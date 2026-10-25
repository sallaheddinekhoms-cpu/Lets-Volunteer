import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/models.dart';

class ApiService {
  // Live production API endpoint
  static const String baseUrl = 'https://api.lets-volunteer-dz.org/api';

  static final List<Opportunity> fallbackOpportunities = [
    Opportunity(
      id: 1,
      title: 'حملة التشجير الكبرى بالسد الأخضر',
      organizationName: 'الجمعية الوطنية للبيئة وحماية السد الأخضر',
      description: 'المساهمة في غرس أكثر من 5,000 شجرة صنوبر لمكافحة التصحر وإعادة تأهيل الغطاء النباتي.',
      category: 'البيئة',
      wilaya: 'الجلفة',
      daira: 'عين وسارة',
      startDate: '2026-10-27',
      duration: 'يومان',
      volunteersNeeded: 50,
      volunteersEnrolled: 32,
      isUrgent: true,
      latitude: 35.3524,
      longitude: 2.9234,
      contactPhone: '0550112233',
    ),
    Opportunity(
      id: 2,
      title: 'قافلة التبرع بالدم التضامنية الشاملة',
      organizationName: 'جمعية إشراقة أمل للصحة المجتمعية',
      description: 'تنظيم قوافل تحسيسية وتجهيز متبرعين لدعم بنوك الدم بالمستشفيات الجامعية.',
      category: 'الصحة',
      wilaya: 'الجزائر',
      daira: 'باب الوادي',
      startDate: '2026-10-29',
      duration: 'يوم واحد',
      volunteersNeeded: 25,
      volunteersEnrolled: 19,
      isUrgent: true,
      latitude: 36.7865,
      longitude: 3.0535,
      contactPhone: '0661223344',
    ),
    Opportunity(
      id: 3,
      title: 'توزيع القفة التضامنية للأسر المتضررة',
      organizationName: 'الهلال الأحمر الجزائري - اللجنة الولائية',
      description: 'تعبئة وتوزيع المواد الغذائية الأساسية لفائدة العائلات المعوزة في القرى النائية.',
      category: 'التطوع المجتمعي',
      wilaya: 'تيزي وزو',
      daira: 'عين الحمام',
      startDate: '2026-11-01',
      duration: '3 أيام',
      volunteersNeeded: 40,
      volunteersEnrolled: 28,
      isUrgent: false,
      latitude: 36.5684,
      longitude: 4.3061,
      contactPhone: '0772334455',
    ),
    Opportunity(
      id: 4,
      title: 'تنشيط ورشات الدعم والتقوية المدرسية',
      organizationName: 'جمعية بصمة شباب للتربية والتعليم',
      description: 'مرافقة تلاميذ الطور المتوسط في مراجعة الدروس وتحضير الامتحانات الفصلية.',
      category: 'التعليم والتدريس',
      wilaya: 'وهران',
      daira: 'السانية',
      startDate: '2026-11-05',
      duration: 'أسبوع',
      volunteersNeeded: 15,
      volunteersEnrolled: 8,
      isUrgent: false,
      latitude: 35.6511,
      longitude: -0.6278,
      contactPhone: '0555443322',
    ),
  ];

