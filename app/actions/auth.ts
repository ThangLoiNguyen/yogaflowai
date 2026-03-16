'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const authData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: signInData, error } = await supabase.auth.signInWithPassword(authData)

  if (error || !signInData.user) {
    const message = encodeURIComponent("Đăng nhập thất bại. Vui lòng kiểm tra lại địa chỉ email hoặc mật khẩu của bạn.")
    redirect(`/login?error=${message}`)
  }

  const { data: userRecord } = await supabase.from('users').select('role').eq('id', signInData.user.id).single()
  const role = userRecord?.role || 'student'

  revalidatePath('/', 'layout')
  if (role === 'teacher') {
    redirect('/teacher-dashboard')
  }

  // Check if student has a profile
  const { data: profile } = await supabase.from('student_profiles').select('id').eq('user_id', signInData.user.id).single()
  if (!profile) {
    redirect('/onboarding')
  }

  redirect('/student-dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const role = formData.get('role') as string || 'student'

  if (!name || name.trim().length < 2) {
    redirect('/signup?error=' + encodeURIComponent("Vui lòng nhập đầy đủ họ và tên."))
  }

  if (!password || password.length < 6) {
    redirect('/signup?error=' + encodeURIComponent("Mật khẩu phải có ít nhất 6 ký tự."))
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
      },
    },
  })

  if (error) {
    const message = error.message.includes("already registered")
      ? "Tài khoản với email này đã tồn tại trong hệ thống YogAI."
      : "Không thể tạo tài khoản lúc này. Vui lòng hoàn thành đầy đủ biểu mẫu và thử lại."
    redirect(`/signup?error=${encodeURIComponent(message)}`)
  }

  if (data.user) {
    const { error: insertError } = await supabase.from('users').insert({
      id: data.user.id,
      email: data.user.email,
      name,
      role
    })

    if (insertError && insertError.code !== '23505') {
      console.error("Failed to insert into public.users:", insertError)
    }
  }

  revalidatePath('/', 'layout')
  if (role === 'teacher') {
    redirect('/teacher-dashboard')
  }
  redirect('/onboarding')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
