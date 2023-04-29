import { Designations, TimeKeeper } from "@prisma/client";
import _ from "lodash";

interface Column {
  id:
    | "date"
    | "m8mw"
    | "f8mw"
    | "m20mw"
    | "f20mw"
    | "mdmplant"
    | "mqc"
    | "mstore"
    | "mk7"
    | "fk7"
    | "mrmhs"
    | "fps"
    | "mhk"
    | "msvr"
    | "total";
  label: string;
  border?: boolean;
  minWidth?: number;
  align?: "right" | "center" | "left";
  format?: (value: number) => string;
}

interface Data {
  date: string;
  m8mw: number;
  f8mw: number;
  m20mw: number;
  f20mw: number;
  mdmplant: number;
  mqc: number;
  mstore: number;
  mk7: number;
  fk7: number;
  mrmhs: number;
  fps: number;
  mhk: number;
  msvr: number;
  total: number;
}

const getTotalAmountAndRows = (timekeeper: TimeKeeper[], month: number, year: number, designations: Designations[]) => {



  const otrate = timekeeper.length > 0 && timekeeper[0].department === "8HR" ? 8: 12

//   const getAttendanceCount = (
//     data: TimeKeeper[],
//     designation: Designations,
//     gender: string,
//     extra: string
//   ) => {
//     return data.filter(
//       (item) => item.designation === designation && (item.gender === gender || item.gender === extra )
//     ).length;
//   };

//     const rows2: any[] = []

  

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
    const m8mw = getCount(filtered, "8MW", "Male", "M");
    const f8mw = getCount(filtered, "8MW", "Female", "F");
    const m20mw = getCount(filtered, "20MW", "Male", "M");
    const f20mw = getCount(filtered, "20WM", "Female", "F");
    const mdmplant = getCount(filtered, "DM Plant", "Male", "M");
    const mqc = getCount(filtered, "QC", "Male", "M");
    const mstore = getCount(filtered, "STORE", "Male", "M");
    const mk7 = getCount(filtered, "K-7 & 1-6PROC", "Male", "M");
    const fk7 = getCount(filtered, "K-7 & 1-6PROC", "Female", "F");
    const mrmhs = getCount(filtered, "RHMS", "Male", "M");
    const fps = getCount(filtered, "PS", "Female", "F");
    const mhk = getCount(filtered, "HK & Garden", "Male", "M");
    const msvr = getCount(filtered, "SVR", "Male", "M");
    const total =
      m8mw + f8mw + m20mw + f20mw + mdmplant + mqc + mstore + mk7 + fk7 + mrmhs + fps + mhk + msvr;
    return {
      date,
      m8mw,
      f8mw,
      m20mw,
      f20mw,
      mdmplant,
      mqc,
      mstore,
      mk7,
      fk7,
      mrmhs,
      fps,
      mhk,
      msvr,
      total,
    };
  };

  function getTotalAttendanceRecord(rows: Data[]): Data {
    const totalAttendance: Data = {
      date: "Total Attendance",
      m8mw: 0,
      f8mw: 0,
      m20mw: 0,
      f20mw: 0,
      mdmplant: 0,
      mqc: 0,
      mstore: 0,
      mk7: 0,
      fk7: 0,
      mrmhs: 0,
      fps: 0,
      mhk: 0,
      msvr: 0,
      total: 0,
    };
    rows.forEach((row) => {
      totalAttendance.m8mw += row.m8mw;
      totalAttendance.f8mw += row.f8mw;
      totalAttendance.m20mw += row.m20mw;
      totalAttendance.f20mw += row.f20mw;
      totalAttendance.mdmplant += row.mdmplant;
      totalAttendance.mqc += row.mqc;
      totalAttendance.mk7 += row.mk7;
      totalAttendance.fk7 += row.fk7;
      totalAttendance.mrmhs += row.mrmhs;
      totalAttendance.fps += row.fps;
      totalAttendance.mhk += row.mhk;
      totalAttendance.msvr += row.msvr;
      totalAttendance.total += row.total;
    });

    return totalAttendance;
  }


  function getTotalOvertimeRecord(data: TimeKeeper[]): Data {
    const totalOvertime: Data = {
      date: "Total Overtime",
      m8mw: 0,
      f8mw: 0,
      m20mw: 0,
      f20mw: 0,
      mdmplant: 0,
      mqc: 0,
      mstore: 0,
      mk7: 0,
      fk7: 0,
      mrmhs: 0,
      fps: 0,
      mhk: 0,
      msvr: 0,
      total: 0,
    };

    

    data.forEach((item) => {
      if (item.designation === "8MW") {
        item.gender === "Male"  || item.gender === "M"
          ? (totalOvertime.m8mw += Number(item.manualovertime  || item.overtime))
          : (totalOvertime.f8mw += Number(item.manualovertime || item.overtime));
      }
      if (item.designation === "20MW") {
        item.gender === "Male"  || item.gender === "M"
          ? (totalOvertime.m20mw += Number(item.manualovertime || item.overtime))
          : (totalOvertime.f20mw += Number(item.manualovertime || item.overtime));
      }
      if (item.designation === "DM Plant") {
        totalOvertime.mdmplant += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "QC") {
        totalOvertime.mqc += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "STORE") {
        totalOvertime.mstore += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "K-7 & 1-6PROC") {
        item.gender === "Male"  || item.gender === "M"
          ? (totalOvertime.mk7 += Number(item.manualovertime || item.overtime))
          : (totalOvertime.fk7 += Number(item.manualovertime || item.overtime));
      }
      if (item.designation === "RHMS") {
        totalOvertime.mrmhs += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "PS") {
        totalOvertime.fps += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "HK & Garden") {
        totalOvertime.mhk += Number(item.manualovertime || item.overtime);
      }
      if (item.designation === "SVR") {
        totalOvertime.msvr += Number(item.manualovertime || item.overtime);
      }
      totalOvertime.total += Number(item.manualovertime || item.overtime);
    });
    return totalOvertime;
  }

  const getAmount = (totalAttendance: Data, rate: Data) => {
    const totalAmount: Data = {
      date: "Total Amount",
      m8mw: Math.floor(totalAttendance.m8mw * rate.m8mw),
      f8mw: Math.floor(totalAttendance.f8mw * rate.f8mw),
      m20mw: Math.floor(totalAttendance.m20mw * rate.m20mw),
      f20mw: Math.floor(totalAttendance.f20mw * rate.f20mw),
      mdmplant: Math.floor(totalAttendance.mdmplant * rate.mdmplant),
      mqc: Math.floor(totalAttendance.mqc * rate.mqc),
      mstore: Math.floor(totalAttendance.mstore * rate.mstore),
      mk7: Math.floor(totalAttendance.mk7 * rate.mk7),
      fk7: Math.floor(totalAttendance.fk7 * rate.fk7),
      mrmhs: Math.floor(totalAttendance.mrmhs * rate.mrmhs),
      fps: Math.floor(totalAttendance.fps * rate.fps),
      mhk: Math.floor(totalAttendance.mhk * rate.mhk),
      msvr: Math.floor(totalAttendance.msvr * rate.msvr),
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
      m8mw: Math.floor((totalOvertime.m8mw * rate.m8mw) / otrate),
      f8mw: Math.floor((totalOvertime.f8mw * rate.f8mw) / otrate),
      m20mw: Math.floor((totalOvertime.m20mw * rate.m20mw) / otrate),
      f20mw: Math.floor((totalOvertime.f20mw * rate.f20mw) / otrate),
      mdmplant: Math.floor((totalOvertime.mdmplant * rate.mdmplant) / otrate),
      mqc: Math.floor((totalOvertime.mqc * rate.mqc) / otrate),
      mstore: Math.floor((totalOvertime.mstore * rate.mstore) / otrate),
      mk7: Math.floor((totalOvertime.mk7 * rate.mk7) / otrate),
      fk7: Math.floor((totalOvertime.fk7 * rate.fk7) / otrate),
      mrmhs: Math.floor((totalOvertime.mrmhs * rate.mrmhs) / otrate),
      fps: Math.floor((totalOvertime.fps * rate.fps) / otrate),
      mhk: Math.floor((totalOvertime.mhk * rate.mhk) / otrate),
      msvr: Math.floor((totalOvertime.msvr * rate.msvr) / otrate),
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
      m8mw: totalAmount.m8mw + totalOtAmount.m8mw,
      f8mw: totalAmount.f8mw + totalOtAmount.f8mw,
      m20mw: totalAmount.m20mw + totalOtAmount.m20mw,
      f20mw: totalAmount.f20mw + totalOtAmount.f20mw,
      mdmplant: totalAmount.mdmplant + totalOtAmount.mdmplant,
      mqc: totalAmount.mqc + totalOtAmount.mqc,
      mstore: totalAmount.mstore + totalOtAmount.mstore,
      mk7: totalAmount.mk7 + totalOtAmount.mk7,
      fk7: totalAmount.fk7 + totalOtAmount.fk7,
      mrmhs: totalAmount.mrmhs + totalOtAmount.mrmhs,
      fps: totalAmount.fps + totalOtAmount.fps,
      mhk: totalAmount.mhk + totalOtAmount.mhk,
      msvr: totalAmount.msvr + totalOtAmount.msvr,
      total: totalAmount.total + totalOtAmount.total,
    };
    return netAmount;
  };



  const getCPAmount = (cp: Data, totalAttendance: Data) => {
    const cpAmount: Data = {
      date: "CP Amount",
      m8mw: Math.floor(cp.m8mw * totalAttendance.m8mw),
      f8mw: Math.floor(cp.f8mw * totalAttendance.f8mw),
      m20mw: Math.floor(cp.m20mw * totalAttendance.m20mw),
      f20mw: Math.floor(cp.f20mw * totalAttendance.f20mw),
      mdmplant: Math.floor(cp.mdmplant * totalAttendance.mdmplant),
      mqc: Math.floor(cp.mqc * totalAttendance.mqc),
      mstore: Math.floor(cp.mstore * totalAttendance.mstore),
      mk7: Math.floor(cp.mk7 * totalAttendance.mk7),
      fk7: Math.floor(cp.fk7 * totalAttendance.fk7),
      mrmhs: Math.floor(cp.mrmhs * totalAttendance.mrmhs),
      fps: Math.floor(cp.fps * totalAttendance.fps),
      mhk: Math.floor(cp.mhk * totalAttendance.mhk),
      msvr: Math.floor(cp.msvr * totalAttendance.msvr),
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
            m8mw: totalAmount.m8mw + cpAmount.m8mw,
            f8mw: totalAmount.f8mw + cpAmount.f8mw,
            m20mw: totalAmount.m20mw + cpAmount.m20mw,
            f20mw: totalAmount.f20mw + cpAmount.f20mw,
            mdmplant: totalAmount.mdmplant + cpAmount.mdmplant,
            mqc: totalAmount.mqc + cpAmount.mqc,
            mstore: totalAmount.mstore + cpAmount.mstore,
            mk7: totalAmount.mk7 + cpAmount.mk7,
            fk7: totalAmount.fk7 + cpAmount.fk7,
            mrmhs: totalAmount.mrmhs + cpAmount.mrmhs,
            fps: totalAmount.fps + cpAmount.fps,

            mhk: totalAmount.mhk + cpAmount.mhk, 
            msvr: totalAmount.msvr + cpAmount.msvr,
            total: totalAmount.total + cpAmount.total,

       }
        return taxable;
   }

   const getGst = (taxable: Data) => {
      const gst: Data = {
        date: "GST",
        m8mw: Math.floor(taxable.m8mw * 0.18),
        f8mw: Math.floor(taxable.f8mw * 0.18),
        m20mw: Math.floor(taxable.m20mw * 0.18),
        f20mw: Math.floor(taxable.f20mw * 0.18),
        mdmplant: Math.floor(taxable.mdmplant * 0.18),
        mqc: Math.floor(taxable.mqc * 0.18),
        mstore: Math.floor(taxable.mstore * 0.18),
        mk7: Math.floor(taxable.mk7 * 0.18),
        fk7: Math.floor(taxable.fk7 * 0.18),
        mrmhs: Math.floor(taxable.mrmhs * 0.18),
        fps: Math.floor(taxable.fps * 0.18),
        mhk: Math.floor(taxable.mhk * 0.18),
        msvr: Math.floor(taxable.msvr * 0.18),
        total: Math.floor(taxable.total * 0.18),
      }
      return gst;
   }

   const getBillAmount  = (taxable: Data, gst: Data) => {
      const billAmount: Data = {
        date: "Bill Amount",
        m8mw: taxable.m8mw + gst.m8mw,
        f8mw: taxable.f8mw + gst.f8mw,
        m20mw: taxable.m20mw + gst.m20mw,
        f20mw: taxable.f20mw + gst.f20mw,
        mdmplant: taxable.mdmplant + gst.mdmplant,
        mqc: taxable.mqc + gst.mqc,
        mstore: taxable.mstore + gst.mstore,
        mk7: taxable.mk7 + gst.mk7,
        fk7: taxable.fk7 + gst.fk7,
        mrmhs: taxable.mrmhs + gst.mrmhs,
        fps: taxable.fps + gst.fps,
        mhk: taxable.mhk + gst.mhk,
        msvr: taxable.msvr + gst.msvr,
        total: taxable.total + gst.total,
      }
      return billAmount;
   }

   const getTds = (taxable: Data) => {
      const tds: Data = {
        date: "TDS",
        m8mw: Math.floor(taxable.m8mw * 0.01),
        f8mw: Math.floor(taxable.f8mw * 0.01),
        m20mw: Math.floor(taxable.m20mw * 0.01),
        f20mw: Math.floor(taxable.f20mw * 0.01),
        mdmplant: Math.floor(taxable.mdmplant * 0.01),
        mqc: Math.floor(taxable.mqc * 0.01),
        mstore: Math.floor(taxable.mstore * 0.01),
        mk7: Math.floor(taxable.mk7 * 0.01),
        fk7: Math.floor(taxable.fk7 * 0.01),
        mrmhs: Math.floor(taxable.mrmhs * 0.01),
        fps: Math.floor(taxable.fps * 0.01),
        mhk: Math.floor(taxable.mhk * 0.01),
        msvr: Math.floor(taxable.msvr * 0.01),
        total: Math.floor(taxable.total * 0.01),
      }
      return tds;

   }

   const getNetPayable = (billAmount: Data, tds: Data) => {
      const netPayable: Data = {
        date: "Net Payable",
        m8mw: billAmount.m8mw + tds.m8mw,
        f8mw: billAmount.f8mw + tds.f8mw,
        m20mw: billAmount.m20mw + tds.m20mw,
        f20mw: billAmount.f20mw + tds.f20mw,
        mdmplant: billAmount.mdmplant + tds.mdmplant,
        mqc: billAmount.mqc + tds.mqc,
        mstore: billAmount.mstore + tds.mstore,
        mk7: billAmount.mk7 + tds.mk7,
        fk7: billAmount.fk7 + tds.fk7,
        mrmhs: billAmount.mrmhs + tds.mrmhs,
        fps: billAmount.fps + tds.fps,
        mhk: billAmount.mhk + tds.mhk,
        msvr: billAmount.msvr + tds.msvr,
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
      m8mw: 325,
      f8mw: 305,
      m20mw: 325,
      f20mw: 305,
      mdmplant: 325,
      mqc: 325,
      mstore: 325,
      mk7: 325,
      fk7: 305,
      mrmhs: 325,
      fps: 305,
      mhk: 325,
      msvr: 365,
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
      m8mw: 30.5,
      f8mw: 27.5,
      m20mw: 30.5,
      f20mw: 27.5,
      mdmplant: 30.5,
      mqc: 30.5,
      mstore: 30.5,
      mk7: 30.5,
      fk7: 27.5,
      mrmhs: 30.5,
      fps: 27.5,
      mhk: 30.5,
      msvr: 34.5,
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