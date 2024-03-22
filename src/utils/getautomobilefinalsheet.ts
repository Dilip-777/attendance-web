import { Automobile, Hsd, Vehicle } from "@prisma/client";
import dayjs from "dayjs";

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
    taxable = Math.round(
      (totalAuto.days / (m * vehicle.shiftduraion || 1)) * vehicle.charges
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

export const getAutomobileFinalSheet = (
  vehicles: (Vehicle & { automobile: Automobile[] })[],
  hsd: Hsd | null,
  month: string
) => {
  const m = dayjs(month, "MM/YYYY").daysInMonth();
  const totalsobj: any = {};
  let total = 0;
  const overtimedata: any[] = [];
  const kpidata: any[] = [];
  const totals: any[] = [];
  let hsdcost = 0;
  let hsdConsumed = 0;
  let idealStandingDays = 0;
  const data = vehicles.map((vehicle) => {
    let runningOvertime: {
      hrs: number;
      days: number;
    } = {
      hrs: 0,
      days: 0,
    };

    let breakDownDaysCounted = 0;
    const totalAuto = {
      hrs: 0,
      days: 0,
      kmdays: 0,
      kms: 0,
      trips: 0,
    };

    vehicle.automobile.forEach((auto) => {
      totalAuto.days +=
        (auto.maintenanceDays || 0) +
        (auto.idealStandingDays || 0) -
        (auto.breakDownDaysCounted || 0);
      totalAuto.trips += auto.trips || 0;

      const start = auto.startTime;
      const end = auto.endTime;
      if (start && end) {
        const hours = calculateDecimalHours(start, end);
        totalAuto.hrs += hours;
        runningOvertime.hrs += Math.max(hours - vehicle.shiftduraion, 0);
        runningOvertime.days += Math.floor(
          Math.max(hours - vehicle.shiftduraion, 0) / vehicle.shiftduraion
        );
      }
      // delete running.kms;
      totalAuto.kms += auto.totalRunning || 0;
      totalAuto.kmdays++;

      // delete running.hrs;
      hsdConsumed += auto.hsdIssuedOrConsumed || 0;
      breakDownDaysCounted += auto.breakDownDaysCounted || 0;
      idealStandingDays += auto.idealStandingDays || 0;
    });

    const overtimeCalculation = getData(runningOvertime, vehicle, m);

    if (vehicle.eligibleForOvertime) {
      overtimedata.push({
        vehicleNo: vehicle.vehicleNo,
        vehicleType: vehicle.vehicleType,
        charges: vehicle.charges,
        paymentMode: vehicle.paymentMode,
        rate: vehicle.rate,
        running: runningOvertime,
        taxable: overtimeCalculation.taxable,
        gst: overtimeCalculation.gst,
        billamount: overtimeCalculation.billamount,
        tds: overtimeCalculation.tds,
        netamount: overtimeCalculation.netamount,
      });
    }

    const mileagefortheMonth =
      totalAuto.kms > totalAuto.hrs
        ? ((totalAuto.kms || 0) / (hsdConsumed || 1)).toFixed(2) + " km/l"
        : ((totalAuto.hrs || 0) / (hsdConsumed || 1)).toFixed(2) + " ltr/hr";

    const hsdOverAbove =
      ((totalAuto.kms || 0) - hsdConsumed * vehicle.mileage) / vehicle.mileage;

    const hsdCost =
      totalAuto.kms === 0
        ? 0
        : Math.round(hsdOverAbove) *
          (hsdOverAbove >= 0
            ? hsd?.payableRate || 0
            : hsd?.recoverableRate || 0);

    hsdcost += hsdCost;

    // totalAuto.days = Math.max(totalAuto.hrs, totalAuto.kms);

    if (totalAuto.kms <= totalAuto.hrs) {
      totalAuto.days += parseFloat(
        (totalAuto.hrs / vehicle.shiftduraion).toFixed(2)
      );
    } else {
      totalAuto.days += totalAuto.kmdays;
    }

    kpidata.push({
      vehicleNo: vehicle.vehicleNo,
      hsdIssuedOrConsumed: hsdConsumed,
      mileagefortheMonth,
      mileage: vehicle.mileage,
      hsdOverAbove,
      hsdrate:
        totalAuto.kms === 0
          ? 0
          : hsdOverAbove >= 0
          ? hsd?.payableRate || 0
          : hsd?.recoverableRate || 0,
      hsdCost,
      idealStandingDays,
      actualWorkingDays: totalAuto.days,
      breakDownDaysCounted,
      avgMileage: vehicle.mileage,
    });

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
      taxable = Math.round(
        (totalAuto.days / (m * vehicle.shiftduraion || 1)) * vehicle.charges
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
    } else if (
      vehicle.paymentStructure === "trip" &&
      vehicle.paymentMode === "trip"
    ) {
      taxable = Math.round(totalAuto.trips * vehicle.charges);
    } else if (
      vehicle.paymentStructure === "km" &&
      vehicle.paymentMode === "km"
    ) {
      taxable = Math.round(totalAuto.kms * vehicle.charges);
    }

    // const taxable = Math.round((totalAuto.days / m) * vehicle.charges);
    const tds = Math.round(taxable * (2 / 100));

    const billamount = Math.round(
      taxable +
        overtimeCalculation.taxable +
        (taxable + overtimeCalculation.taxable) * (vehicle.gst / 100)
    );

    totals.push({
      vehicleNo: vehicle.vehicleNo,
      vehicleType: vehicle.vehicleType,

      charges: vehicle.charges,
      workingDays: totalAuto.days,
      overtime: runningOvertime.days,
      workingAmount: taxable,
      overtimeAmount: overtimeCalculation.taxable,
      totalAmount: taxable + overtimeCalculation.taxable,
      gst: Math.round(
        (taxable + overtimeCalculation.taxable) * (vehicle.gst / 100)
      ),
      billamount,
      tds: Math.round((taxable + overtimeCalculation.taxable) * (2 / 100)),
      netamount: Math.round(
        billamount - (taxable + overtimeCalculation.taxable) * (2 / 100)
      ),
    });

    totalsobj.charges = "";
    totalsobj.workingDays = (totalsobj.workingDays || 0) + totalAuto.days;
    totalsobj.overtime = (totalsobj.overtime || 0) + runningOvertime.days;
    totalsobj.workingAmount = (totalsobj.workingAmount || 0) + taxable;
    totalsobj.overtimeAmount =
      (totalsobj.overtimeAmount || 0) + overtimeCalculation.taxable;
    totalsobj.totalAmount =
      (totalsobj.totalAmount || 0) + taxable + overtimeCalculation.taxable;
    totalsobj.gst =
      (totalsobj.gst || 0) +
      Math.round((taxable + overtimeCalculation.taxable) * (vehicle.gst / 100));
    totalsobj.billamount = (totalsobj.billamount || 0) + billamount;
    totalsobj.tds =
      (totalsobj.tds || 0) +
      Math.round((taxable + overtimeCalculation.taxable) * (2 / 100));
    totalsobj.netamount =
      (totalsobj.netamount || 0) +
      Math.round(
        billamount - (taxable + overtimeCalculation.taxable) * (2 / 100)
      );

    total += Math.round(
      billamount - (taxable + overtimeCalculation.taxable) * (2 / 100)
    );

    return {
      vehicleNo: vehicle.vehicleNo,
      vehicleType: vehicle.vehicleType,
      charges: vehicle.charges,
      paymentMode: vehicle.paymentMode,
      paymentStructure: vehicle.paymentStructure,
      rate: vehicle.rate,
      running: totalAuto,
      taxable,
      gst: Math.round(taxable * (vehicle.gst / 100)),
      billamount: Math.round(taxable + taxable * (vehicle.gst / 100)),
      tds: tds,
      netamount: Math.round(taxable + taxable * (vehicle.gst / 100) - tds),
    };
  });

  totals.push({
    vehicleNo: " Grand Total",
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
    total,
    hsdcost,
  };
};
