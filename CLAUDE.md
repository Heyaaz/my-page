# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev        # 개발 서버 (localhost:3000)
npm run build      # 프로덕션 빌드 (타입 체크 포함)
npm run lint       # ESLint
npx tsc --noEmit   # 타입 체크만
```

## Architecture

**개인 포트폴리오 허브.** 홈(랜딩) + 블로그 + 포트폴리오 + About + Contact 구조.

- **Next.js 16 App Router** + TypeScript + Tailwind CSS v4
- **Supabase (PostgreSQL)**: 메타데이터 저장 (slug, title, tags, featured 여부 등)
- **Notion API**: 블로그/포트폴리오 본문 콘텐츠 소스 — Notion에서 글 작성 → `notion_page_id`로 연동
- **Vercel**: 배포

### 콘텐츠 흐름

```
Supabase DB (slug, title, notion_page_id, ...) 
  → getPostBySlug() / getProjectBySlug()
  → notion_page_id 있으면 getNotionPageMarkdown(id) 호출
  → NotionContent 컴포넌트로 렌더링 (prose 스타일)
```

### Supabase 클라이언트 3종

| 파일 | 용도 |
|---|---|
| `lib/supabase/server.ts` | 서버 컴포넌트, Route Handler — `cookies()` 사용 |
| `lib/supabase/static.ts` | `generateStaticParams` 전용 — 빌드 타임, cookies 없음 |
| `lib/supabase/client.ts` | 클라이언트 컴포넌트 전용 |

`generateStaticParams`에서 절대 `server.ts` 클라이언트를 쓰면 안 됨 — `cookies()` 빌드 타임 오류 발생.

### 환경 변수 가드

`lib/supabase/queries.ts`의 모든 함수는 `hasSupabase()` 체크로 시작함. env 없으면 빈 배열/null 반환 → 로컬에서 Supabase 없이도 빌드/렌더링 가능.

### 핵심 파일 위치

- 데이터 쿼리: `lib/supabase/queries.ts`
- Notion fetch: `lib/notion/fetch.ts`
- Notion 렌더러: `components/ui/NotionContent.tsx` (`'use client'`)
- SEO 메타데이터: `lib/seo/metadata.ts`
- 타입 정의: `types/blog.ts`, `types/portfolio.ts`, `types/shared.ts`

### Tailwind v4 주의사항

플러그인은 `postcss.config.mjs`가 아닌 `app/globals.css`에서 `@plugin` 지시어로 추가:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

### Supabase 스키마 (핵심 컬럼)

**`blog_posts`**: `id, slug, title, excerpt, content, notion_page_id, cover_image_url, category, published_at, is_published, is_featured, reading_time`

**`portfolio_projects`**: `id, slug, title, summary, content, notion_page_id, cover_image_url, role, stack(jsonb), duration, project_url, github_url, outcome, is_published, is_featured, published_at`

새 글/프로젝트 등록 시: Supabase에 메타데이터 입력 + `notion_page_id`에 Notion 페이지 ID 저장.
