import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/password-input'
import { ThemeToggle } from '@/components/theme-toggle'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default async function LoginPage({
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
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Chào mừng trở lại</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Đăng nhập vào tài khoản YogaFlow AI
          </p>
        </div>

        <form className="flex flex-col gap-5 mt-2">
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

          {error && (
            <div className="rounded-lg bg-rose-50 dark:bg-rose-500/10 p-3 text-sm text-rose-600 dark:text-rose-400 font-medium flex items-center gap-2 border border-rose-100 dark:border-rose-900/30">
              <span className="shrink-0">⚠️</span> {error}
            </div>
          )}

          <Button formAction={login} size="lg" className="w-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 shadow-md mt-2">
            Đăng nhập
          </Button>
        </form>

        <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
          Chưa có tài khoản?{' '}
          <Link
            className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            href="/signup"
          >
            Đăng ký
          </Link>
        </p>
      </div>
    </main>
  )
}
