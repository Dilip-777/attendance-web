import {
  BOQ,
  BOQItem,
  BarBending,
  BarBendingItem,
  Contractor,
  Measurement,
  MeasurementItem,
  QcsBoq,
  QcsBoqItem,
  Workorder,
} from "@prisma/client";
import dayjs from "dayjs";

interface Props {
  boq: (QcsBoq & {
    BOQItems: (QcsBoqItem & {
      measurementItems: (MeasurementItem & { measurement: Measurement })[];
      barBendingItems: (BarBendingItem & { barBending: BarBending })[];
    })[];
  })[];
  month: string;
  contractor: Contractor;
}

const getDecimal = (num: number) => {
  return parseFloat(num.toFixed(3));
};

export const getBoqFinalSheet = ({ boq, month, contractor }: Props) => {
  const tables: any[] = [];

  let prevMonth = dayjs(month, "MM/YYYY")
    .subtract(1, "month")
    .format("MM/YYYY");
  console.log("prevMonth", prevMonth);

  let totalsRow: any[] = [];
  let totalsObj = {
    taxable: 0,
    gst: 0,
    billamount: 0,
    tds: 0,
    netPayable: 0,
  };

  let totalcostupto = 0;
  let prevMonthTotal = 0;

  boq.forEach((b) => {
    const rows: any[] = [];

    const totals = {
      taxable: 0,
      gst: 0,
      billamount: 0,
      tds: 0,
      netPayable: 0,
    };

    b.BOQItems.forEach((bi, index) => {
      let quantity = 0;
      bi.measurementItems
        .filter(
          (mi) =>
            mi.measurement.startDate.includes(month) &&
            mi.measurement.endDate.includes(month)
        )
        .forEach((mi) => {
          quantity += mi.quantity;
        });

      totalcostupto += bi.measurementItems.reduce((acc, mi) => {
        const m = dayjs(month, "MM/YYYY");

        const endMonth = dayjs(mi.measurement.startDate.slice(3), "MM/YYYY");

        if (m.isAfter(endMonth, "month") || m.isSame(endMonth, "month")) {
          console.log(
            "here",
            mi.quantity,
            bi.unitrate,
            mi.quantity * bi.unitrate,
            acc
          );

          return (acc || 0) + (mi.quantity * bi.unitrate || 0);
        } else {
          return acc;
        }
      }, 0);

      bi.barBendingItems
        .filter(
          (mi) =>
            mi.barBending.startDate.includes(month) &&
            mi.barBending.endDate.includes(month)
        )
        .forEach((mi) => {
          quantity += parseFloat((mi.totalweight || 0).toFixed(2));
        });

      totalcostupto += bi.barBendingItems.reduce((acc, mi) => {
        const m = dayjs(month, "MM/YYYY");

        const endMonth = dayjs(mi.barBending.startDate.slice(3), "MM/YYYY");

        if (m.isAfter(endMonth, "month") || m.isSame(endMonth, "month")) {
          console.log("here", mi.totalweight, bi.unitrate, acc);

          return (
            acc +
            (parseFloat((mi.totalweight || 0).toFixed(2)) * bi.unitrate || 0)
          );
        } else {
          return acc;
        }
      }, 0);

      prevMonthTotal += bi.measurementItems.reduce((acc, mi) => {
        if (
          mi.measurement.startDate.includes(prevMonth) &&
          mi.measurement.endDate.includes(prevMonth)
        ) {
          return acc + (mi.quantity * bi.unitrate || 0);
        } else {
          return acc;
        }
      }, 0);

      prevMonthTotal += bi.barBendingItems.reduce((acc, mi) => {
        if (
          mi.barBending.startDate.includes(prevMonth) &&
          mi.barBending.endDate.includes(prevMonth)
        ) {
          return (
            acc +
            (parseFloat((mi.totalweight || 0).toFixed(2)) * bi.unitrate || 0)
          );
        } else {
          return acc;
        }
      }, 0);

      const taxable = bi.unitrate * quantity;
      const gst = (taxable * (contractor.gst ?? 0)) / 100;
      const billamount = taxable + gst;
      const tds = (taxable * (contractor.tds ?? 0)) / 100;

      totals.taxable += taxable;
      totals.gst += gst;
      totals.billamount += billamount;
      totals.tds += tds;
      totals.netPayable += billamount - tds;

      rows.push({
        description: bi.description,
        unit: bi.unit,
        rate: bi.unitrate,
        quantity: getDecimal(quantity),
        taxable: getDecimal(taxable),
        gst: getDecimal(gst),
        billamount: getDecimal(billamount),
        tds: getDecimal(tds),
        netPayable: getDecimal(billamount - tds),
      });
    });

    rows.push({
      description: "Total",
      unit: "",
      rate: "",
      quantity: "",
      taxable: getDecimal(totals.taxable),
      gst: getDecimal(totals.gst),
      billamount: getDecimal(totals.billamount),
      tds: getDecimal(totals.tds),
      netPayable: getDecimal(totals.netPayable),
    });

    tables.push({
      description: b.description,
      rows,
    });

    totalsRow.push({
      code: b.itemcode,
      description: b.description,
      taxable: getDecimal(totals.taxable),
      gst: getDecimal(totals.gst),
      billamount: getDecimal(totals.billamount),
      tds: getDecimal(totals.tds),
      netPayable: getDecimal(totals.netPayable),
    });

    totalsObj.taxable += getDecimal(totals.taxable);
    totalsObj.gst += getDecimal(totals.gst);
    totalsObj.billamount += getDecimal(totals.billamount);
    totalsObj.tds += getDecimal(totals.tds);
    totalsObj.netPayable += getDecimal(totals.netPayable);
  });

  const taxable = totalcostupto;

  console.log("totalcostupto", totalcostupto, (contractor.gst || 0) * taxable);

  totalcostupto += (taxable * (contractor.gst ?? 0)) / 100;

  console.log("totalcostupto", totalcostupto);

  const tds = (taxable * (contractor.tds ?? 0)) / 100;

  totalcostupto = totalcostupto - tds;

  const taxable1 = prevMonthTotal;
  prevMonthTotal += (taxable1 * (contractor.gst ?? 0)) / 100;
  const tds1 = (taxable1 * (contractor.tds ?? 0)) / 100;

  prevMonthTotal = prevMonthTotal - tds1;

  totalsRow.push({
    code: "",
    description: "Total",

    ...totalsObj,
  });

  return {
    tables,
    totalsRow,
    total: totalsObj.netPayable,
    totalcostupto: getDecimal(totalcostupto),
    prevMonthTotal: getDecimal(prevMonthTotal),
  };
};
