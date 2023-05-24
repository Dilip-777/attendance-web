import React from "react";
import { View, StyleSheet } from "@react-pdf/renderer";
import InvoiceTableHeader from "./tableHeader";
import InvoiceTableRow from "./tableRow";
import InvoiceTableFooter from "./tableFooter";
import { Department, Designations, Safety, Stores } from "@prisma/client";

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 24,
    borderWidth: 1,
    borderColor: "black",
  },
});

const InvoiceItemsTable = ({
  department,
  rows,
  designations,
  total,
  store,
  safety,
}: {
  department?: Department | undefined;
  rows: any[];
  designations: Designations[];
  total: number;
  store: Stores | null;
  safety: Safety | null;
}) => {
  const contractorDetails = [{ label: "Contractor Name", value: "" }];
  return (
    <View style={styles.tableContainer}>
      <InvoiceTableHeader department={department} />
      <InvoiceTableRow
        designations={designations}
        rows={rows}
        department={department as Department}
      />
      <InvoiceTableFooter total={total} store={store} safety={safety} />
    </View>
  );
};

export default InvoiceItemsTable;
