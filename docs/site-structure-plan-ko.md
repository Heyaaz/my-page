# 홈페이지 구조 제안서

작성일: 2026-04-02  
대상: `/Users/byeonheejae/home_page`
기술 스택 기준: **Next.js + PostgreSQL + Vercel + Supabase**

---

## 1. 목표

이 사이트의 목적은 단순히 "예쁜 개인 페이지"를 만드는 것이 아니라, 아래 3가지를 한 흐름 안에서 보여주는 것이다.

1. **나는 누구인가**  
2. **무엇을 만들고 기록하는가**  
3. **방문자가 어디로 들어가야 하는가**

즉, 이 사이트는 **랜딩페이지형 홈 + 내부 블로그 + 내부 포트폴리오**를 가진 개인 허브 구조로 가는 것이 가장 적절하다.

---

## 2. 기술 방향

이번 사이트는 아래 조합으로 가는 것이 가장 현실적이다.

- **Frontend / App**: Next.js + TypeScript
- **Database**: PostgreSQL
- **배포**: Vercel
- **DB/백엔드 인프라**: Supabase

### 왜 이 조합이 좋은가

#### Next.js
- 랜딩페이지, 블로그, 포트폴리오를 한 프로젝트 안에서 자연스럽게 구성하기 좋다.
- App Router 기준으로 페이지 구조를 명확하게 나누기 쉽다.
- SEO, 메타데이터, Open Graph, 정적/동적 렌더링 전략을 함께 가져가기 좋다.
- Vercel 배포와 궁합이 가장 좋다.

#### TypeScript
- 이 사이트는 **JavaScript가 아니라 TypeScript를 기본 언어로 사용**하는 것이 좋다.
- 콘텐츠 타입(`blog post`, `portfolio project`)과 DB 응답 구조를 타입으로 고정할 수 있다.
- App Router, Supabase 연동, 서버/클라이언트 경계에서 안정성이 높아진다.
- 따라서 `app/`, `components/`, `lib/`, `types/` 전반을 `.ts` / `.tsx` 기준으로 설계한다.

#### PostgreSQL
- 블로그와 포트폴리오를 단순 파일이 아니라 **콘텐츠 타입**으로 분리해 관리하기 좋다.
- 나중에 draft/published, tag, featured, related content, 조회수, 검색 같은 확장이 쉬워진다.
- 포트폴리오와 블로그 간 관계를 구조적으로 관리할 수 있다.

#### Supabase
- PostgreSQL을 바로 활용할 수 있다.
- 초기에 복잡한 백엔드 없이도 DB, Auth, Storage, admin성 기능까지 확장 가능하다.
- 글/프로젝트 작성 기능을 나중에 붙일 때도 자연스럽다.

#### Vercel
- Next.js 배포가 가장 간단하다.
- preview deployment가 편하다.
- 블로그/포트폴리오 변경 후 빠르게 확인하기 좋다.

---

## 3. 핵심 방향

### Supanova skill 사용 원칙
- 홈(랜딩페이지) 디자인은 설치한 Supanova skill을 적극 활용해 설계한다.
- 우선 사용 대상 skill: `taste-skill`, `soft-skill`, `output-skill`
- 홈에서 만든 디자인 언어(타이포그래피, spacing, color, card, button, nav, CTA, motion)를 사이트 전체의 기준으로 삼는다.
- 포트폴리오/블로그/About/Contact는 홈의 디자인 시스템을 재사용하되, 각 페이지 목적에 맞게 강도를 낮춰 적용한다.
- 즉, **홈은 브랜드의 최대치**, 다른 페이지는 **같은 시스템의 실용적 변주**로 설계한다.
- 기존 페이지를 개선할 때는 `redesign-skill`을 사용해 업그레이드 방향을 잡는다.

