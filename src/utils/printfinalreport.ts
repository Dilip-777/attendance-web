import { Contractor, Workorder } from "@prisma/client";
import dayjs from "dayjs";


export const print8HR = (data: any[], c: Contractor | undefined, w: Workorder | undefined, department: string, total : number) => {
  const tableRows  = []
 const cheaders = [
    "Contractor Id", "Contractor Name", "Mobile Number", "Office Address", 
 ]
 tableRows.push(cheaders)
 const contractor = [c?.contractorId || "-", c?.contractorname || "-", c?.mobilenumber || "-", c?.officeaddress || "-"]
    tableRows.push(contractor)

    tableRows.push([""])
    tableRows.push(["Service Detail : "])

    const wheaders = ["Work Order", "Nature of Work", "Location", "Invoice Month", "Start Date", "End Date"]
    tableRows.push(wheaders)

    const workorder = [w?.id || "-", w?.nature || "-", w?.location || "-", dayjs(w?.startDate, "DD/MM/YYYY").format("MM/YYYY") || "-", w?.startDate || "-", w?.endDate || "-"]
    tableRows.push(workorder)

    tableRows.push([""])
    tableRows.push(["Department: ", department])
    tableRows.push([""])

    
     const rows = [
      [
        "",
        "8MW",
        "",
        "12MW",
        "",
        "DM Plant",
        "QC",
        "STORE",
        "K-7 & 1-6PROC",
        "",
        "RHMS",
        "PS",
        "HK & Garden",
        "SVR",
        "Total",
      ],
    ];
    tableRows.push(rows)
    const subheaders =["", "M", "F", "M", "F", "M", "M", "M", "M", "F", "M", "F", "M", "M", ""];
    tableRows.push(subheaders);
    data.forEach((item: any) => {
      tableRows.push([
        item.date as string,
        item.m8?.toString() || "-",
        item.f8?.toString() || "-",
        item.m20?.toString() || "-",
        item.f20?.toString() || "-",
        item.dm?.toString() || "-",
        item.qc?.toString() || "-",
        item.store?.toString() || "-",
        item.k7m?.toString() || "-",
        item.k7f?.toString() || "-",
        item.rmhs?.toString() || "-",
        item.ps?.toString() || "-",
        item.hk?.toString() || "-",
        item.svr?.toString() || "-",
        item.total?.toString() || "-",
      ]);
    });

    tableRows.push(["", "", "", "", "", "", "Net Amount Payable", "", "", "", "", "", "", total.toString()])
    tableRows.push(["", "", "", "", "", "", "GST Hold", "", "", "", "", "", "", total.toString()])
    tableRows.push(["", "", "", "", "", "", "Safety Voilation's Penality", "", "", "", "", "", "", total.toString()])
    tableRows.push(["", "", "", "", "", "", "Consumables / Rechargeable Items", "", "", "", "", "", "", total.toString()])
    tableRows.push(["", "", "", "", "", "", "Adjustments of Advance Amount", "", "", "", "", "", "", total.toString()])
    tableRows.push(["", "", "", "", "", "", "Any Other Deductions", "", "", "", "", "", "", total.toString()])
    tableRows.push(["", "", "", "", "", "", "Final Payable", "", "", "", "", "", "", total.toString()])

    const csvContent = `${tableRows.map((row) => row.join(",")).join("\n")}`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "finalsheet.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const ccmtypes = ["date","ele", "lco", "tman", "filter", "po", "bco", "srfilter", "incharge", "mo", "shiftinch", "gc", "tmesson", "svr", "sbo", "lmes", "lman", "forman","jrele", "helper", "total"]
const cccmheader = ["", "ELE", "LCO", "TMAN", "FILTER", "PO", "BCO", "SRFILTER", "INCHARGE", "MO", "SHIFTINCH", "GC", "TMES", "SVR", "SBO", "LMES", "LMAN", "FORMAN", "JRELE", "HELPER", "TOTAL"]

const lrftypes = ["date", "ele", "filter", "srfilter", "svr", "lmes","helper", "total"]
const lrfheader = ["", "ELE", "FILTER", "SRFILTER", "SVR", "LMES", "HELPER", "TOTAL"]

const colonytypes = ["date", "m", "f", "total"]
const colonyheader = ["", "Male", "Female", "TOTAL"]

export const printOther = (data: any[],c:Contractor | undefined, w: Workorder | undefined,  type: string, total : number) => {

    const types = type === "CCM" ? ccmtypes : type === "LRF" ? lrftypes : colonytypes
    const headers = type === "CCM" ? cccmheader : type === "LRF" ? lrfheader : colonyheader


     const tableRows: any = []
      const cheaders = [
    "Contractor Id", "Contractor Name", "Mobile Number", "Office Address", 
 ]
 tableRows.push(cheaders)
 const contractor = [c?.contractorId || "-", c?.contractorname || "-", c?.mobilenumber || "-", c?.officeaddress || "-"]
    tableRows.push(contractor)

    tableRows.push([""])
    tableRows.push(["Service Detail : "])

    const wheaders = ["Work Order", "Nature of Work", "Location", "Invoice Month", "Start Date", "End Date"]
    tableRows.push(wheaders)

    const workorder = [w?.id || "-", w?.nature || "-", w?.location || "-", dayjs(w?.startDate, "DD/MM/YYYY").format("MM/YYYY") || "-", w?.startDate || "-", w?.endDate || "-"]
    tableRows.push(workorder)

    tableRows.push([""])
    
    tableRows.push(["Department: ", type])
    
    tableRows.push([""])
    tableRows.push(headers)
    data.forEach((item: any) => {
      tableRows.push([
        types.map((type: string) => item[type] as string),
      
      ]);
    });
    tableRows.push([""])
     tableRows.push(["Net Amount Payable", "", "", "", "", total.toString()])
    tableRows.push(["GST Hold", "", "", "", "", total.toString()])
    tableRows.push(["Safety Voilation's Penality", "", "", "", "", total.toString()])
    tableRows.push(["Consumables / Rechargeable Items", "", "", "", "", total.toString()])
    tableRows.push(["Adjustments of Advance Amount", "", "", "", "", total.toString()])
    tableRows.push(["Any Other Deductions", "", "", "", "", total.toString()])
    tableRows.push(["Final Payable", "", "", "", "", total.toString()])
    const csvContent = `${tableRows.map((row:any) => row.join(",")).join("\n")}`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}