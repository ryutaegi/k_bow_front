# 활로 (Hwal-ro) - 국궁 커뮤니티 및 기록 앱

![로고](assets/logo4_square.png)

**활로**는 대한민국의 전통 활쏘기, 국궁(Gukgung)을 즐기는 사람들을 위한 모바일 애플리케이션입니다. 사용자들이 자신의 연습 기록(시수)을 체계적으로 관리하고, 전국의 활터 정보를 쉽게 찾아보며, 다른 궁사들과 소통할 수 있는 커뮤니티 플랫폼을 제공합니다.

## ✨ 주요 기능

- **🎯 시수 기록:**
    - 직관적인 UI를 통해 날짜별, 순(巡)별 시수(발 수, 맞춘 개수)를 기록합니다.
    - 디지털 과녁에 맞은 위치를 직접 표시하여 상세한 기록이 가능합니다.
    - 캘린더와 차트를 통해 월별, 일별 기록 통계를 한눈에 파악할 수 있습니다.

- **🗺️ 활터 정보:**
    - 내 주변 또는 특정 지역의 활터(국궁장) 정보를 지도를 통해 쉽게 찾을 수 있습니다.
    - 각 활터의 상세 정보(주소, 연락처 등)를 제공합니다.

- **👨‍👩‍👧‍👦 커뮤니티:**
    - 공지사항, 자유게시판, 정보 공유, 장비 중고거래 등 다양한 주제의 게시판을 통해 다른 사용자들과 소통할 수 있습니다.
    - 소모임(그룹)을 생성하고 참여하여 관심사가 비슷한 사람들과 교류할 수 있습니다.

- **🏹 장비 관리:**
    - 자신이 사용하는 활, 화살 등 장비 정보를 등록하고 관리할 수 있습니다. (구현 예정)

- **👤 내 정보:**
    - 사용자 프로필을 관리하고, 자신의 게시글이나 기록을 모아볼 수 있습니다.
    - 카카오, 네이버, 구글, 애플 등 소셜 로그인을 지원하여 간편하게 시작할 수 있습니다.

## 🛠️ 기술 스택

- **Core:** React Native, Expo (SDK 49)
- **State Management:** React Context API
- **Navigation:** React Navigation (Bottom Tab, Stack)
- **Styling:** Styled Components
- **HTTP Client:** Axios
- **Maps:** React Native Maps
- **Charts/Graphics:** D3.js, React Native SVG
- **Authentication:** AsyncStorage, JWT Decode, 소셜 로그인 (Kakao, Naver, Google, Apple)

## 🚀 시작하기

### 1. 프로젝트 클론

```bash
git clone https://your-repository-url.git
cd k_bow_front
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 앱 실행

Expo Go 앱을 휴대폰에 설치한 후, 아래 명령어를 실행하고 QR 코드를 스캔하세요.

```bash
npm start
```

또는 각 플랫폼에 맞게 빌드하여 실행할 수 있습니다.

```bash
# Android
npm run android

# iOS
npm run ios
```

## 📁 폴더 구조

```
k_bow_front/
├─── src/
│    ├─── api/         # API 요청 관련 함수
│    ├─── assets/      # 폰트, 이미지 등 정적 자원
│    ├─── components/  # 공통 재사용 컴포넌트 (스피너, 버튼 등)
│    ├─── contexts/    # 전역 상태 관리 (User, Progress)
│    ├─── certification/ # 인증 및 로그인 관련 화면
│    ├─── home/        # 홈, 커뮤니티, 그룹 관련 화면
│    ├─── record/      # 시수 기록 관련 화면
│    ├─── map/         # 활터 지도 관련 화면
│    ├─── equipment/   # 장비 관련 화면
│    ├─── mypage/      # 내 정보 관련 화면
│    ├─── stack/       # 네비게이션 스택 정의
│    └─── utils/       # 유틸리티 함수 (이미지 관리 등)
├─── App.js           # 앱 최상위 진입점

└─── package.json     # 프로젝트 정보 및 의존성 관리
```
<img width="523" height="330" alt="활로-메인" src="https://github.com/user-attachments/assets/f0faa008-2c21-4d98-a77c-17675f67c465" />
<img width="261" height="418" alt="활로-그룹" src="https://github.com/user-attachments/assets/69dfc1b3-68fe-49ae-8bc9-2f5c17fa9cfc" />
<img width="261" height="417" alt="활로-기록" src="https://github.com/user-attachments/assets/1d3039f3-3133-47c1-a948-b369fb3dd6c2" />
<img width="261" height="374" alt="활로-커뮤니티" src="https://github.com/user-attachments/assets/04d01f41-39a5-41c8-8220-36a1ff229e99" />
<img width="261" height="374" alt="활로-지도" src="https://github.com/user-attachments/assets/91698504-0a5c-44a9-a4c9-6251cbd49e62" />
