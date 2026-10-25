"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { Article } from "@/types/articles"
import ArticleCard from "../articles/article-card"


interface BlogPostProps {
  articles : Article[]
}

const LatestBlogPostsSection:React.FC<BlogPostProps> = (
  {articles}
) => {
  return (
    <section className="py-20 bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">آخر المقالات</h2>
          <p className="text-xl text-muted-foreground">اكتشف أحدث المقالات والأفكار حول العمل التطوعي</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ArticleCard post={post} />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/blog">
            <Button
              variant="default"
              size="lg"
              className="text-white bg-primary hover:bg-primary/90 text-lg px-6 py-3 rounded-xl font-medium transition-all duration-300 group"
            >
              عرض جميع المقالات
              <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default LatestBlogPostsSection

