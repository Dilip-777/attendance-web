import {
  Contractor,
  Deductions,
  FixedValues,
  Safety,
  Stores,
} from '@prisma/client';
import dayjs from 'dayjs';

interface Props {
  contractors: (Contractor & {
    fixedValues: FixedValues[];
    deductions: Deductions[];
    safety: Safety[];
    stores: Stores[];
  })[];
  months: string[];
}

export const getMonthlyData = ({ contractors, months }: Props) => {
  let rows: any[] = [];
  let totals: any = {};

  contractors.forEach((contractor) => {
    months.forEach((month, index) => {
      const store = contractor.stores.find((store) => store.month === month);
      const safety = contractor.safety.find((safety) => safety.month === month);
      const m = dayjs(month, 'MM/YYYY');
      const fixedValue = contractor.fixedValues.find(
        (fixedValue) => fixedValue.month === month
      );
      const deduction = contractor.deductions.find(
        (deduction) => deduction.month === month
      );
      rows.push({
        sno: index + 1,
        contractor: contractor.contractorname,
        month: m.format("MMM'YYYY"),
        billno: fixedValue?.billno || '-',
        billdate: fixedValue?.billdate || '-',
        nature: fixedValue?.serviceDetail || '-',
        place: fixedValue?.areaOfWork || '-',
        days: m.daysInMonth(),
        noofmanpower: fixedValue?.noofmanpower || 0,
        mandays: fixedValue?.mandays || 0,
        othrs: fixedValue?.othrs || 0,
        otmandays: fixedValue?.otdays || 0,
        totaldays: (fixedValue?.mandays || 0) + (fixedValue?.otdays || 0),
        totalavgmanpower: Math.round(
          ((fixedValue?.mandays || 0) + (fixedValue?.otdays || 0)) /
            (m.daysInMonth() || 1)
        ),
        mandaysamt: fixedValue?.mandaysamount || 0,
        othramt:
          (fixedValue?.basicamount || 0) - (fixedValue?.mandaysamount || 0),
        basicamount: fixedValue?.basicamount || 0,

        servicecharges: fixedValue?.servicecharges || 0,
        total:
          (fixedValue?.servicecharges || 0) + (fixedValue?.basicamount || 0),
        gst: fixedValue?.gst || 0,
        billamount: fixedValue?.billamount || 0,
        tds: fixedValue?.tds || 0,
        netamount1: (fixedValue?.billamount || 0) - (fixedValue?.tds || 0),
        gsthold: (deduction?.gstrelease || 0) - (deduction?.gsthold || 0) || 0,
        safety: safety?.totalAmount || 0,
        consumablecharges: store?.totalAmount || 0,
        advance: deduction?.advance || 0,
        deduction: deduction?.anyother || 0,
        addition: deduction?.addition || 0,
        totaldeductions:
          (store?.totalAmount || 0) -
          (safety?.totalAmount || 0) +
          ((deduction?.gstrelease || 0) - (deduction?.gsthold || 0) || 0) -
          (deduction?.advance || 0) -
          (deduction?.anyother || 0) +
          (deduction?.addition || 0),
        finalpayable:
          (fixedValue?.billamount || 0) -
          (fixedValue?.tds || 0) -
          (store?.totalAmount || 0) -
          (safety?.totalAmount || 0) +
          ((deduction?.gstrelease || 0) - (deduction?.gsthold || 0) || 0) -
          (deduction?.advance || 0) -
          (deduction?.anyother || 0) +
          (deduction?.addition || 0),

        debits: 0,
        advances: deduction?.advance || 0,
        consumables: 0,
        penalty: 0,
        retention: 0,
        // gsthold: deduction?.gsthold || 0,
        // totaldeductions:
        //   (deduction?.advance || 0) +
        //   (deduction?.gsthold || 0) +
        //   (fixedValue?.tds || 0),
        holdamountrelease: 0,
        gstrelease: deduction?.gstrelease || 0,
        totalrelease: deduction?.gstrelease || 0,
        netamount:
          (fixedValue?.billamount || 0) -
          ((deduction?.advance || 0) +
            (deduction?.gsthold || 0) +
            (fixedValue?.tds || 0)) +
          (deduction?.gstrelease || 0),
        remarks: '-',
      });
    });
  });
  return rows;
};
