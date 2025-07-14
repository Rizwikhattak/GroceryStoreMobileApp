import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import HeaderCommon from "@/components/ui/HeaderCommon";
import { contactUs } from "@/store/actions/authActions";
import { ToastHelper } from "@/utils/ToastHelper";
import { TOAST_MESSAGES } from "@/constants/constants";

const ContactUsScreen = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const primaryColor = "#8B0000";

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      message: formData.message,
    };

    // const resp = await dispatch(contactUs(payload));
    ToastHelper.showSuccess({ title: TOAST_MESSAGES.CONTACT_US.title });
    setIsSubmitting(false);
  };

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleMaps = (address) => {
    const encodedAddress = encodeURIComponent(address);
    Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`);
  };

  const renderInput = (
    key,
    placeholder,
    icon,
    multiline = false,
    keyboardType = "default"
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{placeholder}</Text>
      <View style={[styles.inputWrapper, errors[key] && styles.inputError]}>
        <Ionicons
          name={icon}
          size={20}
          color="#8B8B8B"
          style={styles.inputIcon}
        />
        <TextInput
          style={[styles.textInput, multiline && styles.textArea]}
          placeholder={`Enter your ${placeholder.toLowerCase()}`}
          placeholderTextColor="#B0B0B0"
          value={formData[key]}
          onChangeText={(text) => {
            setFormData((prev) => ({ ...prev, [key]: text }));
            if (errors[key]) {
              setErrors((prev) => ({ ...prev, [key]: null }));
            }
          }}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          keyboardType={keyboardType}
        />
      </View>
      {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      {/* Simplified Header */}
      <HeaderCommon
        title={"Contact Us"}
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
            <MaterialIcons
              name="contact-support"
              size={32}
              color={primaryColor}
            />
          </View>
          <Text style={styles.heroTitle}>Get in Touch</Text>
          <Text style={styles.heroSubtitle}>
            We'd love to hear from you. Drop us a line and we'll get back to you
            as soon as possible.
          </Text>
        </View>

        {/* Contact Form */}
        <View style={styles.formSection}>
          <View style={styles.nameRow}>
            <View style={styles.nameInputContainer}>
              <Text style={styles.inputLabel}>First Name</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.firstName && styles.inputError,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  placeholder="First name"
                  placeholderTextColor="#B0B0B0"
                  value={formData.firstName}
                  onChangeText={(text) => {
                    setFormData((prev) => ({ ...prev, firstName: text }));
                    if (errors.firstName) {
                      setErrors((prev) => ({ ...prev, firstName: null }));
                    }
                  }}
                />
              </View>
              {errors.firstName && (
                <Text style={styles.errorText}>{errors.firstName}</Text>
              )}
            </View>

            <View style={styles.nameInputContainer}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.lastName && styles.inputError,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  placeholder="Last name"
                  placeholderTextColor="#B0B0B0"
                  value={formData.lastName}
                  onChangeText={(text) => {
                    setFormData((prev) => ({ ...prev, lastName: text }));
                    if (errors.lastName) {
                      setErrors((prev) => ({ ...prev, lastName: null }));
                    }
                  }}
                />
              </View>
              {errors.lastName && (
                <Text style={styles.errorText}>{errors.lastName}</Text>
              )}
            </View>
          </View>

          {renderInput(
            "email",
            "Email Address",
            "mail-outline",
            false,
            "email-address"
          )}
          {renderInput(
            "phone",
            "Phone Number",
            "call-outline",
            false,
            "phone-pad"
          )}
          {renderInput("address", "Address", "location-outline")}
          {renderInput("message", "Message", "chatbubble-outline", true)}

          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Text style={styles.submitButtonText}>Sending...</Text>
            ) : (
              <>
                <Text style={styles.submitButtonText}>Send Message</Text>
                <Ionicons
                  name="send"
                  size={18}
                  color="#fff"
                  style={styles.submitIcon}
                />
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Locations Section */}
        <View style={styles.locationsSection}>
          <Text style={styles.sectionTitle}>Our Locations</Text>

          {/* Factory Outlet */}
          <View style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <View style={styles.locationIconContainer}>
                <MaterialIcons name="factory" size={24} color={primaryColor} />
              </View>
              <View style={styles.locationTitleContainer}>
                <Text style={styles.locationTitle}>Factory Outlet</Text>
                <Text style={styles.locationSubtitle}>
                  Manufacturing & Wholesale
                </Text>
              </View>
            </View>

            <View style={styles.locationDetails}>
              <TouchableOpacity
                style={styles.locationItem}
                onPress={() =>
                  handleMaps("3 Saint Jude Street, Avondale, Auckland 1026")
                }
              >
                <Ionicons name="location-outline" size={18} color="#666" />
                <Text style={styles.locationText}>
                  3 Saint Jude Street, Avondale{"\n"}Auckland 1026
                </Text>
              </TouchableOpacity>

              <View style={styles.contactRow}>
                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={() => handleCall("+64 9 8200130")}
                >
                  <Ionicons
                    name="call-outline"
                    size={16}
                    color={primaryColor}
                  />
                  <Text style={styles.contactButtonText}>Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={() => handleEmail("info@premiummeat.co.nz")}
                >
                  <Ionicons
                    name="mail-outline"
                    size={16}
                    color={primaryColor}
                  />
                  <Text style={styles.contactButtonText}>Email</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Retail Outlet */}
          <View style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <View style={styles.locationIconContainer}>
                <MaterialIcons
                  name="storefront"
                  size={24}
                  color={primaryColor}
                />
              </View>
              <View style={styles.locationTitleContainer}>
                <Text style={styles.locationTitle}>Retail Outlet</Text>
                <Text style={styles.locationSubtitle}>Customer Sales</Text>
              </View>
            </View>

            <View style={styles.locationDetails}>
              <TouchableOpacity
                style={styles.locationItem}
                onPress={() =>
                  handleMaps("5/64 Stoddard road, Mt Roskill, Auckland 1024")
                }
              >
                <Ionicons name="location-outline" size={18} color="#666" />
                <Text style={styles.locationText}>
                  5/64 Stoddard Road, Mt Roskill{"\n"}Auckland 1024
                </Text>
              </TouchableOpacity>

              <View style={styles.contactRow}>
                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={() => handleCall("+64 9 6296209")}
                >
                  <Ionicons
                    name="call-outline"
                    size={16}
                    color={primaryColor}
                  />
                  <Text style={styles.contactButtonText}>Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={() => handleEmail("info@premiummeat.co.nz")}
                >
                  <Ionicons
                    name="mail-outline"
                    size={16}
                    color={primaryColor}
                  />
                  <Text style={styles.contactButtonText}>Email</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 280,
  },
  formSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  nameInputContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#F0F0F0",
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 52,
  },

  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
    paddingVertical: 0,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  inputError: {
    borderColor: "#FF6B6B",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#8B0000",
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#8B0000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  submitIcon: {
    marginLeft: 8,
  },
  locationsSection: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 24,
  },
  locationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  locationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  locationTitleContainer: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  locationSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  locationDetails: {
    paddingLeft: 8,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  locationText: {
    fontSize: 15,
    color: "#666",
    marginLeft: 12,
    lineHeight: 20,
    flex: 1,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 8,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 0.4,
    justifyContent: "center",
  },
  contactButtonText: {
    color: "#8B0000",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  bottomSpacing: {
    height: 32,
  },
});

export default ContactUsScreen;
