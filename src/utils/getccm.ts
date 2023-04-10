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
    const ele = getCount(filtered, "8MW");
    const lco = getCount(filtered, "8MW");
    const tman = getCount(filtered, "20MW");
    const filter = getCount(filtered, "20WM");
    const po = getCount(filtered, "DM Plant");
    const bco = getCount(filtered, "QC");
    const srfilter = getCount(filtered, "STORE");
    const incharge = getCount(filtered, "K-7 & 1-6PROC");
    const mo = getCount(filtered, "K-7 & 1-6PROC");
    const shiftinch = getCount(filtered, "RHMS");
    const gc = getCount(filtered, "PS");
    const tmesson = getCount(filtered, "HK & Garden");
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
        totalOvertime.ele += Number(item.manualovertime);
      }
      if (item.designation === "LCO") {
        totalOvertime.lco += Number(item.manualovertime);
      }

      if (item.designation === "TMAN") {
        totalOvertime.tman += Number(item.manualovertime);
      }
      if (item.designation === "PO") {
        totalOvertime.po += Number(item.manualovertime);
      }
      if (item.designation === "BCO") {
        totalOvertime.bco += Number(item.manualovertime);
      }
      if (item.designation === "SRFILTER") {
        totalOvertime.srfilter += Number(item.manualovertime);
      }
      if (item.designation === "INCHARGE") {
        totalOvertime.incharge += Number(item.manualovertime);
      }
      if (item.designation === "MO") {
        totalOvertime.mo += Number(item.manualovertime);
      }
      if (item.designation === "SHIFTINCH") {
        totalOvertime.shiftinch += Number(item.manualovertime);
      }
      if (item.designation === "GC") {
        totalOvertime.gc += Number(item.manualovertime);
      }
      if (item.designation === "TMESSON") {
        totalOvertime.tmesson += Number(item.manualovertime);
      }
      if (item.designation === "SVR") {
        totalOvertime.svr += Number(item.manualovertime);
      }
      if (item.designation === "SBO") {
        totalOvertime.sbo += Number(item.manualovertime);
      }
      if (item.designation === "LMES") {
        totalOvertime.lmes += Number(item.manualovertime);
      }
      if (item.designation === "LMAN") {
        totalOvertime.lman += Number(item.manualovertime);
      }
      if (item.designation === "FORMAN") {
        totalOvertime.forman += Number(item.manualovertime);
      }
      if (item.designation === "JRELE") {
        totalOvertime.jrele += Number(item.manualovertime);
      }
      if (item.designation === "HELPER") {
        totalOvertime.helper += Number(item.manualovertime);
      }

      totalOvertime.total += Number(item.manualovertime);
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

 
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const rows: Data[] = [];

    for (let i = startDate.getDate(); i <= endDate.getDate(); i++) {
      const date = `${i.toString().padStart(2, "0")}-${month
        .toString()
        .padStart(2, "0")}-${year}`;
      rows.push(getData(date));
    }

    const totalAttendance = getTotalAttendanceRecord(rows as Data[]);
    rows.push(totalAttendance);
    const l = rows.length - 1;
    const rates = {
      date: "Rate",
      ele: 31500 / l,
      lco: 20000 / l,
      tman: 19000 / l,
      filter: 21500 / l,
      po: 16000 / l,
      bco: 17000 / l,
      srfilter: 26500 / l,
      incharge: 26500 / l,
      mo: 21400 / l,
      shiftinch: 19500 / l,
      gc: 17000 / l,
      tmesson: 18000 / l,
      svr: 18000 / l,
      sbo: 18000 / l,
      lmes: 18000 / l,
      lman: 18000 / l,
      forman: 18000 / l,
      jrele: 18000 / l,
      helper: 18000 / l,
      total: 0,
    };
    rows.push(rates);
    const Amount = getAmount(totalAttendance, rates);
    rows.push(Amount);

    const data = timekeeper.filter((entry) => {
      const entryMonth = parseInt(entry.attendancedate.split("-")[1]);
      const entryYear = parseInt(entry.attendancedate.split("-")[2]);
      return entryMonth === month && entryYear === year;
    });

    const totalOvertime = getTotalOvertimeRecord(data);
    rows.push(totalOvertime);

    const totalOtAmount = getTotalOtAmount(totalOvertime, rates);
    rows.push(totalOtAmount);

    const totalAmount = getTotalAmount(Amount, totalOtAmount);
    rows.push(totalAmount);

    

    return {rows, totalAmount, totalOtAmount, Amount, rates, totalAttendance, total1 : totalAmount.total};

}
