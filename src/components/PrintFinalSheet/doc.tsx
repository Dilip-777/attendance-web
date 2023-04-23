import React from "react";
import {
  Document,
  Paragraph,
  Heading,
  Table,
  TableRow,
  TableCell,
} from "redocx";

const MyDocument = () => {
  const side8hr = [
    { main: "8MW", sub: "M", id: "m8" },
    { main: "8MW", sub: "F", id: "f8" },
    { main: "20MW", sub: "M", id: "m20" },
    { main: "20MW", sub: "F", id: "f20" },
    { main: "DM", sub: "M", id: "dm" },
    { main: "QC", sub: "M", id: "qc" },
    { main: "Store", sub: "M", id: "store" },
    { main: "K-7", sub: "M", id: "k7m" },
    { main: "K-7", sub: "F", id: "k7f" },
    { main: "RMHS", sub: "M", id: "rmhs" },
    { main: "PS", sub: "F", id: "ps" },
    { main: "HK", sub: "M", id: "hk" },
    { main: "SVR", sub: "M", id: "svr" },
    { main: "TOTAL", sub: " ", id: "total" },
  ];
  const sideccm = [
    { main: "ELE", id: "ele" },
    { main: "LCO", id: "lco" },
    { main: "TMAN", id: "tman" },
    { main: "FILTER", id: "filter" },
    { main: "PO", id: "po" },
    { main: "BCO", id: "bco" },
    { main: "SRFILTER", id: "srfilter" },
    { main: "INCHARGE", id: "incharge" },
    { main: "MO", id: "mo" },
    { main: "SHIFT INCH", id: "shiftinch" },
    { main: "GC", id: "gc" },
    { main: "SVR", id: "svr" },
    { main: "SBO", id: "sbo" },
    { main: "LMAN", id: "lman" },
    { main: "FORMAN", id: "forman" },
    { main: "TMES SON", id: "tmesson" },
    { main: "LMES", id: "lmes" },
    { main: "JRELE", id: "jrele" },
    { main: "HELPER", id: "helper" },
  ];

  const sidelrf = [
    { main: "ELE", id: "ele" },
    { main: "FILTER", id: "filter" },
    { main: "SRFILTER", id: "srfilter" },
    { main: "INCHARGE", id: "incharge" },
    { main: "SVR", id: "svr" },
    { main: "LMES", id: "lmes" },
    { main: "HELPER", id: "helper" },
    { main: "Total", id: "total" },
  ];

  const sidecolony = [
    { main: "Colony", sub: "Male", id: "m" },
    { main: "Colony", sub: "Female", id: "f" },
  ];
  const data = [
    {
      columns: ["Name", "Age", "Gender"],
      rows: [
        { name: "John", age: 25, gender: "Male" },
        { name: "Jane", age: 30, gender: "Female" },
        { name: "Bob", age: 40, gender: "Male" },
      ],
    },
    {
      columns: ["Name", "Age", "Gender"],
      rows: [
        { name: "Alice", age: 35, gender: "Female" },
        { name: "David", age: 45, gender: "Male" },
      ],
    },
    {
      columns: ["Name", "Age", "Gender"],
      rows: [
        { name: "Sarah", age: 28, gender: "Female" },
        { name: "Tom", age: 50, gender: "Male" },
        { name: "Samantha", age: 31, gender: "Female" },
      ],
    },
  ];

  return (
    <Document>
      <Heading>My Document</Heading>
      <Paragraph>This is my document.</Paragraph>
      <Heading>Tables</Heading>
      <Paragraph>Data for the tables.</Paragraph>
      {data.map((tableData, index) => (
        <React.Fragment key={index}>
          <Heading>{`Table ${index + 1}`}</Heading>
          <Table>
            <TableRow>
              {tableData.columns.map((column) => (
                <TableCell>{column}</TableCell>
              ))}
            </TableRow>
            {tableData.rows.map((row) => (
              <TableRow>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.age}</TableCell>
                <TableCell>{row.gender}</TableCell>
              </TableRow>
            ))}
          </Table>
        </React.Fragment>
      ))}
    </Document>
  );
};

export default MyDocument;
