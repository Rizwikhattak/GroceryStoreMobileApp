import { primary } from "@/constants/Colors";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  onViewAll?: () => void;
  showViewAll?: boolean;
}

const SectionHeader = ({
  title,
  onViewAll,
  showViewAll = true,
}: SectionHeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.accent} />
      </View>

      {showViewAll && (
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={onViewAll}
          activeOpacity={0.6}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <View style={styles.chevronContainer}>
            <ChevronRight size={18} color={primary} strokeWidth={2.5} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 18,
    paddingHorizontal: 4,
  },
  leftSection: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  accent: {
    width: 40,
    height: 3,
    backgroundColor: primary,
    borderRadius: 2,
    marginTop: 4,
    opacity: 0.8,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(105, 17, 18, 0.06)",
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: "rgba(105, 17, 18, 0.12)",
  },
  viewAllText: {
    fontSize: 14,
    color: primary,
    fontWeight: "600",
    marginRight: 6,
  },
  chevronContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(105, 17, 18, 0.1)",
    borderRadius: 12,
  },
});

export default SectionHeader;
