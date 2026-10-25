import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../constants/app_theme.dart';
import '../services/api_service.dart';

class SolidarityStoreScreen extends StatefulWidget {
  const SolidarityStoreScreen({super.key});

  @override
  State<SolidarityStoreScreen> createState() => _SolidarityStoreScreenState();
}

class _SolidarityStoreScreenState extends State<SolidarityStoreScreen> {
  String selectedType = 'ALL'; // 'ALL', 'LEND', 'DONATION'

  void _callPhone(String phone) async {
    final uri = Uri.parse('tel:$phone');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  void _openWhatsApp(String? whatsapp) async {
    if (whatsapp == null || whatsapp.isEmpty) return;
    final uri = Uri.parse('https://wa.me/$whatsapp');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    final items = ApiService.fallbackSolidarityItems.where((item) {
      if (selectedType == 'ALL') return true;
      return item.type == selectedType;
    }).toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        elevation: 0,
        title: const Text('متجر التطوع', style: TextStyle(color: Colors.white, fontSize: 16)),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle_outline, color: Colors.white),
            tooltip: 'إيداع غرض جديد',
            onPressed: () => _showAddItemModal(context),
          ),
        ],
      ),
      body: Column(
        children: [
          // Banner
          Container(
            padding: const EdgeInsets.all(12),
            color: const Color(0xFFFEF3C7),
            child: const Row(
              children: [
                Icon(Icons.handshake_outlined, color: Color(0xFFD97706), size: 24),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'فضاء مجاني مخصص لتبادل وإعارة المعدات الطبية والمستلزمات الحركية لوجه الله تعالى والتكافل بين المواطنين.',
                    style: TextStyle(fontSize: 11, color: Color(0xFF92400E)),
                  ),
                ),
              ],
            ),
          ),

          // Segment Filter
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            child: Row(
              children: [
                _buildFilterChip('الكل', 'ALL'),
                const SizedBox(width: 8),
                _buildFilterChip('🔄 إعارة مجانية مؤقتة', 'LEND'),
                const SizedBox(width: 8),
                _buildFilterChip('🎁 تبرع دائم نهائي', 'DONATION'),
              ],
            ),
          ),

          // Items List
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: items.length,
              itemBuilder: (context, index) {
                final item = items[index];
                final isLend = item.type == 'LEND';

                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: isLend ? const Color(0xFFEFF6FF) : const Color(0xFFECFDF5),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              isLend ? '🔄 إعارة مجانية' : '🎁 تبرع نهائي',
                              style: TextStyle(
                                color: isLend ? const Color(0xFF2563EB) : const Color(0xFF059669),
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          Text(
                            'الحالة: ${item.condition}',
                            style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Text(
                        item.title,
                        style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        item.notes,
                        style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          const Icon(Icons.location_on, size: 14, color: AppColors.textSecondary),
                          const SizedBox(width: 4),
                          Text('ولاية ${item.wilaya}', style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                          const Spacer(),
                          if (item.whatsappNumber != null)
                            IconButton(
                              icon: const Icon(Icons.chat, color: Color(0xFF25D366)),
                              tooltip: 'تواصل عبر واتساب',
                              onPressed: () => _openWhatsApp(item.whatsappNumber),
                            ),
                          ElevatedButton.icon(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primary,
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                            ),
                            icon: const Icon(Icons.phone, size: 14, color: Colors.white),
                            label: const Text('طلب واستلام', style: TextStyle(color: Colors.white, fontSize: 11)),
                            onPressed: () => _callPhone(item.contactPhone),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, String value) {
    final isSelected = selectedType == value;
    return ChoiceChip(
      label: Text(label, style: TextStyle(fontSize: 11, color: isSelected ? Colors.white : AppColors.textPrimary)),
      selected: isSelected,
      selectedColor: AppColors.primary,
      backgroundColor: AppColors.background,
      onSelected: (val) {
        if (val) setState(() => selectedType = value);
      },
    );
  }

  void _showAddItemModal(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('إيداع غرض جديد في المتجر', style: TextStyle(fontSize: 16)),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextField(
              decoration: InputDecoration(
                labelText: 'اسم الغرض (مثال: كرسي متحرك، عكازات...)',
                labelStyle: TextStyle(fontSize: 12),
              ),
            ),
            SizedBox(height: 8),
            TextField(
              decoration: InputDecoration(
                labelText: 'رقم الهاتف للتواصل',
                labelStyle: TextStyle(fontSize: 12),
              ),
            ),
            SizedBox(height: 8),
            TextField(
              decoration: InputDecoration(
                labelText: 'الولاية وملاحظات الاستلام',
                labelStyle: TextStyle(fontSize: 12),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('إلغاء'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('تم إرسال طلب إيداع الغرض بنجاح للمراجعة!'),
                  backgroundColor: AppColors.primary,
                ),
              );
            },
            child: const Text('نشر الغرض', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }
}
