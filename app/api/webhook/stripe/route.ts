import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";

export const runtime = 'nodejs';

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Missing Stripe environment variables");
    return new Response("Webhook Error: Server configuration missing", { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-12-18.acacia" as any,
  });

  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const supabase = await createClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, courseId } = session.metadata || {};

    if (userId && courseId) {
      // 1. Create enrollment payment record
      await supabase.from("payments").insert({
        student_id: userId,
        amount: session.amount_total ? session.amount_total / 1 : 0,
        currency: session.currency || "VND",
        stripe_payment_id: session.payment_intent as string,
        status: "paid",
        paid_at: new Date().toISOString()
      });

      // 2. Fetch the next available session for this course to auto-book
      const { data: nextSession } = await supabase
        .from("class_sessions")
        .select("id")
        .eq("course_id", courseId)
        .gte("scheduled_at", new Date().toISOString())
        .order("scheduled_at", { ascending: true })
        .limit(1)
        .single();
      
      if (nextSession) {
        await supabase.from("bookings").insert({
          student_id: userId,
          session_id: nextSession.id,
          status: "booked",
          payment_id: session.payment_intent as string
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
