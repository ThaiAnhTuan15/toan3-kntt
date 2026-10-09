'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Edit3, Eraser, Trash2, X, Minimize2, Maximize2 } from 'lucide-react';
import sounds from '../utils/soundEffects';

export const Scratchpad = ({ isOpen, onClose }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState('draw'); // 'draw' | 'erase'
  const [color, setColor] = useState('#2563EB');
  const [lineWidth, setLineWidth] = useState(3);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (!isOpen || isMinimized) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio || 500;
    canvas.height = rect.height * window.devicePixelRatio || 320;
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [isOpen, isMinimized]);

  if (!isOpen) return null;

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (mode === 'erase') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 20;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    sounds.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const colors = ['#2563EB', '#DC2626', '#16A34A', '#D97706', '#7C3AED', '#000000'];

  return (
    <div className={`fixed z-50 transition-all duration-200 shadow-2xl rounded-2xl border-4 border-amber-300 bg-white overflow-hidden ${
      isMinimized 
        ? 'bottom-4 right-4 w-72 h-14 bg-amber-100 flex items-center justify-between px-4' 
        : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[92vw] sm:w-[480px] md:w-[540px] h-[380px] flex flex-col'
    }`}>
      {/* Header */}
      <div className="bg-amber-400 px-4 py-2.5 flex items-center justify-between select-none">
        <div className="flex items-center gap-2 text-amber-950 font-bold text-base">
          <Edit3 className="w-5 h-5" />
          <span>Bảng Nháp Điện Tử</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-amber-500 rounded-lg text-amber-900 transition-colors"
            title={isMinimized ? "Phóng to" : "Thu nhỏ"}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-red-500 hover:text-white rounded-lg text-amber-900 transition-colors"
            title="Đóng nháp"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Controls toolbar */}
          <div className="bg-amber-50 p-2 border-b border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => { setMode('draw'); sounds.playClick(); }}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all ${
                  mode === 'draw' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" /> Bút vẽ
              </button>
              <button
                onClick={() => { setMode('erase'); sounds.playClick(); }}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all ${
                  mode === 'erase' ? 'bg-rose-500 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Eraser className="w-3.5 h-3.5" /> Tẩy
              </button>
            </div>

            {/* Color swatches */}
            {mode === 'draw' && (
              <div className="flex items-center gap-1">
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => { setColor(c); sounds.playClick(); }}
                    style={{ backgroundColor: c }}
                    className={`w-5 h-5 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-amber-400' : 'hover:scale-110'}`}
                  />
                ))}
              </div>
            )}

            {/* Clear button */}
            <button
              onClick={clearCanvas}
              className="px-2.5 py-1.5 rounded-lg bg-rose-100 text-rose-700 font-bold hover:bg-rose-200 flex items-center gap-1 ml-auto"
              title="Xóa toàn bộ"
            >
              <Trash2 className="w-3.5 h-3.5" /> Xóa hết
            </button>
          </div>

          {/* Drawing Canvas */}
          <div className="flex-1 bg-white relative cursor-crosshair touch-none">
            <canvas
              ref={canvasRef}
              className="w-full h-full block bg-white"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            <div className="absolute bottom-2 right-3 text-[11px] text-slate-400 pointer-events-none select-none">
              Dùng chuột hoặc chạm tay để tính nhẩm
            </div>
          </div>
        </>
      )}
    </div>
  );
};
