
import CategoriesTable from '@/components/dashboard/categories/categories-table';
import { getCategories } from '@/data/Category';


async function CategoryPage() {

  const { data:categories } = await getCategories(); 

  return (
    <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
      <CategoriesTable categories={categories} />
    </div>
  );
}

export default CategoryPage;