### 추천 방향
- 홈은 **랜딩페이지**처럼 동작한다.
- 블로그와 포트폴리오는 **같은 사이트 안의 별도 섹션**으로 운영한다.
- 외부 링크 허브가 아니라, **내부 콘텐츠 중심 구조**로 간다.
- 홈은 모든 걸 다 보여주는 페이지가 아니라, **핵심 소개 + 분기 허브** 역할만 한다.

### 피해야 할 방향
- 홈에서 소개, 블로그 전체, 포트폴리오 전체, 연락, 잡다한 링크를 한 번에 다 보여주기
- 블로그와 포트폴리오를 같은 "게시글"처럼 뭉개기
- 디자인은 화려한데 실제 탐색 흐름은 약한 구조
- 작성/업데이트가 귀찮아서 콘텐츠가 쌓이지 않는 구조

---

## 4. 추천 정보 구조(IA)

```text
/
├─ 홈 Home
├─ 포트폴리오 Portfolio
│  ├─ 목록
│  └─ 상세 /portfolio/[slug]
├─ 블로그 Blog
│  ├─ 목록
│  └─ 상세 /blog/[slug]
├─ 소개 About
└─ 연락 Contact
```

### 가장 중요한 원칙
- **홈은 허브**
- **포트폴리오는 프로젝트 중심**
- **블로그는 글 중심**
- **소개/연락은 보조 페이지**

---

## 5. 페이지별 역할

## 5.1 홈 `/`

홈의 역할은 단 하나다.

> 방문자가 10초 안에 "이 사람은 누구고, 뭘 하고, 어디로 들어가면 되는지" 알게 하는 것

### 홈에 들어갈 섹션
1. **Hero 섹션**
   - 한 줄 소개
   - 짧은 설명
   - 대표 CTA 2개
     - 포트폴리오 보기
     - 글 보기

2. **대표 포트폴리오 하이라이트**
   - 2~4개만 노출
   - 전체 목록은 `/portfolio`로 이동

3. **최근 글 하이라이트**
   - 2~3개만 노출
   - 전체 목록은 `/blog`로 이동

4. **나를 설명하는 짧은 섹션**
   - 어떤 문제를 다루는지
   - 어떤 강점을 가지는지

5. **마지막 CTA**
   - 연락 / 협업 / 더 보기

### 홈에서 하지 말아야 할 것
- 블로그 전체 리스트 노출
- 포트폴리오 전체 카드 과다 노출
- 긴 자기소개 장문
- 너무 많은 분기 버튼

---

## 5.2 포트폴리오 `/portfolio`

포트폴리오는 단순 링크 목록이 아니라, **프로젝트 아카이브**로 가야 한다.

### 목록 페이지
- 썸네일
- 프로젝트명
- 한 줄 설명
- 역할/스택/태그
- 중요도 또는 대표 여부

### 상세 페이지
권장 구조:
- 프로젝트 소개
- 문제/배경
- 내가 맡은 역할
- 접근 방식
- 구현 내용
- 결과/성과
- 배운 점
- 관련 글 링크(있으면)
- 실제 링크/GitHub 링크(있으면)

### 중요한 점
포트폴리오는 블로그처럼 시간순 글이 아니라, **사례(case study)**처럼 보여야 한다.

---

## 5.3 블로그 `/blog`

블로그는 생각과 기록을 쌓는 공간이다.

### 목록 페이지
- 제목
- 요약
- 날짜
- 태그/카테고리
- 읽기 시간(선택)

### 상세 페이지
- 본문 가독성 우선
- 코드 블록/이미지 지원
- 태그/이전글/다음글 정도만 최소 구성
- 관련 프로젝트 연결 가능

### 블로그의 역할
- 검색 유입
- 문제 해결 기록
- 작업 맥락 축적
- 포트폴리오 신뢰 강화

---

## 5.4 소개 `/about`

이 페이지는 홈의 확장판 정도로 보면 된다.

권장 구성:
- 나는 누구인가
- 어떤 분야에 관심 있는가
- 어떤 방식으로 일하는가
- 사용하는 기술/도구
- 작업 철학

주의:
- 이력서 전체를 그대로 붙이지 말 것
- 홈보다 조금 더 자세한 수준이면 충분

