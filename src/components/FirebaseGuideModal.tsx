import React, { useState } from 'react';
import { isFirebaseConfigured } from '../lib/firebase';
import { Database, Copy, Check, X, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const envTemplate = `VITE_FIREBASE_API_KEY="본인의_Firebase_API_KEY"
VITE_FIREBASE_AUTH_DOMAIN="sumaksae-restoration.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="sumaksae-restoration"
VITE_FIREBASE_STORAGE_BUCKET="sumaksae-restoration.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789012"
VITE_FIREBASE_APP_ID="1:123456789012:web:abcdef123456"
VITE_TEACHER_PASSWORD="선생님_지정_비밀번호"`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(envTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#f9f7f2] rounded-2xl border border-[#2d2926]/15 max-w-xl w-full p-6 shadow-2xl relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#726960] hover:text-[#2d2926] hover:bg-[#f5f2ed]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isFirebaseConfigured
                ? 'bg-[#2e5a59]/15 text-[#2e5a59]'
                : 'bg-[#8b4513]/15 text-[#8b4513]'
            }`}
          >
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-batang font-bold text-lg text-[#2d2926]">
              Firebase Cloud Firestore 연동 가이드
            </h3>
            <p className="text-xs text-[#726960]">
              현재 상태:{' '}
              <strong
                className={
                  isFirebaseConfigured ? 'text-[#2e5a59]' : 'text-[#8b4513]'
                }
              >
                {isFirebaseConfigured
                  ? '🟢 Cloud Firestore 실시간 연동 활성화'
                  : '🟡 로컬/브라우저 시연 모드 (체험 가능)'}
              </strong>
            </p>
          </div>
        </div>

        {/* Explanatory Body */}
        <div className="text-xs text-[#2d2926]/85 space-y-3 leading-relaxed">
          <p>
            이 앱은 학생들의 수막새 작도 결과와 성찰일지, 교사 루브릭 피드백을{' '}
            <strong>Google Cloud Firestore</strong>에 실시간 저장하고{' '}
            <code className="px-1 py-0.5 rounded bg-white border border-[#2d2926]/10 text-[#8b4513]">onSnapshot</code> 리스너로 학급 전체에 즉시 동기화합니다.
          </p>

          <div className="p-3 rounded-xl bg-white border border-[#2d2926]/10 space-y-1.5">
            <h4 className="font-bold text-[#2d2926] flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8b4513]" />
              <span>Firebase 연동 3단계 절차</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-[#726960] pl-1">
              <li>
                <a
                  href="https://console.firebase.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#8b4513] underline inline-flex items-center space-x-0.5"
                >
                  <span>Firebase 콘솔</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 inline" />
                </a>
                에서 새 프로젝트 생성 &gt; Cloud Firestore 만들기
              </li>
              <li>웹 앱(Web App)을 추가하고 발급된 6가지 키 복사</li>
              <li>
                프로젝트 루트의 <code>.env.local</code> 파일이나 환경변수에 등록
              </li>
            </ol>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-[#2d2926]">
                환경변수 템플릿 (.env)
              </span>
              <button
                type="button"
                onClick={copyToClipboard}
                className="flex items-center space-x-1 text-[11px] text-[#8b4513] hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '복사 완료!' : '양식 복사하기'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-[#2d2926] text-[#f5f2ed] text-[11px] font-mono overflow-x-auto select-all">
              {envTemplate}
            </pre>
          </div>

          <div className="p-2.5 rounded-lg bg-[#f5f2ed] border border-[#2d2926]/10 text-[11px] text-[#726960]">
            * Firebase 키가 없어도 내장된 로컬 스토리지 &amp; 브로드캐스트 동기화 모드로 작도 및 채점 기능을 자유롭게 시연할 수 있습니다.
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#2d2926] text-[#f5f2ed] text-xs font-medium hover:bg-[#1f1c1a]"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
