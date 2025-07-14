import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import HeaderCommon from "@/components/ui/HeaderCommon";

const AboutUsScreen = () => {
  const primaryColor = "#8B0000";

  const suppliers = [
    { name: "ANZCO", specialty: "Premium Beef & Lamb" },
    { name: "Wilson Hellaby", specialty: "Quality Meats" },
    { name: "Ken Wilson", specialty: "Artisan Cuts" },
    { name: "Silver Ferns", specialty: "Farm Fresh Produce" },
    { name: "Ingham Poultry", specialty: "Premium Poultry" },
    { name: "Van Den Brinks", specialty: "Specialty Meats" },
  ];

  const features = [
    {
      icon: "star-outline",
      title: "Premium Quality",
      description: "Only the finest cuts from New Zealand's leading producers",
    },
    {
      icon: "time-outline",
      title: "13+ Years Experience",
      description:
        "Over a decade of expertise in meat selection and preparation",
    },
    {
      icon: "people-outline",
      title: "Professional Team",
      description: "Committed experts bringing you the best of the best",
    },
    {
      icon: "heart-outline",
      title: "Passionate Service",
      description: "Dedicated to delivering exceptional culinary experiences",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      {/* Header */}
      <HeaderCommon
        title={"About Us"}
        isSearchEnabled={false}
        enableDropdown={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <MaterialIcons name="restaurant" size={32} color={primaryColor} />
          </View>
          <Text style={styles.heroTitle}>Premium Meat</Text>
          <Text style={styles.heroSubtitle}>
            Delivering the finest quality meat and poultry to your table since
            2011
          </Text>
        </View>

        {/* Mission Statement */}
        <View style={styles.missionSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Ionicons name="flag-outline" size={20} color={primaryColor} />
            </View>
            <Text style={styles.sectionTitle}>Our Mission</Text>
          </View>
          <View style={styles.missionCard}>
            <Text style={styles.missionText}>
              At Premium Meat, we are passionate about delivering the finest,
              highest-quality meat and poultry to your table. Our journey began
              with a simple mission 13 years ago to redefine the way people
              experience meat.
            </Text>
            <Text style={styles.missionText}>
              Since our inception, we have been committed to providing top-notch
              products and exceptional service to meat enthusiasts and culinary
              connoisseurs alike.
            </Text>
          </View>
        </View>

        {/* What Makes Us Special */}
        <View style={styles.featuresSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Ionicons name="diamond-outline" size={20} color={primaryColor} />
            </View>
            <Text style={styles.sectionTitle}>What Makes Us Special</Text>
          </View>

          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <Ionicons
                    name={feature.icon}
                    size={24}
                    color={primaryColor}
                  />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quality Promise */}
        <View style={styles.qualitySection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={primaryColor}
              />
            </View>
            <Text style={styles.sectionTitle}>Quality Promise</Text>
          </View>
          <View style={styles.qualityCard}>
            <View style={styles.qualityBadge}>
              <MaterialIcons name="verified" size={24} color={primaryColor} />
              <Text style={styles.qualityBadgeText}>New Zealand Quality</Text>
            </View>
            <Text style={styles.qualityText}>
              At our establishment we pride ourselves on procuring the finest
              meat and poultry from New Zealand's leading meat producers. New
              Zealand is known for its top-notch quality meat in the world and
              our professional team is committed to bring the best out of the
              best.
            </Text>
          </View>
        </View>

        {/* Trusted Suppliers */}
        <View style={styles.suppliersSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Ionicons
                name="business-outline"
                size={20}
                color={primaryColor}
              />
            </View>
            <Text style={styles.sectionTitle}>Trusted Partners</Text>
          </View>
          <Text style={styles.suppliersSubtitle}>
            We work exclusively with New Zealand's premier meat producers
          </Text>

          <View style={styles.suppliersGrid}>
            {suppliers.map((supplier, index) => (
              <View key={index} style={styles.supplierCard}>
                <View style={styles.supplierHeader}>
                  <View style={styles.supplierIcon}>
                    <MaterialIcons
                      name="local-shipping"
                      size={20}
                      color={primaryColor}
                    />
                  </View>
                  <Text style={styles.supplierName}>{supplier.name}</Text>
                </View>
                <Text style={styles.supplierSpecialty}>
                  {supplier.specialty}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <View style={styles.ctaCard}>
            <View style={styles.ctaIcon}>
              <Ionicons
                name="storefront-outline"
                size={28}
                color={primaryColor}
              />
            </View>
            <Text style={styles.ctaTitle}>Visit Our Outlets</Text>
            <Text style={styles.ctaDescription}>
              Experience our premium quality firsthand at our Factory and Retail
              locations
            </Text>
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Find Locations</Text>
              <Ionicons
                name="arrow-forward"
                size={16}
                color="#FFFFFF"
                style={styles.ctaButtonIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  headerSpacer: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    backgroundColor: "#FFFFFF",
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 300,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  missionSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  missionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  missionText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 26,
    marginBottom: 16,
  },
  featuresSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    alignItems: "center",
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    lineHeight: 18,
  },
  qualitySection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  qualityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  qualityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  qualityBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8B0000",
    marginLeft: 8,
  },
  qualityText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 26,
  },
  suppliersSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  suppliersSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    lineHeight: 20,
  },
  suppliersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  supplierCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  supplierHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  supplierIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  supplierName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
    flex: 1,
  },
  supplierSpecialty: {
    fontSize: 12,
    color: "#666",
    marginLeft: 36,
  },
  ctaSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  ctaCard: {
    backgroundColor: "#8B0000",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    shadowColor: "#8B0000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  ctaDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
    maxWidth: 260,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  ctaButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  ctaButtonIcon: {
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 32,
  },
});

export default AboutUsScreen;
