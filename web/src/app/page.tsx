import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <main className="text-center p-8 bg-white rounded-xl shadow-lg max-w-lg w-full">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Toán 3 Kết Nối</h1>
        <p className="text-lg text-gray-600 mb-8">
          Hệ thống học tập và luyện trắc nghiệm Toán lớp 3 theo bộ sách Kết nối tri thức với cuộc sống.
        </p>
        <Link href="/login" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-xl transition-colors">
          Bắt đầu học ngay!
        </Link>
      </main>
    </div>
  );
}
