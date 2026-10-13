import React from 'react';

export const metadata = {
  title: 'Cổng Ba Mẹ Quản Trị - Toán 3 Kết Nối Tri Thức',
  description: 'Bảng điều khiển theo dõi tiến trình học tập thời gian thực dành cho phụ huynh'
};

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/40 text-slate-800 font-sans">
      {children}
    </div>
  );
}
