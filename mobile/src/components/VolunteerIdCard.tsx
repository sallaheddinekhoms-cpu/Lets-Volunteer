import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";
import { VolunteerProfile } from "../types";

interface VolunteerCardProps {
  profile: VolunteerProfile;
}

export const VolunteerIdCard: React.FC<VolunteerCardProps> = ({ profile }) => {
  const nationalId = `DZ-VOL-2026-${String(profile.id).padStart(5, "0")}`;

  return (
    <View style={styles.cardContainer}>
      {/* Official State Republic Top Banner */}
      <View style={styles.topBanner}>
        <Text style={styles.republicText}>الجمهورية الجزائرية الديمقراطية الشعبية</Text>
        <Text style={styles.platformText}>المنصة الوطنية للعمل التطوعي « لنتطوع »</Text>
        <Text style={styles.subCardText}>CARTE NATIONALE DU BÉNÉVOLE • VOLUNTEER ID</Text>
        <View style={styles.nationalBadge}>
          <Text style={styles.nationalBadgeText}>{nationalId}</Text>
        </View>
      </View>

      <View style={styles.body}>
        {/* Profile Avatar and Name */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>
              {profile.first_name?.[0] || "م"}
              {profile.last_name?.[0] || "ت"}
            </Text>
          </View>
          <View style={styles.nameBlock}>
            <View style={styles.nameRow}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={styles.fullName}>
                {profile.first_name} {profile.last_name}
              </Text>
            </View>
            <Text style={styles.roleText}>متطوع معتمد في السجل الوطني</Text>
            <View style={styles.hoursPill}>
              <Ionicons name="ribbon" size={12} color="#FFFFFF" />
              <Text style={styles.hoursPillText}>{profile.total_hours} ساعة تطوع موثقة</Text>
            </View>
          </View>
        </View>

        {/* Data Grid */}
        <View style={styles.dataGrid}>
          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>فصيلة الدم (طوارئ)</Text>
            <View style={styles.bloodBox}>
              <Ionicons name="water" size={13} color="#DC2626" />
              <Text style={styles.bloodText}>{profile.blood_group || "O+"}</Text>
            </View>
          </View>

          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>الولاية والدائرة</Text>
            <Text style={styles.dataValue}>
              {profile.wilaya} {profile.daira ? `• ${profile.daira}` : ""}
            </Text>
          </View>

          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>المشاركات المنجزة</Text>
            <Text style={styles.dataValue}>{profile.participations_count} مبادرة</Text>
          </View>

          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>رقم الاتصال</Text>
            <Text style={styles.dataValue}>{profile.phone_number}</Text>
          </View>
        </View>

        {/* Official Electronic Verification Stamp */}
        <View style={styles.stampFooter}>
          <View style={styles.stampBox}>
            <Text style={styles.stampTitle}>الختم الإلكتروني الرسمي المعتمد</Text>
            <Text style={styles.stampSub}>مطابق لميثاق المتطوع الجزائري والقانون 12-06</Text>
          </View>

          <View style={styles.qrPlaceholder}>
            <Ionicons name="qr-code-outline" size={36} color={COLORS.primary} />
            <Text style={styles.qrText}>فحص فوري</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 2,
    borderColor: COLORS.primary,
    overflow: "hidden",
    shadowColor: "#004D40",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 8,
    marginVertical: 10,
  },
  topBanner: {
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: COLORS.accentGold,
  },
  republicText: {
    color: "#A7F3D0",
    fontSize: 10,
    fontWeight: "700",
  },
  platformText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 2,
  },
  subCardText: {
    color: COLORS.accentGold,
    fontSize: 8,
    fontWeight: "700",
    marginTop: 2,
    letterSpacing: 0.8,
  },
  nationalBadge: {
    backgroundColor: COLORS.accentGold,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 6,
  },
  nationalBadgeText: {
    color: "#0B3F3A",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  body: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.accentGold,
  },
  avatarInitials: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },
  nameBlock: {
    flex: 1,
    alignItems: "flex-end",
  },
  nameRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  fullName: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "900",
  },
  roleText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  hoursPill: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 5,
    gap: 4,
  },
  hoursPillText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  dataGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
    gap: 8,
  },
  dataItem: {
    width: "48%",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "flex-end",
  },
  dataLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: "700",
    marginBottom: 2,
  },
  dataValue: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: "800",
  },
  bloodBox: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  bloodText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "900",
  },
  stampFooter: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    marginTop: 10,
  },
  stampBox: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: 8,
  },
  stampTitle: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "800",
  },
  stampSub: {
    color: COLORS.textMuted,
    fontSize: 8,
    fontWeight: "600",
    marginTop: 2,
  },
  qrPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  qrText: {
    color: COLORS.primary,
    fontSize: 8,
    fontWeight: "800",
  },
});
