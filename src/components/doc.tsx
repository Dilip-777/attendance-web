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
