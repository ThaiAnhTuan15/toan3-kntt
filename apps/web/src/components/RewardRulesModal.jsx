'use client';
import React from 'react';
import { 
  Sparkles, 
  Award, 
  Star, 
  Coins, 
  Gift, 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  Trophy, 
  X,
  GraduationCap
} from 'lucide-react';

export const RewardRulesModal = ({ onClose, onOpenWithdraw }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-2xl max-w-2xl w-full p-5 sm:p-7 text-slate-800 my-auto animate-scale-in relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-amber-100">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-2xl shadow-sm">
              🐷
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-700">Quy Tắc Thưởng Heo Đất Tri Thức</h2>
              <p className="text-xs font-bold text-slate-500">Chăm chỉ học toán – Tích lũy tiền mua đồ dùng học tập 📚</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto py-4 space-y-4 pr-1 scrollbar-thin">
          {/* Top Banner Notice */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <Gift className="w-6 h-6 shrink-0 mt-0.5 text-yellow-200" />
              <div className="text-xs sm:text-sm font-bold leading-relaxed">
                <span className="text-yellow-200 uppercase font-black tracking-wider block mb-0.5">Tiền Thưởng Thực Tế Dành Cho Bé:</span>
                Số tiền trong Heo Đất được tính bằng <strong className="text-white underline">tiền thật (VNĐ)</strong>. Khi bé tích lũy đủ, hãy bấm <strong className="text-yellow-200">"Xin Đổi Quà"</strong> để Ba Mẹ mua sách vở, bút thước, đồ dùng học tập cho con nhé!
              </div>
            </div>
          </div>

          {/* Rule Card 1: Lần Làm Đầu Tiên */}
          <div className="bg-amber-50/80 rounded-2xl p-4 border-2 border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👑</span>
                <h3 className="text-base sm:text-lg font-black text-amber-900">Lần Đầu Tiên Làm Đề (Tối đa 10.000 đ)</h3>
              </div>
              <span className="text-xs font-black px-2.5 py-1 bg-amber-200 text-amber-900 rounded-full">
                Rèn tính cẩn thận
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-600 mb-3">
              Lần đầu làm bài rất quan trọng, bé đọc kỹ đề và tính cẩn thận để nhận thưởng cao nhất:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-bold">
              <div className="bg-white p-2.5 rounded-xl border border-amber-200 flex items-center justify-between">
                <span>Đúng 100%:</span>
                <span className="text-emerald-600 font-black text-sm">+10.000 đ 🌟</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-200 flex items-center justify-between">
                <span>Sai 1 câu:</span>
                <span className="text-amber-700 font-black">+8.000 đ</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-200 flex items-center justify-between">
                <span>Sai 2 câu:</span>
                <span className="text-amber-700 font-black">+6.000 đ</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-200 flex items-center justify-between">
                <span>Sai 3 câu:</span>
                <span className="text-amber-700 font-black">+4.000 đ</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-200 flex items-center justify-between">
                <span>Sai 4 câu:</span>
                <span className="text-amber-700 font-black">+2.000 đ</span>
              </div>
              <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200 flex items-center justify-between text-rose-700">
                <span>Sai $\ge$ 5 câu:</span>
                <span className="font-black">Làm lại bài 🔄</span>
              </div>
            </div>
          </div>

          {/* Rule Card 2: Làm Lại Lần 2 & Lần 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-blue-50/80 rounded-2xl p-4 border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xl">🚀</span>
                <h4 className="font-black text-blue-900 text-sm sm:text-base">Làm Lại Lần 2 (Tối đa 5.000 đ)</h4>
              </div>
              <p className="text-[11px] font-semibold text-slate-600 mb-2">Khuyến khích bé dũng cảm sửa sai:</p>
              <ul className="text-xs font-bold space-y-1 text-slate-700">
                <li className="flex justify-between"><span>• Đúng hết 100%:</span> <strong className="text-emerald-600">+5.000 đ</strong></li>
                <li className="flex justify-between"><span>• Sai 1 câu:</span> <strong className="text-blue-700">+4.000 đ</strong></li>
                <li className="flex justify-between"><span>• Sai 2 câu:</span> <strong className="text-blue-700">+3.000 đ</strong></li>
                <li className="flex justify-between"><span>• Sai 3 câu:</span> <strong className="text-blue-700">+2.000 đ</strong></li>
                <li className="flex justify-between"><span>• Sai 4 câu:</span> <strong className="text-blue-700">+1.000 đ</strong></li>
              </ul>
            </div>

            <div className="bg-purple-50/80 rounded-2xl p-4 border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xl">💪</span>
                <h4 className="font-black text-purple-900 text-sm sm:text-base">Lần 3 Trở Đi (Thưởng Kiên Trì)</h4>
              </div>
              <p className="text-[11px] font-semibold text-slate-600 mb-2">Ghi nhận tinh thần không bỏ cuộc:</p>
              <div className="bg-white p-3 rounded-xl border border-purple-200 mt-2 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-700">Đúng hết 100%:</span>
                  <span className="text-purple-700 font-black text-sm">+2.000 đ 🎖️</span>
                </div>
                <p className="text-[11px] text-slate-500 font-semibold">Bé làm đi làm lại cho tới khi nắm vững 100% bài học!</p>
              </div>
            </div>
          </div>

          {/* Rule Card 3: Thưởng Vượt Chặng & Học Bổng HK1 */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl p-4 border-2 border-emerald-300">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base sm:text-lg font-black text-emerald-900">Giải Thưởng Lớn: Vượt Chặng & Học Bổng</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">🏆</span>
                  <span className="font-black text-emerald-800 text-sm">Thưởng Vượt 1 Chặng:</span>
                </div>
                <div className="text-xl font-black text-emerald-600 mb-1">+50.000 đ 💰</div>
                <p className="text-[11px] font-semibold text-slate-500">Hoàn thành tất cả các đề trong 1 Chặng đạt từ 75% trở lên. (6 Chặng = 300.000 đ)!</p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-xs">
                <div className="flex items-center gap-2 mb-1">
                  <GraduationCap className="w-6 h-6 text-indigo-600" />
                  <span className="font-black text-indigo-900 text-sm">Học Bổng Toàn Khóa HK1:</span>
                </div>
                <div className="text-xl font-black text-indigo-600 mb-1">+100.000 đ 🎓</div>
                <p className="text-[11px] font-semibold text-slate-500">Chinh phục trọn vẹn cả 6 Chặng (66 Đề Học Kỳ 1). Vinh danh Thần Đồng Toán Học!</p>
              </div>
            </div>
          </div>

          {/* Rule Card 4: Nguyên Tắc An Toàn Quỹ */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-xs font-semibold text-slate-600 flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Nguyên tắc bảo vệ Heo Đất:</strong> Tiền thưởng của mỗi bài học chỉ có cộng thêm, <span className="text-rose-600 font-bold">không bao giờ bị trừ âm</span> vào số tiền bé đã tích lũy được từ trước. Bé hoàn toàn yên tâm thử sức ở các bài khó nhé!
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition-colors"
          >
            Đã Hiểu Rồi ạ! 👍
          </button>
          {onOpenWithdraw && (
            <button
              onClick={() => {
                onClose();
                onOpenWithdraw();
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-950 font-black rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1.5"
            >
              <Gift className="w-4 h-4" />
              Xin Đổi Quà Ngay 🎁
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
