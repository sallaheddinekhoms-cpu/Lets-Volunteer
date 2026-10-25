import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";
import { Header } from "../components/Header";
import { OpportunityCard } from "../components/OpportunityCard";
import { ApiService, fallbackOpportunities } from "../api/apiService";
import { OpportunityItem } from "../types";

interface HomeScreenProps {
  onNavigate: (tab: string, param?: any) => void;
  onSelectOpportunity: (opp: OpportunityItem) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onSelectOpportunity,
}) => {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>(fallbackOpportunities);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    setRefreshing(true);
    const data = await ApiService.getOpportunities();
    setOpportunities(data);
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const urgentList = opportunities.filter((o) => o.is_urgent);

  return (
    <View style={styles.container}>
      <Header
        urgentText={
          urgentList.length > 0
            ? `فرصة عاجلة: ${urgentList[0].title} (${urgentList[0].wilaya})`
            : "منصة لنتطوع: انضم لآلاف المتطوعين لصنع الأثر في الجزائر"
        }
        onUrgentPress={() => onNavigate("opportunities")}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} colors={[COLORS.primary]} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Access Action Hub */}
        <View style={styles.hubContainer}>
          <Text style={styles.sectionHeader}>فضاءات المنصة الوطنية</Text>
          <View style={styles.hubGrid}>
            <TouchableOpacity
              style={[styles.hubCard, { backgroundColor: "#ECFDF5" }]}
              activeOpacity={0.8}
              onPress={() => onNavigate("solidarity")}
            >
              <View style={[styles.hubIconBg, { backgroundColor: COLORS.primary }]}>
                <Ionicons name="medical" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.hubTitle}>متجر التطوع</Text>
              <Text style={styles.hubSub}>عكازات وأجهزة طبية</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.hubCard, { backgroundColor: "#EFF6FF" }]}
              activeOpacity={0.8}
              onPress={() => onNavigate("trainings")}
            >
              <View style={[styles.hubIconBg, { backgroundColor: "#2563EB" }]}>
                <Ionicons name="school" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.hubTitle}>فضاء التكوين</Text>
              <Text style={styles.hubSub}>ورشات وتأهيل معتمد</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.hubCard, { backgroundColor: "#FEF3C7" }]}
              activeOpacity={0.8}
              onPress={() => onNavigate("profile")}
            >
              <View style={[styles.hubIconBg, { backgroundColor: COLORS.accentGold }]}>
                <Ionicons name="card" size={20} color="#0B3F3A" />
              </View>
              <Text style={styles.hubTitle}>بطاقة المتطوع</Text>
              <Text style={styles.hubSub}>الجواز الرقمي الوطني</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.hubCard, { backgroundColor: "#F5F3FF" }]}
              activeOpacity={0.8}
              onPress={() => onNavigate("opportunities", { view: "map" })}
            >
              <View style={[styles.hubIconBg, { backgroundColor: "#7C3AED" }]}>
                <Ionicons name="map" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.hubTitle}>خريطة GPS</Text>
              <Text style={styles.hubSub}>الفرص الأقرب إليك</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* National Verified Statistics Counter */}
        <View style={styles.statsBanner}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>+2,450</Text>
            <Text style={styles.statLabel}>ساعة تطوع</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>180+</Text>
            <Text style={styles.statLabel}>فرصة منجزة</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>58</Text>
            <Text style={styles.statLabel}>ولاية مغطاة</Text>
          </View>
        </View>

        {/* Urgent Opportunities Section */}
        {urgentList.length > 0 && (
          <View style={styles.sectionWrap}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.urgentDot} />
              <Text style={styles.sectionHeader}>نداءات طارئة تتطلب تدخلاً سريعاً</Text>
            </View>
            {urgentList.map((opp) => (
              <OpportunityCard
                key={opp.id}
                item={opp}
                onPress={() => onSelectOpportunity(opp)}
              />
            ))}
          </View>
        )}

        {/* Recent Feed Section */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionTitleRow}>
            <TouchableOpacity onPress={() => onNavigate("opportunities")}>
              <Text style={styles.viewAllText}>عرض الكل ←</Text>
            </TouchableOpacity>
            <Text style={styles.sectionHeader}>أحدث المبادرات والفرص التطوعية</Text>
          </View>
          {opportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              item={opp}
              onPress={() => onSelectOpportunity(opp)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  hubContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionHeader: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "right",
    marginBottom: 10,
  },
  hubGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  hubCard: {
    width: "48%",
    borderRadius: 16,
    padding: 12,
    alignItems: "flex-end",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  hubIconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  hubTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "800",
  },
  hubSub: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
  statsBanner: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: COLORS.primaryDark,
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.accentGold,
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  statLabel: {
    color: "#A7F3D0",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  sectionWrap: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitleRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  urgentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.urgentRed,
    marginLeft: 6,
  },
  viewAllText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
  },
});
