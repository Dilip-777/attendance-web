import { TimeKeeper } from "@prisma/client";

interface Column {
  id: "date" | "m" | "f" | "total";
  label: string;
  border?: boolean;
  minWidth?: number;
  align?: "right" | "center" | "left";
  format?: (value: number) => string;
}

interface Data {
  date: string;
  m: number;
  f: number;
  total: number;
}

export default function getColony(timekeeper: TimeKeeper[], month: number, year: number) {
     const getCount = (data: TimeKeeper[], gender: string, extra: string) => {
    return data.filter((item) => (item.gender?.toLowerCase() === gender || item.gender === extra)).length;
  };

  

  const getData = (date: string): Data => {
    const filtered = timekeeper.filter((item) => item.attendancedate === date);
    const m = getCount(filtered, "male", "M");
    const f = getCount(filtered, "female", "F");
    const total = m + f;
    return {
      date,
      m,
      f,
      total,
    };
  };

  function getTotalAttendanceRecord(rows: Data[]): Data {
    const totalAttendance: Data = {
      date: "Total Attendance",
      m: 0,
      f: 0,
      total: 0,
    };
    rows.forEach((row) => {
      totalAttendance.m += row.m;
      totalAttendance.f += row.f;
      totalAttendance.total += row.total;
    });

    return totalAttendance;
  }

  function getTotalOvertimeRecord(data: TimeKeeper[]): Data {
    const totalOvertime: Data = {
      date: "Total Overtime",
      m: 0,
      f: 0,
      total: 0,
    };

    data.forEach((item) => {
      if (item.gender?.toLowerCase() === "male" || item.gender === "M") {
        totalOvertime.m += Number(item.manualovertime || item.overtime);
      }
      if (item.gender?.toLowerCase() === "female", item.gender === "F") {
        totalOvertime.f += Number(item.manualovertime || item.overtime);
      }

      totalOvertime.total += Number(item.manualovertime || item.overtime);
    });
    return totalOvertime;
  }

  const getAmount = (totalAttendance: Data, rate: Data) => {
    const totalAmount: Data = {
      date: "Total Amount",
      m: totalAttendance.m * rate.m,
      f: totalAttendance.f * rate.f,

      total: 0,
    };
    const total = totalAmount.m + totalAmount.f;
    return {
      ...totalAmount,
      total,
    };
  };

  const getTotalOtAmount = (totalOvertime: Data, rate: Data) => {
    const totalAmount: Data = {
      date: "OT Amount",
      m: (totalOvertime.m * rate.m) / 8,
      f: (totalOvertime.f * rate.f) / 8,
      total: 0,
    };
    const total = totalAmount.m + totalAmount.f;
    return {
      ...totalAmount,
      total,
    };
  };

  const getTotalAmount = (totalAmount: Data, totalOtAmount: Data) => {
    const netAmount: Data = {
      date: "Total Amount",
      m: totalAmount.m + totalOtAmount.m,
      f: totalAmount.f + totalOtAmount.f,
      total: totalAmount.total + totalOtAmount.total,
    };
    return netAmount;
  };

  const getCPAmount = (cp: Data, totalAttendance: Data) => {
    const cpAmount: Data = {
      date: "CP Amount",
      m: cp.m * totalAttendance.m,
      f: cp.f * totalAttendance.f,
      total: 0,
    };
    const total = Object.values(cpAmount)
      .filter((value) => typeof value === "number")
      .reduce((a, b) => Number(a) + Number(b), 0);
    return {
      ...cpAmount,
      total,
    };
  };

  const getTaxable = (totalAmount: Data, cpAmount: Data) => {
    const taxable: Data = {
      date: "Taxable",
      m: totalAmount.m - cpAmount.m,
      f: totalAmount.f - cpAmount.f,
      total: totalAmount.total - cpAmount.total,
    };
    return taxable;
  }

  const getGst = (taxable: Data) => {
    const gst: Data = {
      date: "GST",
      m: taxable.m * 0.18,
      f: taxable.f * 0.18,
      total: taxable.total * 0.18,
    };
    return gst;
  }

  const getBillAmount = (taxable: Data, gst: Data) => {
    const billAmount: Data = {
      date: "Bill Amount",
      m: taxable.m + gst.m,
      f: taxable.f + gst.f,
      total: taxable.total + gst.total,
    };
    return billAmount;
  }

  const getTds = (taxable: Data) => {
    const tds: Data = {
      date: "TDS",
      m: taxable.m * 0.1,
      f: taxable.f * 0.1,
      total: taxable.total * 0.1,
    };
    return tds;
  }

  const getNetPayable = (billAmount: Data, tds: Data) => {
    const netPayable: Data = {
      date: "Net Payable",
      m: Math.floor(billAmount.m - tds.m),
      f: Math.floor(billAmount.f - tds.f),
      total: Math.floor(billAmount.total - tds.total),
    };
    return netPayable;
  }

//   async function getRows(month: number, year: number) {
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
    
    const rates = {
      date: "Rate",
      m: 365,
      f: 305,
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

    const cp = {
      date: "CP",
      m: 34.5,
      f: 27.5,
      total: 0,
    };
    rows.push(cp);
    rows1.push(cp)

    const cpAmount = getCPAmount(cp, totalAttendance);
    rows.push(cpAmount);
    rows1.push(cpAmount)

    const taxable = getTaxable(totalAmount, cpAmount);
    rows1.push(taxable)

    const gst = getGst(taxable);
    rows1.push(gst)

    const billAmount = getBillAmount(taxable, gst);
    rows1.push(billAmount)

    const tds = getTds(taxable);
    rows1.push(tds)

    const netPayable = getNetPayable(billAmount, tds);
    rows1.push(netPayable)

    return {rows, totalAmount, cpAmount, totalOvertime, totalOtAmount, Amount, totalAttendance,total1: totalAmount.total + cpAmount.total, rows1, totalnetPayable: netPayable.total};
}