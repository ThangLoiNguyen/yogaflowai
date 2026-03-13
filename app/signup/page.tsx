import { signup } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/password-input'
import { ThemeToggle } from '@/components/theme-toggle'
import Link from 'next/link'
import { Sparkles, UserPlus } from 'lucide-react'

export default async function SignupPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>
}) {
  const error = (await searchParams)?.error

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-sm flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none backdrop-blur-xl">
        <div className="flex flex-col gap-2 items-center text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-sky-400 via-indigo-400 to-cyan-400 mb-2 shadow-inner">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Tạo tài khoản</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Điền thông tin để bắt đầu hành trình
          </p>
        </div>

        <form className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-2.5">
            <Label htmlFor="name" className="font-semibold text-slate-700 dark:text-slate-300">Họ tên</Label>
            <Input
              id="name"
              name="name"
              placeholder="Jane Doe"
              required
              className="h-11 shadow-sm"
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <Label htmlFor="email" className="font-semibold text-slate-700 dark:text-slate-300">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="ten@vidu.com"
              required
              className="h-11 shadow-sm"
            />
          </div>
          <PasswordInput id="password" name="password" label="Mật khẩu" />
          
          <div className="flex flex-col gap-2.5">
            <Label htmlFor="role" className="font-semibold text-slate-700 dark:text-slate-300">Vai trò</Label>
            <div className="relative">
              <select
                name="role"
                id="role"
                className="flex h-11 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:border-indigo-500 focus-visible:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus-visible:border-indigo-400 dark:focus-visible:ring-indigo-400"
                defaultValue="student"
              >
                <option value="student">Học viên</option>
                <option value="teacher">Giáo viên</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-rose-50 dark:bg-rose-500/10 p-3 text-sm text-rose-600 dark:text-rose-400 font-medium flex items-center gap-2 border border-rose-100 dark:border-rose-900/30">
              <span className="shrink-0">⚠️</span> {error}
            </div>
          )}

          <Button formAction={signup} size="lg" className="w-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 shadow-md mt-4">
            Đăng ký
          </Button>
        </form>

        <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
          Đã có tài khoản?{' '}
          <Link
            className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            href="/login"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </main>
  )
}
