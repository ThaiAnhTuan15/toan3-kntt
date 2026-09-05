export default function ParentDashboard() {
  return (
    <div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Tiến trình của bé: Nguyễn Văn A</h2>
        <p className="text-gray-600 mb-6">Đang học: Chủ đề 2 - Bảng nhân, bảng chia</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-rose-50 p-4 rounded-xl">
            <p className="text-rose-600 text-sm font-bold uppercase">Tỉ lệ hoàn thành</p>
            <p className="text-3xl font-black text-rose-700 mt-2">76%</p>
            <p className="text-xs text-rose-500 mt-1">Của học kì 1</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl">
            <p className="text-emerald-600 text-sm font-bold uppercase">Độ chính xác trung bình</p>
            <p className="text-3xl font-black text-emerald-700 mt-2">84%</p>
            <p className="text-xs text-emerald-500 mt-1">Tốt hơn 12% so với tuần trước</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl">
            <p className="text-indigo-600 text-sm font-bold uppercase">Ngày học trong tháng</p>
            <p className="text-3xl font-black text-indigo-700 mt-2">22 Ngày</p>
            <p className="text-xs text-indigo-500 mt-1">Rất chăm chỉ!</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-emerald-600 flex items-center gap-2 mb-4">
            <span>✓</span> Kỹ năng Điểm mạnh
          </h3>
          <ul className="space-y-3">
            <li className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-700 font-medium">Bảng nhân 2, 3, 4, 5</span>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded">MASTERED</span>
            </li>
            <li className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-700 font-medium">Hình học (Góc vuông)</span>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded">PROFICIENT</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-amber-600 flex items-center gap-2 mb-4">
            <span>⚠</span> Kỹ năng Cần cải thiện
          </h3>
          <ul className="space-y-3 mb-4">
            <li className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-700 font-medium">Bảng chia 6</span>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded">WEAK</span>
            </li>
            <li className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-700 font-medium">Giải toán có lời văn 2 bước</span>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded">DEVELOPING</span>
            </li>
          </ul>
          <div className="bg-amber-50 p-4 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Đề xuất:</strong> Hệ thống đã tự động lên lịch để bé ôn lại "Bảng chia 6" trong bài học ngày mai. Ba/Mẹ có thể động viên bé thêm nhé!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
