'use client';
import React, { useState } from 'react';
import { 
  Gift, 
  Sparkles, 
  X, 
  Send, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Coins, 
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';

export const WithdrawModal = ({ onClose, onOpenRules }) => {
  const { profile, piggyBalance, piggyRequests, requestWithdrawal } = useLearning();
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [itemNote, setItemNote] = useState('');
  const [message, setMessage] = useState(null);

  const quickPicks = [
    { label: '20.000 đ', value: 20000, desc: 'Tập vở / Bút viết' },
    { label: '50.000 đ', value: 50000, desc: 'Hộp bút màu / Thước kẻ' },
    { label: '100.000 đ', value: 100000, desc: 'Sách truyện / Đồ dùng lớn' },
    { label: 'Toàn bộ Heo', value: piggyBalance, desc: 'Rút hết tiết kiệm' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalAmount = customAmount ? Number(customAmount) : Number(selectedAmount);
    if (!finalAmount || finalAmount <= 0) {
      setMessage({ type: 'error', text: 'Vui lòng chọn hoặc nhập số tiền muốn đổi quà!' });
      return;
    }
    if (finalAmount > piggyBalance) {
      setMessage({ type: 'error', text: 'Số tiền yêu cầu lớn hơn số dư hiện có trong Heo Đất!' });
      return;
    }

    const res = requestWithdrawal(finalAmount, itemNote.trim() || 'Mua đồ dùng học tập');
    if (res.success) {
      setMessage({ type: 'success', text: res.message });
      setSelectedAmount('');
      setCustomAmount('');
      setItemNote('');
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-2xl max-w-xl w-full p-5 sm:p-7 text-slate-800 my-auto animate-scale-in relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-amber-100">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-2xl shadow-sm text-white">
              🎁
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-rose-700">Xin Lĩnh Thưởng Heo Đất</h2>
              <p className="text-xs font-bold text-slate-500">Gửi ước muốn mua đồ dùng học tập tới Ba Mẹ 💖</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto py-4 space-y-4 pr-1 scrollbar-thin">
          {/* Current Balance Card */}
          <div className="bg-gradient-to-r from-amber-100 via-orange-100 to-amber-200 rounded-2xl p-4 border-2 border-amber-300 flex items-center justify-between shadow-xs">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">Số Dư Heo Đất Hiện Tại</span>
              <div className="text-2xl sm:text-3xl font-black text-amber-950 flex items-center gap-1.5 mt-0.5">
                <span>🐷</span>
                <span>{piggyBalance.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
            {onOpenRules && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRules();
                }}
                className="px-3 py-1.5 bg-white/90 hover:bg-white text-amber-900 text-xs font-bold rounded-xl border border-amber-300 shadow-xs transition-all"
              >
                📜 Xem quy tắc
              </button>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Quick Pick Buttons */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-2">
                1. Chọn số tiền muốn lĩnh:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {quickPicks.map(p => (
                  <button
                    key={p.label}
                    type="button"
                    disabled={p.value > piggyBalance || p.value <= 0}
                    onClick={() => {
                      setSelectedAmount(p.value);
                      setCustomAmount('');
                    }}
                    className={`p-3 rounded-2xl border-2 text-left transition-all ${
                      Number(selectedAmount) === p.value && !customAmount
                        ? 'border-rose-500 bg-rose-50/80 shadow-sm ring-2 ring-rose-300'
                        : 'border-slate-200 hover:border-amber-300 bg-slate-50/60'
                    } ${p.value > piggyBalance || p.value <= 0 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="font-black text-sm text-slate-800">{p.label}</div>
                    <div className="text-[11px] text-slate-500 font-semibold truncate">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Hoặc nhập số tiền khác (VNĐ):
              </label>
              <input
                type="number"
                min={1000}
                max={piggyBalance}
                step={1000}
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount('');
                }}
                placeholder="Ví dụ: 35000"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-rose-400 font-bold text-slate-800 text-sm outline-none"
              />
            </div>

            {/* Item Note Input */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                2. Món đồ {profile?.name || "bé"} muốn mua (hoặc lý do đổi quà):
              </label>
              <input
                type="text"
                maxLength={80}
                value={itemNote}
                onChange={(e) => setItemNote(e.target.value)}
                placeholder="Ví dụ: Mua hộp bút màu Thiên Long, mua vở viết..."
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-rose-400 font-bold text-slate-800 text-sm outline-none"
              />
            </div>

            {message && (
              <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-rose-50 text-rose-800 border border-rose-300'
              }`}>
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                <span>{message.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={piggyBalance <= 0}
              className={`w-full py-3 rounded-2xl font-black text-sm text-white shadow-sm transition-all flex items-center justify-center gap-2 ${
                piggyBalance > 0
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-bouncy-sm'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              Gửi Yêu Cầu Tới Ba Mẹ 💌
            </button>
          </form>

          {/* Pending / Past Requests History */}
          {piggyRequests && piggyRequests.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-black text-slate-600 mb-2">Lịch Sử Các Lần Xin Quà:</h4>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {piggyRequests.slice(0, 5).map(req => (
                  <div key={req.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-slate-800">
                        {req.amount.toLocaleString('vi-VN')} đ <span className="font-normal text-slate-500">• {req.note}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold">
                        {new Date(req.date).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                    <div>
                      {req.status === 'pending' && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Chờ duyệt
                        </span>
                      )}
                      {req.status === 'approved' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Đã trao quà
                        </span>
                      )}
                      {req.status === 'rejected' && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Để dịp sau
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
