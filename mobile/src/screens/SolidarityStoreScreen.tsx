import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, WILAYAS } from "../constants/theme";
import { ApiService, fallbackSolidarityItems } from "../api/apiService";
import { SolidarityItem } from "../types";

export const SolidarityStoreScreen: React.FC = () => {
  const [items, setItems] = useState<SolidarityItem[]>(fallbackSolidarityItems);
  const [selectedType, setSelectedType] = useState<"all" | "lending" | "donation">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New item form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("مستلزمات طبية");
  const [newItemType, setNewItemType] = useState<"lending" | "donation">("lending");
  const [newWilaya, setNewWilaya] = useState("الجزائر");
  const [newPhone, setNewPhone] = useState("");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    ApiService.getSolidarityItems().then(setItems);
  }, []);

  const filtered = items.filter((item) => {
    if (selectedType === "all") return true;
    return item.item_type === selectedType;
  });

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsApp = (phone: string) => {
    const cleaned = phone.replace(/^0/, "213");
    Linking.openURL(`https://wa.me/${cleaned}`);
  };

  const handleAddItem = async () => {
    if (!newTitle.trim() || !newPhone.trim()) {
      Alert.alert("خطأ", "يرجى إدخال اسم الغرض ورقم الهاتف");
      return;
    }

    const newItem: SolidarityItem = {
      id: String(Date.now()),
      title: newTitle,
      category: newCategory,
      item_type: newItemType,
      wilaya: newWilaya,
      contact_phone: newPhone,
      description: newDesc,
      status: "available",
      created_at: new Date().toISOString().split("T")[0],
    };

    await ApiService.addSolidarityItem(newItem);
    setItems([newItem, ...items]);
    setIsModalOpen(false);
    setNewTitle("");
    setNewPhone("");
    setNewDesc("");
    Alert.alert("نجاح", "تم إدراج الغرض في متجر التطوع والتكافل بنجاح!");
  };

  return (
    <View style={styles.container}>
      {/* Top Banner */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setIsModalOpen(true)}
          >
            <Ionicons name="add" size={16} color="#FFFFFF" />
            <Text style={styles.addBtnText}>إضافة غرض</Text>
          </TouchableOpacity>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.headerTitle}>متجر التطوع والتكافل</Text>
            <Text style={styles.headerSub}>مبادرة إعارة وتبرع مجاني 100%</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabBtn, selectedType === "all" && styles.tabBtnActive]}
            onPress={() => setSelectedType("all")}
          >
            <Text style={[styles.tabText, selectedType === "all" && styles.tabTextActive]}>
              الكل
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, selectedType === "lending" && styles.tabBtnActive]}
            onPress={() => setSelectedType("lending")}
          >
            <Text style={[styles.tabText, selectedType === "lending" && styles.tabTextActive]}>
              إعارة مؤقتة مجانية
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, selectedType === "donation" && styles.tabBtnActive]}
            onPress={() => setSelectedType("donation")}
          >
            <Text style={[styles.tabText, selectedType === "donation" && styles.tabTextActive]}>
              تبرع دائم نهائي
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Items Feed */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {filtered.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.typeBadge,
                  item.item_type === "donation"
                    ? { backgroundColor: "#DCFCE7" }
                    : { backgroundColor: "#DBEAFE" },
                ]}
              >
                <Text
                  style={[
                    styles.typeText,
                    item.item_type === "donation" ? { color: "#16A34A" } : { color: "#2563EB" },
                  ]}
                >
                  {item.item_type === "donation" ? "🎁 تبرع دائم" : "🔄 إعارة مجانية"}
                </Text>
              </View>

              <Text style={styles.wilayaText}>📍 {item.wilaya} {item.daira ? `• ${item.daira}` : ""}</Text>
            </View>

            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDesc}>{item.description}</Text>

            <View style={styles.cardFooter}>
              <View style={styles.catPill}>
                <Text style={styles.catPillText}>{item.category}</Text>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.callBtn}
                  onPress={() => handleCall(item.contact_phone)}
                >
                  <Ionicons name="call" size={14} color="#FFFFFF" />
                  <Text style={styles.callBtnText}>اتصال</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.waBtn}
                  onPress={() => handleWhatsApp(item.contact_phone)}
                >
                  <Ionicons name="logo-whatsapp" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Item Modal */}
      <Modal visible={isModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <Ionicons name="close-circle" size={26} color={COLORS.textMuted} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>إضافة غرض للتكافل</Text>
            </View>

            <ScrollView style={{ marginVertical: 10 }}>
              <Text style={styles.inputLabel}>اسم الغرض *</Text>
              <TextInput
                placeholder="مثال: عكازات ألمنيوم، كرسي متحرك، جهاز قياس..."
                value={newTitle}
                onChangeText={setNewTitle}
                style={styles.input}
              />

              <Text style={styles.inputLabel}>نوع المبادرة *</Text>
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[styles.typeOption, newItemType === "lending" && styles.typeOptionActive]}
                  onPress={() => setNewItemType("lending")}
                >
                  <Text style={[styles.typeOptionText, newItemType === "lending" && styles.typeOptionTextActive]}>
                    إعارة مجانية
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeOption, newItemType === "donation" && styles.typeOptionActive]}
                  onPress={() => setNewItemType("donation")}
                >
                  <Text style={[styles.typeOptionText, newItemType === "donation" && styles.typeOptionTextActive]}>
                    تبرع دائم
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>الولاية *</Text>
              <TextInput
                placeholder="مثال: الجزائر، وهران، سطيف..."
                value={newWilaya}
                onChangeText={setNewWilaya}
                style={styles.input}
              />

              <Text style={styles.inputLabel}>رقم الهاتف للتواصل *</Text>
              <TextInput
                placeholder="0555123456"
                keyboardType="phone-pad"
                value={newPhone}
                onChangeText={setNewPhone}
                style={styles.input}
              />

              <Text style={styles.inputLabel}>الوصف وحالة الغرض</Text>
              <TextInput
                placeholder="وضح حالة الغرض، كيفية الاستلام..."
                multiline
                numberOfLines={3}
                value={newDesc}
                onChangeText={setNewDesc}
                style={[styles.input, { height: 70, textAlignVertical: "top" }]}
              />
            </ScrollView>

            <TouchableOpacity style={styles.submitBtn} onPress={handleAddItem}>
              <Text style={styles.submitBtnText}>نشر في متجر التكافل</Text>
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
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  headerSub: {
    color: "#A7F3D0",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
  addBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  addBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  tabsRow: {
    flexDirection: "row-reverse",
    gap: 8,
    marginTop: 4,
  },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  tabBtnActive: {
    backgroundColor: "#FFFFFF",
  },
  tabText: {
    color: "#E2E8F0",
    fontSize: 11,
    fontWeight: "700",
  },
  tabTextActive: {
    color: COLORS.primaryDark,
    fontWeight: "900",
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  wilayaText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },
  itemTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "800",
    textAlign: "right",
    marginBottom: 4,
  },
  itemDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: "right",
    lineHeight: 18,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
  catPill: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  catPillText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: "700",
  },
  actionsRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  callBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  callBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  waBtn: {
    backgroundColor: "#16A34A",
    width: 32,
    height: 32,
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
  typeSelector: {
    flexDirection: "row-reverse",
    gap: 8,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  typeOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeOptionText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
  typeOptionTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 14,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
});
