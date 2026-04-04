'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import { inputCls } from './admin-styles'
import { DEFAULT_BLOG_CATEGORIES } from '@/lib/blog/categories'
import { PROJECT_TYPE_OPTIONS } from '@/lib/portfolio/project-type'
import { formatDate } from '@/lib/utils/date'
import type { BlogPost } from '@/types/blog'
import type { PortfolioProject } from '@/types/portfolio'

type ContentType = 'blog' | 'portfolio'

type BlogFormState = {
  id: string | null
  title: string
  slug: string
  excerpt: string
  category: string
  content: string
  is_featured: boolean
  is_published: boolean
  published_at: string | null
}

type PortfolioFormState = {
  id: string | null
  title: string
  slug: string
  summary: string
  role: string
  stack: string
  duration: string
  status: 'work' | 'side' | ''
  project_url: string
  github_url: string
  outcome: string
  content: string
  is_featured: boolean
  is_published: boolean
  published_at: string | null
}

type BlogAdminItem = Pick<
  BlogPost,
  'id' | 'title' | 'slug' | 'excerpt' | 'category' | 'published_at' | 'is_featured' | 'is_published'
> & {
  updated_at?: string
}

type PortfolioAdminItem = Pick<
  PortfolioProject,
  'id' | 'title' | 'slug' | 'summary' | 'role' | 'status' | 'published_at' | 'is_featured' | 'is_published'
> & {
  updated_at?: string
}

const defaultBlog: BlogFormState = {
  id: null,
  title: '',
  slug: '',
  excerpt: '',
  category: '',
  content: '',
  is_featured: false,
  is_published: true,
  published_at: null,
}

const defaultPortfolio: PortfolioFormState = {
  id: null,
  title: '',
  slug: '',
  summary: '',
  role: '',
  stack: '',
  duration: '',
  status: '',
  project_url: '',
  github_url: '',
  outcome: '',
  content: '',
  is_featured: false,
  is_published: true,
  published_at: null,
}

function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}