  static final List<SolidarityItem> fallbackSolidarityItems = [
    SolidarityItem(
      id: 1,
      title: 'كرسي متحرك طبي قابل للطي',
      type: 'LEND',
      category: 'معدات حركية',
      condition: 'ممتازة شبه جديد',
      wilaya: 'الجزائر',
      contactPhone: '0551234567',
      whatsappNumber: '213551234567',
      notes: 'متاح للإعارة المجانية لأي مريض أو كبار السن لفترة النقاهة.',
    ),
    SolidarityItem(
      id: 2,
      title: 'عكازان طبيان ألومنيوم مع مقابض مرنة',
      type: 'LEND',
      category: 'معدات حركية',
      condition: 'جيدة جداً',
      wilaya: 'البليدة',
      contactPhone: '0662345678',
      whatsappNumber: '213662345678',
      notes: 'صالحة للإعارة الفورية للمصابين بكسور.',
    ),
    SolidarityItem(
      id: 3,
      title: 'جهاز قياس ضغط الدم إلكتروني مع حقيبة',
      type: 'DONATION',
      category: 'أجهزة طبية',
      condition: 'جديد بالعلبة',
      wilaya: 'سطيف',
      contactPhone: '0773456789',
      notes: 'تبرع نهائي مجاني لوجه الله لفائدة شخص محتاج.',
    ),
    SolidarityItem(
      id: 4,
      title: 'سرير طبي للمرضى المقعدين مع مرتبة هوائية',
      type: 'LEND',
      category: 'تجهيزات استشفائية',
      condition: 'ممتازة',
      wilaya: 'قسنطينة',
      contactPhone: '0558765432',
      whatsappNumber: '213558765432',
      notes: 'إعارة مجانية مع إمكانية التنسيق لنقله وتوصيله.',
    ),
  ];

  static final List<Training> fallbackTrainings = [
    Training(
      id: 1,
      title: 'دورة المسعف المتطوع: الإسعافات الأولية المعيارية',
      trainerName: 'د. كريم بوجمعة (طبيب مختص في طب الكوارث)',
      category: 'إسعافات أولية',
      mode: 'حضوري ميداني',
      durationHours: 16,
      wilaya: 'الجزائر العاصمة',
      date: '2026-10-31',
      description: 'تأهيل المتطوعين على تقنيات الإنعاش القلبي الرئوي (CPR) والتعامل مع النزيف والكسور والحروق.',
    ),
    Training(
      id: 2,
      title: 'إدارة وتنسيق الفرق التطوعية في الأزمات والطوارئ',
      trainerName: 'أ. مريم سلطاني (خبيرة إدارة المخاطر)',
      category: 'إدارة أزمات',
      mode: 'عن بُعد',
      durationHours: 12,
      wilaya: 'كل الولايات',
      date: '2026-11-03',
      description: 'أدوات التواصل الميداني، خطط التدخل السريع، وتوزيع المهام بفعالية مع الحفاظ على سلامة المتطوعين.',
    ),
    Training(
      id: 3,
      title: 'صناعة المحتوى التنموي والإعلام الإنساني',
      trainerName: 'الأستاذ ياسين قادري (إعلامي ومدرب معتمد)',
      category: 'إعلام واتصال',
      mode: 'عن بُعد',
      durationHours: 8,
      wilaya: 'كل الولايات',
      date: '2026-11-08',
      description: 'كيفية توثيق المبادرات وإبراز الأثر المجتمعي باحترافية وأخلاقيات تحترم كرامة المستفيدين وفق القانون 18-07.',
    ),
  ];

  static final VolunteerProfile defaultProfile = VolunteerProfile(
    fullName: 'أحمد بن عبد الله السعيد',
    nationalId: '109827364512984',
    registrationNumber: 'DZ-VOL-2026-0849',
    wilaya: 'الجزائر',
    bloodType: 'O+',
    verifiedHours: 74,
    opportunitiesCount: 11,
    trainingsCount: 3,
    joinedDate: 'جانفي 2026',
    status: 'معتمد رسمياً (نشط)',
  );

  static Future<List<Opportunity>> fetchOpportunities() async {
    try {
      final response = await http
          .get(Uri.parse('$baseUrl/opportunities/'))
          .timeout(const Duration(seconds: 4));

      if (response.statusCode == 200) {
        final decoded = json.decode(utf8.decode(response.bodyBytes));
        List list = [];
        if (decoded is Map && decoded.containsKey('results')) {
          list = decoded['results'] as List;
        } else if (decoded is List) {
          list = decoded;
        }

        final liveList = list.map((item) => Opportunity.fromJson(item)).toList();
        if (liveList.isNotEmpty) {
          return liveList;
        }
      }
    } catch (_) {
      // Fallback
    }
    return fallbackOpportunities;
  }
}
