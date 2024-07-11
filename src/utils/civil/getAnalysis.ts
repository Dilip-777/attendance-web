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
  month: string;
}

export const getAnalysisSeries = ({ boq, month }: Props) => {
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
    name: "Pending work",
    data: [],
  };

  const xaxis: string[] = [];

  boq?.BOQItems.forEach((bi, index) => {
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

    bi.barBendingItems
      .filter(
        (mi) =>
          mi.barBending.startDate.includes(month) &&
          mi.barBending.endDate.includes(month)
      )
      .forEach((mi) => {
        quantity += parseFloat((mi.totalweight || 0).toFixed(2));
      });
    rows.data.push(quantity);
    rows1.data.push(bi.totalQuantity);
    xaxis.push(bi.description);
  });

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
