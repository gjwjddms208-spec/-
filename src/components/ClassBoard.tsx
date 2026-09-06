import React, { useState } from 'react';
import type { Submission, StudentInfo } from '../types';
import {
  LayoutGrid,
  Users,
  Search,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Calendar,
  Award,
  BookOpen,
  X,
  Compass,
  Lock,
} from 'lucide-react';

interface Props {
  submissions: Submission[];
  currentStudent?: StudentInfo | null;
}

export const ClassBoard: React.FC<Props> = ({ submissions, currentStudent }) => {
  // If a student is logged in, their class is strictly locked to their own class
  const studentClass = currentStudent?.gradeClass?.trim() || '';
  const isClassLocked = Boolean(studentClass);

  const [selectedClass, setSelectedClass] = useState<string>(
    isClassLocked ? studentClass : 'ALL'
  );
  const [selectedTeam, setSelectedTeam] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModalSub, setSelectedModalSub] = useState<Submission | null>(null);

  const teamColors: Record<number, { bg: string; text: string; border: string; name: string }> = {
    1: { bg: 'bg-[#2e5a59]', text: 'text-white', border: 'border-[#244746]', name: '1모둠 (청룡)' },
    2: { bg: 'bg-[#5e636e]', text: 'text-white', border: 'border-[#4a4f59]', name: '2모둠 (백호)' },
    3: { bg: 'bg-[#c04000]', text: 'text-white', border: 'border-[#9c3400]', name: '3모둠 (주작)' },
    4: { bg: 'bg-[#2d2926]', text: 'text-white', border: 'border-[#1c1917]', name: '4모둠 (현무)' },
    5: { bg: 'bg-[#8b4513]', text: 'text-white', border: 'border-[#703810]', name: '5모둠 (황룡)' },
    6: { bg: 'bg-[#704a29]', text: 'text-white', border: 'border-[#583920]', name: '6모둠 (기린)' },
  };

  // Base scope: When a student is logged in, only submissions from their own class are ever allowed
  const scopedSubmissions = submissions.filter((sub) => {
    if (isClassLocked) {
      return sub.gradeClass === studentClass;
    }
    if (selectedClass !== 'ALL') {
      return sub.gradeClass === selectedClass;
    }
    return true;
  });

  const filteredSubmissions = scopedSubmissions.filter((sub) => {
    if (selectedTeam !== 'ALL' && sub.teamNo !== selectedTeam) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = sub.name.toLowerCase().includes(q);
      const matchClass = sub.gradeClass.toLowerCase().includes(q);
      const matchLearned = sub.reflection.learned.toLowerCase().includes(q);
      const matchConnected = sub.reflection.connected.toLowerCase().includes(q);
      return matchName || matchClass || matchLearned || matchConnected;
    }
    return true;
  });

  // Calculate statistics for the relevant scope
  const totalCount = scopedSubmissions.length;
  const restoredCount = scopedSubmissions.filter((s) => s.drawingData.isRestored).length;
  const quizCorrectCount = scopedSubmissions.filter((s) => s.quizData.isCorrect).length;
  const evaluatedCount = scopedSubmissions.filter((s) => s.evaluation).length;

  const formatDate = (dateStr: any) => {
    if (!dateStr) return '방금 전';
    try {
      const d = new Date(dateStr);
      return `${d.getMonth() + 1}월 ${d.getDate()}일 ${d.getHours()}:${String(
        d.getMinutes()
      ).padStart(2, '0')}`;
    } catch {
      return '방금 전';
    }
  };

  const formatLengthCm = (length?: number) => {
    if (length === undefined || length === null) return '7.5 cm';
    // If length is recorded in old coordinate units (> 30), convert with 17 units/cm
    if (length > 30) {
      return `${(length / 17).toFixed(1)} cm`;
    }
    return `${length.toFixed(1)} cm`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner & Real-time Info */}
      <div className="bg-[#f9f7f2] p-5 sm:p-6 rounded-2xl border border-[#2d2926]/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#8b4513] uppercase tracking-wider mb-1">
            <LayoutGrid className="w-4 h-4" />
            <span>탐구 모듈 3: 실시간 학급 대시보드</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-batang font-bold text-[#2d2926] flex items-center gap-2">
            <span>{studentClass ? `${studentClass} 수막새 복원 탐구 현황판` : '우리 반 수막새 복원 탐구 현황판'}</span>
            {isClassLocked && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#8b4513]/10 text-[#8b4513] border border-[#8b4513]/20">
                <Lock className="w-3 h-3 mr-1" />
                {studentClass} 전용
              </span>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-[#726960] mt-1">
            {isClassLocked
              ? `[${studentClass}] 친구들의 작도 결과와 수학 성찰만 안전하게 실시간 공유됩니다.`
              : '친구들의 작도 결과, 수학 성찰, 교사 피드백이 실시간으로 공유됩니다.'}
          </p>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-white/80 border border-[#2d2926]/10 text-center">
            <span className="text-[#726960] block text-[11px]">총 제출자</span>
            <strong className="text-sm font-bold text-[#2d2926]">{totalCount}명</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-white/80 border border-[#2d2926]/10 text-center">
            <span className="text-[#726960] block text-[11px]">중심 복원율</span>
            <strong className="text-sm font-bold text-[#2e5a59]">
              {totalCount > 0 ? Math.round((restoredCount / totalCount) * 100) : 0}%
            </strong>
          </div>
          <div className="p-2.5 rounded-xl bg-white/80 border border-[#2d2926]/10 text-center">
            <span className="text-[#726960] block text-[11px]">계산 정답률</span>
            <strong className="text-sm font-bold text-[#8b4513]">
              {totalCount > 0 ? Math.round((quizCorrectCount / totalCount) * 100) : 0}%
            </strong>
          </div>
          <div className="p-2.5 rounded-xl bg-white/80 border border-[#2d2926]/10 text-center">
            <span className="text-[#726960] block text-[11px]">교사 평가 완료</span>
            <strong className="text-sm font-bold text-[#c04000]">{evaluatedCount}명</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#f9f7f2] p-3 sm:p-4 rounded-xl border border-[#2d2926]/10">
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {/* Class Filter: If student is logged in, show fixed badge. If guest/teacher preview, allow selection */}
          {isClassLocked ? (
            <div className="flex items-center space-x-1.5 shrink-0 px-2.5 py-1.5 rounded-lg bg-white border border-[#2d2926]/15 text-xs">
              <span className="text-[#726960]">소속 학급:</span>
              <span className="font-bold text-[#8b4513]">{studentClass}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 shrink-0">
              <span className="text-xs text-[#726960] font-medium">학급:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-[#2d2926]/15 bg-white text-xs font-semibold text-[#8b4513] focus:outline-none"
              >
                <option value="ALL">전체 학급</option>
                {['3-1', '3-2', '3-3', '3-4', '3-5', '3-6', '3-7', '3-8', '3-9'].map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Team filter tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto">
            <button
              onClick={() => setSelectedTeam('ALL')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap border ${
                selectedTeam === 'ALL'
                  ? 'bg-[#2d2926] text-[#f5f2ed] border-[#2d2926]'
                  : 'bg-white text-[#2d2926]/70 border-[#2d2926]/10 hover:bg-[#f5f2ed]'
              }`}
            >
              전체 모둠 ({scopedSubmissions.length})
            </button>
            {[1, 2, 3, 4, 5, 6].map((team) => {
              const count = scopedSubmissions.filter((s) => s.teamNo === team).length;
              const isSelected = selectedTeam === team;
              return (
                <button
                  key={team}
                  onClick={() => setSelectedTeam(team)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap border ${
                    isSelected
                      ? `${teamColors[team].bg} text-white ${teamColors[team].border} shadow-xs`
                      : 'bg-white text-[#2d2926]/70 border-[#2d2926]/10 hover:bg-[#f5f2ed]'
                  }`}
                >
                  {team}모둠 ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#726960] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="학생 이름 또는 성찰 검색..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#2d2926]/15 bg-white text-xs text-[#2d2926] focus:outline-none focus:ring-2 focus:ring-[#8b4513]/25"
          />
        </div>
      </div>

      {/* Grid of Submission Cards (Padlet style) */}
      {filteredSubmissions.length === 0 ? (
        <div className="bg-[#f9f7f2] rounded-2xl border border-dashed border-[#2d2926]/20 p-12 text-center text-[#726960] space-y-2">
          <LayoutGrid className="w-8 h-8 mx-auto text-[#8b4513]/40" />
          <p className="font-batang font-medium text-base text-[#2d2926]">
            선택한 조건에 해당하는 제출물이 없습니다.
          </p>
          <p className="text-xs">
            학생들이 수막새 작도 및 성찰일지를 제출하면 실시간으로 이곳에 카드가 게시됩니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubmissions.map((sub) => {
            const teamStyle = teamColors[sub.teamNo] || teamColors[1];
            return (
              <div
                key={sub.id}
                onClick={() => setSelectedModalSub(sub)}
                className="bg-[#f9f7f2] rounded-2xl border border-[#2d2926]/10 hover:border-[#8b4513]/40 shadow-xs hover:shadow-md transition-all cursor-pointer p-5 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Traditional accent top bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 ${teamStyle.bg}`}
                />

                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-3 pt-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${teamStyle.bg} ${teamStyle.text}`}
                      >
                        {sub.teamNo}모둠
                      </span>
                      <span className="text-xs font-semibold text-[#726960]">
                        {sub.gradeClass} {sub.studentNo}번
                      </span>
                      <h4 className="font-batang font-bold text-sm text-[#2d2926] group-hover:text-[#8b4513] transition-colors">
                        {sub.name}
                      </h4>
                    </div>

                    <span className="text-[11px] text-[#726960] flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(sub.createdAt)}</span>
                    </span>
                  </div>

                  {/* Badges: Restoration & Quiz */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#8b4513]/10 text-[#8b4513] border border-[#8b4513]/20 flex items-center space-x-1">
                      <Sparkles className="w-2.5 h-2.5 text-[#8b4513]" />
                      <span>중심 복원 (250, 250)</span>
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-md border flex items-center space-x-1 ${
                        sub.quizData.isCorrect
                          ? 'bg-[#2e5a59]/15 text-[#2e5a59] border-[#2e5a59]/25'
                          : 'bg-[#c04000]/15 text-[#c04000] border-[#c04000]/25'
                      }`}
                    >
                      <CheckCircle2 className="w-2.5 h-2.5 text-current" />
                      <span>반지름 계산: {sub.quizData.userAnswer || '10'}cm</span>
                    </span>
                  </div>

                  {/* Reflection Highlights (배·느·실) */}
                  <div className="space-y-2 text-xs text-[#2d2926]/85 border-t border-[#2d2926]/10 pt-3">
                    <div className="line-clamp-2 leading-relaxed">
                      <strong className="text-[#c04000] font-semibold mr-1.5">[배]</strong>
                      {sub.reflection.learned}
                    </div>
                    <div className="line-clamp-1 leading-relaxed text-[#2d2926]/70">
                      <strong className="text-[#2e5a59] font-semibold mr-1.5">[느]</strong>
                      {sub.reflection.felt}
                    </div>
                    <div className="line-clamp-1 leading-relaxed text-[#2d2926]/70">
                      <strong className="text-[#8b4513] font-semibold mr-1.5">[실]</strong>
                      {sub.reflection.connected}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Teacher Evaluation or Pending */}
                <div className="mt-4 pt-3 border-t border-[#2d2926]/10 flex items-center justify-between">
                  {sub.evaluation ? (
                    <div className="flex items-center space-x-1.5 text-xs text-[#2d2926]">
                      <Award className="w-3.5 h-3.5 text-[#8b4513]" />
                      <span className="font-semibold text-[11px] text-[#8b4513]">
                        루브릭 평가완료
                      </span>
                      <div className="flex space-x-0.5 text-[10px] font-mono font-bold">
                        <span className="px-1 rounded bg-white/80 border border-[#2d2926]/10 text-[#2d2926]">
                          개념 {sub.evaluation.conceptAndReasoning}
                        </span>
                        <span className="px-1 rounded bg-white/80 border border-[#2d2926]/10 text-[#2d2926]">
                          문제 {sub.evaluation.problemSolvingAndConnection}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-[11px] text-[#726960] flex items-center space-x-1">
                      <BookOpen className="w-3 h-3 text-[#8b4513]" />
                      <span>교사 피드백 대기 중</span>
                    </span>
                  )}

                  <span className="text-[11px] text-[#8b4513] font-medium group-hover:underline">
                    상세보기 →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedModalSub && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#f9f7f2] rounded-2xl border border-[#2d2926]/10 max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setSelectedModalSub(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#726960] hover:text-[#2d2926] hover:bg-[#f5f2ed] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center space-x-2.5 mb-4 pb-3 border-b border-[#2d2926]/10">
              <div className="w-10 h-10 rounded-lg bg-[#8b4513] text-white flex items-center justify-center font-bold text-sm">
                {selectedModalSub.teamNo}모둠
              </div>
              <div>
                <h3 className="font-batang font-bold text-lg text-[#2d2926]">
                  {selectedModalSub.name} 학생의 수막새 복원 탐구 보고서
                </h3>
                <p className="text-xs text-[#726960]">
                  {selectedModalSub.gradeClass} {selectedModalSub.studentNo}번 • 제출일시:{' '}
                  {formatDate(selectedModalSub.createdAt)}
                </p>
              </div>
            </div>

            {/* Content Body */}
            <div className="space-y-5 text-xs sm:text-sm">
              {/* Construction Summary */}
              <div className="p-4 rounded-xl bg-white/70 border border-[#2d2926]/10 space-y-2">
                <h4 className="font-batang font-bold text-sm text-[#2d2926] flex items-center space-x-1.5">
                  <Compass className="w-4 h-4 text-[#8b4513]" />
                  <span>디지털 작도 및 피타고라스 계산 결과</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#2d2926]/85">
                  <p>• 현 1: 선분 AB (길이: {formatLengthCm(selectedModalSub.drawingData.chord1?.length)})</p>
                  <p>• 현 2: 선분 CD (길이: {formatLengthCm(selectedModalSub.drawingData.chord2?.length)})</p>
                  <p>• 복원된 원의 중심 O: (250, 250)</p>
                  <p className="font-semibold text-[#8b4513]">
                    • 피타고라스 실측 반지름: {selectedModalSub.quizData.userAnswer} cm (
                    {selectedModalSub.quizData.isCorrect ? '정답' : '오답'})
                  </p>
                </div>
              </div>

              {/* Reflection Full Text */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white border border-[#2d2926]/10">
                  <strong className="text-[#c04000] text-xs font-bold block mb-1">
                    [배] 배운 점 (활동 과정 및 수학적 원리 정당화)
                  </strong>
                  <p className="text-[#2d2926]/85 text-xs leading-relaxed">
                    {selectedModalSub.reflection.learned}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#2d2926]/10">
                  <strong className="text-[#2e5a59] text-xs font-bold block mb-1">
                    [느] 느낀 점 (유물 복원에 수학이 활용되는 감상)
                  </strong>
                  <p className="text-[#2d2926]/85 text-xs leading-relaxed">
                    {selectedModalSub.reflection.felt}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#2d2926]/10">
                  <strong className="text-[#8b4513] text-xs font-bold block mb-1">
                    [실] 실생활과의 연결점 (일상·건축·문화재 응용)
                  </strong>
                  <p className="text-[#2d2926]/85 text-xs leading-relaxed">
                    {selectedModalSub.reflection.connected}
                  </p>
                </div>
              </div>

              {/* Teacher Evaluation & Feedback if exists */}
              {selectedModalSub.evaluation && (
                <div className="p-4 rounded-xl bg-[#8b4513]/10 border border-[#8b4513]/25 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-batang font-bold text-xs text-[#8b4513] flex items-center space-x-1.5">
                      <Award className="w-4 h-4" />
                      <span>교사 루브릭 평가 및 종합 피드백</span>
                    </h5>
                    <span className="text-[11px] text-[#8b4513]/80">
                      {selectedModalSub.evaluation.evaluatedAt}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div className="p-2 rounded bg-white border border-[#8b4513]/20 text-center">
                      <span className="text-[10px] text-[#726960] block">개념 이해 및 추론</span>
                      <strong className="text-sm text-[#8b4513]">
                        {selectedModalSub.evaluation.conceptAndReasoning}
                      </strong>
                    </div>
                    <div className="p-2 rounded bg-white border border-[#8b4513]/20 text-center">
                      <span className="text-[10px] text-[#726960] block">문제 해결/연결</span>
                      <strong className="text-sm text-[#8b4513]">
                        {selectedModalSub.evaluation.problemSolvingAndConnection}
                      </strong>
                    </div>
                    <div className="p-2 rounded bg-white border border-[#8b4513]/20 text-center">
                      <span className="text-[10px] text-[#726960] block">의사소통/협업</span>
                      <strong className="text-sm text-[#8b4513]">
                        {selectedModalSub.evaluation.communicationAndCollaboration}
                      </strong>
                    </div>
                    <div className="p-2 rounded bg-white border border-[#8b4513]/20 text-center">
                      <span className="text-[10px] text-[#726960] block">성찰/메타인지</span>
                      <strong className="text-sm text-[#8b4513]">
                        {selectedModalSub.evaluation.reflectionAndMetacognition}
                      </strong>
                    </div>
                  </div>

                  {selectedModalSub.evaluation.teacherFeedback && (
                    <div className="mt-2 pt-2 border-t border-[#8b4513]/20 text-xs text-[#2d2926]/85 leading-relaxed">
                      <span className="font-semibold text-[#8b4513]">선생님 말씀: </span>
                      {selectedModalSub.evaluation.teacherFeedback}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedModalSub(null)}
                className="px-5 py-2 rounded-xl bg-[#2d2926] text-[#f5f2ed] text-xs font-medium hover:bg-[#1f1c1a] transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
