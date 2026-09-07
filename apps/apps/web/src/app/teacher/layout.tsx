import Link from 'next/link';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-teal-50">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center border-b-2 border-teal-500">
        <h1 className="text-2xl font-bold text-teal-700">Giáo Viên - Toán 3 KNTT</h1>
        <nav className="space-x-4">
          <Link href="/teacher" className="text-gray-600 hover:text-teal-600 font-medium">Tổng quan</Link>
          <Link href="/teacher/classes" className="text-gray-600 hover:text-teal-600 font-medium">Quản lý Lớp</Link>
          <button className="text-sm font-medium bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200">
            Đăng xuất
          </button>
        </nav>
      </header>
      <main className="p-6 max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  );
}
