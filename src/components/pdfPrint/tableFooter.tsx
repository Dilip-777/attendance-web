import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { Safety, Stores } from "@prisma/client";

const borderColor = "#3778C2";
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: "#3778C2",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    fontSize: 6,
    fontStyle: "bold",
  },
  description: {
    width: "85%",
    textAlign: "right",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingRight: 8,
  },
  total: {
    width: "15%",
    textAlign: "right",
    paddingRight: 8,
  },
});

const InvoiceTableFooter = ({
  total,
  store,
  safety,
}: {
  total: number;
  store: Stores | null;
  safety: Safety | null;
}) => {
  //   const total = 100;
  const rows = [
    { label: "Net Amount Payable", value: total },
    { label: "GST Hold", value: 0 },
    { label: "Safety Voilation Penalty", value: safety?.totalAmount || 0 },
    {
      label: "Consumables / Rechargeable Items",
      value: store?.totalAmount || 0,
    },
    { label: "Adjustment of Advance Amount", value: 0 },
    { label: "Any Other Deduction", value: 0 },
    {
      label: "Final Payable",
      value: total - (safety?.totalAmount || 0) - (store?.totalAmount || 0),
    },
  ];
  return (
    <>
      {rows.map((row, index) => (
        <View style={styles.row}>
          <Text style={styles.description}>{row.label}</Text>
          <Text style={styles.total}>{row.value}</Text>
        </View>
      ))}
    </>
  );
  //   return (
  //     <View style={styles.row}>
  //       {rows.map((row, index) => (
  //         <>
  //           <Text style={styles.description}>{row.label}</Text>
  //           <Text style={styles.total}>{row.value}</Text>
  //         </>
  //       ))}
  //     </View>
  //   );
};

export default InvoiceTableFooter;
