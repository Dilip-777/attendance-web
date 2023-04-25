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
}


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
        totalOvertime.ele += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "JRFILTER") {
        totalOvertime.filter += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "SRFILTER") {
        totalOvertime.srfilter += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "SVR") {
        totalOvertime.svr += Number(item.manualovertime || item.overtime);
      }

      if (item.designation === "LMES") {
        totalOvertime.lmes += Number(item.manualovertime || item.overtime);
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
      filter: totalAttendance.filter * rate.filter,
      srfilter: totalAttendance.srfilter * rate.srfilter,
      svr: totalAttendance.svr * rate.svr,
      lmes: totalAttendance.lmes * rate.lmes,
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
      ele: Math.floor((totalOvertime.ele * rate.ele) / 8),
      filter: Math.floor((totalOvertime.filter * rate.filter) / 8),
      srfilter: Math.floor((totalOvertime.srfilter * rate.srfilter) / 8),
      svr: Math.floor((totalOvertime.svr * rate.svr) / 8),
      lmes: Math.floor((totalOvertime.lmes * rate.lmes) / 8),
      helper: Math.floor((totalOvertime.helper * rate.helper) / 8),
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

  const getGST = (totalAmount: Data) => {
    const gstAmount: Data = {
      date: "GST",
      ele: Math.floor(totalAmount.ele * 0.18),
      filter: Math.floor(totalAmount.filter * 0.18),
      srfilter: Math.floor(totalAmount.srfilter * 0.18),
      svr: Math.floor(totalAmount.svr * 0.18),
      lmes: Math.floor(totalAmount.lmes * 0.18),
      helper: Math.floor(totalAmount.helper * 0.18),
      total: Math.floor(totalAmount.total * 0.18),
    };
    return gstAmount;
  }

  const getBillAmount = (totalAmount: Data, gstAmount: Data) => {
    const billAmount: Data = {
      date: "Bill Amount",
      ele: totalAmount.ele + gstAmount.ele,
      filter: totalAmount.filter + gstAmount.filter,
      srfilter: totalAmount.srfilter + gstAmount.srfilter,
      svr: totalAmount.svr + gstAmount.svr,
      lmes: totalAmount.lmes + gstAmount.lmes,
      helper: totalAmount.helper + gstAmount.helper,
      total: totalAmount.total + gstAmount.total,
    };
    return billAmount;
  }

  const getTds = (totalAmount: Data) => {
    const tdsAmount: Data = {
      date: "TDS",
      ele: Math.floor(totalAmount.ele * 0.01),
      filter: Math.floor(totalAmount.filter * 0.01),
      srfilter: Math.floor(totalAmount.srfilter * 0.01),
      svr: Math.floor(totalAmount.svr * 0.01),
      lmes: Math.floor(totalAmount.lmes * 0.01),
      helper: Math.floor(totalAmount.helper * 0.01),
      total: Math.floor(totalAmount.total * 0.01),
    };
    return tdsAmount;
  }

  const getNetPayable = (billAmount: Data, tdsAmount: Data) => {
    const netPayable: Data = {
      date: "Net Payable",
      ele: Math.floor(billAmount.ele + tdsAmount.ele),
      filter: Math.floor(billAmount.filter + tdsAmount.filter),
      srfilter: Math.floor(billAmount.srfilter + tdsAmount.srfilter),
      svr: Math.floor(billAmount.svr + tdsAmount.svr),
      lmes: Math.floor(billAmount.lmes + tdsAmount.lmes),
      helper: Math.floor(billAmount.helper + tdsAmount.helper),
      total: Math.floor(billAmount.total + tdsAmount.total),
    };
    return netPayable;
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
    rows1.push({...totalAttendance, date: "Total Man Days"})
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
    rows1.push(totalAmount)

    const gstAmount = getGST(totalAmount);
    rows1.push(gstAmount)

    const billAmount = getBillAmount(totalAmount, gstAmount);
    rows1.push(billAmount)

    const tds = getTds(billAmount);
    rows1.push(tds)

    const netPayable = getNetPayable(billAmount, tds);
    rows1.push(netPayable)

    return { rows, totalAttendance, rates, totalOvertime, totalOtAmount, totalAmount, Amount, total1: totalAmount.total, rows1, totalnetPayable: netPayable.total};  
}