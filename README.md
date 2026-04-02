# home_page

개인 포트폴리오 허브 프로젝트입니다.

- **Next.js 16 App Router**
- **TypeScript**
- **Supabase (PostgreSQL)**
- **Vercel 배포 기준**

## 로컬 실행

### 1) Node로 직접 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 열기.

Docker Compose 실행 시에는 기본적으로 `http://localhost:3001`에 노출됩니다.

### 2) Docker Compose로 실행

먼저 환경 변수 파일을 준비합니다.

```bash
cp .env.local.example .env.local
```

그다음 실행합니다.

```bash
npm run docker:up
```

또는 직접:

```bash
docker compose up --build -d
```

로그 확인:

```bash
npm run docker:logs
```

중지:

```bash
npm run docker:down
```

## 환경 변수

기본 예시는 `.env.local.example` 참고.

필수/권장 항목:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `NOTION_API_KEY`
- `ADMIN_EMAILS`
- `ADMIN_REQUIRE_MFA`
