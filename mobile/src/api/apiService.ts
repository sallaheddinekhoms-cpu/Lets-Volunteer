import { API_BASE_URL } from "./config";
import {
  OpportunityItem,
  SolidarityItem,
  TrainingItem,
  SupportTicket,
  VolunteerProfile,
} from "../types";

export const fallbackOpportunities: OpportunityItem[] = [
  {
    id: "opp-1",
    title: "حملة تشجير كبرى بغابة باينام بمناسبة اليوم الوطني للشجرة",
    description: "تنظيم غرس 5000 شجرة صنوبر بحري وإعادة تهيئة المسالك الغابية وتوزيع مهام الإرشاد البيئي مع محافظة الغابات.",
    organization: "جمعية أصدقاء البيئة والساحل",
    category: { id: "1", label: "بيئة وتشجير" },
    wilaya: "الجزائر",
    daira: "بوزريعة",
    latitude: 36.7900,
    longitude: 3.0100,
    duration: 1,
    date_of_opportunity: "2026-11-08",
    phone_number: "0555112233",
    email: "contact@baynam-trees.dz",
    is_urgent: true,
    is_remote: false,
    is_available: true,
  },
  {
    id: "opp-2",
    title: "تنظيم بنك الدم والقافلة الطبية للمناطق المعزولة",
    description: "مرافقة الأطقم الطبية، تنظيم المراجعين، وتسجيل المتبرعين بالدم بالتعاون مع مستشفى عبد القادر حساني.",
    organization: "الهلال الأحمر الجزائري",
    category: { id: "2", label: "صحة وإغاثة" },
    wilaya: "سيدي بلعباس",
    daira: "سيدي بلعباس",
    latitude: 35.1900,
    longitude: -0.6300,
    duration: 3,
    date_of_opportunity: "2026-11-14",
    phone_number: "0560123456",
    email: "health@cra-sba.dz",
    is_urgent: true,
    is_remote: false,
    is_available: true,
  },
  {
    id: "opp-3",
    title: "دروس تدعيمية ومراجعة امتحانات البكالوريا للتلاميذ المعوزين",
    description: "تطوع أساتذة وطلبة متفوقين لتقديم مراجعات مجانية في مادتي الرياضيات والفيزياء لفائدة أبناء العائلات المعوزة.",
    organization: "جمعية الإرشاد والإصلاح",
    category: { id: "3", label: "تعليم وتدريب" },
    wilaya: "سطيف",
    daira: "سطيف",
    latitude: 36.1900,
    longitude: 5.4100,
    duration: 7,
    date_of_opportunity: "2026-11-20",
    phone_number: "0550998877",
    email: "setif.educ@irchad.dz",
    is_urgent: false,
    is_remote: false,
    is_available: true,
  },
  {
    id: "opp-4",
    title: "إدخال ورقمنة السجلات وتطوير المحتوى الرقمي للجمعيات الخيرية",
    description: "فرصة عمل عن بعد للمبرمجين والمصممين لتحديث منصات الجمعيات وإعداد قواعد بيانات الأسر المستفيدة.",
    organization: "شبكة صناع الأمل الرقمية",
    category: { id: "4", label: "تقنية وتصميم" },
    wilaya: "وهران",
    daira: "وهران",
    latitude: 35.6987,
    longitude: -0.6349,
    duration: 14,
    date_of_opportunity: "2026-11-25",
    phone_number: "0770554433",
    email: "digital@algeriahope.dz",
    is_urgent: false,
    is_remote: true,
    is_available: true,
  },
];

