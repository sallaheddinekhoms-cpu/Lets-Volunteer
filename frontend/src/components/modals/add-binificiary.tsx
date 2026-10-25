import React from 'react'



const AddBinifiCiaryModal = (
      { setShowAddModal , addBinificiary } : { setShowAddModal: (value: boolean) => void , addBinificiary: (value: string) => void }
) => {


      
  const [bin_id , setBin_id] = React.useState<string>('')
  return (
      <div className="fixed z-60 inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">إضافة مستفيد جديد</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم الهوية
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="أدخل رقم الهوية"
                value={bin_id}
                onChange={(e) => setBin_id(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                onClick={() => { addBinificiary(bin_id) ; setShowAddModal(false) }}
              >
                إضافة
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddBinifiCiaryModal
