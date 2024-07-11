import automobile from "@/components/menu-items/automobile";
import {
  Automobile,
  Contractor,
  FinalCalculations,
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
    const rateperhr = vehicle.charges / (vehicle.shiftduraion * m ?? 1);
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
  vehicles: (Vehicle & { automobile: Automobile[] })[],
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
  const data = vehicles.map((vehicle) => {
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
          const overtime = vehicle.eligibleForOvertime
            ? hours - vehicle.shiftduraion
            : 0;
          runningOvertime.hrs += parseFloat(Math.max(overtime, 0).toFixed(2));
          runningOvertime.days += Math.floor(
            Math.max(overtime, 0) / vehicle.shiftduraion
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

    const overtimeCalculation = getData(runningOvertime, vehicle, m);

    if (vehicle.eligibleForOvertime) {
      overtimedata.push({
        vehicleNo: vehicle.vehicleNo,
        vehicleType: vehicle.vehicleType,
        charges: vehicle.charges,
        paymentMode: vehicle.paymentMode,
        paymentStructure: vehicle.paymentStructure,
        rate: vehicle.rate,
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
        ((totalAuto.kms || 0) - hsdConsumed * vehicle.mileage) /
        (vehicle.mileage || 1)
      ).toFixed(2)
    );

    const hsdRate =
      hsdOverAbove >= 0 ? hsd?.payableRate || 0 : hsd?.recoverableRate || 0;

    const hsdCost = parseFloat((hsdOverAbove * hsdRate).toFixed(2));

    // totalAuto.days = Math.max(totalAuto.hrs, totalAuto.kms);

    if (totalAuto.kms <= totalAuto.hrs) {
      totalAuto.days += parseFloat(
        (totalAuto.hrs / (vehicle.shiftduraion || 1)).toFixed(2)
      );
    } else {
      totalAuto.days += totalAuto.kmdays;
    }

    totalAuto.days =
      m -
      breakDownDaysCounted -
      Math.max(maintenanceDays - vehicle.maintenanceDaysAllowed, 0);

    if (
      vehicle.automobile.filter((auto) => {
        return auto.date?.includes(dayjs(month, "MM/YYYY").format("MM/YYYY"));
      }).length < m
    ) {
      totalAuto.days = 0;
    }

    const avgMileage = getAverageMileage(vehicle.automobile, vehicle);

    hsdrate += hsdRate;
    if (vehicle.hsdDeduction) {
      hsdcost += parseFloat(hsdCost.toFixed(2));
      kpidata.push({
        vehicleNo: vehicle.vehicleNo,
        hsdIssuedOrConsumed: hsdConsumed,
        mileagefortheMonth,
        mileage: vehicle.mileage,
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
        vehicleNo: vehicle.vehicleNo,
        hsdIssuedOrConsumed: hsdConsumed,
        mileagefortheMonth,
        mileage: vehicle.mileage,
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

    if (vehicle.paymentStructure === "hourly") {
      if (vehicle.paymentMode === "hourly") {
        taxable = Math.round(totalAuto.hrs * vehicle.charges);
      } else if (vehicle.paymentMode === "daily") {
        taxable = Math.round(
          (totalAuto.hrs / vehicle.shiftduraion) * vehicle.charges
        );
      } else if (vehicle.paymentMode === "monthly") {
        // taxable = Math.round(
        //   (totalAuto.days / (m * vehicle.shiftduraion || 1)) * vehicle.charges
        // );
        const rateperhr = vehicle.charges / (vehicle.shiftduraion * m || 1);
        taxable = Math.round(
          Math.min(totalAuto.hrs, vehicle.shiftduraion) * rateperhr
        );
      }
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

    totalhiringcharges += taxable;

    // const taxable = Math.round((totalAuto.days / m) * vehicle.charges);
    const tds = Math.round(taxable * ((contractor.tds ?? 0) / 100));

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

    return {
      vehicleNo: vehicle.vehicleNo,
      vehicleType: vehicle.vehicleType,
      charges: vehicle.charges,
      paymentMode: vehicle.paymentMode,
      paymentStructure: vehicle.paymentStructure,
      rate: vehicle.rate,
      running: {
        hrs: parseFloat(totalAuto.hrs.toFixed(2)),
        days: parseFloat(totalAuto.days.toFixed(2)),
        kms: parseFloat(totalAuto.kms.toFixed(2)),
        trips: parseFloat(totalAuto.trips.toFixed(2)),
      },
      taxable,
      gst: Math.round(taxable * (vehicle.gst / 100)),
      billamount: Math.round(taxable + taxable * (vehicle.gst / 100)),
      tds: tds,
      netamount: Math.round(taxable + taxable * (vehicle.gst / 100) - tds),
    };
  });

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
    total,
    hsdcost: parseFloat(hsdcost.toFixed(2)),
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
