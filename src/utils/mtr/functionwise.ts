import {
  Contractor,
  Department,
  FixedDepartments,
  FixedValues,
} from '@prisma/client';
import dayjs from 'dayjs';

const getRoundOff = (value: number) => {
  return parseFloat(value.toFixed(2));
};

export const getFunctionRows = (
  divisions: (Department & {
    contractors: (Contractor & {
      fixedValues: (FixedValues & {
        departments: FixedDepartments[];
      })[];
    })[];
  })[],
  months: string[]
) => {
  let rows: any[] = [];

  let totals: any = {
    heading: 'Grand Total',
    total: { mandays: 0, avgs: 0, amount: 0 },
  };

  divisions.forEach((d) => {
    rows.push({ heading: d.department, fontWeight: '600' });

    let subtotals: any = { total: { mandays: 0, avgs: 0, amount: 0 } };
    d.contractors.forEach((c) => {
      const row: any = {
        heading: c.contractorname,
        total: { mandays: 0, avgs: 0, amount: 0 },
      };

      months.map((m) => {
        if (!subtotals[m]) {
          subtotals[m] = { mandays: 0, avgs: 0, amount: 0 };
        }

        if (!row[m]) {
          row[m] = { mandays: 0, avgs: 0, amount: 0 };
        }
        const fixedValues = c.fixedValues.find((f) => months.includes(f.month));
        const data =
          fixedValues?.departments.filter((f) => fixedValues.month === m) || [];
        const daysInMonth = dayjs(m, 'MM/YYYY').daysInMonth() || 1;

        row[m] = {
          mandays: getRoundOff(
            data.reduce((acc, curr) => acc + curr.mandays, 0)
          ),
          avgs: getRoundOff(
            data.reduce((acc, curr) => acc + curr.mandays / daysInMonth, 0)
          ),
          amount: getRoundOff(data.reduce((acc, curr) => acc + curr.amount, 0)),
        };

        subtotals[m].mandays += row[m].mandays;
        subtotals[m].avgs += row[m].avgs;
        subtotals[m].amount += row[m].amount;

        if (!totals[m]) {
          totals[m] = { mandays: 0, avgs: 0, amount: 0 };
        }

        totals[m].mandays += row[m].mandays;
        totals[m].avgs += row[m].avgs;
        totals[m].amount += row[m].amount;

        row['total'].mandays = getRoundOff(
          (row['total'].mandays || 0) + row[m].mandays
        );
        row['total'].avgs = getRoundOff((row['total'].avgs || 0) + row[m].avgs);
        row['total'].amount = getRoundOff(
          (row['total'].amount || 0) + row[m].amount
        );
        subtotals.total.mandays += row[m].mandays;
        subtotals.total.avgs += row[m].avgs;
        subtotals.total.amount += row[m].amount;
        totals.total.mandays += row[m].mandays;
        totals.total.avgs += row[m].avgs;
        totals.total.amount += row[m].amount;
      });
      rows.push(row);

      // rows.push({ heading: "Sub-Total", fontWeight: "600", ...subtotals });
    });
    rows.push({ heading: 'Sub-Total', fontWeight: '600', ...subtotals });
  });

  rows.push({ fontWeight: '700', ...totals });

  return rows;
};
