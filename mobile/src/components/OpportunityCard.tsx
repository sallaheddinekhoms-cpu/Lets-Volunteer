import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";
import { OpportunityItem } from "../types";

interface CardProps {
  item: OpportunityItem;
  onPress: () => void;
}

export const OpportunityCard: React.FC<CardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.88} onPress={onPress}>
      {/* Top Meta: Urgency & Wilaya */}
      <View style={styles.metaRow}>
        {item.is_urgent ? (
          <View style={styles.urgentBadge}>
            <Ionicons name="flame" size={12} color="#FFFFFF" />
            <Text style={styles.urgentText}>فرصة عاجلة</Text>
          </View>
        ) : (
          <View style={styles.catBadge}>
            <Text style={styles.catText}>{item.category?.label || "عمل تطوعي"}</Text>
          </View>
        )}

        <View style={styles.wilayaBadge}>
          <Ionicons name="location-sharp" size={13} color={COLORS.primary} />
          <Text style={styles.wilayaText}>
            {item.wilaya} {item.daira ? `• ${item.daira}` : ""}
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>

      {/* Description Snippet */}
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>

      {/* Footer Info */}
      <View style={styles.footerRow}>
        <View style={styles.infoPill}>
          <Ionicons name="time-outline" size={13} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>{item.duration || 1} يوم</Text>
        </View>

        {item.organization ? (
          <View style={styles.orgPill}>
            <Ionicons name="business-outline" size={13} color={COLORS.primary} />
            <Text style={styles.orgText} numberOfLines={1}>
              {item.organization}
            </Text>
          </View>
        ) : null}

        <View style={styles.applyBtn}>
          <Text style={styles.applyBtnText}>تفاصيل والتقديم</Text>
          <Ionicons name="chevron-back" size={14} color="#FFFFFF" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  metaRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  urgentBadge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: COLORS.urgentRed,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  urgentText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  catBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  catText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "700",
  },
  wilayaBadge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 3,
  },
  wilayaText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "800",
    textAlign: "right",
    lineHeight: 22,
    marginBottom: 6,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: "right",
    lineHeight: 18,
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },
  infoPill: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },
  orgPill: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    marginHorizontal: 8,
    gap: 4,
  },
  orgText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
  },
  applyBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4,
  },
  applyBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
});
