import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  type Firestore,
  type Unsubscribe,
} from 'firebase/firestore';
import type { Submission, RubricEvaluation } from '../types';

// Environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Teacher password management: prioritize custom localStorage password, then VITE_TEACHER_PASSWORD, default to '2026'
export const getTeacherPassword = (): string => {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('sumaksae_custom_teacher_pw');
    if (custom && custom.trim().length > 0) {
      return custom.trim();
    }
  }
  const envVal = import.meta.env.VITE_TEACHER_PASSWORD;
  if (envVal && String(envVal).trim().length > 0) {
    return String(envVal).trim();
  }
  return '2026';
};

export const setCustomTeacherPassword = (newPassword: string): void => {
  if (typeof window !== 'undefined' && newPassword.trim().length > 0) {
    localStorage.setItem('sumaksae_custom_teacher_pw', newPassword.trim());
  }
};

export const resetTeacherPasswordToEnv = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('sumaksae_custom_teacher_pw');
  }
};

export const verifyTeacherPassword = (input: string): boolean => {
  const current = getTeacherPassword();
  const trimmedInput = input.trim();
  // Accept current configured password OR 2026
  return trimmedInput === current || trimmedInput === '2026';
};

export const TEACHER_PASSWORD = getTeacherPassword();

// Check if Firebase is legitimately configured with projectId and apiKey
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    !firebaseConfig.apiKey.includes('YourApiKey') &&
    firebaseConfig.apiKey.length > 5
);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
    db = null;
  }
}

// Fallback Local Storage Storage Key
const LOCAL_STORAGE_KEY = 'sumaksae_submissions_v1';
const BROADCAST_CHANNEL_NAME = 'sumaksae_channel';

// Default initial sample submissions for classroom demonstration
const DEFAULT_SAMPLE_SUBMISSIONS: Submission[] = [
  {
    id: 'sample-1',
    gradeClass: '3-1',
    studentNo: '07',
    teamNo: 1,
    name: '김서연',
    drawingData: {
      chord1: {
        id: 'c1',
        p1: { x: 190, y: 110 },
        p2: { x: 310, y: 110 },
        midpoint: { x: 250, y: 110 },
        length: 7.1,
        color: '#b83a2b',
        label: '현 AB',
      },
      chord2: {
        id: 'c2',
        p1: { x: 310, y: 110 },
        p2: { x: 395, y: 195 },
        midpoint: { x: 352.5, y: 152.5 },
        length: 7.1,
        color: '#2e6b5e',
        label: '현 CD',
      },
      centerFound: { x: 250, y: 250 },
      radiusFound: 10,
      isRestored: true,
    },
    quizData: {
      distanceOM: 6,
      chordLength: 16,
      userAnswer: '10',
      correctAnswer: 10,
      isCorrect: true,
    },
    reflection: {
      learned:
        '현의 수직이등분선 위의 모든 점은 현의 양 끝점으로부터 같은 거리에 있다는 수학적 성질을 직접 작도해 보았습니다. 두 현의 수직이등분선이 만나는 단 하나의 교점이 바로 원래 수막새의 원의 중심이 됨을 증명할 수 있었습니다.',
      felt: '박물관에 깨진 채로 전시된 삼국시대 수막새를 보며 어떻게 복원하는지 궁금했는데, 중3 수학시간에 배우는 원의 성질과 피타고라스 정리만으로 완벽히 중심과 반지름을 찾을 수 있어서 수학의 위대함을 느꼈습니다.',
      connected:
        '깨진 도자기나 고대 원형 기와, 아치형 석조 다리의 붕괴된 일부분을 복원할 때도 남은 호의 세 점과 현의 수직이등분선을 이용하면 원형을 정확히 되살릴 수 있습니다.',
    },
    evaluation: {
      conceptAndReasoning: 'A',
      problemSolvingAndConnection: 'A',
      communicationAndCollaboration: 'A',
      reflectionAndMetacognition: 'A',
      teacherFeedback:
        '현의 수직이등분선 성질을 원의 정의와 결합하여 논리적으로 정당화한 점이 매우 뛰어납니다. 문화재 복원과의 연결점도 깊이 있게 탐구했습니다.',
      evaluatedAt: '2026-09-05 14:20',
      teacherName: '수학교사',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: 'sample-2',
    gradeClass: '3-1',
    studentNo: '14',
    teamNo: 2,
    name: '이도윤',
    drawingData: {
      chord1: {
        id: 'c1',
        p1: { x: 175, y: 125 },
        p2: { x: 295, y: 95 },
        midpoint: { x: 235, y: 110 },
        length: 7.3,
        color: '#b83a2b',
        label: '현 AB',
      },
      chord2: {
        id: 'c2',
        p1: { x: 320, y: 115 },
        p2: { x: 400, y: 210 },
        midpoint: { x: 360, y: 162.5 },
        length: 7.3,
        color: '#2e6b5e',
        label: '현 CD',
      },
      centerFound: { x: 250, y: 250 },
      radiusFound: 10,
      isRestored: true,
    },
    quizData: {
      distanceOM: 6,
      chordLength: 16,
      userAnswer: '10',
      correctAnswer: 10,
      isCorrect: true,
    },
    reflection: {
      learned:
        '원의 중심에서 현에 내린 수선은 그 현을 수직이등분하고, 역으로 현의 수직이등분선은 원의 중심을 반드시 지난다는 역의 관계를 작도로 확인했습니다.',
      felt: '모둠원들과 함께 현을 어디에 잡아야 수직이등분선 교점을 가장 선명하게 찾을 수 있는지 토의하는 과정이 즐거웠습니다.',
      connected:
        '도로의 굽은 커브길(곡선 구간)의 곡률 반지름을 측정하여 안전 제한속도를 결정할 때도 원호의 현을 측정해 원의 중심과 반지름을 구한다고 합니다.',
    },
    evaluation: {
      conceptAndReasoning: 'A',
      problemSolvingAndConnection: 'B',
      communicationAndCollaboration: 'A',
      reflectionAndMetacognition: 'B',
      teacherFeedback:
        '모둠 협업을 통한 문제 해결 능력이 돋보입니다. 곡률 반지름과 도로 설계 연결점도 참신했습니다.',
      evaluatedAt: '2026-09-05 14:45',
      teacherName: '수학교사',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: 'sample-3',
    gradeClass: '3-1',
    studentNo: '21',
    teamNo: 3,
    name: '박하은',
    drawingData: {
      chord1: {
        id: 'c1',
        p1: { x: 200, y: 105 },
        p2: { x: 330, y: 120 },
        midpoint: { x: 265, y: 112.5 },
        length: 7.7,
        color: '#b83a2b',
        label: '현 AB',
      },
      chord2: {
        id: 'c2',
        p1: { x: 280, y: 95 },
        p2: { x: 380, y: 165 },
        midpoint: { x: 330, y: 130 },
        length: 7.2,
        color: '#2e6b5e',
        label: '현 CD',
      },
      centerFound: { x: 250, y: 250 },
      radiusFound: 10,
      isRestored: true,
    },
    quizData: {
      distanceOM: 6,
      chordLength: 16,
      userAnswer: '10',
      correctAnswer: 10,
      isCorrect: true,
    },
    reflection: {
      learned:
        '직각삼각형의 피타고라스 정리와 현의 이등분 성질을 연계하여 반지름 r = √(d² + (l/2)²) 공식을 유도하고 계산했습니다.',
      felt: '처음에는 깨진 수막새의 3분의 1만 남아있어서 중심을 어떻게 찾을까 막막했는데 수직이등분선 2개만으로 중심이 쏙 찾아져서 신기했습니다.',
      connected:
        '일상에서 접시나 둥근 거울이 깨졌을 때 온전한 테두리 조각만 있으면 원래 지름 크기를 복원해 새 틀을 맞출 수 있겠습니다.',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
];

function getLocalSubmissions(): Submission[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading local submissions', e);
  }
  localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify(DEFAULT_SAMPLE_SUBMISSIONS)
  );
  return DEFAULT_SAMPLE_SUBMISSIONS;
}

function saveLocalSubmissions(submissions: Submission[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(submissions));
    // Broadcast change across tabs if BroadcastChannel is available
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.postMessage({ type: 'UPDATE', submissions });
      channel.close();
    }
  } catch (e) {
    console.error('Error writing local submissions', e);
  }
}

