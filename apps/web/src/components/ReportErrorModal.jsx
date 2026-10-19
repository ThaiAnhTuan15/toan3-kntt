'use client';
import React, { useState } from 'react';
import { 
  Flag, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Sparkles, 
  X, 
  Send, 
  Award,
  Image as ImageIcon,
  HelpCircle
} from 'lucide-react';
import { MathRenderer } from './MathRenderer';
import { useLearning } from '../context/LearningContext';
import sounds from '../utils/soundEffects';

export const ReportErrorModal = ({ question, week, onClose }) => {
  const { reportQuestionError, reportedQuestions, verifiedErrorIds } = useLearning();

  const [selectedReason, setSelectedReason] = useState('Hình ảnh không hiển thị / bị mờ');
  const [customNote, setCustomNote] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null); // { type: 'success' | 'error', message: string }

  if (!question) return null;

  const isAlreadyReported = reportedQuestions?.some(
    r => r.questionId === question.id && r.status === 'pending'
  );
  const isAlreadyVerified = verifiedErrorIds?.includes(question.id);

  const reasonsList = [
    { id: 'image', label: 'Hình ảnh bị lỗi / không hiển thị', icon: '🖼️' },
    { id: 'answer', label: 'Sai đáp án / Không có đáp án đúng', icon: '❌' },
    { id: 'question', label: 'Đề bài khó hiểu / Sai số liệu', icon: '📝' },
    { id: 'other', label: 'Lý do khác...', icon: '💡' },
  ];

  const minNoteLength = 15;
  const currentLength = customNote.trim().length;
  const isValid = currentLength >= minNoteLength;

  const STARTERS = [
    "Theo con đáp án đúng là... vì ",
    "Đề bài bị nhầm lẫn ở số liệu: ",
    "Hình minh họa không hiển thị rõ: "
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAlreadyReported) {
      setSubmitStatus({
        type: 'error',
        message: 'Câu hỏi này bé đã gửi báo lỗi tới Ba Mẹ rồi nhé!'
      });
      return;
    }

    if (!isValid) {
      setSubmitStatus({
        type: 'error',
        message: 'Bé hãy nhập lời nhắn giải thích chi tiết tối thiểu 15 ký tự nhé!'
      });
      return;
    }

    const res = reportQuestionError(
      question, 
      week, 
      selectedReason, 
      customNote.trim()
    );

    if (res.success) {
      setSubmitStatus({
        type: 'success',
        message: res.message
      });
      setTimeout(() => {
        onClose?.();
      }, 1800);
    } else {
      setSubmitStatus({
        type: 'error',
        message: res.message
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border-4 border-rose-300 shadow-2xl max-w-lg w-full p-5 sm:p-6 text-slate-800 my-auto animate-scale-in relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-rose-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-xl text-white shadow-sm">
              🚩
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-rose-700">
                Báo Lỗi Câu Hỏi Cho Ba Mẹ
              </h2>
              <p className="text-xs font-bold text-slate-500">
                {question.id ? `Mã câu: ${question.id}` : 'Đánh dấu câu hỏi cần kiểm tra'} {week ? `(Đề tuần ${week})` : ''}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto py-3 space-y-3.5 pr-1 scrollbar-thin">
          {/* Question Summary Preview Box */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">
              Nội dung câu hỏi:
            </span>
            <div className="font-extrabold text-slate-800 line-clamp-3">
              <MathRenderer text={question.question} />
            </div>
          </div>

          {/* Reward Incentive Notice */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-3 border-2 border-amber-300 flex items-start gap-2.5 text-xs">
            <span className="text-2xl shrink-0 mt-0.5">🎖️</span>
            <div>
              <span className="font-black text-amber-900 block mb-0.5 uppercase tracking-wide">
                Thưởng Thám Tử Nhí: +5.000 đ Heo Đất!
              </span>
              <p className="text-amber-800 font-semibold leading-relaxed">
                Khi Ba Mẹ kiểm tra xác nhận đúng là câu hỏi bị lỗi, bé sẽ được <strong className="text-rose-600 underline">thưởng nóng +5.000 đ</strong> vào Heo Đất và <strong className="text-emerald-700">miễn trừ câu này</strong> để không bị trừ tiền thưởng nhé!
              </p>
            </div>
          </div>

          {isAlreadyVerified ? (
            <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 text-center space-y-1">
              <div className="text-2xl">✅</div>
              <div className="text-emerald-800 font-black text-sm">
                Câu Hỏi Đã Được Ba Mẹ Xác Nhận Lỗi!
              </div>
              <p className="text-xs text-emerald-700 font-semibold">
                Bé đã được nhận thưởng 5.000 đ và câu này được miễn trừ khỏi danh sách trừ tiền.
              </p>
            </div>
          ) : isAlreadyReported ? (
            <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 text-center space-y-1">
              <div className="text-2xl">⏳</div>
              <div className="text-amber-900 font-black text-sm">
                Bé Đã Báo Lỗi Câu Này Rồi!
              </div>
              <p className="text-xs text-amber-700 font-semibold">
                Yêu cầu đang chờ Ba Mẹ kiểm tra trong Góc Phụ Huynh. Bé cứ yên tâm làm tiếp các câu khác nhé!
              </p>
            </div>
          ) : (
            /* Report Form */
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  1. Bé thấy câu hỏi bị lỗi gì?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {reasonsList.map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedReason(r.label)}
                      className={`p-2.5 rounded-xl border-2 text-left text-xs font-bold transition-all flex items-center gap-2 ${
                        selectedReason === r.label
                          ? 'border-rose-500 bg-rose-50/80 text-rose-900 ring-2 ring-rose-200'
                          : 'border-slate-200 hover:border-rose-300 bg-white text-slate-700'
                      }`}
                    >
                      <span className="text-base">{r.icon}</span>
                      <span className="truncate">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-black text-rose-700">
                    2. Lời nhắn giải thích chi tiết cho Ba Mẹ (Bắt buộc):
                  </label>
                  <span className={`text-[11px] font-extrabold ${isValid ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {currentLength}/{minNoteLength} ký tự {isValid ? '✓ Đạt' : '(Tối thiểu 15)'}
                  </span>
                </div>

                {/* Gợi ý mở đầu câu mẫu */}
                <div className="mb-2 space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" /> Bấm chọn gợi ý mở đầu nếu cần:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {STARTERS.map((st, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (!customNote.includes(st)) {
                            setCustomNote(prev => (prev ? prev + ' ' : '') + st);
                          }
                        }}
                        className="px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-[10px] font-bold transition active:scale-95 text-left"
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={3}
                  maxLength={300}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Bé hãy viết rõ: Con thấy câu này sai ở đâu? Vì sao sai? Theo con đáp án hoặc số liệu đúng phải là bao nhiêu để Ba Mẹ duyệt thưởng 5.000đ nhé..."
                  className={`w-full p-2.5 rounded-xl border-2 font-bold text-slate-800 text-xs outline-none transition resize-none ${
                    isValid 
                      ? 'border-emerald-400 focus:ring-2 focus:ring-emerald-200 bg-emerald-50/20' 
                      : currentLength > 0 
                      ? 'border-amber-400 focus:ring-2 focus:ring-amber-200 bg-amber-50/20'
                      : 'border-slate-200 focus:border-rose-400'
                  }`}
                />

                {!isValid && (
                  <p className="text-[11px] font-bold text-amber-700 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Bé hãy viết thêm ít nhất {Math.max(0, minNoteLength - currentLength)} ký tự nữa để giải thích rõ cho Ba Mẹ nhé!
                  </p>
                )}
              </div>

              {submitStatus && (
                <div className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  submitStatus.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                    : 'bg-rose-50 text-rose-800 border border-rose-300'
                }`}>
                  {submitStatus.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  )}
                  <span>{submitStatus.message}</span>
                </div>
              )}

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={!isValid}
                  className={`w-full py-2.5 font-black text-xs sm:text-sm rounded-xl shadow-bouncy-sm btn-bouncy flex items-center justify-center gap-1.5 transition-all ${
                    isValid
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  {isValid ? 'Gửi Cho Ba Mẹ Kiểm Tra Ngay 🚀' : 'Bé cần nhập đủ lý do để mở nút Gửi ✍️'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
