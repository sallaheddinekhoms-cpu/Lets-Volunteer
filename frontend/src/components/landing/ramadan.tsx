import React from 'react'
import { MapPin, Heart, Users2} from 'lucide-react';

const RamadanSection = () => {
  return (
      <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">شارك في تنظيم قفة رمضان</h2>
            <p className="text-xl text-gray-600">معاً نستطيع مساعدة المحتاجين في شهر الخير والبركة</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">تبرع بما تستطيع</h3>
              <p className="text-gray-600">كل مساهمة مهما كانت صغيرة تحدث فرقاً في حياة الآخرين</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">شارك في التوزيع</h3>
              <p className="text-gray-600">انضم إلى فريقنا التطوعي في توزيع القفف على المحتاجين</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">حدد المحتاجين</h3>
              <p className="text-gray-600">ساعدنا في تحديد العائلات المحتاجة في منطقتك</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary/90 transition-colors">
              سجل للمشاركة الآن
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RamadanSection