// ----------------------------------------------------
// Public Firestore API with Local Fallback
// ----------------------------------------------------

export function subscribeToSubmissions(
  callback: (submissions: Submission[]) => void
): Unsubscribe {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, 'submissions'),
        orderBy('createdAt', 'desc')
      );
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: Submission[] = [];
          snapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            list.push({
              id: docSnapshot.id,
              ...data,
              createdAt:
                data.createdAt?.toDate?.()?.toISOString() ||
                data.createdAt ||
                new Date().toISOString(),
            } as Submission);
          });
          callback(list);
        },
        (error) => {
          console.warn(
            'Firestore onSnapshot listener error. Falling back to local storage:',
            error
          );
          callback(getLocalSubmissions());
        }
      );
      return unsubscribe;
    } catch (e) {
      console.warn('Failed to query Firestore, using local mode:', e);
    }
  }

  // Local storage real-time fallback
  callback(getLocalSubmissions());

  let channel: BroadcastChannel | null = null;
  const storageListener = () => {
    callback(getLocalSubmissions());
  };

  if (typeof BroadcastChannel !== 'undefined') {
    channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    channel.onmessage = (event) => {
      if (event.data?.type === 'UPDATE') {
        callback(event.data.submissions);
      }
    };
  }

  window.addEventListener('storage', storageListener);

  return () => {
    window.removeEventListener('storage', storageListener);
    if (channel) {
      channel.close();
    }
  };
}

export async function submitStudentWork(
  data: Omit<Submission, 'id' | 'createdAt'>
): Promise<string> {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, 'submissions'), {
        ...data,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (e) {
      console.error('Firestore save failed, saving locally:', e);
    }
  }

  // Local fallback
  const list = getLocalSubmissions();
  const newSubmission: Submission = {
    ...data,
    id: 'sub-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    createdAt: new Date().toISOString(),
  };
  const updated = [newSubmission, ...list];
  saveLocalSubmissions(updated);
  return newSubmission.id;
}

export async function updateTeacherEvaluation(
  submissionId: string,
  evaluation: RubricEvaluation
): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      const subRef = doc(db, 'submissions', submissionId);
      await updateDoc(subRef, {
        evaluation,
        evaluatedAt: new Date().toISOString(),
      });
      return;
    } catch (e) {
      console.error('Firestore update evaluation failed, updating locally:', e);
    }
  }

  // Local fallback
  const list = getLocalSubmissions();
  const index = list.findIndex((item) => item.id === submissionId);
  if (index !== -1) {
    list[index].evaluation = evaluation;
    saveLocalSubmissions([...list]);
  }
}
