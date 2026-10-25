import 'package:flutter/material.dart';
import '../constants/app_theme.dart';
import '../models/models.dart';
import '../services/api_service.dart';
import '../widgets/volunteer_card_widget.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final VolunteerProfile profile = ApiService.defaultProfile;
  final TextEditingController ticketSubjectController = TextEditingController();
  final TextEditingController ticketDetailsController = TextEditingController();

  @override
  void dispose() {
    ticketSubjectController.dispose();
    ticketDetailsController.dispose();
    super.dispose();
  }

  void _submitTicket() {
    if (ticketSubjectController.text.trim().isEmpty || ticketDetailsController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('يرجى ملء موضوع التذكرة وتفاصيل الشكوى أولاً')),
      );
      return;
    }

    ticketSubjectController.clear();
    ticketDetailsController.clear();

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('تم إرسال التذكرة بنجاح إلى لجنة المطابقة والرقابة! رقم المتابعة: #DZ-TK-9021'),
        backgroundColor: AppColors.primary,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        elevation: 0,
        title: const Text('حسابي - بطاقة المتطوع', style: TextStyle(color: Colors.white, fontSize: 16)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Official ID Card
            VolunteerCardWidget(profile: profile),

            const SizedBox(height: 20),

            // Metrics Summary
            Row(
              children: [
                _buildStatBox('${profile.verifiedHours}', 'ساعات معتمدة', AppColors.primary),
                const SizedBox(width: 8),
                _buildStatBox('${profile.opportunitiesCount}', 'مبادرات منجزة', const Color(0xFF2563EB)),
                const SizedBox(width: 8),
                _buildStatBox('${profile.trainingsCount}', 'دورات تدريبية', AppColors.secondary),
              ],
            ),

            const SizedBox(height: 24),

            // Legal & Compliance Card (Law 12-06 & 18-07)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.border),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.gavel, color: AppColors.primary, size: 20),
                      SizedBox(width: 8),
                      Text(
                        'الضمانات القانونية والمطابقة الرسمية',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 10),
                  Text(
                    '• معتمد وفقاً لمقتضيات القانون رقم 12-06 المتعلق بالجمعيات والنشاطات التطوعية.\n'
                    '• حماية البيانات البيومترية والشخصية مكفولة بموجب القانون رقم 18-07.\n'
                    '• كافة ساعات الميدان موثقة وتمنحك أولوية في التكريمات والاستحقاقات الوطنية.',
                    style: TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.6),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Support & Grievances Section
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.support_agent, color: Color(0xFFD97706), size: 20),
                      SizedBox(width: 8),
                      Text(
                        'نظام الشكاوى وبلاغات الدعم الميداني',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'هل واجهتك مخالفة أو صعوبة أثناء نشاطك التطوعي؟ تواصل مباشرة مع لجنة الرقابة:',
                    style: TextStyle(fontSize: 11, color: AppColors.textSecondary),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: ticketSubjectController,
                    decoration: InputDecoration(
                      labelText: 'موضوع الشكوى أو المقترح',
                      labelStyle: const TextStyle(fontSize: 12),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    ),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: ticketDetailsController,
                    maxLines: 3,
                    decoration: InputDecoration(
                      labelText: 'التفاصيل، اسم الهيئة أو المبادرة...',
                      labelStyle: const TextStyle(fontSize: 12),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                      contentPadding: const EdgeInsets.all(12),
                    ),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      onPressed: _submitTicket,
                      child: const Text('إرسال التذكرة رسمياً', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildStatBox(String value, String label, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          children: [
            Text(
              value,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
            ),
          ],
        ),
      ),
    );
  }
}
