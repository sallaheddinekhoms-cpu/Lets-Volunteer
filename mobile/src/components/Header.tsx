import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

interface HeaderProps {
  urgentText?: string;
  onUrgentPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  urgentText = "نداء عاجل: حملة تشجير كبرى وتبرع بالدم بالجزائر العاصمة وسيدي بلعباس",
  onUrgentPress,
}) => {
  return (
    <View style={styles.container}>
      {/* State Official Banner */}
      <View style={styles.republicBar}>
        <Text style={styles.republicText}>الجمهورية الجزائرية الديمقراطية الشعبية</Text>
      </View>

      {/* Main App Brand Header */}
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <Ionicons name="hand-left" size={18} color="#FFFFFF" />
          <Text style={styles.logoText}>لنتطوع</Text>
        </View>
        <Text style={styles.subTitle}>المنصة الوطنية للعمل التطوعي</Text>
      </View>

      {/* Urgent Alert Ticker */}
      {urgentText ? (
        <TouchableOpacity style={styles.tickerBox} activeOpacity={0.8} onPress={onUrgentPress}>
          <View style={styles.tickerBadge}>
            <Ionicons name="flame" size={12} color="#FFFFFF" />
            <Text style={styles.tickerBadgeText}>عاجل</Text>
          </View>
          <Text style={styles.tickerText} numberOfLines={1}>
            {urgentText}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primaryDark,
    paddingTop: 45,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  republicBar: {
    alignItems: "center",
    marginBottom: 6,
  },
  republicText: {
    color: "#A7F3D0",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  brandRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  logoBadge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    gap: 6,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  subTitle: {
    color: "#E2E8F0",
    fontSize: 11,
    fontWeight: "600",
  },
  tickerBox: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "rgba(220, 38, 38, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(220, 38, 38, 0.35)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 8,
    marginTop: 4,
  },
  tickerBadge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: COLORS.urgentRed,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 2,
  },
  tickerBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  tickerText: {
    flex: 1,
    color: "#FEE2E2",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "right",
  },
});
