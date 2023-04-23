import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import FinalSheetTable from "./finalsheettable";

interface Column {
  id:
    | "date"
    | "ele"
    | "lco"
    | "tman"
    | "filter"
    | "po"
    | "bco"
    | "srfilter"
    | "incharge"
    | "mo"
    | "shiftinch"
    | "gc"
    | "svr"
    | "sbo"
    | "lman"
    | "forman"
    | "tmesson"
    | "lmes"
    | "jrele"
    | "helper"
    | "total";
  label: string;
  border?: boolean;
  minWidth?: number;
  align?: "right" | "center" | "left";
  format?: (value: number) => string;
}

interface Data {
  date: string;
  ele: number;
  lco: number;
  tman: number;
  filter: number;
  po: number;
  bco: number;
  srfilter: number;
  incharge: number;
  mo: number;
  shiftinch: number;
  gc: number;
  tmesson: number;
  svr: number;
  sbo: number;
  lmes: number;
  lman: number;
  forman: number;
  jrele: number;
  helper: number;
  total: number;
}

export default function FinalSheetta({
  rows,
  total,
  department,
}: {
  rows: any[];
  total: number;
  department: string;
}) {
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
    { main: "Total", id: "total" },
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
    { main: "Total", sub: " ", id: "total" },
  ];

  switch (department) {
    case "CCM":
      return (
        <FinalSheetTable
          rows={rows}
          total={Math.floor(total || 0)}
          department={department}
          sides={sideccm}
        />
      );
      break;
    case "LRF":
      return (
        <FinalSheetTable
          rows={rows}
          total={Math.floor(total || 0)}
          department={department}
          sides={sidelrf}
        />
      );
      break;
    case "COLONY":
      return (
        <FinalSheetTable
          rows={rows}
          total={Math.floor(total || 0)}
          department={department}
          sides={sidecolony}
        />
      );
      break;
    case "8HR":
    case "12HR":
      return (
        <FinalSheetTable
          rows={rows}
          total={Math.floor(total || 0)}
          department={department}
          sides={side8hr}
        />
      );
    default:
      return <></>;
  }
  // return (
  //   <Paper sx={{ width: "100%" }}>
  //     <TableContainer
  //       sx={{
  //         maxWidth: "100%",
  //         scrollBehavior: "smooth",
  //         "&::-webkit-scrollbar": {
  //           width: 7,
  //           height: 7,
  //         },
  //         "&::-webkit-scrollbar-thumb": {
  //           backgroundColor: "#bdbdbd",
  //           borderRadius: 2,
  //         },
  //       }}
  //     >
  //       <Table aria-label="sticky table">
  //         <TableHead>
  //           <TableRow>
  //             {columns.map((column) => (
  //               <TableCell
  //                 key={column.id}
  //                 align={column.align}
  //                 style={{ top: 57, minWidth: column.minWidth }}
  //               >
  //                 {column.label}{" "}
  //                 {/* {!(column.id === "date" || column.id === "total") && (
  //                   <span>{`(${count[column.id]})`}</span>
  //                 )} */}
  //               </TableCell>
  //             ))}
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           {rows.map((row, index) => {
  //             return (
  //               <TableRow hover role="checkbox" tabIndex={-1} key={row.lco}>
  //                 {columns.map((column) => {
  //                   const value = row[column.id];
  //                   return (
  //                     <TableCell key={column.id} align={column.align}>
  //                       {column.format && typeof value === "number"
  //                         ? column.format(value).slice(0, 7)
  //                         : value}
  //                     </TableCell>
  //                   );
  //                 })}
  //               </TableRow>
  //             );
  //           })}
  //           <TableRow>
  //             <TableCell rowSpan={department === "Colony" ? 0 : 10} />
  //             <TableCell colSpan={colspan1}></TableCell>
  //             <TableCell colSpan={colspan2}>Net Amount Payable</TableCell>
  //             <TableCell align="center">{total}</TableCell>
  //           </TableRow>
  //           <TableRow>
  //             <TableCell />
  //             {department !== "Colony" && (
  //               <TableCell colSpan={colspan1 - 1}></TableCell>
  //             )}
  //             <TableCell colSpan={colspan2}>GST Hold</TableCell>
  //             <TableCell align="center">{total > 0 ? "300" : "0"}</TableCell>
  //           </TableRow>
  //           <TableRow>
  //             <TableCell />
  //             {department !== "Colony" && (
  //               <TableCell colSpan={colspan1 - 1}></TableCell>
  //             )}
  //             <TableCell colSpan={colspan2}>
  //               Safety Voilation's Penality
  //             </TableCell>
  //             <TableCell align="center">{total > 0 ? "40" : "0"}</TableCell>
  //           </TableRow>
  //           <TableRow>
  //             <TableCell />
  //             {department !== "Colony" && (
  //               <TableCell colSpan={colspan1 - 1}></TableCell>
  //             )}
  //             <TableCell colSpan={colspan2}>
  //               Consumables / Rechargeable Items
  //             </TableCell>
  //             <TableCell align="center">0</TableCell>
  //           </TableRow>
  //           <TableRow>
  //             <TableCell />
  //             {department !== "Colony" && (
  //               <TableCell colSpan={colspan1 - 1}></TableCell>
  //             )}
  //             <TableCell colSpan={colspan2}>
  //               Adjustment Of Advance Amount
  //             </TableCell>
  //             <TableCell align="center">0</TableCell>
  //           </TableRow>
  //           <TableRow>
  //             <TableCell />
  //             {department !== "Colony" && (
  //               <TableCell colSpan={colspan1 - 1}></TableCell>
  //             )}
  //             <TableCell colSpan={colspan2}>Any Other Deductions</TableCell>
  //             <TableCell align="center">{total > 0 ? "80" : "0"}</TableCell>
  //           </TableRow>
  //           <TableRow>
  //             <TableCell />
  //             {department !== "Colony" && (
  //               <TableCell colSpan={colspan1 - 1}></TableCell>
  //             )}
  //             <TableCell colSpan={colspan2}>Final Payable</TableCell>
  //             <TableCell align="center">
  //               {total > 0 ? total - 150 - 40 - 80 : 0}
  //             </TableCell>
  //           </TableRow>
  //         </TableBody>
  //       </Table>
  //     </TableContainer>
  //   </Paper>
  // );
}
