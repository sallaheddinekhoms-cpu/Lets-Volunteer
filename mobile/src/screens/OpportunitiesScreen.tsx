import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, WILAYAS } from "../constants/theme";
import { OpportunityCard } from "../components/OpportunityCard";
import { ApiService, fallbackOpportunities } from "../api/apiService";
import { OpportunityItem } from "../types";

interface OpportunitiesScreenProps {
  initialViewMode?: "grid" | "map";
  onSelectOpportunity?: (opp: OpportunityItem) => void;
}

export const OpportunitiesScreen: React.FC<OpportunitiesScreenProps> = ({
  initialViewMode = "grid",
}) => {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>(fallbackOpportunities);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState("الكل (جميع الولايات)");
  const [viewMode, setViewMode] = useState<"grid" | "map">(initialViewMode);
  const [selectedOpp, setSelectedOpp] = useState<OpportunityItem | null>(null);

  useEffect(() => {
    ApiService.getOpportunities().then(setOpportunities);
  }, []);

  const filtered = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWilaya =
      selectedWilaya === "الكل (جميع الولايات)" || opp.wilaya.includes(selectedWilaya);
    return matchesSearch && matchesWilaya;
  });

  const handleApply = (opp: OpportunityItem) => {
    Alert.alert(
      "تأكيد التقديم",
      `هل ترغب في تسجيل رغبتك بالتطوع في: "${opp.title}"؟`,
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "تأكيد التطوع",
          onPress: () => {
            Alert.alert("نجاح", "تم تسجيل طلبك بنجاح! ستتواصل معك الهيئة المنظمة لتحديد مهامك الميدانية.");
            setSelectedOpp(null);
          },
        },
      ]
    );
  };

  const handleCall = (phone?: string) => {
    if (!phone) return;
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <View style={styles.container}>
      {/* Top Header & Search Bar */}
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>دليل الفرص والمبادرات التطوعية</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={COLORS.textMuted} />
          <TextInput
            placeholder="ابحث عن فرصة، مجال، أو نشاط..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>

        {/* View Mode Toggle: Grid vs GPS Map */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === "grid" && styles.toggleBtnActive]}
            onPress={() => setViewMode("grid")}
          >
            <Ionicons
              name="grid-outline"
              size={14}
              color={viewMode === "grid" ? "#FFFFFF" : COLORS.textSecondary}
            />
            <Text style={[styles.toggleText, viewMode === "grid" && styles.toggleTextActive]}>
              عرض القائمة
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === "map" && styles.toggleBtnActive]}
            onPress={() => setViewMode("map")}
          >
            <Ionicons
              name="map-outline"
              size={14}
              color={viewMode === "map" ? "#FFFFFF" : COLORS.textSecondary}
            />
            <Text style={[styles.toggleText, viewMode === "map" && styles.toggleTextActive]}>
              الخريطة التفاعلية GPS
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Wilayas Horizontal Scroll Filter */}
      <View style={styles.wilayasWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.wilayasList}>
          {WILAYAS.map((w) => {
            const isSelected = selectedWilaya === w;
            return (
              <TouchableOpacity
                key={w}
                style={[styles.wilayaPill, isSelected && styles.wilayaPillActive]}
                onPress={() => setSelectedWilaya(w)}
              >
                <Text style={[styles.wilayaPillText, isSelected && styles.wilayaPillTextActive]}>
                  {w}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* View Content: Grid vs GPS Map View */}
      {viewMode === "grid" ? (
        <ScrollView style={styles.contentScroll} contentContainerStyle={styles.scrollInner}>
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={44} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>لم نجد فرصاً مطابقة للبحث الحالي</Text>
            </View>
          ) : (
            filtered.map((opp) => (
              <OpportunityCard key={opp.id} item={opp} onPress={() => setSelectedOpp(opp)} />
            ))
          )}
        </ScrollView>
      ) : (
        /* GPS Map Interactive Visualizer */
        <View style={styles.mapContainer}>
          <View style={styles.mapVisualHeader}>
            <Ionicons name="location" size={16} color={COLORS.primary} />
            <Text style={styles.mapVisualTitle}>نظام التموضع الجغرافي للفرص عبر الجزائر (GPS)</Text>
          </View>

          <ScrollView style={styles.mapPinsList}>
            {filtered.map((opp) => (
              <TouchableOpacity
                key={opp.id}
                style={styles.pinCard}
                activeOpacity={0.8}
                onPress={() => setSelectedOpp(opp)}
              >
                <View style={[styles.pinIcon, opp.is_urgent && { backgroundColor: COLORS.urgentRed }]}>
                  <Ionicons name="pin" size={16} color="#FFFFFF" />
                </View>
                <View style={styles.pinDetails}>
                  <Text style={styles.pinTitle} numberOfLines={1}>
                    {opp.title}
                  </Text>
                  <Text style={styles.pinCoords}>
                    📍 {opp.wilaya} {opp.daira ? `• ${opp.daira}` : ""} (GPS: {opp.latitude || "36.75"}, {opp.longitude || "3.05"})
                  </Text>
                </View>
                <Ionicons name="chevron-back" size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Opportunity Detail Modal */}
      {selectedOpp && (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setSelectedOpp(null)}>
                  <Ionicons name="close-circle" size={26} color={COLORS.textMuted} />
                </TouchableOpacity>
                <Text style={styles.modalHeaderTitle}>تفاصيل الفرصة التطوعية</Text>
              </View>

              <ScrollView style={styles.modalScroll}>
                {selectedOpp.is_urgent && (
                  <View style={styles.modalUrgentPill}>
                    <Ionicons name="flame" size={14} color="#FFFFFF" />
                    <Text style={styles.modalUrgentText}>فرصة تطوعية عاجلة وذات أولوية قصوى</Text>
                  </View>
                )}

                <Text style={styles.modalTitle}>{selectedOpp.title}</Text>
                <Text style={styles.modalOrg}>
                  🏢 الهيئة المنظمة: {selectedOpp.organization || "هيئة معتمدة لدى المنصة"}
                </Text>

                <View style={styles.modalMetaGrid}>
                  <View style={styles.modalMetaItem}>
                    <Text style={styles.modalMetaLabel}>الولاية</Text>
                    <Text style={styles.modalMetaVal}>{selectedOpp.wilaya}</Text>
                  </View>
                  <View style={styles.modalMetaItem}>
                    <Text style={styles.modalMetaLabel}>المدة</Text>
                    <Text style={styles.modalMetaVal}>{selectedOpp.duration || 1} يوم</Text>
                  </View>
                  <View style={styles.modalMetaItem}>
                    <Text style={styles.modalMetaLabel}>طبيعة النشاط</Text>
                    <Text style={styles.modalMetaVal}>
                      {selectedOpp.is_remote ? "عن بعد" : "حضوري ميداني"}
                    </Text>
                  </View>
                </View>

                <Text style={styles.modalSectionLabel}>وصف النشاط والمهام:</Text>
                <Text style={styles.modalDesc}>{selectedOpp.description}</Text>

                {selectedOpp.phone_number ? (
                  <TouchableOpacity
                    style={styles.callRow}
                    onPress={() => handleCall(selectedOpp.phone_number)}
                  >
                    <Ionicons name="call" size={16} color={COLORS.primary} />
                    <Text style={styles.callText}>نقطة الاتصال: {selectedOpp.phone_number}</Text>
                  </TouchableOpacity>
                ) : null}
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.confirmApplyBtn}
                  onPress={() => handleApply(selectedOpp)}
                >
                  <Ionicons name="hand-left" size={18} color="#FFFFFF" />
                  <Text style={styles.confirmApplyText}>تأكيد التسجيل في الفرصة</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topHeader: {
    backgroundColor: COLORS.primaryDark,
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "right",
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    textAlign: "right",
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  toggleRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },
  toggleBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  toggleBtnActive: {
    backgroundColor: COLORS.secondary,
  },
  toggleText: {
    color: "#E2E8F0",
    fontSize: 11,
    fontWeight: "700",
  },
  toggleTextActive: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  wilayasWrap: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  wilayasList: {
    paddingHorizontal: 14,
    flexDirection: "row-reverse",
    gap: 6,
  },
  wilayaPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  wilayaPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  wilayaPillText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  wilayaPillTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  contentScroll: {
    flex: 1,
  },
  scrollInner: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 8,
  },
  mapContainer: {
    flex: 1,
    padding: 16,
  },
  mapVisualHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.primaryLight,
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  mapVisualTitle: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "800",
  },
  mapPinsList: {
    flex: 1,
  },
  pinCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
    gap: 10,
  },
  pinIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  pinDetails: {
    flex: 1,
    alignItems: "flex-end",
  },
  pinTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "800",
  },
  pinCoords: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: "85%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 12,
  },
  modalHeaderTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "900",
  },
  modalScroll: {
    marginVertical: 12,
  },
  modalUrgentPill: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: COLORS.urgentRed,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
    marginBottom: 8,
    alignSelf: "flex-end",
  },
  modalUrgentText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "900",
    textAlign: "right",
    lineHeight: 24,
    marginBottom: 6,
  },
  modalOrg: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "right",
    marginBottom: 12,
  },
  modalMetaGrid: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  modalMetaItem: {
    alignItems: "center",
  },
  modalMetaLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: "700",
    marginBottom: 2,
  },
  modalMetaVal: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: "800",
  },
  modalSectionLabel: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "right",
    marginBottom: 4,
  },
  modalDesc: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "right",
    marginBottom: 14,
  },
  callRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.primaryLight,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  callText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  modalActions: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  confirmApplyBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 12,
    gap: 8,
  },
  confirmApplyText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
});
