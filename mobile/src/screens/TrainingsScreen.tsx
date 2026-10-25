import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";
import { ApiService, fallbackTrainings } from "../api/apiService";
import { TrainingItem } from "../types";

export const TrainingsScreen: React.FC = () => {
  const [trainings, setTrainings] = useState<TrainingItem[]>(fallbackTrainings);
  const [enrolledIds, setEnrolledIds] = useState<number[]>([]);

  useEffect(() => {
    ApiService.getTrainings().then(setTrainings);
  }, []);

  const handleEnroll = async (training: TrainingItem) => {
    if (enrolledIds.includes(training.id)) {
      Alert.alert("تنبيه", "أنت مسجل بالفعل في هذه الدورة التكوينية.");
      return;
    }

    Alert.alert(
      "تأكيد التسجيل",
      `هل ترغب في التسجيل في دورة "${training.title}"؟`,
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "تسجيل فوري مجاني",
          onPress: async () => {
            await ApiService.enrollTraining(training.id);
            setEnrolledIds([...enrolledIds, training.id]);
            setTrainings(
              trainings.map((t) =>
                t.id === training.id ? { ...t, enrolled_count: t.enrolled_count + 1 } : t
              )
            );
            Alert.alert("تهانينا!", "تم تسجيلك بنجاح في الدورة! ستصلك تفاصيل الموعد ورابط الحضور.");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>أكاديمية المتطوع الجزائري</Text>
        <Text style={styles.headerSub}>دورات وورشات تأهيل معتمدة لصقل الكفاءات</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {trainings.map((t) => {
          const isEnrolled = enrolledIds.includes(t.id);
          const isFull = t.enrolled_count >= t.max_participants && !isEnrolled;

          return (
            <View key={t.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View
                  style={[
                    styles.formatBadge,
                    t.format === "online" ? { backgroundColor: "#F3E8FF" } : { backgroundColor: "#DCFCE7" },
                  ]}
                >
                  <Ionicons
                    name={t.format === "online" ? "laptop-outline" : "location-outline"}
                    size={12}
                    color={t.format === "online" ? "#7C3AED" : "#16A34A"}
                  />
                  <Text
                    style={[
                      styles.formatText,
                      t.format === "online" ? { color: "#7C3AED" } : { color: "#16A34A" },
                    ]}
                  >
                    {t.format === "online" ? "عن بعد (أونلاين)" : "حضوري ميداني"}
                  </Text>
                </View>

                <View style={styles.hoursBadge}>
                  <Ionicons name="time-outline" size={12} color={COLORS.primary} />
                  <Text style={styles.hoursText}>{t.duration_hours} ساعة تدريب</Text>
                </View>
              </View>

              <Text style={styles.title}>{t.title}</Text>
              <Text style={styles.trainer}>👨‍🏫 المؤطر: {t.trainer_name}</Text>
              <Text style={styles.description}>{t.description}</Text>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={12} color={COLORS.textMuted} />
                  <Text style={styles.metaText}>يبدأ: {t.start_date}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="people-outline" size={12} color={COLORS.textMuted} />
                  <Text style={styles.metaText}>
                    المقاعد: {t.enrolled_count} / {t.max_participants}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.enrollBtn,
                  isEnrolled && { backgroundColor: "#16A34A" },
                  isFull && { backgroundColor: "#94A3B8" },
                ]}
                disabled={isEnrolled || isFull}
                onPress={() => handleEnroll(t)}
              >
                <Ionicons
                  name={isEnrolled ? "checkmark-circle" : "arrow-back"}
                  size={16}
                  color="#FFFFFF"
                />
                <Text style={styles.enrollBtnText}>
                  {isEnrolled ? "تم التسجيل بنجاح" : isFull ? "اكتملت المقاعد" : "سجّل الآن مجاناً"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  formatBadge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  formatText: {
    fontSize: 10,
    fontWeight: "800",
  },
  hoursBadge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  hoursText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "900",
    textAlign: "right",
    lineHeight: 22,
    marginBottom: 4,
  },
  trainer: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "right",
    marginBottom: 8,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: "right",
    lineHeight: 18,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: "600",
  },
  enrollBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  enrollBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});
