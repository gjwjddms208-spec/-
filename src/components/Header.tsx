import React from 'react';
import type { AppView, StudentInfo } from '../types';
import { isFirebaseConfigured } from '../lib/firebase';
import {
  Compass,
  FileText,
  LayoutGrid,
  ShieldAlert,
  GraduationCap,
  Database,
  HelpCircle,
} from 'lucide-react';

interface Props {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  student: StudentInfo | null;
  onLogoutStudent: () => void;
  onOpenFirebaseGuide: () => void;
  onOpenMathGuide: () => void;
}

export const Header: React.FC<Props> = ({
  currentView,
  setCurrentView,
  student,
  onLogoutStudent,
  onOpenFirebaseGuide,
  onOpenMathGuide,
}) => {
  const navItems: { id: AppView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'drawing', label: '1. 수막새 작도실', icon: Compass },
    { id: 'reflection', label: '2. 계산 & 성찰일지', icon: FileText },
    { id: 'board', label: '3. 학급 현황판', icon: LayoutGrid },
    { id: 'teacher', label: '교사 관리실', icon: ShieldAlert },
  ];

  return (
    <header className="border-b-2 border-[#2d2926]/10 bg-[#f9f7f2] sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentView(student ? 'drawing' : 'login')}
              className="flex items-center space-x-3 text-left group"
            >
              {/* Traditional Tile "瓦" Circle Badge */}
              <div className="w-10 h-10 bg-[#2d2926] rounded-full flex items-center justify-center text-[#f5f2ed] text-xl font-batang shadow-xs transition-transform group-hover:scale-105">
                <span>瓦</span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="font-batang font-bold text-lg sm:text-xl text-[#2d2926] tracking-tight">
                    수막새 복원 수학 탐구실
                  </h1>
                  <span className="hidden sm:inline-block text-xs font-normal text-[#2d2926]/60 border-l border-[#2d2926]/20 pl-2">
                    원의 성질: 현의 수직이등분선
                  </span>
                </div>
                <p className="text-[11px] text-[#70685e] hidden md:block">
                  삼국시대 연화문 수막새 유물 디지털 복원 &amp; 피타고라스 융합 기하학
                </p>
              </div>
            </button>
          </div>

          {/* Navigation for Logged-in Users */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#2d2926] text-[#f5f2ed] shadow-xs'
                      : 'text-[#2d2926]/75 hover:text-[#2d2926] hover:bg-[#2d2926]/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#e6c170]' : 'text-[#8b4513]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Math Guide button */}
            <button
              onClick={onOpenMathGuide}
              title="수학 개념 및 탐구 원리 보기"
              className="p-2 rounded-lg text-[#2d2926]/70 hover:text-[#2d2926] hover:bg-[#2d2926]/5 transition-colors border border-[#2d2926]/10"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Sync Status Badge */}
            <button
              onClick={onOpenFirebaseGuide}
              title="Firebase Cloud Firestore 연동 상태"
              className="bg-[#2d2926]/5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-medium border border-[#2d2926]/10 flex items-center space-x-1.5 text-[#2d2926] hover:bg-[#2d2926]/10 transition-colors"
            >
              <span className="text-[#8b4513] text-xs">●</span>
              <span className="hidden sm:inline">
                {isFirebaseConfigured ? '실시간 동기화 중' : '로컬 시연 모드'}
              </span>
              <span className="sm:hidden">
                {isFirebaseConfigured ? '동기화' : '로컬'}
              </span>
            </button>

            {/* Student Info or Teacher Admin / Login Button */}
            {student ? (
              <div className="flex items-center space-x-2">
                <div className="bg-white/60 border border-[#2d2926]/10 px-3 py-1 rounded-lg text-xs flex items-center space-x-1.5 text-[#2d2926]">
                  <GraduationCap className="w-3.5 h-3.5 text-[#8b4513]" />
                  <span className="font-semibold">{student.gradeClass}</span>
                  <span>{student.studentNo}번</span>
                  <span className="font-serif-cultural font-bold text-[#8b4513] italic">{student.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#8b4513]/10 text-[#8b4513] font-medium">
                    {student.teamNo}모둠
                  </span>
                </div>
                <button
                  onClick={onLogoutStudent}
                  className="text-xs text-[#2d2926]/60 hover:text-[#8b4513] underline px-1"
                >
                  변경
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentView('login')}
                className="bg-[#2d2926] text-[#f5f2ed] hover:bg-[#1f1c1a] px-3.5 py-1.5 rounded text-xs font-medium transition-colors shadow-xs"
              >
                학생 입장
              </button>
            )}

            {/* Direct Teacher Button */}
            <button
              onClick={() => setCurrentView('teacher')}
              className={`text-xs px-3 py-1.5 rounded font-medium transition-colors border ${
                currentView === 'teacher'
                  ? 'bg-[#8b4513] text-white border-[#8b4513]'
                  : 'bg-[#2d2926] text-[#f5f2ed] border-[#2d2926] hover:bg-[#1f1c1a]'
              }`}
            >
              교사 관리
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-[#2d2926]/10 overflow-x-auto text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex flex-col items-center py-1 px-2 rounded-md transition-colors ${
                  isActive
                    ? 'text-[#8b4513] font-bold'
                    : 'text-[#2d2926]/60 hover:text-[#2d2926]'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span className="whitespace-nowrap">{item.label.replace(/^\d+\.\s*/, '')}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
