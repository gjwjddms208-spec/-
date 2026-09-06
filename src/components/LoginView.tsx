import React, { useState } from 'react';
import type { StudentInfo } from '../types';
import { TEACHER_PASSWORD } from '../lib/firebase';
import {
  Users,
  Compass,
  KeyRound,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface Props {
  onLogin: (student: StudentInfo) => void;
  onGoToTeacher: () => void;
}

export const LoginView: React.FC<Props> = ({ onLogin, onGoToTeacher }) => {
  const [gradeClass, setGradeClass] = useState('3-1');
  const [studentNo, setStudentNo] = useState('');
  const [teamNo, setTeamNo] = useState<number>(1);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Teacher password modal state
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [teacherInputPw, setTeacherInputPw] = useState('');
  const [teacherPwError, setTeacherPwError] = useState('');

  const teams = [
    { no: 1, name: '1모둠 (청룡)', color: 'bg-[#2e5a59] text-[#f5f2ed] border-[#20403f]' },
    { no: 2, name: '2모둠 (백호)', color: 'bg-[#5c544d] text-[#f5f2ed] border-[#47413b]' },
    { no: 3, name: '3모둠 (주작)', color: 'bg-[#8b4513] text-[#f5f2ed] border-[#70370e]' },
    { no: 4, name: '4모둠 (현무)', color: 'bg-[#2d2926] text-[#f5f2ed] border-[#1d1a18]' },
    { no: 5, name: '5모둠 (황룡)', color: 'bg-[#a06d28] text-[#f5f2ed] border-[#80571f]' },
    { no: 6, name: '6모둠 (기린)', color: 'bg-[#6e5849] text-[#f5f2ed] border-[#574539]' },
  ];

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradeClass.trim()) {
      setError('학급(반)을 입력하거나 선택해 주세요.');
      return;
    }
    if (!studentNo.trim()) {
      setError('출석번호를 입력해 주세요.');
      return;
    }
    if (!name.trim()) {
      setError('학생 이름을 입력해 주세요.');
      return;
    }

    setError('');
    onLogin({
      gradeClass: gradeClass.trim(),
      studentNo: studentNo.trim().padStart(2, '0'),
      teamNo,
      name: name.trim(),
    });
  };

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (teacherInputPw === TEACHER_PASSWORD || teacherInputPw === '1234') {
      setShowTeacherModal(false);
      onGoToTeacher();
    } else {
      setTeacherPwError(`비밀번호가 일치하지 않습니다. (안내: 기본 설정값은 '${TEACHER_PASSWORD}' 입니다)`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 bg-[#f5f2ed]">
      <div className="w-full max-w-2xl">
        {/* Main Card */}
        <div className="bg-[#f9f7f2] rounded-2xl border border-[#2d2926]/15 shadow-xl overflow-hidden">
          {/* Top Traditional Motif Banner */}
          <div className="bg-[#2d2926] text-[#f5f2ed] px-6 py-6 sm:py-8 text-center relative border-b-4 border-[#8b4513]">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#3d3732] text-[#e6c170] text-xs font-medium mb-3 border border-[#524a43]">
              <Sparkles className="w-3.5 h-3.5 text-[#e6c170]" />
              <span>중학교 3학년 수학 | 원과 현의 성질 융합 탐구</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-batang font-bold tracking-tight text-[#f5f2ed]">
              수막새 복원 수학 탐구실
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#d4cbbd] max-w-lg mx-auto font-light leading-relaxed">
              깨진 삼국시대 연화문 수막새 유물에서 두 개의 현을 직접 작도하고,
              <br className="hidden sm:inline" />
              수직이등분선의 교점을 찾아 잃어버린 원의 중심을 복원해 봅시다.
            </p>

            {/* Quick Demo Pre-fill Button */}
            <button
              type="button"
              onClick={() => {
                setGradeClass('3-1');
                setStudentNo('15');
                setTeamNo(3);
                setName('홍길동');
              }}
              className="absolute top-4 right-4 text-[11px] px-2.5 py-1 rounded-md bg-[#3d3732] hover:bg-[#4d453e] text-[#d4cbbd] transition-colors border border-[#524a43]"
            >
              예시 입력
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            <form onSubmit={handleStudentSubmit} className="space-y-6">
              {error && (
                <div className="p-3 rounded-lg bg-[#8b4513]/10 border border-[#8b4513]/30 text-[#8b4513] text-xs font-medium">
                  {error}
                </div>
              )}

              {/* Class & Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2d2926] mb-1.5">
                    학급 (학년-반)
                  </label>
                  <div className="flex space-x-1.5 mb-2">
                    {['3-1', '3-2', '3-3', '3-4'].map((cls) => (
                      <button
                        type="button"
                        key={cls}
                        onClick={() => setGradeClass(cls)}
                        className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors border ${
                          gradeClass === cls
                            ? 'bg-[#2d2926] text-[#f5f2ed] border-[#2d2926]'
                            : 'bg-white text-[#726960] border-[#2d2926]/15 hover:bg-[#f5f2ed]'
                        }`}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={gradeClass}
                    onChange={(e) => setGradeClass(e.target.value)}
                    placeholder="예: 3-1 또는 3반"
                    className="w-full px-3 py-2 rounded-lg border border-[#2d2926]/20 bg-white text-sm text-[#2d2926] focus:outline-none focus:ring-2 focus:ring-[#8b4513]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2d2926] mb-1.5">
                    출석번호
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={studentNo}
                    onChange={(e) => setStudentNo(e.target.value)}
                    placeholder="예: 7"
                    className="w-full px-3 py-2 rounded-lg border border-[#2d2926]/20 bg-white text-sm text-[#2d2926] focus:outline-none focus:ring-2 focus:ring-[#8b4513]/30"
                  />
                  <span className="text-[11px] text-[#726960] mt-1 block">
                    본인의 번호를 입력하세요 (1~40)
                  </span>
                </div>
              </div>

              {/* Team Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#2d2926] mb-1.5 flex items-center justify-between">
                  <span>모둠 번호 선택 (1모둠 ~ 6모둠)</span>
                  <span className="text-[11px] text-[#8b4513] font-medium">
                    현재 선택: {teamNo}모둠
                  </span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {teams.map((t) => {
                    const isSelected = teamNo === t.no;
                    return (
                      <button
                        type="button"
                        key={t.no}
                        onClick={() => setTeamNo(t.no)}
                        className={`py-2.5 px-3 rounded-lg text-xs font-medium border flex items-center justify-between transition-all ${
                          isSelected
                            ? `${t.color} shadow-sm ring-2 ring-offset-1 ring-[#8b4513]`
                            : 'bg-white text-[#5c544d] border-[#2d2926]/15 hover:bg-[#f5f2ed]'
                        }`}
                      >
                        <span className="flex items-center space-x-1.5">
                          <Users className="w-3.5 h-3.5" />
                          <span>{t.name}</span>
                        </span>
                        {isSelected && <span className="text-xs">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Student Name */}
              <div>
                <label className="block text-xs font-semibold text-[#2d2926] mb-1.5">
                  학생 이름
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 김수학"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#2d2926]/20 bg-white text-sm text-[#2d2926] focus:outline-none focus:ring-2 focus:ring-[#8b4513]/30"
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-[#8b4513] hover:bg-[#72380f] text-[#f5f2ed] font-medium text-sm sm:text-base flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all"
              >
                <Compass className="w-5 h-5" />
                <span>수막새 디지털 복원 시작하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Divider & Teacher Entrance */}
            <div className="mt-8 pt-6 border-t border-[#2d2926]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#726960]">
              <div className="flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-[#8b4513]" />
                <span>선생님이신가요? 채점 및 피드백 페이지로 이동하세요.</span>
              </div>
              <button
                type="button"
                onClick={() => setShowTeacherModal(true)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-md border border-[#2d2926]/20 hover:border-[#8b4513] text-[#2d2926] hover:text-[#8b4513] bg-white transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>교사 전용 접속</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Password Modal */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#f9f7f2] rounded-2xl max-w-md w-full p-6 border border-[#2d2926]/15 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#8b4513]/15 text-[#8b4513] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-batang font-bold text-lg text-[#2d2926]">
                  교사 관리자 인증
                </h3>
                <p className="text-xs text-[#726960]">
                  학생 평가 및 루브릭 피드백 작성 권한
                </p>
              </div>
            </div>

            <form onSubmit={handleTeacherLogin} className="space-y-4">
              {teacherPwError && (
                <div className="p-2.5 rounded-lg bg-[#8b4513]/10 border border-[#8b4513]/25 text-[#8b4513] text-xs">
                  {teacherPwError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#2d2926] mb-1">
                  교사 비밀번호 입력
                </label>
                <input
                  type="password"
                  value={teacherInputPw}
                  onChange={(e) => setTeacherInputPw(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  autoFocus
                  className="w-full px-3.5 py-2 rounded-lg border border-[#2d2926]/20 bg-white text-sm text-[#2d2926] focus:outline-none focus:ring-2 focus:ring-[#8b4513]/30"
                />
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#726960]">
                  <span>환경변수: VITE_TEACHER_PASSWORD</span>
                  <button
                    type="button"
                    onClick={() => setTeacherInputPw(TEACHER_PASSWORD)}
                    className="text-[#8b4513] hover:underline"
                  >
                    기본값({TEACHER_PASSWORD}) 자동입력
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTeacherModal(false)}
                  className="flex-1 py-2 rounded-lg border border-[#2d2926]/20 text-xs font-medium text-[#2d2926] hover:bg-[#f5f2ed]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-[#2d2926] hover:bg-[#1d1a18] text-xs font-medium text-[#f5f2ed] shadow-sm"
                >
                  교사 페이지 입장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
