import { primary } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const TermsAndConditions = () => {
  const [readingProgress, setReadingProgress] = useState(0);
  const router = useRouter();
  // Sample terms data - replace with your actual 44 terms

  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const progress =
      (contentOffset.y / (contentSize.height - layoutMeasurement.height)) * 100;
    setReadingProgress(Math.min(100, Math.max(0, progress)));
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${readingProgress}%` }]}
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round(readingProgress)}% read
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Introduction */}
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>Welcome to Premium Meats</Text>
          <Text style={styles.introText}>
            These terms and Conditions shall apply to the provision of all Goods
            by the Premium Meat wholes NZ LTD to the Buyer and are the Terms and
            Conditions referred to on the Company’s Credit Application Form. The
            Premium Meat wholes NZ LTD reserves the right to amend the Terms and
            Conditions by written notice to the Buyer.
          </Text>
          {/* <Text style={styles.lastUpdated}>Last updated: January 2025</Text> */}
        </View>

        {/* Terms List */}
        {termsData.map((term, index) => (
          <View key={index} style={styles.termItem}>
            <View style={styles.termHeader}>
              <View style={styles.termNumber}>
                <Text style={styles.termNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.termTitle}>{term.title}</Text>
            </View>
            <Text style={styles.termContent}>{term.content}</Text>
          </View>
        ))}

        {/* Contact Section */}
        <View style={styles.contactSection}>
          <View style={styles.contactCard}>
            <Ionicons name="mail-outline" size={24} color={primary} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Have Questions?</Text>
              <Text style={styles.contactText}>
                If you have any questions about these Terms and Conditions,
                please contact our support team.
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 Premium Meats. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const termsData = [
  {
    title: "Definition of “Goods”",
    content:
      "In the Terms and Conditions, “Goods” means any goods or services supplied by the Company to the Buyer from time to time.",
  },
  {
    title: "Price Validity (30 Days)",
    content:
      "Where a price is quoted to the Buyer then, subject to clause 4, the price of the Goods will be the price quoted if the Goods are ordered within 30 days of the quote. Otherwise, the price will be the price indicated on any invoice provided by the Company to the Buyer for the Goods supplied.",
  },
  {
    title: "Price Increase on Cost Changes",
    content:
      "Any increase in the Company’s cost of supply of the Goods between the date of the quotation and delivery that is beyond the reasonable control of the Company shall be payable by the Buyer.",
  },
  {
    title: "Payment Not Deemed Until Cleared",
    content:
      "Receipt by the Company of any cheque or other payment method shall not be deemed to be payment until the same has been honoured or cleared and until such time shall not prejudice or affect the Company’s rights, powers or remedies against the Buyer and/or the Goods.",
  },
  {
    title: "Return Authorisation Required",
    content:
      "No Goods will be accepted for return and credit without the prior written authority of the Company and then only on such terms and conditions as the Company may agree.",
  },
  {
    title: "Condition for Credit Returns",
    content:
      "All goods accepted by the Company for credit must be delivered at the Buyer’s expense in original condition and packaging and are subject to the Company’s inspection upon receipt.",
  },
  {
    title: "No Credit for Damaged/Used Goods",
    content:
      "Credit will not be given for damaged or used goods or for freight or restocking charges.",
  },
  {
    title: "Warranty Limited to Repair/Replacement",
    content:
      "The Company’s obligations under this warranty extend only to the repair or replacement of defective Goods.",
  },
  {
    title: "Proper Provision of Services",
    content:
      "The Company shall provide its services in a proper and businesslike manner.",
  },
  {
    title: "Claims Period (7 Days)",
    content:
      "If the Buyer has any claim in respect of defects, damage, failure to comply with a description or quote, or short supply, the claim must be made to the Company in writing within 7 days of the date of delivery. The fact that no such claim has been made shall be conclusive evidence in any proceedings between the Company and the Buyer that the Goods at the time of delivery were free from any defect or damage.",
  },
  {
    title: "No Liability for Indirect Damages",
    content:
      "Under no circumstances whatsoever is the Company liable for indirect or consequential damages or for any loss of business or profit, however caused, occasioned through any defect in the Goods or the failure or omission of the Company to comply with its obligations under the Terms and Conditions.",
  },
  {
    title: "Liability Cap",
    content:
      "In any event the maximum amount of any claim in relation to the provision of Goods by the Company shall be limited to the price invoiced to the Buyer in respect of such Goods.",
  },
  {
    title: "Risk Passes on Delivery",
    content:
      "The risk in the Goods supplied to the Buyer will pass to the Buyer on delivery. Delivery of the Goods is deemed to occur when the Goods are delivered by the Company to a courier or carrier for the purpose of transmission to the Buyer.",
  },
  {
    title: "Retention of Title in Integrated Goods",
    content:
      "If any part of the Goods shall become incorporated into any other property so as to lose its separate identity, then the title of that proportion of the property so integrated equal in value to the price owed to the Company shall be reserved and vested in the Company until all money the Buyer owes to the Company has been paid in full.",
  },
  {
    title: "Buyer Holds Goods in Trust",
    content:
      "Until the Company receives payment in full, the Buyer shall hold or deal with the Goods for and on behalf of the Company and in every respect as fiduciary and agent.",
  },
  {
    title: "Authorisation to Secure Priority",
    content:
      "In the case of Goods where title is reserved to the Company, the Buyer authorises the Company to approach the Buyer’s existing or subsequent charge holder(s), where appropriate, to obtain acknowledgment of the Company’s security interest in the Goods and confirmation that the Company has priority with regard to any Goods in which title is reserved to the Company.",
  },
  {
    title: "Acknowledgement of Security Interest",
    content:
      "The Buyer acknowledges the Company’s security interest in all Goods (“Collateral”) supplied to the Buyer but not paid for under the Terms and Conditions.",
  },
  {
    title: "Right to Register Financing Statement",
    content:
      "The Company reserves the right at its discretion to register a Financing Statement in respect of Goods supplied to the Buyer that comprise Collateral. The costs of registering a Financing Statement or Financing Change Statement shall be paid by the Buyer and may be debited by the Company against the Buyer’s account. The Buyer shall promptly execute any documents and do anything else required by the Company to ensure the Company’s security interest constitutes a perfected security interest over the Collateral.",
  },
  {
    title: "Restriction on Third-Party Financing Statements",
    content:
      "The Buyer shall not agree to allow any person to file a Financing Statement over the Collateral without the prior consent of the Company and shall notify the Company immediately if it becomes aware of any person taking steps to file such a statement.",
  },
  {
    title: "Contracting-Out of Certain PPSA Sections",
    content:
      "The Seller, Buyer and Guarantor (if any) agree that nothing in sections 114(1)(a), 133 and 134 of the PPSA will apply to the Terms and Conditions, and the Buyer waives its rights as a debtor under sections 121, 125, 129, 131 and 132 of the PPSA.",
  },
  {
    title: "Late Delivery Disclaimer",
    content:
      "The Company will make every effort to complete delivery on the date agreed, but will not be liable for late delivery or consequential damages of any kind arising out of late delivery, nor will the Company accept cancellation of any order because of late delivery.",
  },
  {
    title: "Default Events",
    content:
      "If the Buyer fails to make payment when due or becomes insolvent, bankrupt, goes into liquidation, or has a receiver appointed, the Company reserves the rights set out in clauses 24 to 27.",
  },
  {
    title: "Acceleration of Payment",
    content:
      "Treat sums due or sums to become due from the Buyer as immediately due and payable.",
  },
  {
    title: "Right to Cancel or Suspend",
    content: "Cancel or suspend delivery of Goods.",
  },
  {
    title: "Right of Entry and Repossession",
    content:
      "By its agents, the Company may enter the Buyer’s premises (without notice) where the Goods may be stored, search for, remove and take possession of the Goods without being liable to the Buyer or anyone claiming under it.",
  },
  {
    title: "Withhold Further Credit Supply",
    content: "Withhold the further supply of Goods on credit.",
  },
  {
    title: "Buyer Obligations on Default",
    content:
      "In the event of default, the Buyer will, at the Company’s request, comply with clauses 29 to 31.",
  },
  {
    title: "Redeliver Goods on Request",
    content:
      "Re-deliver the Goods to the Company and do anything reasonably necessary to allow the Company to retake possession of them.",
  },
  {
    title: "Assign Receivables to Company",
    content:
      "Instruct any third parties who owe money in respect of Goods to pay that money directly to the Company.",
  },
  {
    title: "Provide Records to Company",
    content:
      "Make any records available that may assist the Company to take the proceeds of the Goods.",
  },
  {
    title: "Indemnity for Enforcement Costs",
    content:
      "The Buyer will be liable for and indemnifies the Company for all expenses and losses incurred or suffered by the Company in enforcement or as a result of any default, including solicitor-own legal costs and debt-collection agency fees at 20 % of the total amount collected.",
  },
  {
    title: "Entire Agreement",
    content:
      "The Credit Application Form and the Terms and Conditions constitute the sole evidence of the contract between the Company and Buyer, to the exclusion of all other conditions and warranties, and the Buyer relies solely on its own judgment in entering the agreement.",
  },
  {
    title: "Arbitration and Governing Law",
    content:
      "Any dispute arising under this agreement shall be referred to arbitration under the Arbitration Act 1996 (NZ). New Zealand law governs, and New Zealand Courts have non-exclusive jurisdiction.",
  },
  {
    title: "Force Majeure",
    content:
      "The Company shall not be liable for damages arising from failure to deliver or perform where such failure is caused by events beyond its reasonable control, including acts of God, labour disputes, government intervention, or transportation delays.",
  },
  {
    title: "Credit Information Authorisation",
    content:
      "For assessing credit-worthiness, enforcing rights or marketing products, the Buyer authorises the Company to hold, collect and use information about the Buyer, and to supply that information to credit-reporting agencies or others to facilitate debt collection.",
  },
  {
    title: "Third-Party Information Supply",
    content:
      "The Buyer also authorises any third party to supply to the Company any information about the Buyer requested by the Company.",
  },
  {
    title: "Information Storage",
    content:
      "The information will be held securely at the Company’s origin office referred to on the Credit Application Form and/or the Company’s invoice.",
  },
  {
    title: "Employee Access to Information",
    content:
      "The information will be accessible to any of the Company’s employees and agents who need access to it for the administration of the Company’s business.",
  },
  {
    title: "Buyer Right to Access/Correct Data",
    content:
      "The Buyer may request the Company for access to and correction of any information about the Buyer.",
  },
  {
    title: "CGA Business-Use Exclusion (Company)",
    content:
      "Where the Company is supplying Goods to the Buyer for business purposes within the meaning of the CGA, the provisions of section 43 of the CGA apply to these Terms and Conditions.",
  },
  {
    title: "CGA Business-Use Exclusion (Buyer)",
    content:
      "Where the Buyer supplies the Goods to another person acquiring them for business purposes, it will be a term of that contract that the CGA will not apply.",
  },
  {
    title: "Termination on 7-Days Notice",
    content:
      "The Company may terminate the Terms and Conditions by giving 7 days’ written notice to the Buyer, without prejudice to any existing rights or remedies.",
  },
  {
    title: "Assignment of Rights",
    content:
      "The Company may assign any of its rights or obligations to any person. The Buyer may not assign any of its rights or obligations to any other person without the Company’s written consent.",
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#e9ecef",
    borderRadius: 2,
    marginRight: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: "#6c757d",
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  introSection: {
    backgroundColor: "white",
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  introTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: primary,
    marginBottom: 12,
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#495057",
    marginBottom: 16,
  },
  lastUpdated: {
    fontSize: 14,
    color: "#6c757d",
    fontStyle: "italic",
  },
  termItem: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  termHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  termNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  termNumberText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  termTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    flex: 1,
  },
  termContent: {
    fontSize: 14,
    lineHeight: 20,
    color: "#495057",
    paddingLeft: 44,
  },
  contactSection: {
    margin: 16,
  },
  contactCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  contactInfo: {
    marginLeft: 16,
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 4,
  },
  contactText: {
    fontSize: 14,
    color: "#6c757d",
    lineHeight: 20,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 12,
    color: "#6c757d",
  },
});

export default TermsAndConditions;
