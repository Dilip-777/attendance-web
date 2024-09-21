import automobile from "@/components/menu-items/automobile";
import {
  Automobile,
  Contractor,
  FinalCalculations,
  FixedVehicle,
  Hsd,
  Vehicle,
} from "@prisma/client";
import dayjs from "dayjs";
import { parse } from "path";

function calculateDecimalHours(start_time: string, end_time: string): number {
  const start = dayjs(start_time, "HH:mm");
  const end = dayjs(end_time, "HH:mm");

  const diff = end.diff(start, "minute");
  const decimalHours = diff / 60;

  return parseFloat(decimalHours.toFixed(2));
}

const getData = (
  totalAuto: {
    days: number;
    hrs: number;
  },
  vehicle: Vehicle,
  m: number
) => {
  let taxable = 0;
  if (vehicle.paymentStructure === "hourly") {
    if (vehicle.paymentMode === "hourly") {
      taxable = Math.round(totalAuto.hrs * vehicle.charges);
    } else if (vehicle.paymentMode === "daily") {
      taxable = Math.round(
        (totalAuto.hrs / vehicle.shiftduraion) * vehicle.charges
      );
    }
  } else if (vehicle.paymentMode === "monthly") {
    // taxable = Math.round(
    //   (totalAuto.days / (m * vehicle.shiftduraion || 1)) * vehicle.charges
    // );
    const rateperhr = vehicle.charges / (vehicle.shiftduraion * m || 1);
    taxable = Math.round(
      Math.min(totalAuto.hrs, vehicle.shiftduraion) * rateperhr
    );
  } else if (
    vehicle.paymentStructure === "monthly" &&
    vehicle.paymentMode === "monthly"
  ) {
    taxable = Math.round((totalAuto.days / m) * vehicle.charges);
  } else if (
    vehicle.paymentStructure === "daily" &&
    vehicle.paymentMode === "daily"
  ) {
    taxable = Math.round(totalAuto.days * vehicle.charges);
  }
  // const taxable = Math.round((totalAuto.days / m) * vehicle.charges);
  const tds = Math.round(taxable * (2 / 100));
  return {
    taxable,
    gst: Math.round(taxable * (vehicle.gst / 100)),
    billamount: Math.round(taxable + taxable * (vehicle.gst / 100)),
    tds: tds,
    netamount: Math.round(taxable + taxable * (vehicle.gst / 100) - tds),
  };
};

const getAverageMileage = (automobile: Automobile[], vehicle: Vehicle) => {
  let totalRunning = 0;
  let totalHsd = 0;
  automobile.forEach((auto) => {
    totalRunning += auto.totalRunning || 0;
    totalHsd += auto.hsdIssuedOrConsumed || 0;
  });
  const avgMileage =
    (totalRunning - totalHsd * vehicle.mileage) / (vehicle.mileage || 1);
  return Math.abs(parseFloat((totalRunning / (avgMileage || 1)).toFixed(2)));
};

