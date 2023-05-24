import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 36,
    display: "flex",
    flexWrap: "wrap",
    fontWeight: 700,
    fontSize: 10,
    // fontStyle: "bold",
    flexDirection: "row",
    width: "100%",
  },
  billTo: {
    marginTop: 20,
    paddingBottom: 3,
    paddingHorizontal: 10,
    borderRight: 1,
    borderColor: "black",
    // fontFamily: "",
    // fontWeight: "bold",
  },
  value: {
    // fontWeight: "medium",
    fontStyle: "normal",
  },
});

const Details = () => (
  <View style={styles.headerContainer}>
    <Text style={styles.billTo}>
      Contractor name: <Text style={styles.value}>name</Text>{" "}
    </Text>
    <Text style={styles.billTo}>
      Contractor name: <Text style={styles.value}>name</Text>{" "}
    </Text>
    <Text style={styles.billTo}>
      Contractor name: <Text style={styles.value}>name</Text>{" "}
    </Text>
    <Text style={styles.billTo}>
      Contractor name: <Text style={styles.value}>name</Text>{" "}
    </Text>
    <Text style={styles.billTo}>
      Contractor name: <Text style={styles.value}>name</Text>{" "}
    </Text>
    <Text style={styles.billTo}>
      Contractor name: <Text style={styles.value}>name</Text>{" "}
    </Text>
    <Text style={styles.billTo}>
      Contractor name: <Text style={styles.value}>name</Text>{" "}
    </Text>
    <Text style={styles.billTo}>
      Contractor name: <Text style={styles.value}>name</Text>{" "}
    </Text>
    <Text style={styles.billTo}>
      Contractor name: <Text style={styles.value}>name</Text>{" "}
    </Text>
    <Text style={styles.billTo}>
      Contractor name: <Text style={styles.value}>name</Text>{" "}
    </Text>
  </View>
);

export default Details;
