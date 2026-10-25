import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";
import { VolunteerIdCard } from "../components/VolunteerIdCard";
import { fallbackVolunteerProfile, ApiService } from "../api/apiService";
import { SupportTicket } from "../types";

export const ProfileScreen: React.FC = () => {
  const [profile] = useState(fallbackVolunteerProfile);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  // Ticket form
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketCategory, setTicketCategory] = useState("مشكلة تقنية");
  const [ticketDesc, setTicketDesc] = useState("");

  const handleShareCard = () => {
    Alert.alert(
      "البطاقة الوطنية الرقمية للمتطوع",
      `تم توثيق قيدك في السجل الوطني برقم:\n${`DZ-VOL-2026-${String(profile.id).padStart(5, "0")}`}\n\nيمكنك إبراز هذه البطاقة في الميدان للسلطات والهيئات المعنية.`
    );
  };

  const handleSendTicket = async () => {
    if (!ticketTitle.trim() || !ticketDesc.trim()) {
      Alert.alert("خطأ", "يرجى ملء موضوع الشكوى وتفاصيلها");
      return;
    }

    const ticket: SupportTicket = {
      title: ticketTitle,
      category: ticketCategory,
      priority: "normal",
      description: ticketDesc,
    };

    await ApiService.submitTicket(ticket);
    setIsTicketModalOpen(false);
    setTicketTitle("");
    setTicketDesc("");
    Alert.alert("تم الإرسال بنجاح", "تم تسجيل بطاقة الدعم برقم رسمي وسيتم الرد خلال 24 ساعة.");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الملف الشخصي وبطاقة المتطوع</Text>
        <Text style={styles.headerSub}>الجواز الرقمي الوطني المعتمد لدى الدولة</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* National Volunteer Card */}
        <VolunteerIdCard profile={profile} />

        {/* Card Actions */}
        <View style={styles.cardActionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleShareCard}>
            <Ionicons name="shield-checkmark" size={16} color={COLORS.primary} />
            <Text style={styles.actionBtnText}>التحقق من صحة البطاقة</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: COLORS.primary }]}
            onPress={() => Alert.alert("حفظ", "تم حفظ نسخة من البطاقة الرقمية على جهازك بنجاح.")}
          >
            <Ionicons name="download-outline" size={16} color="#FFFFFF" />
            <Text style={[styles.actionBtnText, { color: "#FFFFFF" }]}>تنزيل البطاقة</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Menu Options */}
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => setIsTicketModalOpen(true)}
          >
            <Ionicons name="chevron-back" size={18} color={COLORS.textMuted} />
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>نظام التواصل وبطاقات الشكاوى</Text>
              <Text style={styles.menuSub}>رفع انشغال، إبلاغ عن مخالفة، أو طلب مساعدة</Text>
            </View>
            <View style={[styles.menuIconBg, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="chatbubbles" size={18} color="#D97706" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                "الإطار القانوني وميثاق الاعتماد",
                "منظومة «لنتطوع» ممتثلة كلياً للقانون 12-06 المنظم للجمعيات والقانون 18-07 لحماية المعطيات الشخصية الصادر عن الهيئة الوطنية ANPDP."
              )
            }
          >
            <Ionicons name="chevron-back" size={18} color={COLORS.textMuted} />
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>ميثاق الاعتماد المؤسساتي</Text>
              <Text style={styles.menuSub}>الامتثال للقانون 12-06 وقانون حماية البيانات 18-07</Text>
            </View>
            <View style={[styles.menuIconBg, { backgroundColor: "#DCFCE7" }]}>
              <Ionicons name="document-text" size={18} color="#16A34A" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                "الرقم الأخضر المجاني",
                "للحالات الطارئة والاستفسارات الميدانية:\nهاتف: 3030 (مجاني)\nالبريد: support@lets-volunteer.dz"
              )
            }
          >
            <Ionicons name="chevron-back" size={18} color={COLORS.textMuted} />
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>قنوات التواصل المباشرة</Text>
              <Text style={styles.menuSub}>خدمة المتطوعين 24/7 والرقم الأخضر</Text>
            </View>
            <View style={[styles.menuIconBg, { backgroundColor: "#EFF6FF" }]}>
              <Ionicons name="call" size={18} color="#2563EB" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Support Ticket Modal */}
      <Modal visible={isTicketModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setIsTicketModalOpen(false)}>
                <Ionicons name="close-circle" size={26} color={COLORS.textMuted} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>فتح بطاقة شكوى أو استفسار</Text>
            </View>

            <ScrollView style={{ marginVertical: 10 }}>
              <Text style={styles.inputLabel}>موضوع الانشغال *</Text>
              <TextInput
                placeholder="مثال: استفسار حول احتساب ساعات التطوع..."
                value={ticketTitle}
                onChangeText={setTicketTitle}
                style={styles.input}
              />

              <Text style={styles.inputLabel}>نوع الطلب</Text>
              <View style={styles.catSelector}>
                {["مشكلة تقنية", "إبلاغ عن مخالفة", "استفسار إداري", "اقتراح تحسين"].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catOption, ticketCategory === cat && styles.catOptionActive]}
                    onPress={() => setTicketCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.catOptionText,
                        ticketCategory === cat && styles.catOptionTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>تفاصيل الشكوى أو الملاحظة *</Text>
              <TextInput
                placeholder="اشرح المشكلة بدقة مع ذكر أسماء المبادرات أو التواريخ..."
                multiline
                numberOfLines={4}
                value={ticketDesc}
                onChangeText={setTicketDesc}
                style={[styles.input, { height: 90, textAlignVertical: "top" }]}
              />
            </ScrollView>

            <TouchableOpacity style={styles.sendTicketBtn} onPress={handleSendTicket}>
              <Ionicons name="send" size={16} color="#FFFFFF" />
              <Text style={styles.sendTicketBtnText}>إرسال التذكرة لفريق المتابعة</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primaryDark,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    alignItems: "flex-end",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  headerSub: {
    color: "#A7F3D0",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  cardActionsRow: {
    flexDirection: "row-reverse",
    gap: 10,
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    gap: 6,
  },
  actionBtnText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  menuContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 6,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  menuTextWrap: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: 10,
  },
  menuTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "800",
  },
  menuSub: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  menuIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
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
    paddingBottom: 10,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "900",
  },
  inputLabel: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "right",
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    textAlign: "right",
    color: COLORS.textPrimary,
  },
  catSelector: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 6,
  },
  catOption: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  catOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  catOptionText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },
  catOptionTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  sendTicketBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
    marginTop: 14,
  },
  sendTicketBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
});
