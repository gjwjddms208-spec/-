/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import type { AppView, DrawingData, StudentInfo, Submission } from './types';
import { subscribeToSubmissions, isFirebaseConfigured } from './lib/firebase';
import { Header } from './components/Header';
import { LoginView } from './components/LoginView';
import { RestorationCanvas } from './components/RestorationCanvas';
import { QuizAndReflection } from './components/QuizAndReflection';
import { ClassBoard } from './components/ClassBoard';
import { TeacherAdmin } from './components/TeacherAdmin';
import { FirebaseGuideModal } from './components/FirebaseGuideModal';
import { MathGuideModal } from './components/MathGuideModal';

const STUDENT_STORAGE_KEY = 'sumaksae_current_student';

export default function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<AppView>('login');

  // Student Authentication State
  const [student, setStudent] = useState<StudentInfo | null>(() => {
    try {
      const saved = sessionStorage.getItem(STUDENT_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Active Construction State
  const [drawingData, setDrawingData] = useState<DrawingData>({
    chord1: null,
    chord2: null,
    centerFound: null,
    radiusFound: null,
    isRestored: false,
  });

  // Real-time Submissions list from Firestore (or local fallback)
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Modals
  const [showFirebaseModal, setShowFirebaseModal] = useState(false);
  const [showMathModal, setShowMathModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Subscribe to real-time Firestore submissions
  useEffect(() => {
    const unsubscribe = subscribeToSubmissions((data) => {
      setSubmissions(data);
    });
    return () => unsubscribe();
  }, []);

  // If student is already logged in on initial load, go to drawing room
  useEffect(() => {
    if (student && currentView === 'login') {
      setCurrentView('drawing');
    }
  }, [student]);

  const handleStudentLogin = (info: StudentInfo) => {
    setStudent(info);
    try {
      sessionStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(info));
    } catch (e) {
      console.error(e);
    }
    setCurrentView('drawing');
    showToast(`${info.name} 학생, 수막새 복원 탐구실에 오신 것을 환영합니다!`);
  };

  const handleLogoutStudent = () => {
    setStudent(null);
    try {
      sessionStorage.removeItem(STUDENT_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    setCurrentView('login');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSubmittedSuccess = () => {
    setCurrentView('board');
    showToast('수막새 복원 탐구 보고서가 성공적으로 제출되었습니다!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f2ed] text-[#2d2926]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#2d2926] text-[#f5f2ed] px-4 py-3 rounded-xl shadow-xl text-xs sm:text-sm font-medium border border-[#8b4513]/40 flex items-center space-x-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#8b4513]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Persistent Header */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        student={student}
        onLogoutStudent={handleLogoutStudent}
        onOpenFirebaseGuide={() => setShowFirebaseModal(true)}
        onOpenMathGuide={() => setShowMathModal(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'login' && (
          <LoginView
            onLogin={handleStudentLogin}
            onGoToTeacher={() => setCurrentView('teacher')}
          />
        )}

        {currentView === 'drawing' && (
          <RestorationCanvas
            drawingData={drawingData}
            setDrawingData={setDrawingData}
            onComplete={() => setCurrentView('reflection')}
          />
        )}

        {currentView === 'reflection' && (
          student ? (
            <QuizAndReflection
              student={student}
              drawingData={drawingData}
              onSubmittedSuccess={handleSubmittedSuccess}
              onBackToDrawing={() => setCurrentView('drawing')}
            />
          ) : (
            <LoginView
              onLogin={handleStudentLogin}
              onGoToTeacher={() => setCurrentView('teacher')}
            />
          )
        )}

        {currentView === 'board' && (
          <ClassBoard submissions={submissions} currentStudent={student} />
        )}

        {currentView === 'teacher' && (
          <TeacherAdmin
            submissions={submissions}
            onBackToApp={() => setCurrentView(student ? 'drawing' : 'login')}
            onOpenFirebaseGuide={() => setShowFirebaseModal(true)}
          />
        )}
      </main>

      {/* Traditional Korean Cultural Heritage Footer */}
      <footer className="border-t border-[#2d2926]/10 bg-[#f9f7f2] py-5 text-center text-xs text-[#726960]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#8b4513]" />
            <span className="font-batang font-semibold text-[#2d2926]">
              수막새 복원 수학 탐구실
            </span>
            <span>• 중학교 3학년 수학 융합 탐구 수업용</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <button
              onClick={() => setShowMathModal(true)}
              className="hover:text-[#8b4513] underline"
            >
              수학적 원리 증명
            </button>
            <span>국립박물관 유물보존센터 협업 모델링</span>
          </div>
        </div>
      </footer>

      {/* Guide Modals */}
      <FirebaseGuideModal
        isOpen={showFirebaseModal}
        onClose={() => setShowFirebaseModal(false)}
      />
      <MathGuideModal
        isOpen={showMathModal}
        onClose={() => setShowMathModal(false)}
      />
    </div>
  );
}
