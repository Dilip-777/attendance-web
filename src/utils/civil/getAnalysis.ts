import {
  BOQ,
  BOQItem,
  BarBending,
  BarBendingItem,
  Measurement,
  MeasurementItem,
  QcsBoq,
  QcsBoqItem,
  Workorder,
} from "@prisma/client";
import dayjs from "dayjs";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

interface Props {
  boq:
    | (QcsBoq & {
        BOQItems: (QcsBoqItem & {
          measurementItems: (MeasurementItem & { measurement: Measurement })[];
          barBendingItems: (BarBendingItem & { barBending: BarBending })[];
        })[];
      })
    | null;
}

export const getAnalysisSeries = ({ boq }: Props) => {
  //    {
  //       name: "Net Profit",
  //       data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
  //     },
  //     {
  //       name: "Revenue",
  //       data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
  //     },
  //     {
  //       name: "Free Cash Flow",
  //       data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
  //     },

  interface Rows {
    name: string;
    data: number[];
  }

  const rows: Rows = {
    name: "Completed work",
    data: [],
  };
  const rows1: Rows = {
    name: "Expected work",
    data: [],
  };

  const xaxis: string[] = [];

  const startDate = boq?.startDate;
  const endDate = boq?.endDate;

  if (!startDate || !endDate) return { series: [], xaxis };

  let start = dayjs(startDate, "DD/MM/YYYY");
  let end = dayjs(endDate, "DD/MM/YYYY");

  const startMonth = start.format("MM/YYYY");
  const endMonth = end.format("MM/YYYY");

  const days = end.diff(start, "day");
  const quantityPerDay = boq.totalQuantity / days;

  while (start.isBefore(end)) {
    const month = start.format("MMM");
    const daysInmonth = start.daysInMonth();

    const m = start.format("MM/YYYY");

    let expected = Math.floor(quantityPerDay * daysInmonth);

    if (startMonth === m) {
      expected = Math.floor(quantityPerDay * (daysInmonth - start.date()));
    } else if (endMonth === m) {
      expected = Math.floor(quantityPerDay * end.date());
    }
    let quantity = 0;
    boq?.BOQItems.forEach((bi, index) => {
      bi.measurementItems
        .filter(
          (mi) =>
            mi.measurement.startDate.includes(m) &&
            mi.measurement.endDate.includes(m)
        )
        .forEach((mi) => {
          quantity += mi.quantity;
        });

      bi.barBendingItems
        .filter(
          (mi) =>
            mi.barBending.startDate.includes(m) &&
            mi.barBending.endDate.includes(m)
        )
        .forEach((mi) => {
          quantity += parseFloat((mi.totalweight || 0).toFixed(2));
        });

      const expectedPercentage = parseFloat(
        ((expected / boq.totalQuantity) * 100).toFixed(2)
      );
      const completedPercentage = parseFloat(
        ((quantity / boq.totalQuantity) * 100).toFixed(2)
      );

      rows.data.push(completedPercentage);
      rows1.data.push(expectedPercentage);

      xaxis.push(month);

      start = start.add(1, "month");

      // rows.data.push(quantity);
      // rows1.data.push(bi.totalQuantity);
      // xaxis.push(bi.description);
    });
  }

  // rows.push({
  //   description: bi.description,
  //   unit: bi.unit,
  //   rate: bi.unitrate,
  //   quantity: getDecimal(quantity),
  //   taxable: getDecimal(taxable),
  //   gst: getDecimal(gst),
  //   billamount: getDecimal(billamount),
  //   tds: getDecimal(tds),
  //   netPayable: getDecimal(billamount - tds),
  // });

  return { series: [rows, rows1], xaxis };
};