---

## 5.5 연락 `/contact`

연락 페이지는 단순해야 한다.

권장 구성:
- 이메일
- GitHub
- LinkedIn / SNS (필요 시)
- 협업 가능 분야
- 간단한 안내 문구

폼이 꼭 필요한 건 아니다.  
처음엔 링크/이메일 기반으로 시작해도 충분하다.

---

## 6. 콘텐츠 타입 분리

이 사이트에서 가장 중요하게 분리해야 하는 건 아래 두 타입이다.

### 1) Blog Post
- 글 중심
- 시간 축이 중요
- 태그/카테고리 기반 탐색
- 생각, 기록, 회고, 튜토리얼

### 2) Portfolio Project
- 프로젝트 중심
- 성과/역할/결과가 중요
- 사례 연구 형식
- 작업물, 서비스, 실험, 제품

### 공통 필드 예시
- `title`
- `slug`
- `summary`
- `coverImage`
- `tags`
- `publishedAt`
- `featured`
- `status`

### Post 전용 필드 예시
- `category`
- `readingTime`
- `excerpt`

### Project 전용 필드 예시
- `role`
- `stack`
- `duration`
- `links`
- `outcome`
- `caseStudy`

즉, 내부적으로는 비슷한 구조를 써도 되지만, 사용자 경험상으로는 **명확히 다른 콘텐츠 타입**으로 보여줘야 한다.

---

## 7. 운영 방식 추천

## 추천: 1단계는 DB 기반 + 단순 admin 전략

이번에는 DB가 PostgreSQL(Supabase)이므로, 블로그/포트폴리오 콘텐츠를 DB 기반으로 가는 것이 맞다.

### 1단계 추천
- 콘텐츠 저장: Supabase PostgreSQL
- 이미지/썸네일: Supabase Storage
- 공개 사이트 렌더링: Next.js
- 배포: Vercel

### 작성 방식 추천
초기에는 두 가지 중 하나를 고르면 된다.

#### 옵션 A — 가장 현실적
- DB는 PostgreSQL에 두고
- 작성은 Supabase dashboard / 간단한 내부 admin / seed script로 관리

#### 옵션 B — 조금 더 제품형
- `/admin` 같은 내부 작성 페이지를 만들어서
- 블로그/포트폴리오를 웹에서 직접 등록/수정

### 내 추천
처음에는 **옵션 A**가 맞다.

이유:
- 가장 빨리 시작 가능
- 글/포트폴리오 구조 확정이 먼저
- 에디터/권한/보안/초안 저장 같은 복잡도를 뒤로 미룰 수 있음

즉:

> 처음부터 완전한 CMS를 만드는 것보다, **사이트 구조와 콘텐츠 모델을 먼저 확정**하는 것이 더 중요하다.

---

## 8. 데이터 모델 초안

### blog_posts
- `id`
- `slug`
- `title`
- `excerpt`
- `content`
- `cover_image_url`
- `category`
- `published_at`
- `is_published`
- `is_featured`
- `reading_time`
- `created_at`
- `updated_at`

### portfolio_projects
- `id`
- `slug`
- `title`
- `summary`
- `content`
- `cover_image_url`
- `role`
- `stack` (jsonb 또는 relation)
- `duration`
- `status`
- `project_url`
- `github_url`
- `outcome`
- `is_published`
- `is_featured`
- `published_at`
- `created_at`
- `updated_at`

### tags
- `id`
- `name`
- `slug`

### post_tags / project_tags
- 다대다 연결 테이블

### 선택 확장
- `related_posts`
- `related_projects`
- `page_views`
- `drafts`

---

## 9. 네비게이션 구조 추천

헤더 메뉴는 단순하게 가는 것이 좋다.

```text
Home | Portfolio | Blog | About | Contact
```

추가 원칙:
- 상단 메뉴는 5개 내외
- CTA는 1개만 강조
- 모바일에서도 구조가 무너지지 않아야 함

