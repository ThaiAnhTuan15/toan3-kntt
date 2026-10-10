export default function TeacherDashboard() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Thống kê lớp học: Lớp 3A</h2>
        <select className="px-4 py-2 border rounded-lg bg-white shadow-sm outline-none focus:border-teal-500">
          <option>Lớp 3A</option>
          <option>Lớp 3B</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Sĩ số</p>
          <p className="text-3xl font-bold text-gray-800">35</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Hoàn thành bài tập tuần</p>
          <p className="text-3xl font-bold text-teal-600">91%</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Điểm trung bình</p>
          <p className="text-3xl font-bold text-blue-600">8.5</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">HS cần hỗ trợ</p>
          <p className="text-3xl font-bold text-red-500">4</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Phân tích Kỹ năng lớp</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-emerald-700">Phép cộng, trừ (Khá)</span>
                <span className="text-gray-500">88%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-blue-700">Bảng nhân chia (Trung bình)</span>
                <span className="text-gray-500">72%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-rose-700">Giải toán có lời văn (Yếu)</span>
                <span className="text-gray-500">55%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-rose-500 h-2 rounded-full" style={{ width: '55%' }}></div>
              </div>
            </div>
          </div>
          <button className="mt-6 w-full bg-teal-50 text-teal-700 font-medium py-2 rounded-lg hover:bg-teal-100">
            Tạo bài tập tăng cường Giải toán lời văn
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Học sinh cần chú ý tuần này</h3>
          <ul className="divide-y divide-gray-100">
            <li className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">Lê Hoàng Nam</p>
                <p className="text-sm text-gray-500">Sai nhiều câu Bảng chia 6</p>
              </div>
              <button className="text-teal-600 text-sm hover:underline">Xem chi tiết</button>
            </li>
            <li className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">Trần Thị Bích</p>
                <p className="text-sm text-gray-500">Chưa hoàn thành bài tập</p>
              </div>
              <button className="text-teal-600 text-sm hover:underline">Nhắc nhở</button>
            </li>
            <li className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">Phạm Văn Kiên</p>
                <p className="text-sm text-gray-500">Điểm giảm 20% so với tuần trước</p>
              </div>
              <button className="text-teal-600 text-sm hover:underline">Xem chi tiết</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
