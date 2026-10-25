"use client"

import React, { useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import { uploadExcelFile } from '@/data/Aids';
import Link from 'next/link';
import { BASE_URL } from '@/lib/constant';

interface BulkUploadBeneficiariesProps {
  aid_type_id: string;
  onSuccess?: () => void;
}

const BulkUploadBeneficiaries: React.FC<BulkUploadBeneficiariesProps> = ({
  aid_type_id,
  onSuccess
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  

  const uploadFile = async () => {
    if (!file) {
      toast.warning('يرجى اختيار ملف أولاً');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('aid_type', aid_type_id);

    try {
      const data = await uploadExcelFile(formData);
      
      toast.success(`تمت إضافة ${data.added_count} مستفيد بنجاح`);
      
      // if (response.data.duplicates_count > 0) {
      //   setDuplicates(response.data.duplicates);
      //   toast.info(`تم تخطي ${response.data.duplicates_count} مستفيد مكرر`);
      // }
      
      // Reset file input
      setFile(null);
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      // Call onSuccess if provided
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'حدث خطأ أثناء رفع الملف');
    } finally {
      setLoading(false);
    }
  };

//   const fetchDuplicates = async () => {
//     try {
//       const response = await axios.get(`/api/duplicates/beneficiaries?aid_type=${aid_type_id}`);
//       setDuplicates(response.data.duplicates);
//       setShowDuplicates(true);
//     } catch (error) {
//       toast.error('حدث خطأ أثناء جلب قائمة المستفيدين المكررين');
//     }
//   };

  return (
    <div dir='rtl' className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">إضافة مستفيدين بشكل جماعي</h3>
      
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-4">
          <Link className='flex gap-2 items-center' href={`${BASE_URL}/aid/download_template/beneficiaries`} >
            <Download className="w-4 h-4 ml-2" />
            تحميل النموذج
            </Link>

          
          <span className="text-sm text-gray-500">
            قم بتحميل النموذج أولاً وملئه بأرقام هويات المستفيدين
          </span>
        </div>
        
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 mb-1">
              ملف المستفيدين
            </label>
            <Input
              id="file-input"
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>
          
          <Button
            onClick={uploadFile}
            disabled={!file || loading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? 'جاري الرفع...' : (
              <>
                <Upload className="w-4 h-4 ml-2" />
                رفع الملف
              </>
            )}
          </Button>
        </div>
        
        
        
        {/* {duplicates.length === 0 && (
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={fetchDuplicates}
              className="text-gray-600 border-gray-400 hover:bg-gray-50"
            >
              <AlertCircle className="w-4 h-4 ml-2" />
              التحقق من المستفيدين المكررين
            </Button>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default BulkUploadBeneficiaries;