푸터에는 아래 정도면 충분하다.
- 이메일
- GitHub
- 간단한 소개
- 저작권

---

## 10. 홈 페이지 카피 구조 예시

### Hero
- 한 줄 소개: 무엇을 만드는 사람인지
- 짧은 설명: 무엇을 기록하고 어떤 작업을 하는지
- 버튼:
  - 포트폴리오 보기
  - 글 보기

### 하이라이트
- 대표 프로젝트 3개
- 최근 글 3개

### 소개 요약
- 관심 분야
- 작업 스타일
- 강점

### 마지막 CTA
- 협업 문의
- 더 많은 작업 보기

즉, 홈은 "정보 과다"가 아니라 **방향 제시**가 핵심이다.

---

## 11. MVP 추천 범위

처음부터 전부 만들지 말고 아래까지만 먼저 만드는 걸 추천한다.

### MVP
- 홈
- 포트폴리오 목록 + 상세
- 블로그 목록 + 상세
- About
- Contact

### 홈에 노출할 것
- 대표 프로젝트 2~3개
- 최근 글 2~3개

### 아직 미뤄도 되는 것
- 검색
- 태그 페이지
- 복잡한 admin 에디터
- 댓글
- 좋아요/조회수
- 뉴스레터
- 복잡한 애니메이션

---

## 12. 추천 폴더 구조 예시

Next.js App Router + TypeScript 기준으로는 대략 이렇게 가는 것이 무난하다.

```text
app/
  page.tsx
  about/page.tsx
  contact/page.tsx
  blog/page.tsx
  blog/[slug]/page.tsx
  portfolio/page.tsx
  portfolio/[slug]/page.tsx

components/
  home/
  blog/
  portfolio/
  layout/
  ui/

lib/
  supabase/
  blog/
  portfolio/
  seo/

types/
  blog.ts
  portfolio.ts
  shared.ts

content/
  # 필요 시 seed 데이터 또는 정적 fallback
```

### Supabase 관련 권장 분리

```text
lib/supabase/
  client.ts
  server.ts
  queries.ts
  mutations.ts
```

---

## 13. 배포 구조 추천

### Vercel
- Next.js 앱 배포
- preview deployment 사용
- production domain 연결

### Supabase
- PostgreSQL
- Storage
- 필요 시 Auth

### 연결 방식
- Vercel 환경변수에 Supabase URL / key 설정
- 서버 컴포넌트 또는 route handler에서 데이터 조회
- 이미지 asset은 Supabase Storage 사용 가능

### 권장 운영
- public read 중심으로 시작
- admin은 나중에 auth 붙이기
- content CRUD는 점진적으로 확장

---

## 14. 우선순위 제안

### 1단계
- 정보 구조 확정
- 홈/블로그/포트폴리오 구분
- DB 스키마 초안 확정

### 2단계
- 홈 UI
- 블로그 목록/상세
- 포트폴리오 목록/상세
- Supabase 연동

### 3단계
- About/Contact
- SEO 기본 적용
- featured 글/프로젝트 연결

### 4단계
- 태그/필터
- 검색
- admin 또는 작성 UX 개선

---

## 15. 최종 결론

이 프로젝트는 **Next.js + PostgreSQL(Supabase) + Vercel** 조합으로,
**랜딩페이지형 홈 + 내부 블로그 + 내부 포트폴리오** 구조로 가는 것이 적절하다.

핵심은 아래 네 가지다.

1. 홈은 허브 역할만 한다  
2. 블로그와 포트폴리오는 타입을 분리한다  
3. 처음에는 완전한 CMS보다 콘텐츠 구조와 렌더링을 우선한다  
4. Vercel + Supabase 조합으로 빠르게 운영 가능한 구조를 만든다

한 줄로 요약하면:

> "홈은 나를 설명하고, 블로그는 생각을 쌓고, 포트폴리오는 작업을 증명하며, Vercel + Supabase는 이를 가장 현실적으로 운영하게 해주는 조합"이다.
