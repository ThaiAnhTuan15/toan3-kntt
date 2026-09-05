import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-slate-900 text-white min-h-screen p-4 hidden md:block">
        <h2 className="text-2xl font-bold mb-8 text-center border-b border-slate-700 pb-4">T3KNTT Admin</h2>
        <nav className="space-y-2">
          <Link href="/admin" className="block px-4 py-2 rounded hover:bg-slate-800">
            Tổng quan (Dashboard)
          </Link>
          <Link href="/admin/questions" className="block px-4 py-2 rounded hover:bg-slate-800 text-blue-400">
            Ngân hàng câu hỏi
          </Link>
          <Link href="/admin/curriculum" className="block px-4 py-2 rounded hover:bg-slate-800">
            Chương trình & Khung
          </Link>
          <Link href="/admin/users" className="block px-4 py-2 rounded hover:bg-slate-800">
            Quản lý Người dùng
          </Link>
        </nav>
      </aside>
      <main className="flex-1">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Hệ thống quản trị Content</h1>
          <button className="text-sm font-medium bg-red-50 text-red-600 px-4 py-2 rounded hover:bg-red-100">
            Đăng xuất
          </button>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
