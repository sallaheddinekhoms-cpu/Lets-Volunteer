import { Button } from "@/components/ui/button";
import ArticleForm from "@/components/dashboard/blog/article-form";
import Link from "next/link";

export default function AddArticlePage() {

 

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">إضافة مقال جديد</h2>
        <Link href="/dashboard/blog">
          <Button variant="outline">العودة للقائمة</Button>
        </Link>
      </div>

      <ArticleForm  />
    </div>
  );
}