export const fallbackSolidarityItems: SolidarityItem[] = [
  {
    id: "sol-1",
    title: "عكازات ألمنيوم طبية قابلة للتعديل (زوج)",
    category: "مستلزمات طبية",
    item_type: "lending",
    description: "عكازات بحالة ممتازة للإعارة المجانية للمرضى في فترة التعافي أو العمليات الجراحية.",
    wilaya: "الجزائر",
    daira: "باب الوادي",
    contact_phone: "0555123456",
    status: "available",
    created_at: "2026-10-21",
  },
  {
    id: "sol-2",
    title: "كرسي متحرك طبي خفيف الوزن قابل للطي",
    category: "مستلزمات طبية",
    item_type: "donation",
    description: "تبرع دائم لوجه الله لشخص مسن أو من ذوي الاحتياجات الخاصة، حالة شبه جديدة.",
    wilaya: "وهران",
    daira: "السانية",
    contact_phone: "0661234567",
    status: "available",
    created_at: "2026-10-22",
  },
  {
    id: "sol-3",
    title: "جهاز قياس ضغط الدم إلكتروني ناطق",
    category: "أجهزة صحية",
    item_type: "lending",
    description: "جهاز قياس دقيق جداً للإعارة لكبار السن لمتابعة الضغط بشكل دوري في البيت.",
    wilaya: "قسنطينة",
    daira: "الخروب",
    contact_phone: "0770987654",
    status: "available",
    created_at: "2026-10-23",
  },
  {
    id: "sol-4",
    title: "مجموعة مراجع وحوليات البكالوريا (شعبة علوم)",
    category: "تعليم وكتب",
    item_type: "donation",
    description: "كتب ملخصات وحوليات كاملة لتلاميذ البكالوريا تبرع نهائي لمن يستحقها.",
    wilaya: "سطيف",
    daira: "سطيف",
    contact_phone: "0550112233",
    status: "available",
    created_at: "2026-10-23",
  },
];

export const fallbackTrainings: TrainingItem[] = [
  {
    id: 1,
    title: "الإسعافات الأولية الميدانية والتدخل السريع",
    trainer_name: "د. سمير بلحاج (طبيب طوارئ وهلال أحمر)",
    category: "صحة وإغاثة",
    format: "in_person",
    level: "beginner",
    duration_hours: 16,
    description: "تدريب تطبيقي على الإنعاش القلبي الرئوي، معالجة الحروق والجروح، وإخلاء المصابين في الحوادث.",
    start_date: "2026-11-05",
    enrolled_count: 24,
    max_participants: 30,
    location: "الجزائر العاصمة - المركز الثقافي",
  },
  {
    id: 2,
    title: "إدارة وتنظيم الفرق التطوعية في الأزمات",
    trainer_name: "أ. أمينة قادري (مستشارة تسيير منظمات)",
    category: "قيادة وإدارة",
    format: "online",
    level: "intermediate",
    duration_hours: 12,
    description: "استراتيجيات قيادة الفرق الميدانية، حل النزاعات، وتوزيع المهام وتوثيق الأثر الاجتماعي.",
    start_date: "2026-11-12",
    enrolled_count: 62,
    max_participants: 80,
  },
  {
    id: 3,
    title: "صناعة المحتوى والتسويق الرقمي للمبادرات الخيرية",
    trainer_name: "م. كريم بوزيد (خبير إعلام رقمي)",
    category: "إعلام وتقنية",
    format: "online",
    level: "beginner",
    duration_hours: 8,
    description: "كيفية تصوير وتوثيق الحملات الإنسانية والترويج لها لاستقطاب المتطوعين والداعمين.",
    start_date: "2026-11-18",
    enrolled_count: 95,
    max_participants: 120,
  },
];

export const fallbackVolunteerProfile: VolunteerProfile = {
  id: 1042,
  first_name: "سمير",
  last_name: "عمارة",
  email: "samir.amara@volunteers.dz",
  phone_number: "0555123456",
  wilaya: "الجزائر",
  daira: "باب الوادي",
  blood_group: "O+",
  date_of_birth: "1998-06-15",
  total_hours: 48,
  participations_count: 7,
};

export class ApiService {
  static async getOpportunities(): Promise<OpportunityItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/opportunities/`, { method: "GET" });
      if (response.ok) {
        const data = await response.json();
        const list = data.results || data;
        if (Array.isArray(list) && list.length > 0) return list;
      }
    } catch {
      // Fallback on network failure
    }
    return fallbackOpportunities;
  }

  static async getSolidarityItems(): Promise<SolidarityItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/solidarity-store/`, { method: "GET" });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {}
    return fallbackSolidarityItems;
  }

  static async addSolidarityItem(item: Partial<SolidarityItem>): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/solidarity-store/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  static async getTrainings(): Promise<TrainingItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/trainings/`, { method: "GET" });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {}
    return fallbackTrainings;
  }

  static async enrollTraining(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/trainings/${id}/enroll/`, { method: "POST" });
      return response.ok;
    } catch {
      return true; // Optimistic enrollment
    }
  }

  static async submitTicket(ticket: SupportTicket): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticket),
      });
      return response.ok;
    } catch {
      return true; // Optimistic submission
    }
  }
}
