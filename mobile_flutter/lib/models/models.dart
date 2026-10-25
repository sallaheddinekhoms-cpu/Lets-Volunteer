import '../constants/app_theme.dart';

class Opportunity {
  final dynamic id;
  final String title;
  final String organizationName;
  final String description;
  final String category;
  final String wilaya;
  final String daira;
  final String startDate;
  final String duration;
  final int volunteersNeeded;
  final int volunteersEnrolled;
  final bool isUrgent;
  final double latitude;
  final double longitude;
  final String contactPhone;

  Opportunity({
    required this.id,
    required this.title,
    required this.organizationName,
    required this.description,
    required this.category,
    required this.wilaya,
    required this.daira,
    required this.startDate,
    required this.duration,
    required this.volunteersNeeded,
    required this.volunteersEnrolled,
    required this.isUrgent,
    required this.latitude,
    required this.longitude,
    required this.contactPhone,
  });

  factory Opportunity.fromJson(Map<String, dynamic> json) {
    // Category resolution
    String cat = 'تطوع عام';
    if (json['category'] != null) {
      if (json['category'] is Map) {
        cat = json['category']['label'] ?? 'تطوع عام';
      } else {
        cat = json['category'].toString();
      }
    }

    // Wilaya resolution
    String w = json['wilaya']?.toString() ?? 'الجزائر';
    if (AppConstants.wilayaCodeToName.containsKey(w)) {
      w = AppConstants.wilayaCodeToName[w]!;
    }

    return Opportunity(
      id: json['id'] ?? 0,
      title: json['title'] ?? 'فرصة تطوعية',
      organizationName: json['organization'] ?? json['organization_name'] ?? 'هيئة معتمدة',
      description: json['description'] ?? '',
      category: cat,
      wilaya: w,
      daira: json['daira'] ?? 'وسط',
      startDate: json['date_of_opportunity'] ?? json['start_date'] ?? '2026-10-25',
      duration: json['duration'] != null ? '${json['duration']} يوم' : '3 أيام',
      volunteersNeeded: json['volunteers_needed'] ?? 10,
      volunteersEnrolled: json['volunteers_enrolled'] ?? 0,
      isUrgent: json['is_urgent'] ?? false,
      latitude: (json['latitude'] as num?)?.toDouble() ?? 36.7538,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 3.0588,
      contactPhone: json['contact_phone'] ?? '0555001122',
    );
  }
}

class SolidarityItem {
  final int id;
  final String title;
  final String type; // 'LEND' or 'DONATION'
  final String category;
  final String condition;
  final String wilaya;
  final String contactPhone;
  final String? whatsappNumber;
  final String notes;

  SolidarityItem({
    required this.id,
    required this.title,
    required this.type,
    required this.category,
    required this.condition,
    required this.wilaya,
    required this.contactPhone,
    this.whatsappNumber,
    required this.notes,
  });
}

class Training {
  final int id;
  final String title;
  final String trainerName;
  final String category;
  final String mode;
  final int durationHours;
  final String wilaya;
  final String date;
  final String description;

  Training({
    required this.id,
    required this.title,
    required this.trainerName,
    required this.category,
    required this.mode,
    required this.durationHours,
    required this.wilaya,
    required this.date,
    required this.description,
  });
}

class VolunteerProfile {
  final String fullName;
  final String nationalId;
  final String registrationNumber;
  final String wilaya;
  final String bloodType;
  final int verifiedHours;
  final int opportunitiesCount;
  final int trainingsCount;
  final String joinedDate;
  final String status;

  VolunteerProfile({
    required this.fullName,
    required this.nationalId,
    required this.registrationNumber,
    required this.wilaya,
    required this.bloodType,
    required this.verifiedHours,
    required this.opportunitiesCount,
    required this.trainingsCount,
    required this.joinedDate,
    required this.status,
  });
}
