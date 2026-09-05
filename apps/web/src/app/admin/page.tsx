export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tổng quan hệ thống</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm">Tổng số câu hỏi</p>
          <p className="text-3xl font-bold text-slate-800">1,245</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm">Câu hỏi chờ duyệt (REVIEW)</p>
          <p className="text-3xl font-bold text-amber-500">42</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm">Học sinh hoạt động</p>
          <p className="text-3xl font-bold text-emerald-500">3,402</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm">Lỗi báo cáo</p>
          <p className="text-3xl font-bold text-red-500">3</p>
        </div>
      </div>
    </div>
  );
}
