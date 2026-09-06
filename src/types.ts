export interface StudentInfo {
  gradeClass: string;
  studentNo: string;
  teamNo: number;
  name: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface ChordLine {
  id: string;
  p1: Point;
  p2: Point;
  midpoint: Point;
  length: number;
  color: string;
  label: string;
}

export interface DrawingData {
  chord1: ChordLine | null;
  chord2: ChordLine | null;
  centerFound: Point | null;
  radiusFound: number | null;
  isRestored: boolean;
}

export interface QuizData {
  distanceOM: number; // e.g. 6 cm
  chordLength: number; // e.g. 16 cm
  userAnswer: string;
  correctAnswer: number; // 10 cm
  isCorrect: boolean | null;
}

export interface ReflectionData {
  learned: string; // 배운 점 (활동 과정 및 수학적 원리 정당화)
  felt: string; // 느낀 점 (유물 복원에 수학이 활용되는 것을 보며 느낀 감상)
  connected: string; // 실생활과의 연결점 (주변이나 역사 유적 등에서 원의 중심 찾기)
}

export type RubricGrade = 'A' | 'B' | 'C';

export interface RubricEvaluation {
  // 4대 평가 영역
  conceptAndReasoning: RubricGrade; // 개념 이해 및 추론
  problemSolvingAndConnection: RubricGrade; // 문제 해결 및 삶과의 연결
  communicationAndCollaboration: RubricGrade; // 의사소통 및 협업
  reflectionAndMetacognition: RubricGrade; // 성찰 및 메타인지
  teacherFeedback: string;
  evaluatedAt: string;
  teacherName?: string;
}

export interface Submission {
  id: string;
  gradeClass: string;
  studentNo: string;
  teamNo: number;
  name: string;
  drawingData: DrawingData;
  quizData: QuizData;
  reflection: ReflectionData;
  evaluation?: RubricEvaluation;
  createdAt: any; // Firestore Timestamp or ISO string
}

export type AppView = 'login' | 'drawing' | 'reflection' | 'board' | 'teacher';
