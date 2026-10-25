import ArticleCard from "@/components/articles/article-card"
import { getArticles } from "@/data/Articles"






export default async function BlogPage() {


  const {data:blogPosts} = await getArticles();

  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      <h1 className="text-4xl font-bold text-primary mb-8 text-right">مدونة التطوع</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
            <ArticleCard post={post} key={post.id} />
        ))}
      </div>
    </div>
  )
}

