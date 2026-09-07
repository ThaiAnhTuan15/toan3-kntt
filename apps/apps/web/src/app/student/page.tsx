'use client';

import { useEffect, useState } from 'react';

export default function StudentDashboard() {
  const [studentName, setStudentName] = useState('Em');

  useEffect(() => {
    // In real app, fetch student profile from API
    setStudentName('Học sinh Lớp 3');
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Toán 3 Kết Nối</h1>
        <div className="flex items-center gap-4">
          <span className="font-semibold text-gray-700">👋 Chào {studentName}!</span>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
            Đăng xuất
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-8 p-4 space-y-6">
        {/* TODAY PLAN */}
        <section className="bg-blue-500 text-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-2">🎯 Kế hoạch hôm nay</h2>
          <ul className="mt-4 space-y-2 text-lg">
            <li className="flex items-center gap-2">
              <span className="bg-white/20 p-1 rounded-full">✓</span> Ôn 3 câu làm sai
            </li>
            <li className="flex items-center gap-2">
              <span className="bg-white/20 p-1 rounded-full">▶</span> Học bài mới: Bảng nhân 6
            </li>
            <li className="flex items-center gap-2">
              <span className="bg-white/20 p-1 rounded-full">🔒</span> Thử thách 2 câu nâng cao
            </li>
          </ul>
          <button className="mt-6 bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-xl transition-colors shadow">
            Bắt đầu học ngay
          </button>
        </section>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <span className="text-4xl mb-2">⭐</span>
            <h3 className="text-lg text-gray-500 font-medium">Điểm rèn luyện</h3>
            <p className="text-3xl font-bold text-amber-500">1,250</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <span className="text-4xl mb-2">🔥</span>
            <h3 className="text-lg text-gray-500 font-medium">Chuỗi ngày học</h3>
            <p className="text-3xl font-bold text-orange-500">5 Ngày</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <span className="text-4xl mb-2">🏆</span>
            <h3 className="text-lg text-gray-500 font-medium">Huy hiệu</h3>
            <p className="text-3xl font-bold text-indigo-500">3</p>
          </div>
        </div>

        {/* LEARNING PATH QUICK VIEW */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Lộ trình học tập - Tuần 4</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
              <div>
                <h4 className="font-bold text-green-800">Bài 8: Bảng nhân 6</h4>
                <p className="text-green-600 text-sm">Đã hoàn thành 100%</p>
              </div>
              <span className="bg-green-500 text-white p-2 rounded-full">✓</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div>
                <h4 className="font-bold text-blue-800">Bài 9: Bảng chia 6</h4>
                <p className="text-blue-600 text-sm">Đang học...</p>
              </div>
              <span className="bg-blue-500 text-white py-1 px-3 rounded-full text-sm font-bold">Tiếp tục</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 opacity-70">
              <div>
                <h4 className="font-bold text-gray-700">Bài 10: Tìm thành phần...</h4>
                <p className="text-gray-500 text-sm">Chưa mở khóa</p>
              </div>
              <span className="text-gray-400">🔒</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
