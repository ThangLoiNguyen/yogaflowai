export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-6 text-xs text-slate-500 dark:text-slate-400">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p className="font-medium">© {new Date().getFullYear()} YogaFlow AI. Mọi quyền được rành riêng.</p>
        <div className="flex gap-4">
          <button className="font-medium hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Bảo mật</button>
          <button className="font-medium hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Điều khoản</button>
          <button className="font-medium hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Hỗ trợ</button>
        </div>
      </div>
    </footer>
  );
}

