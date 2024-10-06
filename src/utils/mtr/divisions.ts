import { Department, FixedDepartments, FixedValues } from '@prisma/client';
import dayjs from 'dayjs';

export const getDivisionRows = (
  divisions: (Department & {
    fixedDepartments: (FixedDepartments & { fixedValues: FixedValues })[];
  })[],
  months: string[]
) => {
  let rows: any[] = [];

  let totals: any = {
    mandays: {},
    avgs: {},
    amount: {},
  };

  divisions.forEach((d) => {
    rows.push({ heading: d.department, fontWeight: '700' });
    let mandays: any = {};
    let avgs: any = {};
    let amount: any = {};

    months.forEach((m) => {
      const data = d.fixedDepartments.filter((f) => f.fixedValues.month === m);

      const daysInMonth = dayjs(m, 'MM/YYYY').daysInMonth() || 1;

      mandays[m] = data.reduce((acc, curr) => acc + curr.mandays, 0);
      avgs[m] = Math.round(
        data.reduce((acc, curr) => acc + curr.mandays / daysInMonth, 0)
      );
      amount[m] = parseFloat(
        data.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)
      );
      mandays['total'] = Math.round((mandays['total'] || 0) + mandays[m]);
      avgs['total'] = Math.round((avgs['total'] || 0) + avgs[m]);
      amount['total'] = Math.round((amount['total'] || 0) + amount[m]);
      totals.mandays[m] = (totals.mandays[m] || 0) + mandays[m];
      totals.avgs[m] = (totals.avgs[m] || 0) + avgs[m];
      totals.amount[m] = (totals.amount[m] || 0) + amount[m];
      totals.mandays['total'] = (totals.mandays['total'] || 0) + mandays[m];
      totals.avgs['total'] = (totals.avgs['total'] || 0) + avgs[m];
      totals.amount['total'] = (totals.amount['total'] || 0) + amount[m];
    });

    rows.push({ heading: 'Mandays', ...mandays });
    rows.push({ heading: 'Average', ...avgs });
    rows.push({ heading: 'Cost', ...amount });
  });

  rows.push({ heading: 'Total', fontWeight: '700' });

  rows.push({ heading: 'Mandays', ...totals.mandays, fontWeight: '600' });
  rows.push({ heading: 'Average', ...totals.avgs, fontWeight: '600' });
  rows.push({ heading: 'Cost', ...totals.amount, fontWeight: '600' });

  return rows;
};
