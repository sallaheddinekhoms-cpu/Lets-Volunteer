import { Button } from "@/components/ui/button"
import ArticleForm from "@/components/dashboard/blog/article-form"
import Link from "next/link"

import { getArticle } from "@/data/Articles"

interface EditArticlePageProps {
  params: Promise<{ id: string }>
}

const EditArticlePage = async ({ params }: EditArticlePageProps) => {
  const { id } = await params
  const { data: article } = await getArticle(id)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">تحديث المقال </h2>
        <Link href="/dashboard/blog">
          <Button variant="outline">العودة للقائمة</Button>
        </Link>
      </div>

      <ArticleForm initialData={article} />
    </div>
  )
}

export default EditArticlePage

