# 수막새 복원 수학 탐구실 (원과 현의 성질)
> **중학교 3학년 수학 | '원의 현의 성질' 및 '피타고라스 정리' 융합 탐구 학습 웹앱**

삼국시대(신라·백제·고구려)의 대표적 문화유산인 **연화문 수막새(Lotus patterned roof-end tile)**가 깨진 상태로 발견되었을 때, 수학적 원리인 **'원의 현의 수직이등분선은 그 원의 중심을 지난다'**는 성질을 디지털 작도로 직접 실습하여 원의 중심과 반지름을 복원하고, 피타고라스 정리를 적용한 계산 문제 및 **배·느·실(배운 점, 느낀 점, 실생활 연결)** 성찰일지를 작성하는 중등 수학 탐구 플랫폼입니다.

교사는 학생들의 복원 과정과 성찰을 실시간 학급 현황판(패들렛 스타일)으로 확인하고, 4개 평가 영역의 루브릭 기준에 따라 학생별 피드백과 평가를 실시간으로 입력할 수 있습니다.

---

## 🏛️ 주요 기능 및 화면 구성

1. **접속 및 간이 로그인**
   - 학생: 학급(반), 출석번호, 모둠(1~6모둠), 이름을 입력하여 간편하게 입장.
   - 교사: 전용 비밀번호 인증을 통해 교사 관리자 페이지로 이동.

2. **수막새 디지털 작도 및 중심 복원 캔버스**
   - 깨진 수막새 유물의 남겨진 원호 둘레 위에 두 개의 현(선분 AB, CD)을 클릭/터치하여 작도.
   - 현의 중점과 수직이등분선이 실시간으로 계산 및 시각화.
   - 두 수직이등분선의 교점이 **원의 중심(복원점 $O$)**으로 정확히 찾아지며, 잃어버렸던 수막새의 원형 테두리가 황금빛으로 복원되는 인터랙티브 효과 제공.
   - 수학적 원리 툴팁 및 증명 가이드 제공 ("현의 수직이등분선 위의 임의의 점은 현의 양 끝점으로부터 같은 거리에 있다").

3. **피타고라스 정리 계산 문제 & 배·느·실 성찰일지 제출**
   - 수막새 복원 실측 계산 문제: 현의 길이와 중심에서 현까지의 거리를 이용한 반지름 $r$ 계산 ($r^2 = d^2 + (l/2)^2$).
   - 배운 점(활동 과정 및 수학적 원리 정당화), 느낀 점(유물 복원에 수학이 쓰이는 감상), 실생활과의 연결점(주변이나 다른 문화재에서 중심 찾는 방법) 작성 후 제출.
   - Cloud Firestore 실시간 저장.

4. **실시간 학급 현황판 (모둠별 공유 대시보드)**
   - Firestore `onSnapshot` 기반 실시간 반영 (새 학생 제출 및 교사 피드백이 즉각 업데이트).
   - 1~6모둠 필터링 및 학생별 복원 결과 카드 그리드.
   - 카드 클릭 시 작도 상세, 계산 풀이, 배느실 전문, 교사 루브릭 평가 확인.

5. **교사 전용 관리자 평가 페이지**
   - 전체 학생 제출물 일괄 조회 및 필터링.
   - **4개 루브릭 평가 영역** (A / B / C 등급 부여):
     1. 개념 이해 및 추론 (원의 현의 성질 및 수직이등분선의 교점 원리 이해)
     2. 문제 해결 및 삶과의 연결 (피타고라스 정리 적용 계산 및 실생활 연계성)
     3. 의사소통 및 협업 (모둠 활동 및 수학적 표현의 정당화)
     4. 성찰 및 메타인지 (배·느·실 성찰의 깊이와 자기주도성)
   - 교사 맞춤형 피드백 작성 및 Firestore 저장.
   - 학생 생활기록부 및 수행평가 입력을 위한 **CSV 데이터 내보내기** 지원.

---

## ⚙️ 환경변수 (Environment Variables) 안내

앱은 **Firebase Cloud Firestore**를 통해 전 세계 어디서든 실시간 동기화됩니다.

| 환경변수명 | 필수 여부 | 설명 | 예시 |
|---|---|---|---|
| `VITE_FIREBASE_API_KEY` | 권장 | Firebase 프로젝트 Web API Key | `AIzaSyB...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | 권장 | Firebase Auth 도메인 | `project-id.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | 권장 | Firebase 프로젝트 ID | `sumaksae-math-lab` |
| `VITE_FIREBASE_STORAGE_BUCKET` | 권장 | Cloud Storage 버킷 | `project-id.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | 권장 | Cloud Messaging 발신자 ID | `1029384756` |
| `VITE_FIREBASE_APP_ID` | 권장 | Firebase 웹 App ID | `1:1029...:web:...` |
| `VITE_TEACHER_PASSWORD` | 선택 | 교사 전용 관리자 비밀번호 (기본값: `teacher2025`) | `myschool2025!` |

> 💡 **참고 (로컬/프리뷰 모드 지원)**:  
> 만약 Firebase 키를 아직 발급받지 않았더라도, 앱 자체에 내장된 고성능 브라우저 로컬 저장소 및 시뮬레이션 브로드캐스트 엔진이 작동하므로 모든 기능(작도, 성찰 작성, 학급 현황판, 교사 평가)을 즉시 체험해볼 수 있습니다.

---

## 🚀 GitHub 커밋 및 Vercel 배포 가이드

### 1단계: GitHub 저장소에 푸시
```bash
# 1. 변경사항 추가 및 커밋
git add .
git commit -m "feat: 수막새 복원 수학 탐구실 웹앱 구축"

# 2. 본인의 GitHub 원격 저장소에 푸시
git push origin main
```
*(주의: `.gitignore`에 `.env`, `.env.local`이 포함되어 있으므로 개인 비밀키는 절대 유출되지 않습니다.)*

### 2단계: Vercel에서 프로젝트 Import
1. [Vercel](https://vercel.com/)에 로그인합니다.
2. 대시보드 우측 상단 **"Add New..."** > **"Project"**를 클릭합니다.
3. 방금 푸시한 GitHub 저장소를 찾아 **"Import"**를 누릅니다.
4. **Framework Preset**은 `Vite`로 자동 감지됩니다.

### 3단계: Vercel 환경변수(Environment Variables) 일괄 등록
Vercel Import 설정 화면의 **"Environment Variables"** 섹션에서 아래 블록을 복사하여 Key 칸에 붙여넣기(Paste)하면 모든 환경변수가 자동으로 분할 등록됩니다:

```env
VITE_FIREBASE_API_KEY=본인의_Firebase_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=본인의_프로젝트ID.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=본인의_프로젝트ID
VITE_FIREBASE_STORAGE_BUCKET=본인의_프로젝트ID.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=본인의_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=본인의_APP_ID
VITE_TEACHER_PASSWORD=선생님이_지정한_교사비밀번호
```

5. **"Deploy"** 버튼을 누르면 약 1분 이내에 전 세계 학생들과 함께 접속할 수 있는 실시간 웹앱이 배포됩니다.

---

## 🔒 Firestore 보안 규칙 (Security Rules)
Firebase 콘솔 > Firestore Database > 규칙(Rules) 탭에 프로젝트 루트의 `firestore.rules` 내용을 적용하세요:
- 학생 제출 데이터(`submissions`)의 읽기 권한은 수업 현황 공유를 위해 공개됩니다.
- 생성 권한은 필수 필드가 모두 포함된 경우에만 허용됩니다.
- 교사 평가 필드(`evaluation`, `teacherFeedback`) 외의 무단 덮어쓰기는 차단됩니다.
