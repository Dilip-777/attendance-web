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

interface Props {
  boq: (QcsBoq & {
    BOQItems: (QcsBoqItem & {
      measurementItems: (MeasurementItem & { measurement: Measurement })[];
      barBendingItems: (BarBendingItem & { barBending: BarBending })[];
    })[];
  })[];
  month: string;
}

const getDecimal = (num: number) => {
  return parseFloat(num.toFixed(3));
};

export const getBoqFinalSheet = ({ boq, month }: Props) => {
  const tables: any[] = [];

  let totalsRow: any[] = [];
  let totalsObj = {
    taxable: 0,
    gst: 0,
    billamount: 0,
    tds: 0,
    netPayable: 0,
  };

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

      bi.barBendingItems
        .filter(
          (mi) =>
            mi.barBending.startDate.includes(month) &&
            mi.barBending.endDate.includes(month)
        )
        .forEach((mi) => {
          quantity += parseFloat((mi.totalweight || 0).toFixed(2));
        });

      const taxable = bi.unitrate * quantity;
      const gst = taxable * 0.18;
      const billamount = taxable + gst;
      const tds = taxable * 0.02;

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

  totalsRow.push({
    code: "",
    description: "Total",
    ...totalsObj,
  });

  return { tables, totalsRow, total: totalsObj.netPayable };
};
