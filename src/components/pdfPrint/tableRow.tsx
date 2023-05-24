import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { Department, Designations } from "@prisma/client";
import _ from "lodash";

const borderColor = "black";
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: "black",
    borderRightColor: "black",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    fontStyle: "bold",
  },
  description: {
    width: "60%",
    textAlign: "left",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
  },
  qty: {
    width: "10%",
    // borderRightColor: borderColor,
    // borderRightWidth: 1,
    textAlign: "center",
    // paddingRight: 8,
    fontSize: 6,
    paddingHorizontal: 2,
    paddingVertical: 0,
  },
  rate: {
    width: "10%",
    // borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "center",
    // paddingRight: 8,
    fontSize: 6,
    paddingHorizontal: 2,
  },
  amount: {
    width: "15%",
    textAlign: "right",
    paddingRight: 8,
  },
});

interface item {
  sno: number;
  desc: string;
  qty: number;
  rate: number;
}

const InvoiceTableRow = ({
  rows,
  designations,
  department,
}: {
  rows: any[];
  designations: Designations[];
  department: Department;
}) => {
  const sidebar = designations
    .filter((d) => d.departmentname === department?.department)
    .map((d) => {
      if (d.gender === "Male")
        return { main: d.designation, sub: "M", id: d.designationid };
      else if (d.gender === "Female")
        return { main: d.designation, sub: "F", id: d.designationid };
      else return { main: d.designation, id: d.designationid };
    });

  if (department?.basicsalary_in_duration?.toLowerCase() === "hourly") {
    sidebar.push({ main: "Total", sub: " ", id: "total" });
  } else {
    sidebar.push({ main: "Total", id: "total" });
  }
  const rows1 = sidebar.map((item, index) => (
    <View style={styles.row} key={index}>
      <Text style={styles.rate}>{item.main}</Text>
      {item.sub && <Text style={styles.rate}>{item.sub}</Text>}
      {rows.map((row) => (
        <Text style={styles.qty}>
          {Math.round(_.get(row, item.id, 0) * 100) / 100}
        </Text>
      ))}
    </View>
    // <View style={styles.row} key={item.sno.toString()}>
    //   <Text style={styles.description}>{item.desc}</Text>
    //   <Text style={styles.qty}>{item.qty}</Text>
    //   <Text style={styles.rate}>{item.rate}</Text>
    //   <Text style={styles.amount}>{(item.qty * item.rate).toFixed(2)}</Text>
    // </View>
  ));
  return <Fragment>{rows1}</Fragment>;
};

export default InvoiceTableRow;
