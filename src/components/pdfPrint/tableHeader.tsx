import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { Department } from "@prisma/client";

const borderColor = "black";
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomColor: "black",
    backgroundColor: "#e0e0e0",
    color: "black",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 30,
    textAlign: "center",
    fontStyle: "bold",
    flexGrow: 1,
    fontSize: 6,
  },
  description: {
    width: "60%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  qty: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    marginHorizontal: 2,
  },
  rate: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  amount: {
    width: "15%",
  },
});

const InvoiceTableHeader = ({
  department,
}: {
  department: Department | undefined;
}) => {
  const headers = [
    "Designation",
    "Type",
    "Total Man days",
    "Rate",
    "Total Amount",
    "Total Overtime",
    "OT Amount",
    "Total Amount",
    "Service Charge",
    "Service Charge Amount",
    "Taxable",
    "GST",
    "Bill Amount",
    "TDS",
    "Net Payable",
  ];

  const ccmheader = [
    "Designation",
    "Total Man days",
    "Rate",
    "Total Amount",
    "Total Overtime",
    "OT Amount",
    "Taxable",
    "GST",
    "Bill Amount",
    "TDS",
    "Net Payable",
  ];
  const headcells =
    department?.basicsalary_in_duration?.toLowerCase() === "hourly"
      ? headers
      : ccmheader;
  return (
    <View style={styles.container}>
      {headcells.map((headcell) => (
        <Text style={styles.qty}>{headcell}</Text>
      ))}
      {/* <Text style={styles.description}>Item Description</Text>
      <Text style={styles.rate}>Price</Text>
      <Text style={styles.amount}>Amount</Text> */}
    </View>
  );
};

export default InvoiceTableHeader;
