'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export type AuthResult = {
  error?: string;
  field?: 'email' | 'password' | 'name' | 'general';
  success?: boolean;
};

export async function login(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data: signInData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !signInData.user) {
    const isInvalidPassword = error?.message.toLowerCase().includes("invalid login credentials");
    return {
      error: isInvalidPassword 
        ? "Mật khẩu không chính xác. Vui lòng thử lại." 
        : "Không tìm thấy tài khoản với email này.",
      field: isInvalidPassword ? 'password' : 'email'
    }
  }

  const { data: userRecord } = await supabase.from('users').select('role').eq('id', signInData.user.id).single()
  const role = userRecord?.role || 'student'

  revalidatePath('/', 'layout')
  
  // Successful login, we use redirect here because it's the final step
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

export async function signup(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const role = formData.get('role') as string || 'student'

  if (!name || name.trim().length < 2) {
    return { error: "Vui lòng nhập đầy đủ họ và tên.", field: 'name' }
  }

  if (password.length < 6) {
    return { error: "Mật khẩu phải có ít nhất 6 ký tự.", field: 'password' }
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
    const isExists = error.message.includes("already registered");
    return {
      error: isExists
        ? "Tài khoản với email này đã tồn tại trong hệ thống YogAI."
        : "Không thể tạo tài khoản lúc này. Vui lòng thử lại sau.",
      field: isExists ? 'email' : 'general'
    }
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
