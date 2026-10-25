"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderCircle, Upload, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from 'next/link';
import { BASE_URL } from '@/lib/constant';
import { importVolunteerExcel } from '@/data/admin/Volunteers';

interface ImportResult {
  success: boolean;
  imported: number;
  errors: Array<string>;
  total: number;
}

export default function VolunteerImport() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
      setResult(null);
    }
  };

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError("الرجاء اختيار ملف Excel");
      return;
    }

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError("يجب أن يكون الملف بتنسيق Excel (.xlsx أو .xls)");
      return;
    }

    setIsUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('excel_file', file);

    try {
      const { data , status } = await importVolunteerExcel(formData);

      if (status !== 200) {
        throw new Error(data.errors|| 'فشل تحميل الملف');
      }

      
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء استيراد المتطوعين');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>استيراد المتطوعين</CardTitle>
        <CardDescription>قم بتحميل ملف Excel يحتوي على قائمة المتطوعين</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>خطأ</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {result && (
          <Alert className={result.errors.length > 0 ? "mb-4 bg-yellow-50" : "mb-4 bg-green-50"}>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>تم استيراد {result.imported} من أصل {result.total} متطوع</AlertTitle>
            {result.errors.length > 0 && (
              <AlertDescription>
                <p className="mb-2">فشل استيراد {result.errors.length} متطوع:</p>
                <ul className="list-disc list-inside">
                  {result.errors.slice(0, 5).map((err, index) => (
                    <li key={index}>
                      {err}
                    </li>
                  ))}
                  {result.errors.length > 5 && <li>...و {result.errors.length - 5} أخطاء أخرى</li>}
                </ul>
              </AlertDescription>
            )}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input 
                id="excel_file" 
                type="file" 
                accept=".xlsx,.xls" 
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link className='flex gap-2 items-center justify-center' href={`${BASE_URL}/download-volunteer-template/`} passHref>
          <Download className="h-4 w-4 mr-2" />
          تنزيل القالب
        </Link>
        <Button 
          onClick={handleSubmit} 
          className='bg-primary text-white'
          disabled={!file || isUploading}
        >
          {isUploading ? (
            <>
              <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
              جاري التحميل...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              تحميل واستيراد
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}