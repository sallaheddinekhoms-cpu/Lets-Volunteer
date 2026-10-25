import { CalendarIcon } from "lucide-react"
import { getArticle } from "@/data/Articles"
import { format, formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface BlogPostPageProps {
  params: Promise<{ id: string }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {

  const { id } = await params

  const { data: post } = await getArticle(id);

  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-4 text-right">{post.title}</h1>
        <div className="flex items-center justify-start space-x-4 space-x-reverse mb-6 text-muted-foreground">
          <div className="flex items-center justify-start">
          <CalendarIcon className="w-4 h-4 ml-2" />
            <span>
              {format(new Date(post.created_at), 'PPP', { locale: ar })}
              {" "}
              <span className="text-muted-foreground/60">
                ({formatDistanceToNow(new Date(post.created_at), { locale: ar, addSuffix: true })})
              </span>
            </span>
           
          </div>


        </div>
        {post.video ? (
          <div className="aspect-w-16 aspect-h-9 mb-8">
            <iframe
              src={`https://www.youtube.com/embed/${post.video}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg shadow-lg"
            ></iframe>
          </div>
        ) : (
          <img
            src={post.article_image || "/placeholder.svg"}
            alt={post.title}
            width={800}
            height={400}
            className="w-full h-auto rounded-lg shadow-lg mb-8"
          />
        )}
        {post.content && (
          <div className="prose prose-lg max-w-none text-right" dangerouslySetInnerHTML={{ __html: post.content }}></div>
        )}
      </article>
    </div>
  )
}

