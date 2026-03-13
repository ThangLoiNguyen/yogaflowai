import { signup } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/password-input'
import { ThemeToggle } from '@/components/theme-toggle'
import Link from 'next/link'

export default async function SignupPage({
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
      <div className="w-full max-w-sm flex flex-col gap-6 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-8">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Tạo tài khoản</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Nhập thông tin để đăng ký
          </p>
        </div>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Họ tên</Label>
            <Input
              id="name"
              name="name"
              placeholder="Jane Doe"
              required
            />
          </div>
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
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="role">Vai trò</Label>
            <select
              name="role"
              id="role"
              className="flex h-9 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors text-slate-900 dark:text-slate-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue="student"
            >
              <option value="student" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Học viên</option>
              <option value="teacher" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Giáo viên</option>
            </select>
          </div>

          {error && (
            <div className="text-sm text-rose-500 font-medium">{error}</div>
          )}

          <Button formAction={signup} className="w-full bg-sky-500 text-white hover:bg-sky-600 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 transition-colors">
            Đăng ký
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Đã có tài khoản?{' '}
          <Link
            className="font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
            href="/login"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </main>
  )
}
