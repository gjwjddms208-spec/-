import React from 'react';
import { BookOpen, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MathGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#f9f7f2] rounded-2xl border border-[#2d2926]/15 max-w-xl w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#726960] hover:text-[#2d2926] hover:bg-[#f5f2ed]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 pb-3 border-b border-[#2d2926]/10">
          <div className="w-10 h-10 rounded-xl bg-[#8b4513]/15 text-[#8b4513] flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-batang font-bold text-lg text-[#2d2926]">
              중3 수학: 원의 현의 성질 & 유물 복원 원리
            </h3>
            <p className="text-xs text-[#726960]">
              교과 역량: 기하학적 추론, 문제 해결, 융합적 사고
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs sm:text-sm text-[#2d2926]/85 leading-relaxed">
          {/* Section 1 */}
          <div className="p-4 rounded-xl bg-white border border-[#2d2926]/10 space-y-2">
            <h4 className="font-batang font-bold text-sm text-[#8b4513] flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1. 원의 현의 성질 (핵심 정리)</span>
            </h4>
            <div className="space-y-2 text-xs text-[#2d2926]/80">
              <div className="p-2.5 rounded-lg bg-[#f5f2ed] border border-[#2d2926]/10">
                <strong className="text-[#2d2926]">[정리 1]</strong> 원의 중심에서 현에 내린 수선은 그 현을 수직이등분한다.
              </div>
              <div className="p-2.5 rounded-lg bg-[#f5f2ed] border border-[#2d2926]/10">
                <strong className="text-[#2d2926]">[정리 2]</strong> 원에서 현의 수직이등분선은 그 원의 중심을 반드시 지난다.
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="p-4 rounded-xl bg-white border border-[#2d2926]/10 space-y-2">
            <h4 className="font-batang font-bold text-sm text-[#2e5a59] flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>2. 깨진 수막새 복원 수학 원리</span>
            </h4>
            <p className="text-xs text-[#2d2926]/80 leading-relaxed">
              남겨진 원 둘레 호 위에 서로 다른 두 현(선분 AB, 선분 CD)을 잡았을 때,
              현 AB의 수직이등분선은 원의 중심 O를 지나고,
              현 CD의 수직이등분선 역시 원의 중심 O를 지납니다.
              따라서 <strong>두 수직이등분선의 유일한 교점</strong>이 바로 잃어버렸던 수막새의 본래 원의 중심이 됩니다.
            </p>
          </div>

          {/* Section 3 */}
          <div className="p-4 rounded-xl bg-white border border-[#2d2926]/10 space-y-2">
            <h4 className="font-batang font-bold text-sm text-[#c04000] flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>3. 피타고라스 정리와 반지름 r 계산</span>
            </h4>
            <p className="text-xs text-[#2d2926]/80 leading-relaxed">
              원의 중심 O에서 현 AB까지의 거리를 d, 현의 길이를 l이라 하면,
              직각삼각형의 밑변은 l/2, 높이는 d, 빗변은 반지름 r이 됩니다.
            </p>
            <div className="p-3 rounded-lg bg-[#f5f2ed] font-mono text-center text-xs font-semibold text-[#2d2926] border border-[#2d2926]/10">
              r² = d² + (l/2)²  ⟹  r = √(d² + (l/2)²)
            </div>
            <p className="text-xs text-[#2d2926]/80 leading-relaxed">
              본 탐구실의 실측 수치(거리 d = 6 cm, 현의 길이 l = 16 cm)를 대입하면,
              밑변 = 8 cm이므로 r = √(6² + 8²) = √(36 + 64) = √100 = 10 cm가 산출됩니다.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#2d2926] text-[#f5f2ed] text-xs font-medium hover:bg-[#1f1c1a]"
          >
            탐구실로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};
