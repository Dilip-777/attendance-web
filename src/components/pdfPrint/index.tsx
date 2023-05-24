import React from "react";
import { Page, Document, StyleSheet, Image } from "@react-pdf/renderer";
import InvoiceItemsTable from "./table";
import { Department, Designations, Safety, Stores } from "@prisma/client";
import Details from "./details";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 50,
    paddingRight: 50,
    lineHeight: 1.5,
    flexDirection: "column",
    fontWeight: "bold",
    fontStyle: "bold",
  },
  logo: {
    width: 84,
    height: 70,
    marginLeft: "auto",
    marginRight: "auto",
  },
});

const PdfDocument = ({
  department,
  designations,
  rows,
  total,
  store,
  safety,
  details,
}: {
  department: Department;
  designations: Designations[];
  rows: any[];
  total: number;
  store: Stores | null;
  safety: Safety | null;
  details: any;
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Details />
        <InvoiceItemsTable
          rows={rows}
          designations={designations}
          department={department}
          total={total}
          store={store}
          safety={safety}
        />
      </Page>
    </Document>
  );
};

export default PdfDocument;
