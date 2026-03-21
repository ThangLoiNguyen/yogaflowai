import { Resend } from "resend";
import { createClient } from "@/utils/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNotification({
  userId,
  type,
  title,
  body,
  channel = "in_app"
}: {
  userId: string;
  type: string;
  title: string;
  body: string;
  channel?: "push" | "email" | "in_app";
}) {
  const supabase = await createClient();

  // 1. Save to DB for In-App list
  await supabase.from("notifications").insert({
    user_id: userId,
    type,
    title,
    body,
    channel
  });

  // 2. Multi-channel delivery
  if (channel === "email" || channel === "push") { // Simple fall-through for now
     const { data: user } = await supabase.from("users").select("email").eq("id", userId).single();
     if (user?.email) {
        await resend.emails.send({
          from: "YogAI <notifications@yogaflow.ai>",
          to: user.email,
          subject: title,
          text: body,
        });
     }
  }

  // 3. Push (Firebase) would go here in production
  // ...
}
