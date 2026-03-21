export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-50 bg-[#fdfdfd] py-12 text-[11px] text-slate-400 font-bold uppercase tracking-widest">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-5 px-4 sm:flex-row sm:px-6 lg:px-5">
        <p className="opacity-60">© {new Date().getFullYear()} YogAI. Mọi quyền được bảo lưu.</p>
        <div className="flex gap-5">
          <button className="hover:text-indigo-600 transition-colors">Bảo mật</button>
          <button className="hover:text-indigo-600 transition-colors">Điều khoản</button>
          <button className="hover:text-indigo-600 transition-colors">Hỗ trợ</button>
        </div>
      </div>
    </footer>
  );
}
