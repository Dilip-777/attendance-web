import { TimeKeeper } from "@prisma/client";

interface Column {
  id:
    | "date"
    | "m8"
    | "f8"
    | "m20"
    | "f20"
    | "dm"
    | "qc"
    | "store"
    | "k7m"
    | "k7f"
    | "rmhs"
    | "ps"
    | "hk"
    | "svr"
    | "total";
  label: string;
  border?: boolean;
  minWidth?: number;
  align?: "right" | "center" | "left";
  format?: (value: number) => string;
}

interface Data {
  date: string;
  m8: number;
  f8: number;
  m20: number;
  f20: number;
  dm: number;
  qc: number;
  store: number;
  k7m: number;
  k7f: number;
  rmhs: number;
  ps: number;
  hk: number;
  svr: number;
  total: number;
}

const getTotalAmountAndRows = (timekeeper: TimeKeeper[], month: number, year: number) => {



const getCount = (
    data: TimeKeeper[],
    designation: string,
    gender: string
  ) => {
    return data.filter(
      (item) => item.designation === designation && item.gender === gender
    ).length;
  };

  const getData = (date: string): Data => {
    const filtered = timekeeper.filter((item) => item.attendancedate === date);
    const m8 = getCount(filtered, "8MW", "Male");
    const f8 = getCount(filtered, "8MW", "Female");
    const m20 = getCount(filtered, "20MW", "Male");
    const f20 = getCount(filtered, "20WM", "Female");
    const dm = getCount(filtered, "DM Plant", "Male");
    const qc = getCount(filtered, "QC", "Male");
    const store = getCount(filtered, "STORE", "Male");
    const k7m = getCount(filtered, "K-7 & 1-6PROC", "Male");
    const k7f = getCount(filtered, "K-7 & 1-6PROC", "Female");
    const rmhs = getCount(filtered, "RHMS", "Male");
    const ps = getCount(filtered, "PS", "Female");
    const hk = getCount(filtered, "HK & Garden", "Male");
    const svr = getCount(filtered, "SVR", "Male");
    const total =
      m8 + f8 + m20 + f20 + dm + qc + store + k7m + k7f + rmhs + ps + hk + svr;
    return {
      date,
      m8,
      f8,
      m20,
      f20,
      dm,
      qc,
      store,
      k7m,
      k7f,
      rmhs,
      ps,
      hk,
      svr,
      total,
    };
  };

  function getTotalAttendanceRecord(rows: Data[]): Data {
    const totalAttendance: Data = {
      date: "Total Attendance",
      m8: 0,
      f8: 0,
      m20: 0,
      f20: 0,
      dm: 0,
      qc: 0,
      store: 0,
      k7m: 0,
      k7f: 0,
      rmhs: 0,
      ps: 0,
      hk: 0,
      svr: 0,
      total: 0,
    };
    rows.forEach((row) => {
      totalAttendance.m8 += row.m8;
      totalAttendance.f8 += row.f8;
      totalAttendance.m20 += row.m20;
      totalAttendance.f20 += row.f20;
      totalAttendance.dm += row.dm;
      totalAttendance.qc += row.qc;
      totalAttendance.k7m += row.k7m;
      totalAttendance.k7f += row.k7f;
      totalAttendance.rmhs += row.rmhs;
      totalAttendance.ps += row.ps;
      totalAttendance.hk += row.hk;
      totalAttendance.svr += row.svr;
      totalAttendance.total += row.total;
    });

    return totalAttendance;
  }


  function getTotalOvertimeRecord(data: TimeKeeper[]): Data {
    const totalOvertime: Data = {
      date: "Total Overtime",
      m8: 0,
      f8: 0,
      m20: 0,
      f20: 0,
      dm: 0,
      qc: 0,
      store: 0,
      k7m: 0,
      k7f: 0,
      rmhs: 0,
      ps: 0,
      hk: 0,
      svr: 0,
      total: 0,
    };

    data.forEach((item) => {
      if (item.designation === "8MW") {
        item.gender === "Male"
          ? (totalOvertime.m8 += Number(item.manualovertime))
          : (totalOvertime.f8 += Number(item.manualovertime));
      }
      if (item.designation === "20MW") {
        item.gender === "Male"
          ? (totalOvertime.m20 += Number(item.manualovertime))
          : (totalOvertime.f20 += Number(item.manualovertime));
      }
      if (item.designation === "DM Plant") {
        totalOvertime.dm += Number(item.manualovertime);
      }
      if (item.designation === "QC") {
        totalOvertime.qc += Number(item.manualovertime);
      }
      if (item.designation === "STORE") {
        totalOvertime.store += Number(item.manualovertime);
      }
      if (item.designation === "K-7 & 1-6PROC") {
        item.gender === "Male"
          ? (totalOvertime.k7m += Number(item.manualovertime))
          : (totalOvertime.k7f += Number(item.manualovertime));
      }
      if (item.designation === "RHMS") {
        totalOvertime.rmhs += Number(item.manualovertime);
      }
      if (item.designation === "PS") {
        totalOvertime.ps += Number(item.manualovertime);
      }
      if (item.designation === "HK & Garden") {
        totalOvertime.hk += Number(item.manualovertime);
      }
      if (item.designation === "SVR") {
        totalOvertime.svr += Number(item.manualovertime);
      }
      totalOvertime.total += Number(item.manualovertime);
    });
    return totalOvertime;
  }

  const getAmount = (totalAttendance: Data, rate: Data) => {
    const totalAmount: Data = {
      date: "Total Amount",
      m8: totalAttendance.m8 * rate.m8,
      f8: totalAttendance.f8 * rate.f8,
      m20: totalAttendance.m20 * rate.m20,
      f20: totalAttendance.f20 * rate.f20,
      dm: totalAttendance.dm * rate.dm,
      qc: totalAttendance.qc * rate.qc,
      store: totalAttendance.store * rate.store,
      k7m: totalAttendance.k7m * rate.k7m,
      k7f: totalAttendance.k7f * rate.k7f,
      rmhs: totalAttendance.rmhs * rate.rmhs,
      ps: totalAttendance.ps * rate.ps,
      hk: totalAttendance.hk * rate.hk,
      svr: totalAttendance.svr * rate.svr,
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
      m8: (totalOvertime.m8 * rate.m8) / 12,
      f8: (totalOvertime.f8 * rate.f8) / 12,
      m20: (totalOvertime.m20 * rate.m20) / 12,
      f20: (totalOvertime.f20 * rate.f20) / 12,
      dm: (totalOvertime.dm * rate.dm) / 12,
      qc: (totalOvertime.qc * rate.qc) / 12,
      store: (totalOvertime.store * rate.store) / 12,
      k7m: (totalOvertime.k7m * rate.k7m) / 12,
      k7f: (totalOvertime.k7f * rate.k7f) / 12,
      rmhs: (totalOvertime.rmhs * rate.rmhs) / 12,
      ps: (totalOvertime.ps * rate.ps) / 12,
      hk: (totalOvertime.hk * rate.hk) / 12,
      svr: (totalOvertime.svr * rate.svr) / 12,
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
      m8: totalAmount.m8 + totalOtAmount.m8,
      f8: totalAmount.f8 + totalOtAmount.f8,
      m20: totalAmount.m20 + totalOtAmount.m20,
      f20: totalAmount.f20 + totalOtAmount.f20,
      dm: totalAmount.dm + totalOtAmount.dm,
      qc: totalAmount.qc + totalOtAmount.qc,
      store: totalAmount.store + totalOtAmount.store,
      k7m: totalAmount.k7m + totalOtAmount.k7m,
      k7f: totalAmount.k7f + totalOtAmount.k7f,
      rmhs: totalAmount.rmhs + totalOtAmount.rmhs,
      ps: totalAmount.ps + totalOtAmount.ps,
      hk: totalAmount.hk + totalOtAmount.hk,
      svr: totalAmount.svr + totalOtAmount.svr,
      total: totalAmount.total + totalOtAmount.total,
    };
    return netAmount;
  };

  const getCPAmount = (cp: Data, totalAttendance: Data) => {
    const cpAmount: Data = {
      date: "CP Amount",
      m8: cp.m8 * totalAttendance.m8,
      f8: cp.f8 * totalAttendance.f8,
      m20: cp.m20 * totalAttendance.m20,
      f20: cp.f20 * totalAttendance.f20,
      dm: cp.dm * totalAttendance.dm,
      qc: cp.qc * totalAttendance.qc,
      store: cp.store * totalAttendance.store,
      k7m: cp.k7m * totalAttendance.k7m,
      k7f: cp.k7f * totalAttendance.k7f,
      rmhs: cp.rmhs * totalAttendance.rmhs,
      ps: cp.ps * totalAttendance.ps,
      hk: cp.hk * totalAttendance.hk,
      svr: cp.svr * totalAttendance.svr,
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


    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const rows: Data[] = [];

    for (let i = startDate.getDate(); i <= endDate.getDate(); i++) {
      const date = `${i.toString().padStart(2, "0")}/${month
        .toString()
        .padStart(2, "0")}/${year}`;
      rows.push(getData(date));
    }

    const totalAttendance = getTotalAttendanceRecord(rows as Data[]);
    rows.push(totalAttendance);
    const rates = {
      date: "Rate",
      m8: 325,
      f8: 305,
      m20: 325,
      f20: 305,
      dm: 325,
      qc: 325,
      store: 325,
      k7m: 325,
      k7f: 305,
      rmhs: 325,
      ps: 305,
      hk: 325,
      svr: 365,
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

    const cp = {
      date: "CP",
      m8: 30.5,
      f8: 27.5,
      m20: 30.5,
      f20: 27.5,
      dm: 30.5,
      qc: 30.5,
      store: 30.5,
      k7m: 30.5,
      k7f: 27.5,
      rmhs: 30.5,
      ps: 27.5,
      hk: 30.5,
      svr: 34.5,
      total: 0,
    };
    rows.push(cp);

    const cpAmount = getCPAmount(cp, totalAttendance);
    rows.push(cpAmount);

    return { rows, totalAmount, totalOtAmount, totalAttendance, Amount, total1: totalAmount.total + cpAmount.total};




  }

  export default getTotalAmountAndRows