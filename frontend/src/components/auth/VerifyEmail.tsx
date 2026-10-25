'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { BASE_URL } from '@/lib/constant';

export default function VerifyEmail({ token }: { token: string }) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('جاري التحقق من بريدك الإلكتروني...');
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      console.log('BASE_URL', BASE_URL);
      try {
        const response = await fetch(`${BASE_URL}/auth/verify-email/${token}/`, {
          method: 'GET',
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage('تم تأكيد بريدك الإلكتروني بنجاح!');
          setTimeout(() => {
            router.push('/auth');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.message || 'حدث خطأ أثناء تأكيد البريد الإلكتروني');
        }
      } catch (error) {
        setStatus('error');
        console.error('Error verifying email:', error);
        setMessage('حدث خطأ أثناء الاتصال بالخادم');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg"
      >
        <div className="text-center">
          {status === 'loading' && (
            <Loader2 className="h-16 w-16 text-primary mx-auto animate-spin" />
          )}
          {status === 'success' && (
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
          )}
          {status === 'error' && (
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
          )}

          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            تأكيد البريد الإلكتروني
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {message}
          </p>

          {status === 'success' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-sm text-gray-500"
            >
              سيتم توجيهك إلى صفحة تسجيل الدخول خلال 3 ثوان...
            </motion.p>
          )}

          {status === 'error' && (
            <button
              onClick={() => router.push('/auth')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              العودة إلى تسجيل الدخول
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}