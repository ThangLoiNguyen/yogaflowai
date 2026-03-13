import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/password-input'
import { ThemeToggle } from '@/components/theme-toggle'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>
}) {
  const error = (await searchParams)?.error

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white dark:bg-slate-950 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm flex border border-slate-200 dark:border-slate-800 flex-col gap-6 rounded-lg bg-slate-50 dark:bg-slate-900/80 p-8">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Chào mừng trở lại</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Nhập thông tin để đăng nhập
          </p>
        </div>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <PasswordInput id="password" name="password" />

          {error && (
            <div className="text-sm text-rose-500 font-medium">{error}</div>
          )}

          <Button formAction={login} className="w-full bg-sky-500 text-white hover:bg-sky-600 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 transition-colors">
            Đăng nhập
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Chưa có tài khoản?{' '}
          <Link
            className="font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
            href="/signup"
          >
            Đăng ký
          </Link>
        </p>
      </div>
    </main>
  )
}
