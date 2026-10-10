import Link from 'next/link';

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-rose-50">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center border-b-2 border-rose-200">
        <h1 className="text-2xl font-bold text-rose-600">Phụ Huynh - Toán 3 KNTT</h1>
        <nav className="space-x-4">
          <Link href="/parent" className="text-gray-600 hover:text-rose-600 font-medium">Tổng quan</Link>
          <Link href="/parent/child-progress" className="text-gray-600 hover:text-rose-600 font-medium">Báo cáo chi tiết</Link>
          <button className="text-sm font-medium bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200">
            Đăng xuất
          </button>
        </nav>
      </header>
      <main className="p-6 max-w-5xl mx-auto">
        {children}
      </main>
    </div>
  );
}
