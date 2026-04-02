import { Metadata } from 'next'
import BlogCategoryFilter from '@/components/blog/BlogCategoryFilter'
import { getAllPosts } from '@/lib/supabase/queries'

export const metadata: Metadata = {
  title: 'Blog',
  description: '생각, 기록, 회고, 기술 이야기를 씁니다.',
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Blog</h1>
      <p className="text-neutral-500 mb-12">생각, 기록, 회고, 기술 이야기를 씁니다.</p>

      {posts.length === 0 ? (
        <p className="text-neutral-400 text-sm">아직 작성된 글이 없습니다.</p>
      ) : (
        <BlogCategoryFilter posts={posts} />
      )}
    </div>
  )
}
