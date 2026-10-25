import { Article } from '@/types/articles'
import React from 'react'
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, ArrowLeft } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
interface ArticleCardProps {
      post: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = (
      { post }
) => {
      return (
            <Link href={`/blog/${post.id}`} key={post.id} className="group">
                  <Card className="hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 overflow-hidden">
                        <CardContent className="p-0">
                              <div className="relative">
                                    <img
                                          src={post.article_image || "/placeholder.svg"}
                                          alt={post.title}
                                          width={400}
                                          height={200}
                                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                                          <h2 className="text-xl font-semibold text-white text-right line-clamp-2">{post.title}</h2>
                                    </div>
                              </div>
                              <div className="p-4">
                                    <div className="flex items-center justify-start text-sm text-muted-foreground mb-2">
                                    <CalendarIcon className="w-4 h-4 ml-2" />
                                          <span>
                                                {format(new Date(post.created_at), 'PPP', { locale: ar })}
                                                {" "}
                                                <span className="text-muted-foreground/60">
                                                      ({formatDistanceToNow(new Date(post.created_at), { locale: ar, addSuffix: true })})
                                                </span>
                                          </span>
                                          
                                    </div>
                                    <p className="text-muted-foreground text-right line-clamp-3">{post.desc}</p>
                                    <div className="mt-4 flex justify-end items-center text-primary group-hover:text-primary/80 transition-colors duration-300">
                                          <span className="text-sm font-medium">اقرأ المزيد</span>
                                          <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                                    </div>
                              </div>
                        </CardContent>
                  </Card>
            </Link>
      )
}




export default ArticleCard
