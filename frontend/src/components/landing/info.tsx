import React from 'react'
import {  HandHeart, Building2, Calendar} from 'lucide-react';
import Image from 'next/image';

const InfoSection = () => {
  return (
      <section className="py-20 bg-gray-50">

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">منصتنا التطوعية</h2>
            <p className="text-xl text-gray-600">نربط المتطوعين بالفرص التطوعية ونساهم في بناء مجتمع أفضل</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <HandHeart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">فرص تطوعية متنوعة</h3>
              <p className="text-gray-600">نقدم مجموعة واسعة من الفرص التطوعية في مختلف المجالات والمناطق</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">شراكات مع المؤسسات</h3>
              <p className="text-gray-600">نتعاون مع المؤسسات غير الربحية لتحقيق أهداف مجتمعية مشتركة</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">أنشطة دورية</h3>
              <p className="text-gray-600">نظم فعاليات وأنشطة تطوعية على مدار السنة في مختلف المناسبات</p>
            </div>
          </div>

          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="bg-white flex items-center justify-center h-64 rounded-lg">
                {/* Placeholder for illustration or image */}
                <Image
                src={'/black_logo.svg'}
                alt="logo"
                width={300}
                height={300}
                />
              </div>
              <div className="space-y-4 text-right" dir="rtl">
                <h3 className="text-2xl font-bold text-gray-900">كيف تعمل منصتنا؟</h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 flex-row-reverse justify-end">
                    <p className="text-gray-600">سجل حساباً كمتطوع أو كمؤسسة غير ربحية</p>
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">1</span>
                    </div>
                  </li>
                  <li className="flex items-center gap-3 flex-row-reverse justify-end">
                    <p className="text-gray-600">ابحث عن الفرص التطوعية أو أعلن عن فرصة جديدة</p>
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">2</span>
                    </div>
                  </li>
                  <li className="flex items-center gap-3 flex-row-reverse justify-end">
                    <p className="text-gray-600">تواصل مع المتطوعين أو المؤسسات مباشرة</p>
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">3</span>
                    </div>
                  </li>
                </ul>
                <button className="bg-primary text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-primary/90 transition-colors mt-4">
                  ابدأ الآن
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InfoSection