export default function AdminEditor() {
  const router = useRouter()
  const [type, setType] = useState<ContentType>('blog')
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [loadingList, setLoadingList] = useState(false)
  const [loadingEntry, setLoadingEntry] = useState(false)
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)

  const [blog, setBlog] = useState<BlogFormState>(defaultBlog)
  const [portfolio, setPortfolio] = useState<PortfolioFormState>(defaultPortfolio)

  const [blogItems, setBlogItems] = useState<BlogAdminItem[]>([])
  const [portfolioItems, setPortfolioItems] = useState<PortfolioAdminItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const supabase = useMemo(() => createClient(), [])
  const notifyTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const selectionRef = useRef({ start: 0, end: 0 })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [draggingImage, setDraggingImage] = useState(false)

  function notify(text: string, ok: boolean) {
    clearTimeout(notifyTimer.current)
    setMessage({ text, ok })
    notifyTimer.current = setTimeout(() => setMessage(null), 3000)
  }

  function resetCurrentForm(nextType: ContentType = type) {
    setPreview(false)
    setSelectedId(null)
    if (nextType === 'blog') {
      setBlog(defaultBlog)
      return
    }
    setPortfolio(defaultPortfolio)
  }


  function setCurrentContent(value: string) {
    if (type === 'blog') {
      setBlog((current) => ({ ...current, content: value }))
      return
    }
    setPortfolio((current) => ({ ...current, content: value }))
  }

  function rememberSelection() {
    const textarea = textareaRef.current
    if (!textarea) return
    selectionRef.current = {
      start: textarea.selectionStart ?? 0,
      end: textarea.selectionEnd ?? 0,
    }
  }

  function insertMarkdownAtSelection(markdown: string) {
    const { start, end } = selectionRef.current
    const before = currentContent.slice(0, start)
    const after = currentContent.slice(end)
    const nextValue = `${before}${markdown}${after}`
    const nextCursor = start + markdown.length

    setCurrentContent(nextValue)
    setPreview(false)

    requestAnimationFrame(() => {
      textareaRef.current?.focus()
      textareaRef.current?.setSelectionRange(nextCursor, nextCursor)
      selectionRef.current = { start: nextCursor, end: nextCursor }
    })
  }

  function buildImageMarkdown(url: string, label = 'image') {
    const alt = label.replace(/\.[^.]+$/, '').trim() || 'image'
    return `\n![${alt}](${url})\n`
  }

  async function uploadImageFile(file: File) {
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? 'content-images'
    const safeName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.-]+/g, '-')
      .replace(/-+/g, '-')
    const path = `${type}/${Date.now()}-${crypto.randomUUID()}-${safeName}`

    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { cacheControl: '3600', upsert: false })

    if (error) {
      notify(`이미지 업로드에 실패했습니다. Supabase Storage bucket(기본값: ${bucket})과 정책을 확인해주세요.`, false)
      return null
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }

  async function insertImageFiles(files: File[]) {
    const imageFiles = files.filter((file) => file.type.startsWith('image/'))
    if (imageFiles.length === 0) return

    setUploadingImage(true)
    const markdowns: string[] = []

    for (const file of imageFiles) {
      const publicUrl = await uploadImageFile(file)
      if (!publicUrl) {
        setUploadingImage(false)
        return
      }
      markdowns.push(buildImageMarkdown(publicUrl, file.name))
    }

    insertMarkdownAtSelection(markdowns.join(''))
    notify('이미지를 업로드하고 본문에 삽입했습니다.', true)
    setUploadingImage(false)
  }

  function handleDroppedUrl(raw: string) {
    const value = raw.trim()
    if (!/^https?:\/\//.test(value)) return false
    insertMarkdownAtSelection(buildImageMarkdown(value, 'image'))
    notify('이미지 링크를 본문에 삽입했습니다.', true)
    return true
  }

  async function handleTextareaDrop(event: React.DragEvent<HTMLTextAreaElement>) {
    event.preventDefault()
    setDraggingImage(false)
    rememberSelection()

    const files = Array.from(event.dataTransfer.files ?? [])
    if (files.length > 0) {
      await insertImageFiles(files)
      return
    }

    const uri = event.dataTransfer.getData('text/uri-list') || event.dataTransfer.getData('text/plain')
    handleDroppedUrl(uri)
  }

  async function handleTextareaPaste(event: React.ClipboardEvent<HTMLTextAreaElement>) {
    const files = Array.from(event.clipboardData.files ?? [])
    if (files.length === 0) return

    event.preventDefault()
    rememberSelection()
    await insertImageFiles(files)
  }

  function openImagePicker() {
    fileInputRef.current?.click()
  }

  async function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (files.length === 0) return
    rememberSelection()
    await insertImageFiles(files)
  }

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await supabase.auth.signOut()
      router.refresh()
    } catch {
      setSigningOut(false)
    }
  }

  async function refreshEntries(nextType: ContentType) {
    setLoadingList(true)

    const isBlog = nextType === 'blog'
    const { data, error } = await supabase
      .from(isBlog ? 'blog_posts' : 'portfolio_projects')
      .select(
        isBlog
          ? 'id, title, slug, excerpt, category, published_at, is_featured, is_published, updated_at'
          : 'id, title, slug, summary, role, published_at, is_featured, is_published, updated_at'
      )
      .order('updated_at', { ascending: false })

    setLoadingList(false)

    if (error) {
      notify('콘텐츠 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.', false)
      return
    }

    if (isBlog) {
      setBlogItems((data ?? []) as BlogAdminItem[])
    } else {
      setPortfolioItems((data ?? []) as PortfolioAdminItem[])
    }
  }

  useEffect(() => {
    void refreshEntries(type)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  useEffect(() => () => clearTimeout(notifyTimer.current), [])

  async function selectBlog(id: string) {
    setLoadingEntry(true)
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, category, content, is_featured, is_published, published_at')
      .eq('id', id)
      .single()

    setLoadingEntry(false)

    if (error || !data) {
      notify('글을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.', false)
      return
    }

    setType('blog')
    setPreview(false)
    setSelectedId(data.id)
    setBlog({
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      category: data.category ?? '',
      content: data.content,
      is_featured: data.is_featured,
      is_published: data.is_published,
      published_at: data.published_at,
    })
  }

  async function selectPortfolio(id: string) {
    setLoadingEntry(true)
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('id, title, slug, summary, role, stack, duration, status, project_url, github_url, outcome, content, is_featured, is_published, published_at')
      .eq('id', id)
      .single()

    setLoadingEntry(false)

    if (error || !data) {
      notify('프로젝트를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.', false)
      return
    }

    setType('portfolio')
    setPreview(false)
    setSelectedId(data.id)
    setPortfolio({
      id: data.id,
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      role: data.role ?? '',
      stack: Array.isArray(data.stack) ? data.stack.join(', ') : '',
      duration: data.duration ?? '',
      status: data.status ?? '',
      project_url: data.project_url ?? '',
      github_url: data.github_url ?? '',
      outcome: data.outcome ?? '',
      content: data.content,
      is_featured: data.is_featured,
      is_published: data.is_published,
      published_at: data.published_at,
    })
  }

  async function saveBlog() {
    if (saving) return
    setSaving(true)
    const publishedAt = computePublishedAt(blog.is_published, blog.published_at)
    const payload = {
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      category: blog.category || null,
      content: blog.content,
      is_featured: blog.is_featured,
      is_published: blog.is_published,
      published_at: publishedAt,
    }

    const query = blog.id
      ? supabase.from('blog_posts').update(payload).eq('id', blog.id)
      : supabase.from('blog_posts').insert(payload)

    const { data, error } = await query.select('id, published_at').single()
    setSaving(false)

    if (error || !data) {
      notify('저장에 실패했습니다. 잠시 후 다시 시도해주세요.', false)
      return
    }

    setBlog((current) => ({ ...current, id: data.id, published_at: data.published_at }))
    setSelectedId(data.id)
    notify(blog.id ? '블로그 글을 수정했습니다.' : '블로그 글을 저장했습니다.', true)
    await refreshEntries('blog')
  }

  async function savePortfolio() {
    if (saving) return
    setSaving(true)
    const publishedAt = computePublishedAt(portfolio.is_published, portfolio.published_at)

    const payload = {
      title: portfolio.title,
      slug: portfolio.slug,
      summary: portfolio.summary,
      role: portfolio.role || null,
      stack: portfolio.stack
        ? portfolio.stack.split(',').map((value) => value.trim()).filter(Boolean)
        : [],
      duration: portfolio.duration || null,
      status: portfolio.status || null,
      project_url: portfolio.project_url || null,
      github_url: portfolio.github_url || null,
      outcome: portfolio.outcome || null,
      content: portfolio.content,
      is_featured: portfolio.is_featured,
      is_published: portfolio.is_published,
      published_at: publishedAt,
    }

    const query = portfolio.id
      ? supabase.from('portfolio_projects').update(payload).eq('id', portfolio.id)
      : supabase.from('portfolio_projects').insert(payload)

    const { data, error } = await query.select('id, published_at').single()
    setSaving(false)

    if (error || !data) {
      notify('저장에 실패했습니다. 잠시 후 다시 시도해주세요.', false)
      return
    }

    setPortfolio((current) => ({ ...current, id: data.id, published_at: data.published_at }))
    setSelectedId(data.id)
    notify(portfolio.id ? '포트폴리오를 수정했습니다.' : '포트폴리오를 저장했습니다.', true)
    await refreshEntries('portfolio')
  }

  async function deleteCurrent() {
    const isBlog = type === 'blog'
    const targetId = isBlog ? blog.id : portfolio.id

    if (!targetId) return

    const confirmed = window.confirm(
      isBlog ? '이 블로그 글을 삭제할까요?' : '이 포트폴리오 프로젝트를 삭제할까요?'
    )

    if (!confirmed) return

    setSaving(true)
    const { error } = await supabase
      .from(isBlog ? 'blog_posts' : 'portfolio_projects')
      .delete()
      .eq('id', targetId)
    setSaving(false)

    if (error) {
      notify('삭제에 실패했습니다. 잠시 후 다시 시도해주세요.', false)
      return
    }

    notify(isBlog ? '블로그 글을 삭제했습니다.' : '포트폴리오를 삭제했습니다.', true)
    resetCurrentForm(type)
    await refreshEntries(type)
  }

  const isEditing = selectedId !== null
  const currentContent = type === 'blog' ? blog.content : portfolio.content
  const currentPublished = type === 'blog' ? blog.is_published : portfolio.is_published
  const currentFeatured = type === 'blog' ? blog.is_featured : portfolio.is_featured
  const currentSlug = type === 'blog' ? blog.slug : portfolio.slug
  const currentTitle = type === 'blog' ? blog.title : portfolio.title
  const currentItems = type === 'blog' ? blogItems : portfolioItems

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-2">
            Authenticated
          </p>
          <h2 className="text-xl font-bold tracking-tight text-neutral-950">콘텐츠 관리</h2>
          <p className="text-sm text-neutral-500 mt-1 leading-relaxed">
            로그인된 관리자만 블로그와 포트폴리오 콘텐츠를 수정할 수 있습니다.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="inline-flex items-center rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-950 disabled:opacity-50"
        >
          {signingOut ? '로그아웃 중...' : '로그아웃'}
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm h-fit xl:sticky xl:top-24">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-2">Library</p>
              <h3 className="text-lg font-semibold tracking-tight text-neutral-950">콘텐츠 목록</h3>
            </div>
            <div className="flex gap-2">
              {(['blog', 'portfolio'] as ContentType[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setType(value)
                    resetCurrentForm(value)
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                    type === value
                      ? 'bg-neutral-950 text-white'
                      : 'border border-neutral-200 text-neutral-500 hover:border-neutral-400'
                  }`}
                >
                  {value === 'blog' ? 'Blog' : 'Portfolio'}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => resetCurrentForm(type)}
            className="mb-5 w-full rounded-full border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-950"
          >
            {type === 'blog' ? '새 블로그 글' : '새 포트폴리오'}
          </button>

          <div className="space-y-2">
            {loadingList ? (
              <p className="text-sm text-neutral-400">목록 불러오는 중...</p>
            ) : currentItems.length === 0 ? (
              <p className="text-sm text-neutral-400">
                아직 등록된 {type === 'blog' ? '글' : '프로젝트'}이 없습니다.
              </p>
            ) : (
              currentItems.map((item) => {
                const selected = item.id === selectedId
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => void (type === 'blog' ? selectBlog(item.id) : selectPortfolio(item.id))}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors ${
                      selected
                        ? 'border-neutral-950 bg-neutral-950 text-white'
                        : 'border-neutral-100 bg-neutral-50 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className={`text-sm font-medium leading-snug ${selected ? 'text-white' : 'text-neutral-900'}`}>
                        {item.title}
                      </p>
                      {item.is_featured && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${selected ? 'bg-white/15 text-white' : 'bg-white text-neutral-500'}`}>
                          Featured
                        </span>
                      )}
                    </div>
                    <div className={`flex flex-wrap gap-2 text-[11px] ${selected ? 'text-white/70' : 'text-neutral-400'}`}>
                      <span>{item.is_published ? 'Published' : 'Draft'}</span>
                      <span>•</span>
                      <span>{formatDate(item.published_at)}</span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-2">
                  Editor
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-neutral-950">
                  {type === 'blog' ? '블로그 작성' : '포트폴리오 작성'}
                </h3>
                <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
                  {isEditing
                    ? '기존 콘텐츠를 수정하거나 삭제할 수 있습니다.'
                    : '새 콘텐츠를 작성해 바로 저장할 수 있습니다.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600">
                  {isEditing ? '수정 중' : '새로 작성'}
                </span>
                <span className={`rounded-full px-3 py-1.5 text-xs font-medium ${currentPublished ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>
                  {currentPublished ? 'Published' : 'Draft'}
                </span>
                {currentFeatured && (
                  <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
                    Featured
                  </span>
                )}
              </div>
            </div>

            {message && (
              <div className={`mb-6 rounded-2xl px-4 py-3 text-sm ${message.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message.text}
              </div>
            )}

            {loadingEntry ? (
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-10 text-sm text-neutral-400">
                선택한 콘텐츠를 불러오는 중...
              </div>
            ) : (
              <>
                {type === 'blog' ? (
                  <div className="space-y-4">
                    <Field label="제목">
                      <input
                        value={blog.title}
                        onChange={(event) =>
                          setBlog((current) => ({
                            ...current,
                            title: event.target.value,
                            slug: toSlug(event.target.value),
                          }))
                        }
                        placeholder="글 제목"
                        className={inputCls}
                      />
                    </Field>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="슬러그">
                        <input
                          value={blog.slug}
                          onChange={(event) => setBlog((current) => ({ ...current, slug: event.target.value }))}
                          placeholder="my-post-slug"
                          className={inputCls}
                        />
                      </Field>
                      <Field label="카테고리">
                        <input
                          value={blog.category}
                          onChange={(event) => setBlog((current) => ({ ...current, category: event.target.value }))}
                          list="blog-category-options"
                          placeholder="기록, 회고, 생각, 기술..."
                          className={inputCls}
                        />
                        <datalist id="blog-category-options">
                          {DEFAULT_BLOG_CATEGORIES.map((category) => (
                            <option key={category} value={category} />
                          ))}
                        </datalist>
                      </Field>
                    </div>
                    <Field label="요약">
                      <input
                        value={blog.excerpt}
                        onChange={(event) => setBlog((current) => ({ ...current, excerpt: event.target.value }))}
                        placeholder="한 줄 요약"
                        className={inputCls}
                      />
                    </Field>
                    <div className="flex flex-wrap gap-6 text-sm text-neutral-600">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={blog.is_featured}
                          onChange={(event) => setBlog((current) => ({ ...current, is_featured: event.target.checked }))}
                          className="rounded"
                        />
                        홈에 대표 글로 표시
                      </label>
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={blog.is_published}
                          onChange={(event) => setBlog((current) => ({ ...current, is_published: event.target.checked }))}
                          className="rounded"
                        />
                        공개 상태로 저장
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Field label="제목">
                      <input
                        value={portfolio.title}
                        onChange={(event) =>
                          setPortfolio((current) => ({
                            ...current,
                            title: event.target.value,
                            slug: toSlug(event.target.value),
                          }))
                        }
                        placeholder="프로젝트명"
                        className={inputCls}
                      />
                    </Field>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="슬러그">
                        <input
                          value={portfolio.slug}
                          onChange={(event) => setPortfolio((current) => ({ ...current, slug: event.target.value }))}
                          placeholder="my-project"
                          className={inputCls}
                        />
                      </Field>
                      <Field label="역할">
                        <input
                          value={portfolio.role}
                          onChange={(event) => setPortfolio((current) => ({ ...current, role: event.target.value }))}
                          placeholder="Frontend, Fullstack..."
                          className={inputCls}
                        />
                      </Field>
                    </div>
                    <Field label="한 줄 요약">
                      <input
                        value={portfolio.summary}
                        onChange={(event) => setPortfolio((current) => ({ ...current, summary: event.target.value }))}
                        placeholder="프로젝트 요약"
                        className={inputCls}
                      />
                    </Field>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="스택 (쉼표 구분)">
                        <input
                          value={portfolio.stack}
                          onChange={(event) => setPortfolio((current) => ({ ...current, stack: event.target.value }))}
                          placeholder="Next.js, TypeScript, Supabase"
                          className={inputCls}
                        />
                      </Field>
                      <Field label="기간">
                        <input
                          value={portfolio.duration}
                          onChange={(event) => setPortfolio((current) => ({ ...current, duration: event.target.value }))}
                          placeholder="2024.01 – 2024.03"
                          className={inputCls}
                        />
                      </Field>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="프로젝트 유형">
                        <select
                          value={portfolio.status}
                          onChange={(event) => setPortfolio((current) => ({ ...current, status: event.target.value as 'work' | 'side' | '' }))}
                          className={inputCls}
                        >
                          <option value="">선택 안 함</option>
                          {PROJECT_TYPE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="프로젝트 URL">
                        <input
                          value={portfolio.project_url}
                          onChange={(event) => setPortfolio((current) => ({ ...current, project_url: event.target.value }))}
                          placeholder="https://..."
                          className={inputCls}
                        />
                      </Field>
                      <Field label="GitHub URL">
                        <input
                          value={portfolio.github_url}
                          onChange={(event) => setPortfolio((current) => ({ ...current, github_url: event.target.value }))}
                          placeholder="https://github.com/..."
                          className={inputCls}
                        />
                      </Field>
                    </div>
                    <Field label="결과/성과">
                      <input
                        value={portfolio.outcome}
                        onChange={(event) => setPortfolio((current) => ({ ...current, outcome: event.target.value }))}
                        placeholder="주요 성과 한 줄"
                        className={inputCls}
                      />
                    </Field>
                    <div className="flex flex-wrap gap-6 text-sm text-neutral-600">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={portfolio.is_featured}
                          onChange={(event) =>
                            setPortfolio((current) => ({ ...current, is_featured: event.target.checked }))
                          }
                          className="rounded"
                        />
                        홈에 대표 프로젝트로 표시
                      </label>
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={portfolio.is_published}
                          onChange={(event) =>
                            setPortfolio((current) => ({ ...current, is_published: event.target.checked }))
                          }
                          className="rounded"
                        />
                        공개 상태로 저장
                      </label>
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-neutral-700">본문</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={openImagePicker}
                        disabled={uploadingImage}
                        className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-900 disabled:opacity-50"
                      >
                        {uploadingImage ? '이미지 업로드 중...' : '이미지 업로드'}
                      </button>
                      <div className="flex gap-1">
                        {([{ label: '작성', value: false }, { label: '미리보기', value: true }] as const).map((tab) => (
                          <button
                            key={tab.label}
                            type="button"
                            onClick={() => setPreview(tab.value)}
                            className={`rounded-full px-3 py-1 text-xs transition-colors ${
                              preview === tab.value
                                ? 'bg-neutral-900 text-white'
                                : 'text-neutral-500 hover:text-neutral-900'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  {!preview && (
                    <p className="mb-3 text-xs text-neutral-400">
                      이미지를 드래그하거나 붙여넣으면 현재 커서 위치에 Markdown 이미지가 삽입됩니다.
                    </p>
                  )}

                  {preview ? (
                    <div className="min-h-80 rounded-2xl border border-neutral-200 p-8">
                      <MarkdownRenderer content={currentContent} />
                    </div>
                  ) : (
                    <textarea
                      ref={textareaRef}
                      value={currentContent}
                      onChange={(event) => setCurrentContent(event.target.value)}
                      onSelect={rememberSelection}
                      onClick={rememberSelection}
                      onKeyUp={rememberSelection}
                      onDragOver={(event) => {
                        event.preventDefault()
                        setDraggingImage(true)
                      }}
                      onDragLeave={() => setDraggingImage(false)}
                      onDrop={handleTextareaDrop}
                      onPaste={handleTextareaPaste}
                      placeholder="Markdown으로 작성하세요. # 제목, **굵게**, - 목록, ```코드블록``` 등 사용 가능."
                      className={`w-full min-h-80 resize-none rounded-2xl border p-6 font-mono text-sm leading-relaxed text-neutral-700 transition-colors focus:border-neutral-400 focus:outline-none ${draggingImage ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200'}`}
                    />
                  )}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => void (type === 'blog' ? saveBlog() : savePortfolio())}
                    disabled={saving || !currentTitle.trim() || !currentSlug.trim()}
                    className="inline-flex min-w-40 items-center justify-center rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
                  >
                    {saving ? '저장 중...' : isEditing ? '업데이트' : '저장'}
                  </button>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => void deleteCurrent()}
                      disabled={saving}
                      className="inline-flex items-center justify-center rounded-full border border-red-200 px-6 py-3 text-sm font-medium text-red-700 transition-colors hover:border-red-400 hover:text-red-800 disabled:opacity-50"
                    >
                      삭제
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => resetCurrentForm(type)}
                    className="inline-flex items-center justify-center rounded-full border border-neutral-200 px-6 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-950"
                  >
                    새로 작성
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function computePublishedAt(isPublished: boolean, existing: string | null): string | null {
  return isPublished ? existing ?? new Date().toISOString() : null
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-neutral-500">{label}</label>
      {children}
    </div>
  )
}

