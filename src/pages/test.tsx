import React, { useEffect, useState } from "react";
const ExcelJS = require("exceljs");

const handleExport = () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  const border = {
    top: { style: "thick", color: { argb: "black" } },
    left: { style: "thick", color: { argb: "black" } },
    bottom: { style: "thick", color: { argb: "black" } },
    right: { style: "thick", color: { argb: "black" } },
  };

  // Add data to the worksheet
  // Customize this logic based on your requirements
  worksheet.getRow(1).border = border;

  worksheet.getRow(1).font = {
    name: "Comic Sans MS",
    family: 4,
    size: 16,
    bold: true,
  };
  worksheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };
  const table1Data = [
    ["Column 1", "Column 2"],
    ["Data 1", "Data 2"],
  ];

  const table2Data = [
    ["Column A", "Column B"],
    ["Data A", "Data B"],
  ];

  let rownumber = 2;

  const headings = [
    {
      header: ["Plant One"],
      colSpan: 10,
      bgcolor: "80d8ff",
      font: { size: 19, bold: true },
    },
    {
      header: ["CONTRACTOR'S PAYMENT APPROVAL REQUISITION FORM"],
      colSpan: 10,
      bgcolor: "80d8ff",
      font: { size: 18, bold: true },
    },
    {
      header: ["STRATEGIC BUSINESS UNIT", "", "", "", "", "", "", "", "RTTTT"],
      colSpan: 5,
      bgcolor: "fafafa",
      font: { size: 17, bold: true },
    },
  ];

  function createHeading(heading: any) {
    const headingTextRow = worksheet.addRow(heading.header);
    headingTextRow.height = heading.height || 43;
    if (heading.colSpan === 5) {
      worksheet.mergeCells(
        `A${headingTextRow.number}:H${headingTextRow.number}`
      );
      worksheet.mergeCells(
        `I${headingTextRow.number}:P${headingTextRow.number}`
      );
    } else {
      worksheet.mergeCells(
        `A${headingTextRow.number}:P${headingTextRow.number}`
      );
    }
    headingTextRow.eachCell((cell: any) => {
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.font = heading.font;
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: heading.bgcolor }, // Replace 'FFFF0000' with the desired color code
      };
      cell.border = border;
    });
  }

  headings.forEach((heading) => {
    createHeading(heading);
    rownumber = rownumber + 1;
  });

  // const textrow = worksheet.addRow([
  //   "test",
  //   "test",
  //   "test",
  //   "tesdfkvjndvjndivndjvndjvndfjnt",
  //   "tesgfbkjrnbvirmvidcvmehucvehcneicnt",
  // ]);
  // textrow.height = 45;
  // worksheet.mergeCells(`A${textrow.number}:C${textrow.number}`);
  // textrow.eachCell((cell: any) => {
  //   cell.alignment = { wrapText: true };
  // });
  // // worksheet.mergeCells(`D${textrow.number}:F${textrow.number}`);

  // // Add the first table to the worksheet
  // table1Data.forEach((row) => {
  //   worksheet.addRow(row);
  //   worksheet.getRow(rownumber).border = border

  //   rownumber = rownumber + 1;
  // });

  // Add a blank row between tables
  // worksheet.addRow([]);
  createHeading({
    header: [""],
    height: 30,
  });
  rownumber = rownumber + 1;

  createHeading({
    header: ["Contractor Information"],
    colSpan: 10,
    bgcolor: "fafafa",
    font: { size: 14, bold: true },
    height: 40,
  });

  function createDetails(details: string[]) {
    const textrow = worksheet.addRow(details);
    textrow.height = 45;
    textrow.eachCell((cell: any) => {
      cell.alignment = {
        wrapText: true,
        vertical: "middle",
        horizontal: "center",
      };
    });
    // textrow.border = border;
    textrow.eachCell((cell: any) => {
      cell.border = border;
    });
    [
      { s: "A", e: "B" },
      { s: "C", e: "D" },
      { s: "E", e: "F" },
      { s: "G", e: "H" },
      { s: "I", e: "J" },
      { s: "K", e: "L" },
      { s: "M", e: "N" },
      { s: "O", e: "P" },
    ].forEach((cellnumber) => {
      worksheet.mergeCells(
        `${cellnumber.s}${textrow.number}:${cellnumber.e}${textrow.number}`
      );
    });
    [1, 5, 9, 13].forEach((cellnumber) => {
      textrow.getCell(cellnumber).font = {
        bold: true,
        size: 14,
        wrapText: true,
      };
    });
    [3, 7, 11, 15].forEach((cellnumber) => {
      textrow.getCell(cellnumber).font = {
        bold: false,
        size: 14,
        wrapText: true,
      };
    });
    // textrow.getCell(1).font = { bold: true, size: 14, wrapText: true };
    // textrow.getCell(5).font = { bold: false, size: 14, wrapText: true };
    // textrow.getCell(9).font = { bold: true, size: 14, wrapText: true };
    // textrow.getCell(13).font = { bold: false, size: 14, wrapText: true };
  }

  createDetails([
    "Contractor Code",
    "",
    "This is contractor id ",
    "",
    "Contractor Name",
    "",
    "This is contractor name",
    "",
    "Contact NO:",
    "",
    "98798778",
    "",
    "Type of Contractor",
    "",
    "test",
  ]);

  createDetails([
    "Contractor Address",
    "",
    "This is contractor address",
    "",
    "GSTIN",
    "",
    "This is contractor GSTIN",
    "",
    "PAN",
    "",
    "This is contractor PAN",
    "",
    "Area of Work",
    "",
    "test",
  ]);

  createHeading({
    header: [""],
    height: 30,
  });

  createHeading({
    header: ["Invoice Information"],
    colSpan: 10,
    bgcolor: "fafafa",
    font: { size: 14, bold: true },
    height: 40,
  });

  createDetails([
    "Invoice No",
    "",
    "This is invoice no",
    "",
    "Invoice Date",
    "",
    "This is invoice date",
    "",
    "Work Order No",
    "",
    "This is work order no",
    "",
    "Nature of Work",
    "",
    "test",
  ]);

  createDetails([
    "Invoice Month",
    "",
    "This is invoice month",
    "",
    "Date of Invoice Received",
    "",
    "This is date of invoice received",
    "",
    "Effective Date of contractor",
    "",
    "This is effective date of contractor",
    "",
    "Ending Date of contractor",
    "",
    "This is ending date of contractor",
  ]);

  createDetails([
    "GST Compliance's Status - Month",
    "",
    "test",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  createHeading({
    header: [""],
    height: 30,
  });

  createHeading({
    header: ["Billing Information"],
    colSpan: 10,
    bgcolor: "fafafa",
    font: { size: 14, bold: true },
    height: 40,
  });

  createHeading({
    header: [""],
    height: 30,
  });

  const tableheader = worksheet.addRow([
    "Category",
    "",
    "Shift Hours",
    "Rate",
    "Man Days",
    "Man Days Amount",
    "OT Hours",
    "OT Rate",
    "OT Amount",
    "Service Charge Rate",
    "Service Charge",
    "Taxable",
    "GST",
    "Bill Amount",
    "TDS",
    "Net Payable",
  ]);

  tableheader.eachCell((cell: any) => {
    cell.alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    cell.font = { bold: true, size: 14, wrapText: true };
    cell.border = border;
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "e0e0e0" }, // Replace 'FFFF0000' with the desired color code
    };
  });

  worksheet.mergeCells(`A${tableheader.number}:B${tableheader.number}`);

  const ids = [
    "designation",
    "",
    "shift",
    "rate",
    "mandays",
    "ot",
    "otrate",
    "sc",
    "scrate",
    "taxable",
    "gst",
    "billamount",
    "tds",
    "netpayable",
  ];

  // Add the second table to the worksheet
  // table2Data.forEach((row) => {
  //   worksheet.addRow(row);

  //   worksheet.getRow(rownumber).border = {
  //     top: { style: "thick", color: { argb: "black" } },
  //     left: { style: "thick", color: { argb: "black" } },
  //     bottom: { style: "thick", color: { argb: "black" } },
  //     right: { style: "thick", color: { argb: "black" } },
  //   };
  //   rownumber = rownumber + 1;
  // });

  // worksheet.getRow(6).border = {
  //   top: { style: "thick", color: { argb: "black" } },
  //   left: { style: "thick", color: { argb: "black" } },
  //   bottom: { style: "thick", color: { argb: "black" } },
  //   right: { style: "thick", color: { argb: "black" } },
  // };

  // Save the workbook as an Excel file
  workbook.xlsx.writeBuffer().then((buffer: any) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "multitable.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};

export default function Test() {
  return (
    <div>
      <button onClick={handleExport}>Export Excel</button>
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// const ExcelJS = require("exceljs");

// const toDataURL = (url: any) => {
//   const promise = new Promise((resolve, reject) => {
//     var xhr = new XMLHttpRequest();
//     xhr.onload = function () {
//       var reader = new FileReader();
//       reader.readAsDataURL(xhr.response);
//       reader.onloadend = function () {
//         resolve({ base64Url: reader.result });
//       };
//     };
//     xhr.open("GET", url);
//     xhr.responseType = "blob";
//     xhr.send();
//   });

//   return promise;
// };

// const App = () => {
//   const [data, setData] = useState<any>([]);
//   useEffect(() => {
//     fetch("https://dummyjson.com/products")
//       .then((res) => res.json())
//       .then(async (data) => {
//         console.log(data);
//         setData(data);
//       })
//       .then((json) => console.log(json));
//   }, []);

//   const exportExcelFile = () => {
//     const workbook = new ExcelJS.Workbook();
//     const sheet = workbook.addWorksheet("My Sheet", {
//       pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
//     });
//     // sheet.views = [{ state: "frozen", xSplit: 0, ySplit: 1, outerHeight: 100 }];
//     sheet.properties.defaultRowHeight = 45;

//     sheet.pageSetup.fitToWidth = true;

//     sheet.getRow(1).border = {
//       top: { style: "thick", color: { argb: "black" } },
//       left: { style: "thick", color: { argb: "black" } },
//       bottom: { style: "thick", color: { argb: "black" } },
//       right: { style: "thick", color: { argb: "black" } },
//     };

//     // sheet.getRow(1).font = {
//     //   name: "Comic Sans MS",
//     //   family: 4,
//     //   size: 16,
//     //   bold: true,
//     // };
//     // sheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };
//     // sheet.columns = [
//     //   {
//     //     header: "Id",
//     //     key: "id",
//     //     width: 10,
//     //   },
//     //   { header: "Title", key: "title", width: 32 },
//     //   {
//     //     header: "Brand",
//     //     key: "brand",
//     //     width: 20,
//     //   },
//     //   {
//     //     header: "Category",
//     //     key: "category",
//     //     width: 20,
//     //   },
//     //   {
//     //     header: "Price",
//     //     key: "price",
//     //     width: 15,
//     //   },

//     //   sheet.addRow({
//     //     id: 1,
//     //     title1: "title",
//     //   }),
//     //   {
//     //     header: "Rating",
//     //     key: "rating",
//     //     width: 10,
//     //   },
//     //   {
//     //     header: "Photo",
//     //     key: "thumbnail",
//     //     width: 30,
//     //   },
//     // ];

//     const promise = Promise.all(
//       // [...data?.products, ...data?.products, ...data?.products]?.map(
//       //   async (product: any, index: number) => {
//       //     const rowNumber = index + 2;
//       //     sheet.addRow({
//       //       id: product?.id,
//       //       title: product?.title,
//       //       brand: product?.brand,
//       //       category: product?.category,
//       //       price: product?.price,
//       //       rating: product?.rating,
//       //     });
//       //     sheet.getRow(rowNumber).border = {
//       //       top: { style: "thick", color: { argb: "black" } },
//       //       left: { style: "thick", color: { argb: "black" } },
//       //       bottom: { style: "thick", color: { argb: "black" } },
//       //       right: { style: "thick", color: { argb: "black" } },
//       //     };

//       //     sheet.getRow(rowNumber).height = 45;

//       //     sheet.getRow(rowNumber).alignment = {
//       //       vertical: "middle",
//       //       horizontal: "center",
//       //     };
//       //   }
//       // )

//       [
//         {
//           headers: ["Id", "Title", "Brand", "Category", "Price", "Rating"],
//           values: [1, "title", "brand", "category", "price", "rating"],
//         },

//         {
//           headers: ["Id", "Title", "Brand", "Category", "Price", "Rating"],
//           values: [1, "title", "brand", "category", "price", "rating"],
//         },
//         {
//           headers: ["Id", "Title", "Brand", "Category", "Price", "Rating"],
//           values: [1, "title", "brand", "category", "price", "rating"],
//         },
//       ].map(async (table: any, index: number) => {
//         const rowNumber = index + 2;
//         table.headers.map((header: any, index: number) => {
//           sheet.addRow(header);
//         });

//         table.values.map((value: any, index: number) => {
//           sheet.addRow(value);
//         });
//         // sheet.addTable({
//         //   name: "MyTable",
//         //   ref: "A1",
//         //   headerRow: true,
//         //   totalsRow: true,
//         //   style: {
//         //     theme: "TableStyleMedium2",
//         //     showRowStripes: true,
//         //   },
//         //   columns: table?.headers.map((header: any) => {
//         //     return {
//         //       name: header,
//         //       filterButton: true,
//         //     };
//         //   }),
//         //   rows: table?.values.map((value: any) => {
//         //     return {
//         //       values: value,
//         //     };
//         //   }),
//         // });
//       })
//     );

//     // Add the first table to the worksheet
//     // sheet.addRows([
//     //   ['Column 1', 'Column 2'],
//     //   ['Data 1', 'Data 2'],
//     // ]);

//     // // Add a blank row between tables
//     // sheet.addRow([]);

//     // // Add the second table to the sheet
//     //          sheet.addRows([
//     //   ['Column A', 'Column B'],
//     //   ['Data A', 'Data B'],
//     // ]);

//     sheet.columns = [
//       {
//         header: "Id",
//         key: "id",
//         width: 10,
//       },
//       { header: "Title", key: "title", width: 32 },
//       {
//         header: "Brand",
//         key: "brand",
//         width: 20,
//       },
//       {
//         header: "Category",
//         key: "category",
//         width: 20,
//       },
//       {
//         header: "Price",
//         key: "price",
//         width: 15,
//       },
//       // {
//       //   header: "Rating",
//       //   key: "rating",
//       //   width: 10,
//       // },
//       // {
//       //   header: "Photo",
//       //   key: "thumbnail",
//       //   width: 30,
//       // },
//     ];

//     // sheet.getRows().forEach((row: any) => {
//     //   row.eachCell((cell: any) => {
//     //     cell.alignment = { horizontal: "center", vertical: "middle" };
//     //   });
//     // });

//     promise.then(() => {
//       const priceCol = sheet.getColumn(5);

//       // iterate over all current cells in this column
//       // priceCol.eachCell((cell: any) => {
//       //   const cellValue = sheet.getCell(cell?.address).value;
//       //   // add a condition to set styling
//       //   if (cellValue > 50 && cellValue < 1000) {
//       //     sheet.getCell(cell?.address).fill = {
//       //       type: "pattern",
//       //       pattern: "solid",
//       //       fgColor: { argb: "FF0000" },
//       //     };
//       //   }
//       // });

//       workbook.xlsx.writeBuffer().then(function (data: any) {
//         const blob = new Blob([data], {
//           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         });
//         const url = window.URL.createObjectURL(blob);
//         const anchor = document.createElement("a");
//         anchor.href = url;
//         anchor.download = "download.xlsx";
//         anchor.click();
//         window.URL.revokeObjectURL(url);
//       });
//     });
//   };

//   return (
//     <div style={{ padding: "30px" }}>
//       <button
//         className="btn btn-primary float-end mt-2 mb-2"
//         onClick={exportExcelFile}
//       >
//         Export
//       </button>
//       <h3>Table Data:</h3>
//       <table className="table table-bordered">
//         <thead style={{ background: "yellow" }}>
//           <tr>
//             <th scope="col">Id</th>
//             <th scope="col">Title</th>
//             <th scope="col">Brand</th>
//             <th scope="col">Category</th>
//             <th scope="col">Price</th>
//             <th scope="col">Rating</th>
//             <th scope="col">Photo</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Array.isArray(data?.products) &&
//             data?.products?.map((row: any) => (
//               <tr>
//                 <td>{row?.id}</td>
//                 <td>{row?.title}</td>
//                 <td>{row?.brand}</td>
//                 <td>{row?.category}</td>
//                 <td>${row?.price}</td>
//                 <td>{row?.rating}/5</td>
//                 <td>
//                   <img src={row?.thumbnail} width="100" />
//                 </td>
//               </tr>
//             ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default App;
