import { getPartners } from "@/data/Partners"
import { Partner } from "@/types"
import {  ExternalLink } from "lucide-react"

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

async function PartnersPage() {
  let partners: Partner[] = [];
  try {
    const result = await getPartners();
    partners = Array.isArray(result?.data) ? result.data : [];
  } catch (error) {
    console.error("Failed to fetch partners:", error);
    partners = [];
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
   
   
      <div className="bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">شركاؤنا</h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              نعمل معاً مع المؤسسات الرائدة لإحداث تأثير إيجابي في المجتمع
            </p>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {partners.map((partner:Partner) => (
            <div
              key={partner.id}
              className="relative group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative overflow-hidden">
                {/* <Image
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                /> */}

                <img src={partner.logo} alt={partner.name} 
                                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
              />
                
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{partner.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{partner.description}</p>
                <div className="flex justify-between items-center">
                    
                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">كن شريكاً معنا</h2>
          <p className="mt-4 text-lg text-gray-300">انضم إلى شبكة المؤسسات التي تصنع الفرق في مجتمعنا</p>
          <button className="mt-8 bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300">
            تواصل معنا
          </button>
        </div>
      </div>
    </div>
  )
}

export default PartnersPage
