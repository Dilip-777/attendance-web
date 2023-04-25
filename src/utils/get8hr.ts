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

  const otrate = timekeeper.length > 0 && timekeeper[0].department === "8HR" ? 8: 12

  

const getCount = (
    data: TimeKeeper[],
    designation: string,
    gender: string,
    extra: string
  ) => {
    return data.filter(
      (item) => item.designation === designation && (item.gender === gender || item.gender === extra )
    ).length;
  };

  const getData = (date: string): Data => {
    const filtered = timekeeper.filter((item) => item.attendancedate === date);
    const m8 = getCount(filtered, "8MW", "Male", "M");
    const f8 = getCount(filtered, "8MW", "Female", "F");
    const m20 = getCount(filtered, "20MW", "Male", "M");
    const f20 = getCount(filtered, "20WM", "Female", "F");
    const dm = getCount(filtered, "DM Plant", "Male", "M");
    const qc = getCount(filtered, "QC", "Male", "M");
    const store = getCount(filtered, "STORE", "Male", "M");
    const k7m = getCount(filtered, "K-7 & 1-6PROC", "Male", "M");
    const k7f = getCount(filtered, "K-7 & 1-6PROC", "Female", "F");
    const rmhs = getCount(filtered, "RHMS", "Male", "M");
    const ps = getCount(filtered, "PS", "Female", "F");
    const hk = getCount(filtered, "HK & Garden", "Male", "M");
    const svr = getCount(filtered, "SVR", "Male", "M");
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
        item.gender === "Male"  || item.gender === "M"
          ? (totalOvertime.m8 += Number(item.manualovertime  || item.overtime))
          : (totalOvertime.f8 += Number(item.manualovertime || item.overtime));
      }
      if (item.designation === "20MW") {
        item.gender === "Male"  || item.gender === "M"
          ? (totalOvertime.m20 += Number(item.manualovertime || item.overtime))
          : (totalOvertime.f20 += Number(item.manualovertime || item.overtime));
      }
      if (item.designation === "DM Plant") {
        totalOvertime.dm += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "QC") {
        totalOvertime.qc += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "STORE") {
        totalOvertime.store += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "K-7 & 1-6PROC") {
        item.gender === "Male"  || item.gender === "M"
          ? (totalOvertime.k7m += Number(item.manualovertime || item.overtime))
          : (totalOvertime.k7f += Number(item.manualovertime || item.overtime));
      }
      if (item.designation === "RHMS") {
        totalOvertime.rmhs += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "PS") {
        totalOvertime.ps += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "HK & Garden") {
        totalOvertime.hk += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "SVR") {
        totalOvertime.svr += Number(item.manualovertime || item.overtime);
      }
      totalOvertime.total += Number(item.manualovertime || item.overtime);
    });
    return totalOvertime;
  }

  const getAmount = (totalAttendance: Data, rate: Data) => {
    const totalAmount: Data = {
      date: "Total Amount",
      m8: Math.floor(totalAttendance.m8 * rate.m8),
      f8: Math.floor(totalAttendance.f8 * rate.f8),
      m20: Math.floor(totalAttendance.m20 * rate.m20),
      f20: Math.floor(totalAttendance.f20 * rate.f20),
      dm: Math.floor(totalAttendance.dm * rate.dm),
      qc: Math.floor(totalAttendance.qc * rate.qc),
      store: Math.floor(totalAttendance.store * rate.store),
      k7m: Math.floor(totalAttendance.k7m * rate.k7m),
      k7f: Math.floor(totalAttendance.k7f * rate.k7f),
      rmhs: Math.floor(totalAttendance.rmhs * rate.rmhs),
      ps: Math.floor(totalAttendance.ps * rate.ps),
      hk: Math.floor(totalAttendance.hk * rate.hk),
      svr: Math.floor(totalAttendance.svr * rate.svr),
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
      m8: Math.floor((totalOvertime.m8 * rate.m8) / otrate),
      f8: Math.floor((totalOvertime.f8 * rate.f8) / otrate),
      m20: Math.floor((totalOvertime.m20 * rate.m20) / otrate),
      f20: Math.floor((totalOvertime.f20 * rate.f20) / otrate),
      dm: Math.floor((totalOvertime.dm * rate.dm) / otrate),
      qc: Math.floor((totalOvertime.qc * rate.qc) / otrate),
      store: Math.floor((totalOvertime.store * rate.store) / otrate),
      k7m: Math.floor((totalOvertime.k7m * rate.k7m) / otrate),
      k7f: Math.floor((totalOvertime.k7f * rate.k7f) / otrate),
      rmhs: Math.floor((totalOvertime.rmhs * rate.rmhs) / otrate),
      ps: Math.floor((totalOvertime.ps * rate.ps) / otrate),
      hk: Math.floor((totalOvertime.hk * rate.hk) / otrate),
      svr: Math.floor((totalOvertime.svr * rate.svr) / otrate),
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
      m8: Math.floor(cp.m8 * totalAttendance.m8),
      f8: Math.floor(cp.f8 * totalAttendance.f8),
      m20: Math.floor(cp.m20 * totalAttendance.m20),
      f20: Math.floor(cp.f20 * totalAttendance.f20),
      dm: Math.floor(cp.dm * totalAttendance.dm),
      qc: Math.floor(cp.qc * totalAttendance.qc),
      store: Math.floor(cp.store * totalAttendance.store),
      k7m: Math.floor(cp.k7m * totalAttendance.k7m),
      k7f: Math.floor(cp.k7f * totalAttendance.k7f),
      rmhs: Math.floor(cp.rmhs * totalAttendance.rmhs),
      ps: Math.floor(cp.ps * totalAttendance.ps),
      hk: Math.floor(cp.hk * totalAttendance.hk),
      svr: Math.floor(cp.svr * totalAttendance.svr),
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
       const taxable:  Data = {

            date: "Taxable",
            m8: totalAmount.m8 + cpAmount.m8,
            f8: totalAmount.f8 + cpAmount.f8,
            m20: totalAmount.m20 + cpAmount.m20,
            f20: totalAmount.f20 + cpAmount.f20,
            dm: totalAmount.dm + cpAmount.dm,
            qc: totalAmount.qc + cpAmount.qc,
            store: totalAmount.store + cpAmount.store,
            k7m: totalAmount.k7m + cpAmount.k7m,
            k7f: totalAmount.k7f + cpAmount.k7f,
            rmhs: totalAmount.rmhs + cpAmount.rmhs,
            ps: totalAmount.ps + cpAmount.ps,

            hk: totalAmount.hk + cpAmount.hk, 
            svr: totalAmount.svr + cpAmount.svr,
            total: totalAmount.total + cpAmount.total,

       }
        return taxable;
   }

   const getGst = (taxable: Data) => {
      const gst: Data = {
        date: "GST",
        m8: Math.floor(taxable.m8 * 0.18),
        f8: Math.floor(taxable.f8 * 0.18),
        m20: Math.floor(taxable.m20 * 0.18),
        f20: Math.floor(taxable.f20 * 0.18),
        dm: Math.floor(taxable.dm * 0.18),
        qc: Math.floor(taxable.qc * 0.18),
        store: Math.floor(taxable.store * 0.18),
        k7m: Math.floor(taxable.k7m * 0.18),
        k7f: Math.floor(taxable.k7f * 0.18),
        rmhs: Math.floor(taxable.rmhs * 0.18),
        ps: Math.floor(taxable.ps * 0.18),
        hk: Math.floor(taxable.hk * 0.18),
        svr: Math.floor(taxable.svr * 0.18),
        total: Math.floor(taxable.total * 0.18),
      }
      return gst;
   }

   const getBillAmount  = (taxable: Data, gst: Data) => {
      const billAmount: Data = {
        date: "Bill Amount",
        m8: taxable.m8 + gst.m8,
        f8: taxable.f8 + gst.f8,
        m20: taxable.m20 + gst.m20,
        f20: taxable.f20 + gst.f20,
        dm: taxable.dm + gst.dm,
        qc: taxable.qc + gst.qc,
        store: taxable.store + gst.store,
        k7m: taxable.k7m + gst.k7m,
        k7f: taxable.k7f + gst.k7f,
        rmhs: taxable.rmhs + gst.rmhs,
        ps: taxable.ps + gst.ps,
        hk: taxable.hk + gst.hk,
        svr: taxable.svr + gst.svr,
        total: taxable.total + gst.total,
      }
      return billAmount;
   }

   const getTds = (taxable: Data) => {
      const tds: Data = {
        date: "TDS",
        m8: Math.floor(taxable.m8 * 0.01),
        f8: Math.floor(taxable.f8 * 0.01),
        m20: Math.floor(taxable.m20 * 0.01),
        f20: Math.floor(taxable.f20 * 0.01),
        dm: Math.floor(taxable.dm * 0.01),
        qc: Math.floor(taxable.qc * 0.01),
        store: Math.floor(taxable.store * 0.01),
        k7m: Math.floor(taxable.k7m * 0.01),
        k7f: Math.floor(taxable.k7f * 0.01),
        rmhs: Math.floor(taxable.rmhs * 0.01),
        ps: Math.floor(taxable.ps * 0.01),
        hk: Math.floor(taxable.hk * 0.01),
        svr: Math.floor(taxable.svr * 0.01),
        total: Math.floor(taxable.total * 0.01),
      }
      return tds;

   }

   const getNetPayable = (billAmount: Data, tds: Data) => {
      const netPayable: Data = {
        date: "Net Payable",
        m8: billAmount.m8 + tds.m8,
        f8: billAmount.f8 + tds.f8,
        m20: billAmount.m20 + tds.m20,
        f20: billAmount.f20 + tds.f20,
        dm: billAmount.dm + tds.dm,
        qc: billAmount.qc + tds.qc,
        store: billAmount.store + tds.store,
        k7m: billAmount.k7m + tds.k7m,
        k7f: billAmount.k7f + tds.k7f,
        rmhs: billAmount.rmhs + tds.rmhs,
        ps: billAmount.ps + tds.ps,
        hk: billAmount.hk + tds.hk,
        svr: billAmount.svr + tds.svr,
        total: billAmount.total + tds.total,
      }
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
    rows1.push({ ...totalAttendance, date: "Total Man days"})
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
    rows1.push(rates)
    rows1.push(Amount)

    // const data = timekeeper.filter((item) => item.attendancedate === date);

    const totalOvertime = getTotalOvertimeRecord(timekeeper);
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
    rows1.push(cp)

    const cpAmount = getCPAmount(cp, totalAttendance);
    rows.push(cpAmount);
    rows1.push(cpAmount)

    const taxable = getTaxable(totalAmount, cpAmount);
    rows1.push(taxable);
   
    const gst = getGst(taxable);
    rows1.push(gst);
     
    const billAmount = getBillAmount(taxable, gst);
    rows1.push(billAmount);

    const tds = getTds(taxable);
    rows1.push(tds);

    const netPayable = getNetPayable(billAmount, tds);
    rows1.push(netPayable);




    

    return { rows, totalAmount, totalOtAmount, totalAttendance, Amount, total1: totalAmount.total + cpAmount.total, rows1, totalnetPayable: netPayable.total};




  }

  export default getTotalAmountAndRows