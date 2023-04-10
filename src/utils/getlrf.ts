import { TimeKeeper } from "@prisma/client";

interface Column {
  id:
    | "date"
    | "ele"
    | "filter"
    | "srfilter"
    | "svr"
    | "lmes"
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
  filter: number;
  srfilter: number;
  svr: number;
  lmes: number;
  helper: number;
  total: number;
}``


export default function getLRF(timekeeper: TimeKeeper[], month: number, year: number) {
      const getCount = (data: TimeKeeper[], designation: string) => {
    return data.filter((item) => item.designation === designation).length;
  };

  const getData = (date: string): Data => {
    const filtered = timekeeper.filter((item) => item.attendancedate === date);
    const ele = getCount(filtered, "ELE");
    const filter = getCount(filtered, "JRFILTER");
    const srfilter = getCount(filtered, "SRFILTER");
    const lmes = getCount(filtered, "LMES");
    const svr = getCount(filtered, "SVR");
    const helper = getCount(filtered, "HELPER");
    const total = ele + filter + srfilter + lmes + svr + helper;
    return {
      date,
      ele,
      filter,
      srfilter,
      svr,
      lmes,
      helper,
      total,
    };
  };

  function getTotalAttendanceRecord(rows: Data[]): Data {
    const totalAttendance = {
      date: "Total Attendance",
      ele: 0,
      filter: 0,
      srfilter: 0,
      lmes: 0,
      svr: 0,
      helper: 0,
      total: 0,
    };

    rows.forEach((row) => {
      totalAttendance.ele += row.ele;
      totalAttendance.filter += row.filter;
      totalAttendance.srfilter += row.srfilter;
      totalAttendance.svr += row.svr;
      totalAttendance.lmes += row.lmes;
      totalAttendance.helper += row.helper;
      totalAttendance.total += row.total;
    });

    return totalAttendance;
  }


  function getTotalOvertimeRecord(data: TimeKeeper[]): Data {
    const totalOvertime: Data = {
      date: "Total Overtime",
      ele: 0,
      filter: 0,
      srfilter: 0,
      svr: 0,
      lmes: 0,
      helper: 0,
      total: 0,
    };

    data.forEach((item) => {
      if (item.designation === "ELE") {
        totalOvertime.ele += Number(item.manualovertime);
      }
      if (item.designation === "JRFILTER") {
        totalOvertime.filter += Number(item.manualovertime);
      }
      if (item.designation === "SRFILTER") {
        totalOvertime.srfilter += Number(item.manualovertime);
      }
      if (item.designation === "SVR") {
        totalOvertime.svr += Number(item.manualovertime);
      }

      if (item.designation === "LMES") {
        totalOvertime.lmes += Number(item.manualovertime);
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
      filter: totalAttendance.filter * rate.filter,
      srfilter: totalAttendance.srfilter * rate.srfilter,
      lmes: totalAttendance.lmes * rate.lmes,
      svr: totalAttendance.svr * rate.svr,
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
      filter: (totalOvertime.filter * rate.filter) / 8,
      srfilter: (totalOvertime.srfilter * rate.srfilter) / 8,
      lmes: (totalOvertime.lmes * rate.lmes) / 8,
      svr: (totalOvertime.svr * rate.svr) / 8,
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
      filter: totalAmount.filter + totalOtAmount.filter,
      srfilter: totalAmount.srfilter + totalOtAmount.srfilter,
      svr: totalAmount.svr + totalOtAmount.svr,
      lmes: totalAmount.lmes + totalOtAmount.lmes,
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

    

    return { rows, totalAttendance, rates, totalOvertime, totalOtAmount, totalAmount, Amount, total1: totalAmount.total};
  

  
}