export const getAutomobileFinalSheet = (
  vehicles: (Vehicle & {
    automobile: Automobile[];
    fixedVehicle: FixedVehicle[];
  })[],
  hsd: Hsd | null,
  month: string,
  contractor: Contractor
) => {
  const m = dayjs(month, "MM/YYYY").daysInMonth();
  const totalsobj: any = {};
  let total = 0;
  let totalhiringcharges = 0;
  let hsdconsumed = 0;
  let hsdrate = 0;

  const overtimedata: any[] = [];
  const kpidata: any[] = [];
  const totals: any[] = [];
  let hsdcost = 0;
  let idealStandingDays = 0;
  const grandtotalrow = {
    vehicleNo: "Grand Total",
    taxable: 0,
    gst: 0,
    billamount: 0,
    tds: 0,
    netamount: 0,
  };
  const data = vehicles.map((vehicle) => {
    let v = vehicle.fixedVehicle[0] || vehicle;
    let hsdConsumed = 0;
    let runningOvertime: {
      hrs: number;
      days: number;
    } = {
      hrs: 0,
      days: 0,
    };

    let breakDownDaysCounted = 0;
    let maintenanceDays = 0;
    const totalAuto = {
      hrs: 0,
      days: 0,
      kmdays: 0,
      kms: 0,
      trips: 0,
    };

    vehicle.automobile
      .filter((auto) => {
        return auto.date?.includes(dayjs(month, "MM/YYYY").format("MM/YYYY"));
      })
      .forEach((auto) => {
        // totalAuto.days += parseFloat(
        //   (
        //     (auto.maintenanceDays || 0) +
        //     (auto.idealStandingDays || 0) -
        //     (auto.breakDownDaysCounted || 0)
        //   ).toFixed(2)
        // );
        totalAuto.trips += auto.trips || 0;

        const start = auto.startTime;
        const end = auto.endTime;
        if (start && end) {
          const hours = calculateDecimalHours(start, end);
          totalAuto.hrs += hours;
          const overtime = v.eligibleForOvertime ? hours - v.shiftduraion : 0;
          runningOvertime.hrs += parseFloat(Math.max(overtime, 0).toFixed(2));
          runningOvertime.days += Math.floor(
            Math.max(overtime, 0) / v.shiftduraion
          );
        }
        // delete running.kms;
        totalAuto.kms += auto.totalRunning || 0;
        if (auto.totalRunning && auto.totalRunning > 0) {
          totalAuto.kmdays++;
        }

        // delete running.hrs;
        breakDownDaysCounted += auto.breakDownDaysCounted || 0;
        maintenanceDays += auto.maintenanceDays || 0;
        hsdConsumed += auto.hsdIssuedOrConsumed || 0;
        idealStandingDays += auto.idealStandingDays || 0;
      });

    const overtimeCalculation = getData(runningOvertime, v, m);

    if (v.eligibleForOvertime) {
      overtimedata.push({
        vehicleNo: v.vehicleNo,
        vehicleType: v.vehicleType,
        charges: v.charges,
        paymentMode: v.paymentMode,
        paymentStructure: v.paymentStructure,
        rate: v.rate,
        running: runningOvertime,
        taxable: overtimeCalculation.taxable,
        gst: overtimeCalculation.gst,
        billamount: overtimeCalculation.billamount,
        tds: overtimeCalculation.tds,
        netamount: overtimeCalculation.netamount,
      });
    }

    const kmperltr =
      hsdConsumed === 0
        ? 0
        : ((totalAuto.kms || 0) / (hsdConsumed || 1)).toFixed(2) + " km/l";
    const ltperhr =
      hsdConsumed === 0
        ? 0
        : (
            ((totalAuto.hrs || 0) + runningOvertime.hrs) /
            (hsdConsumed || 1)
          ).toFixed(2) + " ltr/hr";

    const mileagefortheMonth = {
      kmperltr,
      ltperhr,
    };

    const hsdOverAbove = parseFloat(
      (
        ((totalAuto.kms || 0) - hsdConsumed * v.mileage) /
        (v.mileage || 1)
      ).toFixed(2)
    );

    const hsdRate =
      hsdOverAbove >= 0 ? hsd?.payableRate || 0 : hsd?.recoverableRate || 0;

    const hsdCost = parseFloat((hsdOverAbove * hsdRate).toFixed(2));

    // totalAuto.days = Math.max(totalAuto.hrs, totalAuto.kms);

    if (totalAuto.kms <= totalAuto.hrs) {
      totalAuto.days += parseFloat(
        (totalAuto.hrs / (v.shiftduraion || 1)).toFixed(2)
      );
    } else {
      totalAuto.days += totalAuto.kmdays;
    }

    totalAuto.days =
      m -
      breakDownDaysCounted -
      Math.max(maintenanceDays - v.maintenanceDaysAllowed, 0);

    if (
      vehicle.automobile.filter((auto) => {
        return auto.date?.includes(dayjs(month, "MM/YYYY").format("MM/YYYY"));
      }).length < m
    ) {
      totalAuto.days = 0;
    }

    const avgMileage = getAverageMileage(vehicle.automobile, v);

    hsdrate += hsdRate;
    if (v.hsdDeduction) {
      hsdcost += parseFloat(hsdCost.toFixed(2));
      kpidata.push({
        vehicleNo: v.vehicleNo,
        hsdIssuedOrConsumed: hsdConsumed,
        mileagefortheMonth,
        mileage: v.mileage,
        hsdOverAbove,
        hsdrate: hsdRate,
        hsdCost,
        idealStandingDays,
        actualWorkingDays: totalAuto.days,
        breakDownDaysCounted,
        avgMileage,
      });
    } else {
      kpidata.push({
        vehicleNo: v.vehicleNo,
        hsdIssuedOrConsumed: hsdConsumed,
        mileagefortheMonth,
        mileage: v.mileage,
        hsdOverAbove,
        hsdrate: hsdRate,
        hsdCost: 0,
        idealStandingDays,
        actualWorkingDays: totalAuto.days,
        breakDownDaysCounted,
        avgMileage,
      });
    }

    let taxable = 0;

    if (v.paymentStructure === "hourly") {
      if (v.paymentMode === "hourly") {
        taxable = Math.round(totalAuto.hrs * v.charges);
      } else if (v.paymentMode === "daily") {
        taxable = Math.round((totalAuto.hrs / v.shiftduraion) * v.charges);
      } else if (v.paymentMode === "monthly") {
        // taxable = Math.round(
        //   (totalAuto.days / (m * v.shiftduraion || 1)) * v.charges
        // );
        const rateperhr = v.charges / (v.shiftduraion * m || 1);
        taxable = Math.round(
          Math.min(totalAuto.hrs, v.shiftduraion) * rateperhr
        );
      }
    } else if (
      v.paymentStructure === "monthly" &&
      v.paymentMode === "monthly"
    ) {
      taxable = Math.round((totalAuto.days / m) * v.charges);
    } else if (v.paymentStructure === "daily" && v.paymentMode === "daily") {
      taxable = Math.round(totalAuto.days * v.charges);
    } else if (v.paymentStructure === "trip" && v.paymentMode === "trip") {
      taxable = Math.round(totalAuto.trips * v.charges);
    } else if (v.paymentStructure === "km" && v.paymentMode === "km") {
      taxable = Math.round(totalAuto.kms * v.charges);
    }

    totalhiringcharges += taxable;

    // const taxable = Math.round((totalAuto.days / m) * v.charges);
    const tds = Math.round(taxable * ((contractor.tds ?? 0) / 100));

    const billamount = Math.round(
      taxable +
        overtimeCalculation.taxable +
        (taxable + overtimeCalculation.taxable) * (v.gst / 100)
    );

    totals.push({
      vehicleNo: v.vehicleNo,
      vehicleType: v.vehicleType,

      charges: v.charges,
      workingDays: totalAuto.days,
      overtime: runningOvertime.days || 0,
      workingAmount: taxable,
      overtimeAmount: overtimeCalculation.taxable,
      totalAmount: taxable + overtimeCalculation.taxable,
      gst: Math.round((taxable + overtimeCalculation.taxable) * (v.gst / 100)),
      billamount,
      tds: Math.round(
        (taxable + overtimeCalculation.taxable) * ((contractor?.tds ?? 0) / 100)
      ),
      netamount: Math.round(
        billamount -
          (taxable + overtimeCalculation.taxable) *
            ((contractor?.tds ?? 0) / 100)
      ),
    });

    totalsobj.charges = "";
    totalsobj.workingDays = parseFloat(
      ((totalsobj.workingDays || 0) + totalAuto.days).toFixed(2)
    );
    totalsobj.overtime =
      (totalsobj.overtime || 0) + (runningOvertime.days || 0);
    totalsobj.workingAmount = (totalsobj.workingAmount || 0) + taxable;
    totalsobj.overtimeAmount =
      (totalsobj.overtimeAmount || 0) + overtimeCalculation.taxable;
    totalsobj.totalAmount =
      (totalsobj.totalAmount || 0) + taxable + overtimeCalculation.taxable;
    totalsobj.gst =
      (totalsobj.gst || 0) +
      Math.round((taxable + overtimeCalculation.taxable) * (v.gst / 100));
    totalsobj.billamount = (totalsobj.billamount || 0) + billamount;
    totalsobj.tds =
      (totalsobj.tds || 0) +
      Math.round(
        (taxable + overtimeCalculation.taxable) * ((contractor.tds ?? 0) / 100)
      );
    totalsobj.netamount =
      (totalsobj.netamount || 0) +
      Math.round(
        billamount -
          (taxable + overtimeCalculation.taxable) *
            ((contractor.tds ?? 0) / 100)
      );

    total += Math.round(
      billamount -
        (taxable + overtimeCalculation.taxable) * ((contractor.tds ?? 0) / 100)
    );
    hsdconsumed += hsdConsumed;

    grandtotalrow.taxable += taxable;
    grandtotalrow.gst += Math.round(taxable * (v.gst / 100));
    grandtotalrow.billamount += Math.round(taxable + taxable * (v.gst / 100));
    grandtotalrow.tds += tds;
    grandtotalrow.netamount += Math.round(
      taxable + taxable * (v.gst / 100) - tds
    );

    return {
      vehicleNo: v.vehicleNo,
      vehicleType: v.vehicleType,
      charges: v.charges,
      paymentMode: v.paymentMode,
      paymentStructure: v.paymentStructure,
      rate: v.rate,
      running: {
        hrs: parseFloat(totalAuto.hrs.toFixed(2)),
        days: parseFloat(totalAuto.days.toFixed(2)),
        kms: parseFloat(totalAuto.kms.toFixed(2)),
        trips: parseFloat(totalAuto.trips.toFixed(2)),
      },
      taxable,
      gst: Math.round(taxable * (v.gst / 100)),
      billamount: Math.round(taxable + taxable * (v.gst / 100)),
      tds: tds,
      netamount: Math.round(taxable + taxable * (v.gst / 100) - tds),
    };
  });

  let totalsdata: any[] = [];

  const gst =
    hsdcost > 0 ? Math.round(hsdcost * ((contractor.gst || 0) / 100)) : 0;
  const billamount =
    hsdcost > 0
      ? Math.round(hsdcost + hsdcost * ((contractor.gst || 0) / 100))
      : hsdcost;
  const tds =
    hsdcost > 0 ? Math.round(hsdcost * ((contractor.tds || 0) / 100)) : 0;
  const netamount =
    hsdcost > 0
      ? Math.round(billamount - hsdcost * ((contractor.tds || 0) / 100))
      : hsdcost;

  grandtotalrow.taxable += hsdcost;
  grandtotalrow.gst += gst;
  grandtotalrow.billamount += billamount;
  grandtotalrow.tds += tds;
  grandtotalrow.netamount += netamount;

  totalsdata.push({
    vehicleNo: "HSD Payable / Recoverable",

    taxable: hsdcost,
    gst: gst,
    billamount: billamount,
    tds: tds,
    netamount: netamount,
  });

  totalsdata.push(grandtotalrow);

  // totals.push({
  //   vehicleNo: "Total HSD",
  //   vehicleType: "",
  //   charges: totalsobj.charges,
  //   workingDays: totalsobj.workingDays,
  //   overtime: totalsobj.overtime,
  //   workingAmount: totalsobj.workingAmount,
  //   overtimeAmount: totalsobj.overtimeAmount,
  //   totalAmount: hsdcost,
  //   gst: hsdcost > 0 ? Math.round(hsdcost * ((contractor?.gst || 0) / 100)) : 0,
  //   billamount:
  //     hsdcost > 0
  //       ? Math.round(hsdcost + hsdcost * ((contractor?.gst || 0) / 100))
  //       : hsdcost,
  //   tds: hsdcost > 0 ? Math.round(hsdcost * ((contractor?.tds || 0) / 100)) : 0,
  //   netamount:
  //     hsdcost > 0
  //       ? Math.round(hsdcost - hsdcost * ((contractor?.tds || 0) / 100))
  //       : hsdcost,
  // });
  totals.push({
    vehicleNo: "Grand Total",
    vehicleType: "",
    charges: totalsobj.charges,
    workingDays: totalsobj.workingDays,
    overtime: totalsobj.overtime,
    workingAmount: totalsobj.workingAmount,
    overtimeAmount: totalsobj.overtimeAmount,
    totalAmount: totalsobj.totalAmount,
    gst: totalsobj.gst,
    billamount: totalsobj.billamount,
    tds: totalsobj.tds,
    netamount: totalsobj.netamount,
  });

  return {
    data,
    overtimedata,
    kpidata,
    totals,
    total: grandtotalrow.netamount,
    hsdcost: parseFloat(hsdcost.toFixed(2)),
    totalsdata,
    cost: {
      totalhiringcharges,
      hsdconsumed,
      hsdrate,
      hsdcost: parseFloat((hsdconsumed * hsdrate).toFixed(2)),
      total:
        totalhiringcharges + parseFloat((hsdconsumed * hsdrate).toFixed(2)),
    },
  };
};

export const getYTDCost = (
  contractor: Contractor & { finalCalculations: FinalCalculations[] }
) => {
  const ytdHiringCost = contractor.finalCalculations.reduce((acc, curr) => {
    return acc + curr.hiringCharged;
  }, 0);
  const ytdHsdCost = contractor.finalCalculations.reduce((acc, curr) => {
    return acc + curr.hsdCost;
  }, 0);
  const ytdHsdConsumed = contractor.finalCalculations.reduce((acc, curr) => {
    return acc + curr.hsdConsumed;
  }, 0);
  const ytdHsdRate = contractor.finalCalculations.reduce((acc, curr) => {
    return acc + curr.hsdRateCharged;
  }, 0);
  const ytdCost = contractor.finalCalculations.reduce((acc, curr) => {
    return acc + curr.totalCost;
  }, 0);

  return {
    ytdHiringCost,
    ytdHsdCost,
    ytdHsdConsumed,
    ytdHsdRate,
    ytdCost,
  };
};
