import { TimeKeeper } from "@prisma/client";

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

export default function getCCM(timekeeper: TimeKeeper[], month: number, year: number) {
  
     const getCount = (data: TimeKeeper[], designation: string) => {
    return data.filter((item) => item.designation === designation).length;
  };

  const getData = (date: string): Data => {
    const filtered = timekeeper.filter((item) => item.attendancedate === date);
     const ele = getCount(filtered, "ELE");
    const lco = getCount(filtered, "LCO");
    const tman = getCount(filtered, "TMAN");
    const filter = getCount(filtered, "FILTER");
    const po = getCount(filtered, "PO");
    const bco = getCount(filtered, "BCO");
    const srfilter = getCount(filtered, "SRFILTER");
    const incharge = getCount(filtered, "INCHARGE");
    const mo = getCount(filtered, "MO");
    const shiftinch = getCount(filtered, "SHIFTINCH");
    const gc = getCount(filtered, "GC");
    const tmesson = getCount(filtered, "TMESSON");
    const svr = getCount(filtered, "SVR");
    const sbo = getCount(filtered, "SBO");
    const lmes = getCount(filtered, "LMES");
    const lman = getCount(filtered, "LMAN");
    const forman = getCount(filtered, "FORMAN");
    const jrele = getCount(filtered, "JR ELE");
    const helper = getCount(filtered, "HELPER");
    const total =
      ele +
      lco +
      tman +
      filter +
      po +
      bco +
      srfilter +
      incharge +
      mo +
      shiftinch +
      gc +
      tmesson +
      svr +
      sbo +
      lmes +
      lman +
      forman +
      jrele +
      helper;
    return {
      date,
      ele,
      lco,
      tman,
      filter,
      po,
      bco,
      srfilter,
      incharge,
      mo,
      shiftinch,
      gc,
      tmesson,
      svr,
      sbo,
      lmes,
      lman,
      forman,
      jrele,
      helper,
      total,
    };
  };

  function getTotalAttendanceRecord(rows: Data[]): Data {
    const totalAttendance = {
      date: "Total Attendance",
      ele: 0,
      lco: 0,
      tman: 0,
      filter: 0,
      po: 0,
      bco: 0,
      srfilter: 0,
      incharge: 0,
      mo: 0,
      shiftinch: 0,
      gc: 0,
      tmesson: 0,
      svr: 0,

      sbo: 0,
      lmes: 0,
      lman: 0,
      forman: 0,
      jrele: 0,
      helper: 0,
      total: 0,
    };

    rows.forEach((row) => {
      totalAttendance.ele += row.ele;
      totalAttendance.lco += row.lco;
      totalAttendance.tman += row.tman;
      totalAttendance.filter += row.filter;
      totalAttendance.po += row.po;
      totalAttendance.bco += row.bco;
      totalAttendance.srfilter += row.srfilter;
      totalAttendance.incharge += row.incharge;
      totalAttendance.mo += row.mo;
      totalAttendance.shiftinch += row.shiftinch;
      totalAttendance.gc += row.gc;
      totalAttendance.tmesson += row.tmesson;
      totalAttendance.svr += row.svr;
      totalAttendance.sbo += row.sbo;
      totalAttendance.lmes += row.lmes;
      totalAttendance.lman += row.lman;
      totalAttendance.forman += row.forman;
      totalAttendance.jrele += row.jrele;
      totalAttendance.helper += row.helper;
      totalAttendance.total += row.total;
    });

    return totalAttendance;
  }



  function getTotalOvertimeRecord(data: TimeKeeper[]): Data {
    const totalOvertime: Data = {
      date: "Total Overtime",
      ele: 0,
      lco: 0,
      tman: 0,
      filter: 0,
      po: 0,
      bco: 0,
      srfilter: 0,
      incharge: 0,
      mo: 0,
      shiftinch: 0,
      gc: 0,
      tmesson: 0,
      svr: 0,
      sbo: 0,
      lmes: 0,
      lman: 0,
      forman: 0,
      jrele: 0,
      helper: 0,
      total: 0,
    };

    data.forEach((item) => {
      if (item.designation === "ELE") {
        totalOvertime.ele += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "LCO") {
        totalOvertime.lco += Number(item.manualovertime || item.overtime);
      }

      if (item.designation === "TMAN") {
        totalOvertime.tman += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "PO") {
        totalOvertime.po += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "BCO") {
        totalOvertime.bco += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "SRFILTER") {
        totalOvertime.srfilter += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "INCHARGE") {
        totalOvertime.incharge += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "MO") {
        totalOvertime.mo += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "SHIFTINCH") {
        totalOvertime.shiftinch += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "GC") {
        totalOvertime.gc += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "TMESSON") {
        totalOvertime.tmesson += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "SVR") {
        totalOvertime.svr += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "SBO") {
        totalOvertime.sbo += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "LMES") {
        totalOvertime.lmes += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "LMAN") {
        totalOvertime.lman += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "FORMAN") {
        totalOvertime.forman += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "JRELE") {
        totalOvertime.jrele += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "HELPER") {
        totalOvertime.helper += Number(item.manualovertime || item.overtime);
      }

      totalOvertime.total += Number(item.manualovertime || item.overtime);
    });
    return totalOvertime;
  }

  const getAmount = (totalAttendance: Data, rate: Data) => {
    const totalAmount: Data = {
      date: "Total Amount",
      ele: totalAttendance.ele * rate.ele,
      lco: totalAttendance.lco * rate.lco,
      tman: totalAttendance.tman * rate.tman,
      filter: totalAttendance.filter * rate.filter,
      po: totalAttendance.po * rate.po,
      bco: totalAttendance.bco * rate.bco,
      srfilter: totalAttendance.srfilter * rate.srfilter,
      incharge: totalAttendance.incharge * rate.incharge,
      mo: totalAttendance.mo * rate.mo,
      shiftinch: totalAttendance.shiftinch * rate.shiftinch,
      gc: totalAttendance.gc * rate.gc,
      tmesson: totalAttendance.tmesson * rate.tmesson,
      svr: totalAttendance.svr * rate.svr,
      sbo: totalAttendance.sbo * rate.sbo,
      lmes: totalAttendance.lmes * rate.lmes,
      lman: totalAttendance.lman * rate.lman,
      forman: totalAttendance.forman * rate.forman,
      jrele: totalAttendance.jrele * rate.jrele,
      helper: totalAttendance.helper * rate.helper,
      total: 0,
    };
    const total = Object.values(totalAmount)
      .filter((value) => typeof value === "number")
      .reduce((a, b) => Number(a) + Number(b), 0);
    return {
      ...totalAmount,
      total,
    };
  };

  const getTotalOtAmount = (totalOvertime: Data, rate: Data) => {
    const totalAmount: Data = {
      date: "OT Amount",
      ele: (totalOvertime.ele * rate.ele) / 8,
      lco: (totalOvertime.lco * rate.lco) / 8,
      tman: (totalOvertime.tman * rate.tman) / 8,
      filter: (totalOvertime.filter * rate.filter) / 8,
      po: (totalOvertime.po * rate.po) / 8,
      bco: (totalOvertime.bco * rate.bco) / 8,
      srfilter: (totalOvertime.srfilter * rate.srfilter) / 8,
      incharge: (totalOvertime.incharge * rate.incharge) / 8,
      mo: (totalOvertime.mo * rate.mo) / 8,
      shiftinch: (totalOvertime.shiftinch * rate.shiftinch) / 8,
      gc: (totalOvertime.gc * rate.gc) / 8,
      tmesson: (totalOvertime.tmesson * rate.tmesson) / 8,
      svr: (totalOvertime.svr * rate.svr) / 8,
      sbo: (totalOvertime.sbo * rate.sbo) / 8,
      lmes: (totalOvertime.lmes * rate.lmes) / 8,
      lman: (totalOvertime.lman * rate.lman) / 8,
      forman: (totalOvertime.forman * rate.forman) / 8,
      jrele: (totalOvertime.jrele * rate.jrele) / 8,
      helper: (totalOvertime.helper * rate.helper) / 8,
      total: 0,
    };
    const total = Object.values(totalAmount)
      .filter((value) => typeof value === "number")
      .reduce((a, b) => Number(a) + Number(b), 0);
    return {
      ...totalAmount,
      total,
    };
  };

  const getTotalAmount = (totalAmount: Data, totalOtAmount: Data) => {
    const netAmount: Data = {
      date: "Total Amount",
      ele: totalAmount.ele + totalOtAmount.ele,
      lco: totalAmount.lco + totalOtAmount.lco,
      tman: totalAmount.tman + totalOtAmount.tman,
      filter: totalAmount.filter + totalOtAmount.filter,
      po: totalAmount.po + totalOtAmount.po,
      bco: totalAmount.bco + totalOtAmount.bco,
      srfilter: totalAmount.srfilter + totalOtAmount.srfilter,
      incharge: totalAmount.incharge + totalOtAmount.incharge,
      mo: totalAmount.mo + totalOtAmount.mo,
      shiftinch: totalAmount.shiftinch + totalOtAmount.shiftinch,
      gc: totalAmount.gc + totalOtAmount.gc,
      tmesson: totalAmount.tmesson + totalOtAmount.tmesson,
      svr: totalAmount.svr + totalOtAmount.svr,
      sbo: totalAmount.sbo + totalOtAmount.sbo,
      lmes: totalAmount.lmes + totalOtAmount.lmes,
      lman: totalAmount.lman + totalOtAmount.lman,
      forman: totalAmount.forman + totalOtAmount.forman,
      jrele: totalAmount.jrele + totalOtAmount.jrele,
      helper: totalAmount.helper + totalOtAmount.helper,
      total: totalAmount.total + totalOtAmount.total,
    };
    return netAmount;
  };

  const getGST = (taxable:Data) => {
    const gst: Data = {
      date: "GST",

      ele: Math.floor(taxable.ele * 0.18),
      lco: Math.floor(taxable.lco * 0.18),
      tman: Math.floor(taxable.tman * 0.18),
      filter: Math.floor(taxable.filter * 0.18),
      po: Math.floor(taxable.po * 0.18),
      bco: Math.floor(taxable.bco * 0.18),
      srfilter: Math.floor(taxable.srfilter * 0.18),
      incharge: Math.floor(taxable.incharge * 0.18),
      mo: Math.floor(taxable.mo * 0.18),
      shiftinch: Math.floor(taxable.shiftinch * 0.18),
      gc: Math.floor(taxable.gc * 0.18),
      tmesson: Math.floor(taxable.tmesson * 0.18),
      svr: Math.floor(taxable.svr * 0.18),
      sbo: Math.floor(taxable.sbo * 0.18),
      lmes: Math.floor(taxable.lmes * 0.18),
      lman: Math.floor(taxable.lman * 0.18),
      forman: Math.floor(taxable.forman * 0.18),
      jrele: Math.floor(taxable.jrele * 0.18),
      helper: Math.floor(taxable.helper * 0.18),
      total: Math.floor(taxable.total * 0.18),
    }
    return gst
  }


  const getBillAmount = (taxable: Data, gst: Data) => {
    const billAmount: Data = {
      date: "Bill Amount",
      ele: taxable.ele + gst.ele,
      lco: taxable.lco + gst.lco,
      tman: taxable.tman + gst.tman,
      filter: taxable.filter + gst.filter,
      po: taxable.po + gst.po,
      bco: taxable.bco + gst.bco,
      srfilter: taxable.srfilter + gst.srfilter,
      incharge: taxable.incharge + gst.incharge,
      mo: taxable.mo + gst.mo,
      shiftinch: taxable.shiftinch + gst.shiftinch,
      gc: taxable.gc + gst.gc,
      tmesson: taxable.tmesson + gst.tmesson,
      svr: taxable.svr + gst.svr,
      sbo: taxable.sbo + gst.sbo,
      lmes: taxable.lmes + gst.lmes,
      lman: taxable.lman + gst.lman,
      forman: taxable.forman + gst.forman,
      jrele: taxable.jrele + gst.jrele,
      helper: taxable.helper + gst.helper,
      total: taxable.total + gst.total,
    };
    return billAmount;
  }

  const getTds = (taxable: Data) => {
    const tds: Data = {
      date: "TDS",
      ele: Math.floor(taxable.ele * 0.01),
      lco: Math.floor(taxable.lco * 0.01),
      tman: Math.floor(taxable.tman * 0.01),
      filter: Math.floor(taxable.filter * 0.01),
      po: Math.floor(taxable.po * 0.01),
      bco: Math.floor(taxable.bco * 0.01),
      srfilter: Math.floor(taxable.srfilter * 0.01),
      incharge: Math.floor(taxable.incharge * 0.01),
      mo: Math.floor(taxable.mo * 0.01),
      shiftinch: Math.floor(taxable.shiftinch * 0.01),
      gc: Math.floor(taxable.gc * 0.01),
      tmesson: Math.floor(taxable.tmesson * 0.01),
      svr: Math.floor(taxable.svr * 0.01),
      sbo: Math.floor(taxable.sbo * 0.01),
      lmes: Math.floor(taxable.lmes * 0.01),
      lman: Math.floor(taxable.lman * 0.01),
      forman: Math.floor(taxable.forman * 0.01),
      jrele: Math.floor(taxable.jrele * 0.01),
      helper: Math.floor(taxable.helper * 0.01),
      total: Math.floor(taxable.total * 0.01),
    }
    return tds
  }

  const getNetPayable = (billAmount: Data, tds: Data) => {
    const netPayable: Data = {
      date: "Net Payable",
      ele: Math.floor(billAmount.ele + tds.ele),
      lco: Math.floor(billAmount.lco + tds.lco),
      tman: Math.floor(billAmount.tman + tds.tman),
      filter: Math.floor(billAmount.filter + tds.filter),
      po: Math.floor(billAmount.po + tds.po),
      bco: Math.floor(billAmount.bco + tds.bco),
      srfilter: Math.floor(billAmount.srfilter + tds.srfilter),
      incharge: Math.floor(billAmount.incharge + tds.incharge),
      mo: Math.floor(billAmount.mo + tds.mo),
      shiftinch: Math.floor(billAmount.shiftinch + tds.shiftinch),
      gc: Math.floor(billAmount.gc + tds.gc),
      tmesson: Math.floor(billAmount.tmesson + tds.tmesson),
      svr: Math.floor(billAmount.svr + tds.svr),
      sbo: Math.floor(billAmount.sbo + tds.sbo),
      lmes: Math.floor(billAmount.lmes + tds.lmes),
      lman: Math.floor(billAmount.lman + tds.lman),
      forman: Math.floor(billAmount.forman + tds.forman),
      jrele: Math.floor(billAmount.jrele + tds.jrele),
      helper: Math.floor(billAmount.helper + tds.helper),
      total: Math.floor(billAmount.total + tds.total),
    }
    return netPayable
  }

  



 
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const rows: Data[] = [];

    for (let i = startDate.getDate(); i <= endDate.getDate(); i++) {
      const date = `${i.toString().padStart(2, "0")}/${month
        .toString()
        .padStart(2, "0")}/${year}`;
      rows.push(getData(date));
    }

    const rows1: Data[] = [];

    const totalAttendance = getTotalAttendanceRecord(rows as Data[]);
    rows.push(totalAttendance);
    rows1.push({...totalAttendance, date: "Total Man days"})
    const l = rows.length - 1;
    const rates = {
      date: "Rate",
      ele: Math.floor(31500 / l),
      lco: Math.floor(20000 / l),
      tman: Math.floor(19000 / l),
      filter: Math.floor(21500 / l),
      po: Math.floor(16000 / l),
      bco: Math.floor(17000 / l),
      srfilter: Math.floor(26500 / l),
      incharge: Math.floor(26500 / l),
      mo: Math.floor(21400 / l),
      shiftinch: Math.floor(19500 / l),
      gc: Math.floor(17000 / l),
      tmesson: Math.floor(18000 / l),
      svr: Math.floor(18000 / l),
      sbo: Math.floor(18000 / l),
      lmes: Math.floor(18000 / l),
      lman: Math.floor(18000 / l),
      forman: Math.floor(18000 / l),
      jrele: Math.floor(18000 / l),
      helper: Math.floor(18000 / l),
      total: 0,
    };
    rows.push(rates);
    rows1.push(rates)
    const Amount = getAmount(totalAttendance, rates);
    rows.push(Amount);
    rows1.push(Amount)

    const data = timekeeper.filter((entry) => {
      const entryMonth = parseInt(entry.attendancedate.split("/")[1]);
      const entryYear = parseInt(entry.attendancedate.split("/")[2]);
      return entryMonth === month && entryYear === year;
    });

    const totalOvertime = getTotalOvertimeRecord(data);
    rows.push(totalOvertime);
    rows1.push(totalOvertime)

    const totalOtAmount = getTotalOtAmount(totalOvertime, rates);
    rows.push(totalOtAmount);
    rows1.push(totalOtAmount)

    const totalAmount = getTotalAmount(Amount, totalOtAmount);
    rows.push(totalAmount);
    rows1.push({...totalAmount, date: "Taxable"})

    const gst = getGST(totalAmount);
   rows1.push(gst)

   const billAmount = getBillAmount(totalAmount, gst);
    rows1.push(billAmount)
    

    const tds = getTds(totalAmount);
    rows1.push(tds)

    const netPayable = getNetPayable(billAmount, tds);
    rows1.push(netPayable)

    
    

    return {rows, totalAmount, totalOtAmount, Amount, rates, totalAttendance, total1 : totalAmount.total, rows1, totalnetPayable: netPayable.total};

}
