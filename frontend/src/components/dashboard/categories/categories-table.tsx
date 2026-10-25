"use client"
import { addCategory, deleteCategory, editCategory } from '@/data/admin/Categories';
import { Category } from '@/types'
import { Pencil, PlusIcon, Trash2 } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
    } from "@/components/ui/alert-dialog";
interface CategoryTableProps {
      categories: Category[]
}

const CategoriesTable: React.FC<CategoryTableProps> = (
      { categories }
) => {

const [isModalOpen, setIsModalOpen] = useState(false);
const [editingCategory, setEditingCategory] = useState<Category | null>(null);
const [newLabel, setNewLabel] = useState('');

const [ deleteCategoryId, setDeleteCategory] = useState<string | null>(null);

const [showDeleteDialog, setShowDeleteDialog] = useState(false);


const handleAdd = async() => {
      if (newLabel.trim()) {
            const newCategory = {
                  label: newLabel.trim()
            };

            toast.promise(
                  addCategory(newCategory),
                  {
                        pending: 'جاري إضافة التصنيف...',
                        success: 'تمت إضافة التصنيف بنجاح',
                        error: 'حدث خطأ أثناء إضافة التصنيف'
                  }
            )

            setNewLabel('');
            setIsModalOpen(false);
      }
};

const handleEdit = () => {
      if (editingCategory && newLabel.trim()) {
            
            toast.promise(
                  editCategory(editingCategory.id, { label: newLabel.trim() }),
                  {
                        pending: 'جاري تعديل التصنيف...',
                        success: 'تم تعديل التصنيف بنجاح',
                        error: 'حدث خطأ أثناء تعديل التصنيف'
                  }
            )

            setNewLabel('');
            setEditingCategory(null);
            setIsModalOpen(false);
      }
};

const handleDelete = () => {
      if (deleteCategoryId) {
            toast.promise(
                  deleteCategory(deleteCategoryId),
                  {
                        pending: 'جاري حذف التصنيف...',
                        success: 'تم حذف التصنيف بنجاح',
                        error: 'حدث خطأ أثناء حذف التصنيف'
                  }
            )

            setDeleteCategory(null);
            setShowDeleteDialog(false);
      }
};

const openEditModal = (category: Category) => {
      setEditingCategory(category);
      setNewLabel(category.label);
      setIsModalOpen(true);
};
return (
<>
  <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">إدارة التصنيفات</h1>
                    <button
                          onClick={() => {
                                setEditingCategory(null);
                                setNewLabel('');
                                setIsModalOpen(true);
                          }}
                          className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors"
                    >
                          <PlusIcon size={20} />
                          إضافة تصنيف جديد
                    </button>
              </div>

              <div className="overflow-x-auto">
                    <table className="w-full">
                          <thead className="bg-gray-50">
                                <tr>
                                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">التصنيف</th>
                                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الإجراءات</th>
                                </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                                {categories.map(category => (
                                      <tr key={category.id}>
                                            <td className="px-6 py-4 text-right text-sm text-gray-900">{category.label}</td>
                                            <td className="px-6 py-4 text-right">
                                                  <div className="flex gap-2 justify-end">
                                                        <button
                                                              onClick={() => openEditModal(category)}
                                                              className="text-primary hover:text-primary/90 p-1"
                                                        >
                                                              <Pencil size={18} />
                                                        </button>
                                                        <button
                                                              onClick={() => {setDeleteCategory(category.id); setShowDeleteDialog(true)}}
                                                              className="text-red-600 hover:text-red-800 p-1"
                                                        >
                                                              <Trash2 size={18} />
                                                        </button>
                                                  </div>
                                            </td>
                                      </tr>
                                ))}
                                {categories.length === 0 && (
                                      <tr>
                                            <td colSpan={2} className="px-6 py-4 text-center text-gray-500">
                                                  لا توجد تصنيفات مضافة
                                            </td>
                                      </tr>
                                )}
                          </tbody>
                    </table>
              </div>
        </div>
  </div>

  {/* Modal */}
  {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <h2 className="text-xl font-semibold mb-4">
                          {editingCategory ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
                    </h2>
                    <input
                          type="text"
                          value={newLabel}
                          onChange={(e) => setNewLabel(e.target.value)}
                          placeholder="اسم التصنيف"
                          className="w-full p-2 border border-gray-300 rounded-md mb-4"
                          dir="rtl"
                    />
                    <div className="flex justify-end gap-2">
                          <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                          >
                                إلغاء
                          </button>
                          <button
                                onClick={editingCategory ? handleEdit : handleAdd}
                                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                          >
                                {editingCategory ? 'حفظ التغييرات' : 'إضافة'}
                          </button>
                    </div>
              </div>
        </div>
  )}

<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا التصنيف  </AlertDialogTitle>
      
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف المتطوع
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
</>

)
}

export default CategoriesTable 
