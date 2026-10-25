import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "./src/constants/theme";
import { HomeScreen } from "./src/screens/HomeScreen";
import { OpportunitiesScreen } from "./src/screens/OpportunitiesScreen";
import { SolidarityStoreScreen } from "./src/screens/SolidarityStoreScreen";
import { TrainingsScreen } from "./src/screens/TrainingsScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { OpportunityItem } from "./src/types";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [oppInitialView, setOppInitialView] = useState<"grid" | "map">("grid");

  const handleNavigate = (tab: string, param?: any) => {
    if (tab === "opportunities" && param?.view) {
      setOppInitialView(param.view);
    } else {
      setOppInitialView("grid");
    }
    setActiveTab(tab);
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomeScreen
            onNavigate={handleNavigate}
            onSelectOpportunity={() => {
              setOppInitialView("grid");
              setActiveTab("opportunities");
            }}
          />
        );
      case "opportunities":
        return <OpportunitiesScreen initialViewMode={oppInitialView} />;
      case "solidarity":
        return <SolidarityStoreScreen />;
      case "trainings":
        return <TrainingsScreen />;
      case "profile":
        return <ProfileScreen />;
      default:
        return (
          <HomeScreen
            onNavigate={handleNavigate}
            onSelectOpportunity={() => setActiveTab("opportunities")}
          />
        );
    }
  };

  const navItems = [
    { id: "home", label: "الرئيسية", icon: "home", activeIcon: "home" },
    { id: "opportunities", label: "الفرص", icon: "compass-outline", activeIcon: "compass" },
    { id: "solidarity", label: "متجر التكافل", icon: "heart-outline", activeIcon: "heart" },
    { id: "trainings", label: "التكوين", icon: "school-outline", activeIcon: "school" },
    { id: "profile", label: "بطاقتي", icon: "card-outline", activeIcon: "card" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.screenContainer}>{renderActiveScreen()}</View>

      {/* Modern Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.navItem}
              activeOpacity={0.7}
              onPress={() => {
                setOppInitialView("grid");
                setActiveTab(item.id);
              }}
            >
              <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
                <Ionicons
                  name={(isActive ? item.activeIcon : item.icon) as any}
                  size={20}
                  color={isActive ? COLORS.primary : COLORS.textMuted}
                />
              </View>
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  bottomNav: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 10,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  iconWrap: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  iconWrapActive: {
    backgroundColor: COLORS.primaryLight,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textMuted,
    marginTop: 2,
  },
  navLabelActive: {
    color: COLORS.primary,
    fontWeight: "900",
  },
});
