import 'package:flutter/material.dart';
import '../constants/app_theme.dart';
import '../models/models.dart';
import '../services/api_service.dart';

class OpportunitiesScreen extends StatefulWidget {
  const OpportunitiesScreen({super.key});

  @override
  State<OpportunitiesScreen> createState() => _OpportunitiesScreenState();
}

class _OpportunitiesScreenState extends State<OpportunitiesScreen> {
  String selectedWilaya = 'الكل';
  String searchQuery = '';
  bool isMapView = false;
  List<Opportunity> _opportunities = ApiService.fallbackOpportunities;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadLiveOpportunities();
  }

  Future<void> _loadLiveOpportunities() async {
    setState(() => _isLoading = true);
    final data = await ApiService.fetchOpportunities();
    if (mounted) {
      setState(() {
        _opportunities = data;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final allOpps = _opportunities;
    final filtered = allOpps.where((opp) {
      final matchesWilaya = selectedWilaya == 'الكل' || opp.wilaya == selectedWilaya;
      final matchesSearch = searchQuery.isEmpty ||
          opp.title.contains(searchQuery) ||
          opp.organizationName.contains(searchQuery) ||
          opp.wilaya.contains(searchQuery);
      return matchesWilaya && matchesSearch;
    }).toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        elevation: 0,
        title: const Text('الفرص التطوعية', style: TextStyle(color: Colors.white, fontSize: 16)),
        actions: [
          IconButton(
            icon: Icon(isMapView ? Icons.list_alt : Icons.map_outlined, color: Colors.white),
            tooltip: isMapView ? 'عرض كقائمة' : 'عرض الخريطة التفاعلية',
            onPressed: () {
              setState(() {
                isMapView = !isMapView;
              });
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Search & Filter Box
          Container(
            padding: const EdgeInsets.all(12),
            color: Colors.white,
            child: Column(
              children: [
                TextField(
                  onChanged: (val) => setState(() => searchQuery = val),
                  decoration: InputDecoration(
                    hintText: 'ابحث عن فرصة، مجال، أو جمعية...',
                    hintStyle: const TextStyle(fontSize: 12),
                    prefixIcon: const Icon(Icons.search, size: 20),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    filled: true,
                    fillColor: AppColors.background,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(color: AppColors.border),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(color: AppColors.border),
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                // Wilaya Filter Horizontal
                SizedBox(
                  height: 36,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: AppConstants.wilayas.length,
                    itemBuilder: (context, index) {
                      final wilaya = AppConstants.wilayas[index];
                      final isSelected = selectedWilaya == wilaya;
                      return Padding(
                        padding: const EdgeInsets.only(left: 6),
                        child: ChoiceChip(
                          label: Text(wilaya, style: TextStyle(fontSize: 11, color: isSelected ? Colors.white : AppColors.textPrimary)),
                          selected: isSelected,
                          selectedColor: AppColors.primary,
                          backgroundColor: AppColors.background,
                          onSelected: (val) {
                            if (val) setState(() => selectedWilaya = wilaya);
                          },
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),

          // Main Display (List or GPS Map Visualizer)
          Expanded(
            child: isMapView
                ? _buildGpsMapVisualizer(filtered)
                : filtered.isEmpty
                    ? const Center(
                        child: Text(
                          'لا توجد فرص تطوعية مطابقة في هذه الولاية',
                          style: TextStyle(color: AppColors.textSecondary),
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: _loadLiveOpportunities,
                        child: ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: filtered.length,
                          itemBuilder: (context, index) {
                            return _buildOpportunityItem(context, filtered[index]);
                          },
                        ),
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildGpsMapVisualizer(List<Opportunity> opps) {
    return Container(
      color: const Color(0xFFE2E8F0),
      child: Stack(
        children: [
          // Simulated Radar & Geo Map Grid
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.radar, size: 80, color: AppColors.primary.withOpacity(0.3)),
                const SizedBox(height: 12),
                const Text(
                  'خريطة التموضع الميداني GPS النشطة',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
                Text(
                  'تم تحديد ${opps.length} نقاط تطوع ميدانية في ولايات الوطن',
                  style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                ),
              ],
            ),
          ),

          // Pin Cards overlay
          Positioned(
            bottom: 16,
            left: 16,
            right: 16,
            child: SizedBox(
              height: 130,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: opps.length,
                itemBuilder: (context, idx) {
                  final item = opps[idx];
                  return Container(
                    width: 280,
                    margin: const EdgeInsets.only(left: 12),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.1),
                          blurRadius: 10,
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.pin_drop, color: AppColors.urgentRed, size: 18),
                            const SizedBox(width: 4),
                            Text(
                              '${item.wilaya} - ${item.daira}',
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          item.title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primary),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          item.organizationName,
                          maxLines: 1,
                          style: const TextStyle(fontSize: 10, color: AppColors.textSecondary),
                        ),
                        const Spacer(),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'المطلوب: ${item.volunteersNeeded} متطوع',
                              style: const TextStyle(fontSize: 10, color: AppColors.textSecondary),
                            ),
                            ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.primary,
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                minimumSize: Size.zero,
                              ),
                              onPressed: () => _showApplyDialog(context, item),
                              child: const Text('تفاصيل', style: TextStyle(color: Colors.white, fontSize: 10)),
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOpportunityItem(BuildContext context, Opportunity opp) {
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
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.primaryLight,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  opp.category,
                  style: const TextStyle(color: AppColors.primary, fontSize: 11, fontWeight: FontWeight.bold),
                ),
              ),
              if (opp.isUrgent)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.urgentLight,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Text('عاجل ⚠️', style: TextStyle(color: AppColors.urgentRed, fontSize: 11, fontWeight: FontWeight.bold)),
                ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            opp.title,
            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
          ),
          const SizedBox(height: 4),
          Text(opp.organizationName, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
          const SizedBox(height: 8),
          Text(opp.description, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
          const SizedBox(height: 12),
          Row(
            children: [
              const Icon(Icons.location_on, size: 14, color: AppColors.textSecondary),
              const SizedBox(width: 4),
              Text('${opp.wilaya} (${opp.daira})', style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
              const SizedBox(width: 12),
              const Icon(Icons.group, size: 14, color: AppColors.textSecondary),
              const SizedBox(width: 4),
              Text('${opp.volunteersEnrolled} / ${opp.volunteersNeeded}', style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
              const Spacer(),
              ElevatedButton(
                onPressed: () => _showApplyDialog(context, opp),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                child: const Text('انضم للفرصة', style: TextStyle(color: Colors.white, fontSize: 12)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showApplyDialog(BuildContext context, Opportunity opp) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(opp.title),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('الهيئة: ${opp.organizationName}'),
            const SizedBox(height: 6),
            Text('الموقع: ولاية ${opp.wilaya} - دائرة ${opp.daira}'),
            const SizedBox(height: 6),
            Text('هاتف التنسيق المعتمد: ${opp.contactPhone}'),
            const SizedBox(height: 6),
            Text('المدة: ${opp.duration} (البداية: ${opp.startDate})'),
            const SizedBox(height: 10),
            Text(opp.description),
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
                  content: Text('تم تسجيل ترشحك بنجاح! سيتم إخطارك بموافقة المشرف الميداني.'),
                  backgroundColor: AppColors.primary,
                ),
              );
            },
            child: const Text('تأكيد الانضمام', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }
}
