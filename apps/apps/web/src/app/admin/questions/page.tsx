'use client';

import { useState } from 'react';

export default function QuestionBankAdmin() {
  const [questions] = useState([
    { id: 'M3-Q-001', stem: 'Tính 6 x 4 = ?', difficulty: 1, status: 'PUBLISHED', type: 'MULTIPLE_CHOICE' },
    { id: 'M3-Q-002', stem: 'Tìm trung điểm của đoạn thẳng dài 10cm', difficulty: 2, status: 'NEEDS_REVIEW', type: 'FILL_NUMBER' },
    { id: 'M3-Q-003', stem: 'Có 24 học sinh chia đều thành 4 hàng. Mỗi hàng có bao nhiêu bạn?', difficulty: 3, status: 'DRAFT', type: 'MULTIPLE_CHOICE' },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Ngân hàng câu hỏi</h2>
        <div className="space-x-2">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow">
            + Sinh câu hỏi bằng AI
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
            + Thêm thủ công
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã (Code)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nội dung (Stem)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {questions.map((q) => (
              <tr key={q.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{q.id}</td>
                <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{q.stem}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{q.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Lv {q.difficulty}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${q.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 
                      q.status === 'NEEDS_REVIEW' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                    {q.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">Sửa</button>
                  {q.status === 'NEEDS_REVIEW' && (
                    <button className="text-green-600 hover:text-green-900">Duyệt</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
