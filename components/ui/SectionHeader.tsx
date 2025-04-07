import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronRight } from "lucide-react-native";

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
      <Text style={styles.title}>{title}</Text>
      {showViewAll && (
        <TouchableOpacity style={styles.viewAllButton} onPress={onViewAll}>
          <Text style={styles.viewAllText}>View All</Text>
          <ChevronRight size={16} color="#ea7173" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    color: "#ea7173",
    fontWeight: "500",
  },
});

export default SectionHeader;
