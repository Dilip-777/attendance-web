import {
  BOQ,
  BOQItem,
  BarBending,
  BarBendingItem,
  Measurement,
  MeasurementItem,
  QcsBoq,
  QcsBoqItem,
} from "@prisma/client";
import dayjs from "dayjs";
import { parse } from "path";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

interface Props {
  boqs: (QcsBoq & {
    BOQItems: (QcsBoqItem & {
      measurementItems: (MeasurementItem & { measurement: Measurement })[];
      barBendingItems: (BarBendingItem & { barBending: BarBending })[];
    })[];
  })[];
  month: string;
}

export const getAbstractSheet = ({ boqs, month }: Props) => {
  const beforemonth = dayjs(month, "MM/YYYY")
    .subtract(1, "month")
    .format("MM/YYYY");

  return boqs.map((m) => ({
    ...m,
    BOQItems: m.BOQItems.map((bi) => {
      const prevMeasuremets = bi.measurementItems.filter(
        (mi) =>
          mi.measurement.startDate.includes(beforemonth) &&
          mi.measurement.endDate.includes(beforemonth)
      );
      const currentMeasurements = bi.measurementItems.filter(
        (mi) =>
          mi.measurement.startDate.includes(month) &&
          mi.measurement.endDate.includes(month)
      );

      const prevBarBending = bi.barBendingItems.filter(
        (mi) =>
          mi.barBending.startDate?.includes(beforemonth) &&
          mi.barBending.endDate?.includes(beforemonth)
      );

      const currentBarBending = bi.barBendingItems.filter(
        (mi) =>
          mi.barBending.startDate?.includes(month) &&
          mi.barBending.endDate?.includes(month)
      );

      let prevQuantity = 0;
      let currentQuantity = 0;

      prevMeasuremets.forEach((mi) => {
        prevQuantity += mi.quantity;
      });

      prevBarBending.forEach((mi) => {
        prevQuantity += parseFloat((mi.totalweight || 0).toFixed(2));
        console.log(mi);
      });

      currentMeasurements.forEach((mi) => {
        currentQuantity += mi.quantity || 0;
      });

      currentBarBending.forEach((mi) => {
        currentQuantity += parseFloat((mi.totalweight || 0).toFixed(2));
      });

      const totalQuantity = m.totalQuantity;

      return {
        ...bi,
        prevQuantity: prevQuantity,
        currentQuantity: currentQuantity,
        totalQuantity: parseFloat((prevQuantity + currentQuantity).toFixed(2)),
        balance: parseFloat(
          (totalQuantity - prevQuantity - currentQuantity).toFixed(2)
        ),
        unitRate: bi.unitrate,
        prevBill: parseFloat((prevQuantity * bi.unitrate).toFixed(2)),
        currentBill: parseFloat((currentQuantity * bi.unitrate).toFixed(2)),
        balanceBill: parseFloat(
          (
            (totalQuantity - prevQuantity - currentQuantity) *
            bi.unitrate
          ).toFixed(2)
        ),
        totalBill: parseFloat(
          ((prevQuantity + currentQuantity) * bi.unitrate).toFixed(2)
        ),
      };
    }),
  }));
};
