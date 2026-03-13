export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-800 pt-6 text-xs text-slate-500">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} YogaFlow AI. All rights reserved.</p>
        <div className="flex gap-4">
          <button className="hover:text-slate-300">Privacy</button>
          <button className="hover:text-slate-300">Terms</button>
          <button className="hover:text-slate-300">Support</button>
        </div>
      </div>
    </footer>
  );
}

