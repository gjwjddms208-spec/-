import React, { useState } from 'react';
import type { DrawingData, QuizData, ReflectionData, StudentInfo } from '../types';
import { submitStudentWork } from '../lib/firebase';
import confetti from 'canvas-confetti';
import {
  Calculator,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Send,
  Sparkles,
  ArrowLeft,
  Check,
} from 'lucide-react';

interface Props {
  student: StudentInfo;
  drawingData: DrawingData;
  onSubmittedSuccess: () => void;
  onBackToDrawing: () => void;
}

export const QuizAndReflection: React.FC<Props> = ({
  student,
  drawingData,
  onSubmittedSuccess,
  onBackToDrawing,
}) => {
  // Quiz states
  // Problem: Distance OM = 6 cm, Chord AB = 16 cm -> AM = 8 cm. r = sqrt(6^2 + 8^2) = 10 cm.
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizChecked, setQuizChecked] = useState(false);
  const [isQuizCorrect, setIsQuizCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Reflection states (배·느·실)
  const [learned, setLearned] = useState('');
  const [felt, setFelt] = useState('');
  const [connected, setConnected] = useState('');

  // Submit states
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const checkQuiz = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = quizAnswer.trim().replace(/cm/gi, '').trim();
    const num = parseFloat(clean);
    const correct = num === 10;
    setIsQuizCorrect(correct);
    setQuizChecked(true);

    if (correct) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#2e6b5e', '#ffd700', '#b83a2b'],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!learned.trim() || !felt.trim() || !connected.trim()) {
      setSubmitError('배운 점, 느낀 점, 실생활 연결점을 모두 성실히 작성해 주세요.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    const clean = quizAnswer.trim().replace(/cm/gi, '').trim();
    const calculatedCorrect = isQuizCorrect !== null ? isQuizCorrect : (parseFloat(clean) === 10);

    const quizData: QuizData = {
      distanceOM: 6,
      chordLength: 16,
      userAnswer: quizAnswer || '10',
      correctAnswer: 10,
      isCorrect: calculatedCorrect,
    };

    const reflection: ReflectionData = {
      learned: learned.trim(),
      felt: felt.trim(),
      connected: connected.trim(),
    };

    try {
      await submitStudentWork({
        gradeClass: student.gradeClass,
        studentNo: student.studentNo,
        teamNo: student.teamNo,
        name: student.name,
        drawingData,
        quizData,
        reflection,
      });

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });

      onSubmittedSuccess();
    } catch (err) {
      console.error('Submit error:', err);
      setSubmitError('제출 중 문제가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Top Header */}
      <div className="bg-[#f9f7f2] p-4 sm:p-6 rounded-2xl border border-[#2d2926]/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#8b4513] mb-1 whitespace-nowrap">
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">수학 계산 및 성찰일지</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-batang font-bold text-[#2d2926] break-keep">
            피타고라스 실측 계산 &amp; 배·느·실 성찰일지 제출
          </h2>
          <p className="text-xs sm:text-sm text-[#726960] mt-1 break-keep">
            작도로 중심을 찾은 수막새 유물의 실측 수치를 바탕으로 반지름을 계산하고, 활동을 돌아보는 성찰일지를 작성합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToDrawing}
          className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-[#2d2926]/10 text-xs font-semibold text-[#2d2926]/80 hover:bg-[#f5f2ed] self-start sm:self-center transition-colors shadow-xs whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#8b4513] shrink-0" />
          <span className="whitespace-nowrap">작도실 다시 가기</span>
        </button>
      </div>

      {/* Part 1: Pythagorean Theorem Calculation Problem */}
      <div className="bg-[#f9f7f2] rounded-2xl border border-[#2d2926]/10 p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-[#2d2926]/10 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#c04000]/10 text-[#c04000] border border-[#c04000]/20 flex items-center justify-center font-bold text-sm">
              Q1
            </div>
            <div>
              <h3 className="font-batang font-bold text-base sm:text-lg text-[#2d2926]">
                피타고라스 정리 적용 실측 계산 문제
              </h3>
              <span className="text-xs text-[#726960]">
                수막새 유물 복원 보고서 실측치 분석
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-xs px-2.5 py-1 rounded-md bg-white/80 hover:bg-[#f5f2ed] border border-[#2d2926]/10 text-[#2d2926]/80 flex items-center space-x-1 transition-colors shadow-xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#8b4513]" />
            <span>{showHint ? '힌트 닫기' : '풀이 힌트'}</span>
          </button>
        </div>

        {/* Problem Description & Diagram Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-3 text-xs sm:text-sm text-[#2d2926] leading-relaxed">
            <div className="p-4 rounded-xl bg-white/70 border border-[#2d2926]/10">
              <p className="font-medium text-[#2d2926] mb-2">
                [문제 상황]
              </p>
              <p className="text-[#2d2926]/85">
                국립박물관 유물보존센터에서 복원된 수막새의 원의 중심을 점 O라 하고, 유물 테두리의 온전한 현 AB에 내린 수선의 발을 M이라 합니다.
              </p>
              <ul className="mt-2 space-y-1 font-semibold text-[#8b4513]">
                <li>• 중심에서 현까지의 거리: 선분 OM = 6 cm</li>
                <li>• 현의 길이: 선분 AB = 16 cm</li>
              </ul>
              <p className="mt-2 text-[#2d2926]/80">
                원의 현의 성질에 따라 점 M은 현 AB의 중점이므로, 선분 AM = 8 cm입니다.
                직각삼각형 △OAM에서 피타고라스 정리를 적용하여 원래 수막새의 <strong className="text-[#8b4513]">반지름 r (선분 OA)의 길이(cm)</strong>를 구하세요.
              </p>
            </div>

            {/* Hint Box */}
            {showHint && (
              <div className="p-3 rounded-xl bg-[#8b4513]/10 border border-[#8b4513]/20 text-[#8b4513] text-xs space-y-1">
                <p className="font-bold">💡 피타고라스 정리 힌트:</p>
                <p>직각삼각형의 빗변 OA = r이므로 r² = OM² + AM² 입니다.</p>
                <p>r² = 6² + 8² = 36 + 64 = 100  ⟹  r = √100 = ?</p>
              </div>
            )}
          </div>

          {/* Clean Vector Diagram of Triangle OAM */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-[#2d2926] rounded-xl text-white">
            <svg viewBox="0 0 220 180" className="w-full max-w-[200px]">
              {/* Arc representing circle */}
              <path
                d="M 20,40 A 130 130 0 0 1 190,40"
                fill="none"
                stroke="#695f54"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
              {/* Chord AB */}
              <line x1="30" y1="50" x2="170" y2="50" stroke="#c04000" strokeWidth={3} />
              {/* Midpoint M */}
              <circle cx="100" cy="50" r="3" fill="#ffffff" />
              <text x="100" y="42" fill="#ffd700" fontSize="10" textAnchor="middle" fontWeight="bold">
                M (직각)
              </text>

              {/* Perpendicular OM (6cm) */}
              <line x1="100" y1="50" x2="100" y2="140" stroke="#ffd700" strokeWidth={2.5} strokeDasharray="3 2" />
              {/* Right angle indicator at M */}
              <polyline points="100,60 110,60 110,50" fill="none" stroke="#ffd700" strokeWidth={1.5} />

              {/* Center O */}
              <circle cx="100" cy="140" r="4" fill="#ffd700" />
              <text x="100" y="155" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="bold">
                중심 O
              </text>

              {/* Radius OA (hypotenuse r) */}
              <line x1="30" y1="50" x2="100" y2="140" stroke="#2e5a59" strokeWidth={2.5} />

              {/* Length Labels */}
              <text x="55" y="45" fill="#ffffff" fontSize="10" textAnchor="middle">
                8 cm
              </text>
              <text x="118" y="98" fill="#ffd700" fontSize="10" textAnchor="start">
                6 cm
              </text>
              <text x="50" y="105" fill="#99f6e4" fontSize="11" fontWeight="bold" textAnchor="middle">
                r = ?
              </text>
              <text x="25" y="48" fill="#ffffff" fontSize="11" fontWeight="bold">
                A
              </text>
              <text x="175" y="48" fill="#ffffff" fontSize="11" fontWeight="bold">
                B
              </text>
            </svg>
            <span className="text-[11px] text-[#cfc4b2] mt-2 font-medium">
              직각삼각형 △OAM 피타고라스 모델
            </span>
          </div>
        </div>

        {/* Answer Input and Check */}
        <form onSubmit={checkQuiz} className="pt-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center space-x-2">
              <label className="text-xs font-semibold text-[#2d2926]">
                정답 입력: 반지름 r =
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={quizAnswer}
                  onChange={(e) => {
                    setQuizAnswer(e.target.value);
                    setQuizChecked(false);
                  }}
                  placeholder="수치 입력"
                  className="w-28 px-3 py-2 rounded-lg border border-[#2d2926]/15 bg-white text-sm text-center font-bold text-[#2d2926] focus:outline-none focus:ring-2 focus:ring-[#8b4513]/30"
                />
                <span className="absolute right-3 top-2 text-xs text-[#726960]">cm</span>
              </div>
            </div>

            <button
              type="submit"
              className="py-2 px-4 rounded-lg bg-[#2d2926] hover:bg-[#1f1c1a] text-[#f5f2ed] text-xs font-medium transition-colors shadow-xs"
            >
              정답 확인
            </button>

            {quizChecked && (
              <div className="flex items-center space-x-1.5 text-xs font-medium">
                {isQuizCorrect ? (
                  <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#2e5a59]/15 text-[#2e5a59] border border-[#2e5a59]/25">
                    <CheckCircle2 className="w-4 h-4 text-[#2e5a59]" />
                    <span>정답입니다! (r = 10 cm)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#c04000]/15 text-[#c04000] border border-[#c04000]/25">
                    <AlertCircle className="w-4 h-4 text-[#c04000]" />
                    <span>다시 계산해 보세요. (힌트: 6² + 8² = 100)</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Part 2: 배·느·실 성찰일지 (Reflection) */}
      <div className="bg-[#f9f7f2] rounded-2xl border border-[#2d2926]/10 p-5 sm:p-7 shadow-xs space-y-6">
        <div className="border-b border-[#2d2926]/10 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#8b4513]/15 text-[#8b4513] border border-[#8b4513]/20 flex items-center justify-center font-bold text-xs">
              배느실
            </div>
            <div>
              <h3 className="font-batang font-bold text-base sm:text-lg text-[#2d2926]">
                수학 탐구 성찰일지 (배운 점 · 느낀 점 · 실생활 연결)
              </h3>
              <span className="text-xs text-[#726960]">
                교사 평가 루브릭 4대 영역에 반영됩니다. 자신의 생각과 언어로 진솔하게 작성해 보세요.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setLearned('현의 수직이등분선 위의 점은 양 끝점과 거리가 같으므로, 두 현의 수직이등분선이 만나는 교점이 원의 중심이 됨을 작도로 입증했습니다.');
              setFelt('깨진 삼국시대 수막새를 수학적 원리(원의 현의 성질 및 피타고라스 정리)로 정확히 복원할 수 있어서 수학의 실용성과 가치를 깨달았습니다.');
              setConnected('둥근 그릇의 깨진 파편이나 굽은 도로의 곡률 반경을 측정할 때도 현의 수직이등분선과 피타고라스 정리를 활용할 수 있습니다.');
              if (!quizAnswer) {
                setQuizAnswer('10');
                setIsQuizCorrect(true);
                setQuizChecked(true);
              }
            }}
            className="self-start sm:self-center text-xs px-2.5 py-1.5 rounded-lg bg-white border border-[#8b4513]/30 hover:bg-[#8b4513]/10 text-[#8b4513] font-semibold transition-colors shadow-xs whitespace-nowrap cursor-pointer"
          >
            예시 성찰 내용 자동 채우기
          </button>
        </div>

        {submitError && (
          <div className="p-3 rounded-xl bg-[#c04000]/15 border border-[#c04000]/25 text-[#c04000] text-xs font-medium">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 배운 점 */}
          <div>
            <label className="block text-xs font-bold text-[#2d2926] mb-1.5 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-[#c04000] text-white flex items-center justify-center text-[10px] font-bold">
                  배
                </span>
                <span>배운 점 (활동 과정 및 수학적 원리 정당화)</span>
              </span>
              <span className="text-[11px] text-[#726960] font-normal">
                루브릭: 개념 이해 및 추론
              </span>
            </label>
            <p className="text-[11px] text-[#726960] mb-2">
              • 깨진 수막새의 중심을 찾는 과정에서 원의 현의 성질(수직이등분선의 성질과 교점)을 어떻게 적용하고 정당화했는지 수학적 용어를 사용하여 구체적으로 서술하세요.
            </p>
            <textarea
              rows={3}
              value={learned}
              onChange={(e) => setLearned(e.target.value)}
              placeholder="예: 현의 수직이등분선 위의 임의의 점은 현의 양 끝점으로부터 거리가 같으므로, 두 현의 수직이등분선의 교점은 모든 끝점과 거리가 같아 원의 중심이 됨을 알게 되었습니다..."
              className="w-full p-3.5 rounded-xl border border-[#2d2926]/15 bg-white text-xs sm:text-sm text-[#2d2926] focus:outline-none focus:ring-2 focus:ring-[#8b4513]/25 leading-relaxed"
            />
          </div>

          {/* 느낀 점 */}
          <div>
            <label className="block text-xs font-bold text-[#2d2926] mb-1.5 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-[#2e5a59] text-white flex items-center justify-center text-[10px] font-bold">
                  느
                </span>
                <span>느낀 점 (유물 복원에 수학이 활용되는 것을 보며 느낀 감상)</span>
              </span>
              <span className="text-[11px] text-[#726960] font-normal">
                루브릭: 성찰 및 메타인지
              </span>
            </label>
            <p className="text-[11px] text-[#726960] mb-2">
              • 삼국시대 기와 유물 복원에 중학교 수학(원과 피타고라스 정리)이 쓰이는 과정을 탐구하며 느낀 점이나 호기심을 적어보세요.
            </p>
            <textarea
              rows={3}
              value={felt}
              onChange={(e) => setFelt(e.target.value)}
              placeholder="예: 박물관에 깨진 채로 있던 유물들이 어떻게 본래 크기를 찾아 복원되는지 늘 신기했는데, 수학 교과서 속 공식이 실제 역사 보존에 생생하게 쓰인다는 사실에 큰 보람을 느꼈습니다..."
              className="w-full p-3.5 rounded-xl border border-[#2d2926]/15 bg-white text-xs sm:text-sm text-[#2d2926] focus:outline-none focus:ring-2 focus:ring-[#2e5a59]/25 leading-relaxed"
            />
          </div>

          {/* 실생활과의 연결점 */}
          <div>
            <label className="block text-xs font-bold text-[#2d2926] mb-1.5 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-[#8b4513] text-white flex items-center justify-center text-[10px] font-bold">
                  실
                </span>
                <span>실생활과의 연결점 (일상·건축·타 문화재 응용)</span>
              </span>
              <span className="text-[11px] text-[#726960] font-normal">
                루브릭: 문제 해결 및 삶과의 연결
              </span>
            </label>
            <p className="text-[11px] text-[#726960] mb-2">
              • 깨진 도자기, 원형 거울, 둥근 도로의 커브길(곡률 반경), 석조 아치교 등 우리 주변에서 원의 중심을 찾거나 현의 성질을 응용할 수 있는 사례를 제시하세요.
            </p>
            <textarea
              rows={3}
              value={connected}
              onChange={(e) => setConnected(e.target.value)}
              placeholder="예: 둥근 접시나 시계의 일부가 깨졌을 때 온전한 테두리 조각만 있으면 현의 수직이등분선으로 지름을 알아내어 새 틀을 맞출 수 있으며, 도로의 곡선 구간 안전 설계 시에도 활용할 수 있습니다..."
              className="w-full p-3.5 rounded-xl border border-[#2d2926]/15 bg-white text-xs sm:text-sm text-[#2d2926] focus:outline-none focus:ring-2 focus:ring-[#8b4513]/25 leading-relaxed"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-4 border-t border-[#2d2926]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#726960]">
              <span>제출자: </span>
              <strong className="text-[#2d2926]">
                {student.gradeClass} {student.studentNo}번 <span className="font-serif-cultural italic font-bold text-[#8b4513]">{student.name}</span> ({student.teamNo}모둠)
              </strong>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#8b4513] hover:bg-[#703810] text-white font-bold text-sm shadow-lg shadow-[#8b4513]/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Firestore 실시간 전송 중...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>수막새 복원 탐구일지 제출하기</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
