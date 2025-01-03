import {
  BarBending,
  BarBendingItem,
  BOQ,
  BOQItem,
  Measurement,
  MeasurementItem,
  QcsBoq,
  QcsBoqItem,
  Workorder,
} from '@prisma/client';
import dayjs from 'dayjs';
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

interface Props {
  boq: (QcsBoq & {
    BOQItems: (QcsBoqItem & {
      measurementItems: (MeasurementItem & { measurement: Measurement })[];
      barBendingItems: (BarBendingItem & { barBending: BarBending })[];
    })[];
  })[];
  workorder: Workorder | null;
}

export const getBoq = ({ boq, workorder }: Props) => {
  const headcells = [
    {
      id: 'slno',
      label: 'Sl No',
      cell: (row: any, index: number) => index + 1,
      colspan: 1,
    },
    { id: 'type', label: 'Type', cell: (row: any) => row.type, colspan: 1 },
    { id: 'code', label: 'Code', cell: (row: any) => row.code, colspan: 1 },
    {
      id: 'description',
      label: 'Description',
      cell: (row: any) => row.description,
      colspan: 1,
    },
    { id: 'rate', label: 'Rate', cell: (row: any) => row.quantity, colspan: 1 },
    {
      id: 'worktobedone',
      label: 'Work to be done',
      cell: (row: any) => row.rate,
      colspan: 3,
    },
    { id: 'unit', label: 'Unit', cell: (row: any) => row.unit, colspan: 1 },
    {
      id: 'workdone',
      label: 'Work Done',
      cell: (row: any) => row.amount,
      colspan: 0,
    },
    { id: 'total', label: 'Total', cell: (row: any) => row.amount, colspan: 1 },
    {
      id: 'balance',
      label: 'Balance',
      cell: (row: any) => row.amount,
      colspan: 1,
    },
  ];

  const headcells2 = [
    {
      id: 'slno',
      label: '',
      cell: (row: any, index: number) => index + 1,
      colspan: 1,
    },
    { id: 'type', label: '', cell: (row: any) => row.type, colspan: 1 },
    { id: 'code', label: '', cell: (row: any) => row.code, colspan: 1 },
    {
      id: 'description',
      label: '',
      cell: (row: any) => row.description,
      colspan: 1,
    },
    { id: 'rate', label: '', cell: (row: any) => row.rate, colspan: 1 },
    {
      id: 'asperdrawing',
      label: 'As per drawing',
      cell: (row: any) => row.worktobedone.asperdrawing,
      colspan: 1,
    },
    {
      id: 'extrawork',
      label: 'Extra Work',
      cell: (row: any) => row.worktobedone.extrawork,
      colspan: 1,
    },
    {
      id: 'total',
      label: 'Total',
      cell: (row: any) => row.worktobedone.totalQuantity,
      colspan: 1,
    },
    { id: 'unit', label: '', cell: (row: any) => row.unit, colspan: 1 },
  ];

  const startDate = dayjs(workorder?.startDate || '02/08/2024', 'DD/MM/YYYY');
  const endDate = dayjs(workorder?.endDate || '05/10/2024', 'DD/MM/YYYY');

  let currentDate = startDate;

  while (
    currentDate.isBefore(endDate) ||
    currentDate.isSame(endDate, 'month')
  ) {
    const id = `${currentDate.month() + 1}/${currentDate.year()}`;

    headcells[7] = {
      id: 'workdone',
      label: 'Work Done',
      cell: (row: any) => row.amount,
      colspan: headcells[7].colspan + 1,
    };

    headcells2.push({
      id: id,
      label: currentDate.format('MMMM').slice(0, 3),
      cell: (row: any) => row.workdone[id],
      colspan: 1,
    });

    currentDate = currentDate.add(1, 'month').startOf('month');
  }

  const getRow = (
    item: BOQItem & {
      measurementItems: (MeasurementItem & { measurement: Measurement })[];
    }
  ) => {
    const startDate = dayjs(workorder?.startDate || '02/08/2024', 'DD/MM/YYYY');
    const endDate = dayjs(workorder?.endDate || '05/10/2024', 'DD/MM/YYYY');

    let currentDate = startDate;

    let row: any = {};

    let total = 0;

    while (
      currentDate.isBefore(endDate) ||
      currentDate.isSame(endDate, 'month')
    ) {
      const id = `${currentDate.month() + 1}/${currentDate.year()}`;
      const filtered = item.measurementItems.filter(
        (m) =>
          m.measurement.startDate.endsWith(id) &&
          m.measurement.endDate.endsWith(id)
      );
      let quantity = 0;

      filtered.forEach((f) => {
        quantity += f.quantity || 0;
      });

      row = {
        ...row,
        [id]: quantity,
      };

      total += quantity || 0;
      currentDate = currentDate.add(1, 'month').startOf('month');
    }

    return { obj: row, total };
  };

  const rows: any[] = [];

  boq.forEach((b) => {
    //  addRows(b.measurements, rows, b.BOQItems)

    b.BOQItems.forEach((item, index) => {
      const { obj, total } = getRow(item);
      let row = {
        type: b.description,
        code: b.itemcode,
        description: item.description,
        rate: item.unitrate,
        worktobedone: {
          asperdrawing: 0,
          extrawork: 0,
          totalQuantity: item.quantity,
        },
        unit: item.unit,
        workdone: {
          ...obj,
        },
        // ...obj,
        total: total,
        balance: item.quantity - total,
      };

      rows.push(row);
    });
  });

  headcells2.push({
    id: 'total',
    label: '',
    cell: (row: any) => row.total,
    colspan: 1,
  });

  headcells2.push({
    id: 'balance',
    label: '',
    cell: (row: any) => row.balance,
    colspan: 1,
  });

  return { rows, headcells, headcells2 };
};
