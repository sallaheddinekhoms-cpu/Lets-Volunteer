import ArticleTables from "@/components/dashboard/blog/articles-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getArticles } from "@/data/Articles";
import Link from "next/link";

interface BlogPageProps {
  searchParams : Promise<{page:number}>
}


export default async function BlogPage(
  {searchParams} : BlogPageProps
) {


  const filters = await searchParams
  const { data , count } = await getArticles( undefined , filters); 

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">المدونة</h2>
        <Link href="/dashboard/blog/add">
        <Button className="bg-primary text-white" >
                  إضافة مقال جديد
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة المقالات</CardTitle>
        </CardHeader>
        <CardContent>

          <ArticleTables 
          articles={data}
          currentPage={filters.page || 1}
          totalPages={Math.ceil(count / 10)}
          />
          
        </CardContent>
      </Card>
    </div>
  );
}