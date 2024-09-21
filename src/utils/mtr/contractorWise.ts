import { Contractor, FixedValues } from '@prisma/client';
import dayjs from 'dayjs';

interface Props {
  contractors: Contractor[];
  months: string[];
  fixedValues: FixedValues[];
}

export const getContractorWiseFixedValues = ({
  contractors,
  months,
  fixedValues,
}: Props) => {
  let rows: any[] = [];

  let totals: any = {};

  months.forEach((month) => {
    let row: any = {
      heading: dayjs(month, 'MM/YYYY').format("MMM'YYYY"),
      fontWeight: '600',
    };
    let mandays: any = { heading: 'Mandays' };
    let cost: any = { heading: 'Cost' };
    let servicecharges: any = { heading: 'Service Charges' };
    let total: any = { heading: 'Total', fontWeight: '600' };

    contractors.forEach((contractor) => {
      const isExist = fixedValues.find(
        (fixedValue) =>
          fixedValue.contractorId === contractor.contractorId &&
          fixedValue.month === month
      );
      mandays[contractor.contractorId] = isExist?.mandays || 0;
      cost[contractor.contractorId] = isExist?.basicamount || 0;
      servicecharges[contractor.contractorId] = isExist?.servicecharges || 0;
      total[contractor.contractorId] =
        (isExist?.basicamount || 0) + (isExist?.servicecharges || 0);
      totals[contractor.contractorId] =
        (totals[contractor.contractorId] || 0) +
        (isExist?.basicamount || 0) +
        (isExist?.servicecharges || 0);
    });
    rows.push(row, mandays, cost, servicecharges, total);
  });

  rows.push({ heading: 'Grand Total', ...totals, fontWeight: '700' });

  return rows;
};
