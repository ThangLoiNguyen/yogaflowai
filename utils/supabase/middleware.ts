import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtectedRoute = request.nextUrl.pathname.startsWith("/student-dashboard") || request.nextUrl.pathname.startsWith("/teacher-dashboard") || request.nextUrl.pathname.startsWith("/onboarding") || request.nextUrl.pathname.startsWith("/recommendation");

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isProtectedRoute) {
    // Check role from users table
    const { data: dbUser, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Middleware fetch user role error:", error);
    }

    // Fallback to user_metadata if trigger wasn't set up
    const role = dbUser?.role || user.user_metadata?.role || "student";

    const isStudentRoute = request.nextUrl.pathname.startsWith("/student-dashboard") || request.nextUrl.pathname.startsWith("/onboarding") || request.nextUrl.pathname.startsWith("/recommendation");
    const isTeacherRoute = request.nextUrl.pathname.startsWith("/teacher-dashboard");

    if (isStudentRoute && role !== "student") {
       const url = request.nextUrl.clone();
       url.pathname = "/teacher-dashboard";
       return NextResponse.redirect(url);
    }
    
    if (isTeacherRoute && role !== "teacher") {
       const url = request.nextUrl.clone();
       url.pathname = "/student-dashboard";
       return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
