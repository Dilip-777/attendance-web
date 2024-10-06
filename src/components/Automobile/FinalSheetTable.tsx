import { Grid, Stack, Typography } from '@mui/material';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Deductions } from '@prisma/client';

interface Props {
  data: {
    heading: string;
    headcells: any[];
    data: any[];
  }[];
  colspans?: number[];
  total: number;
  hsdcost: number;
  cost?: {
    ytdHiringCost: number;
    ytdHsdCost: number;
    ytdHsdConsumed: number;
    ytdHsdRate: number;
    ytdCost: number;
    prevHiringCost: number;
    monthHiringCost: number;
    prevHsdCost: number;
    monthHsdCost: number;
    prevHsdConsumed: number;
    monthHsdConsumed: number;
    prevHsdRate: number;
    monthHsdRate: number;
    prevCost: number;
    monthCost: number;
  };
  deduction: Deductions | null;
  fixed?: boolean;
  safetyAmount?: number;
  totalsdata?: any[];
}

export default function FinalSheetTable({
  data,
  total,
  hsdcost,
  cost,
  colspans,
  deduction,
  fixed,
  safetyAmount,
  totalsdata,
}: Props) {
  const data1 = [
    {
      description: '• Hiring Cost Charged In P & L',
      costprev: cost?.prevHiringCost,
      costmonth: cost?.monthHiringCost,
      costupto: cost?.ytdHiringCost,
    },
    {
      description: '• HSD consumed (in Ltr.)',
      costprev: cost?.prevHsdConsumed,
      costmonth: cost?.monthHsdConsumed,
      costupto: cost?.ytdHsdConsumed,
    },
    {
      description: '• HSD Rate charged (per Ltr.)',
      costprev: cost?.prevHsdRate,
      costmonth: cost?.monthHsdRate,
      costupto: cost?.ytdHsdRate,
    },
    {
      description: '• Cost of HSD',
      costprev: cost?.prevHsdCost,
      costmonth: cost?.monthHsdCost,
      costupto: cost?.ytdHsdCost,
    },
    {
      description: '• Cost borned (Hiring + HSD) by the Compnay',
      costprev: cost?.prevCost,
      costmonth: cost?.monthCost,
      costupto: cost?.ytdCost,
    },
  ];
  console.log(deduction, 'deductions');

  return (
    <Stack spacing={3}>
      {data.map((sheet, index) => (
        <Stack key={index}>
          <h3>{sheet.heading}</h3>
          <TableContainer
            sx={{
              // maxHeight: "calc(100vh - 16rem)",
              overflowY: 'auto',
              scrollBehavior: 'smooth',
              '&::-webkit-scrollbar': {
                height: 10,
                width: 10,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#bdbdbd',
                borderRadius: 2,
              },
            }}
          >
            <Table>
              <TableHead sx={{ bgcolor: '#eeeeee' }}>
                <TableRow>
                  {sheet.headcells.map((headcell, index) => (
                    <TableCell
                      sx={{ fontWeight: 600 }}
                      key={headcell.id + index.toString()}
                    >
                      {headcell.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sheet.data.map((row, index) => (
                  <TableRow key={index}>
                    {sheet.headcells.map((headcell) => (
                      <TableCell key={headcell.id}>
                        {headcell.cell(row) ?? ''}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {totalsdata &&
                  index === 0 &&
                  totalsdata.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell align='center' colSpan={6}>
                        {row.vehicleNo}
                      </TableCell>
                      <TableCell align='center'>{row.taxable}</TableCell>
                      <TableCell align='center'>{row.gst}</TableCell>
                      <TableCell align='center'>{row.billamount}</TableCell>
                      <TableCell align='center'>{row.tds}</TableCell>
                      <TableCell align='center'>{row.netamount}</TableCell>
                    </TableRow>
                  ))}
                {index === data.length - 1 && (
                  <>
                    <TableRow>
                      <TableCell colSpan={13}></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={13}
                        align='center'
                        sx={{ fontWeight: '600', fontSize: '1.1rem' }}
                      >
                        Final Payout Information
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={colspans ? colspans[0] : 7}
                      ></TableCell>
                      <TableCell sx={{ fontWeight: '600' }} colSpan={4}>
                        Net Amount Payable
                      </TableCell>
                      <TableCell sx={{ fontWeight: '600' }}>{total}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={colspans ? colspans[0] : 7}
                      ></TableCell>
                      <TableCell sx={{ fontWeight: '600' }} colSpan={4}>
                        GST Hold (if any)
                      </TableCell>
                      <TableCell sx={{ fontWeight: '600' }}>
                        {(deduction?.gstrelease || 0) -
                          (deduction?.gsthold || 0) || 0}
                      </TableCell>
                    </TableRow>
                    {(safetyAmount || safetyAmount === 0) && (
                      <TableRow>
                        <TableCell
                          colSpan={colspans ? colspans[0] : 7}
                        ></TableCell>
                        <TableCell sx={{ fontWeight: '600' }} colSpan={4}>
                          Safety Penalty / Extra PPE / Extra Helment
                        </TableCell>
                        <TableCell sx={{ fontWeight: '600' }}>
                          -{safetyAmount || 0}
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell
                        colSpan={colspans ? colspans[0] : 7}
                      ></TableCell>
                      <TableCell sx={{ fontWeight: '600' }} colSpan={4}>
                        Consumables / Chargeable Items
                      </TableCell>
                      <TableCell sx={{ fontWeight: '600' }}>
                        {(hsdcost || 0) * -1}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={colspans ? colspans[0] : 7}
                      ></TableCell>
                      <TableCell sx={{ fontWeight: '600' }} colSpan={4}>
                        Adjustment of Advance Amount
                      </TableCell>
                      <TableCell sx={{ fontWeight: '600' }}>
                        -{deduction?.advance || 0}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={colspans ? colspans[0] : 7}
                      ></TableCell>
                      <TableCell sx={{ fontWeight: '600' }} colSpan={4}>
                        Any Other Deductions (If any)
                      </TableCell>
                      <TableCell sx={{ fontWeight: '600' }}>
                        -{deduction?.anyother || 0}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={colspans ? colspans[0] : 7}
                      ></TableCell>
                      <TableCell sx={{ fontWeight: '600' }} colSpan={4}>
                        Any Other Additions (If any)
                      </TableCell>
                      <TableCell sx={{ fontWeight: '600' }}>
                        {deduction?.addition || 0}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={colspans ? colspans[0] : 7}
                      ></TableCell>
                      <TableCell sx={{ fontWeight: '700' }} colSpan={4}>
                        Final Payable
                      </TableCell>
                      <TableCell sx={{ fontWeight: '600' }}>
                        {Math.round(
                          total -
                            (safetyAmount || 0) -
                            hsdcost +
                            ((deduction?.gstrelease || 0) -
                              (deduction?.gsthold || 0) || 0) -
                            (deduction?.advance || 0) -
                            (deduction?.anyother || 0) +
                            (deduction?.addition || 0)
                        )}
                      </TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      ))}
      {!fixed && (
        <Stack spacing={1}>
          <Typography variant='h4'>
            CONTRACTOR MONTHLY COST CHARGED IN PROFIT & LOSS A/C FOR THE CURRENT
            FINANCIAL YEAR
          </Typography>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#eeeeee' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }} align='center'>
                    Descriptions
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align='center'>
                    Cost for the previous Month
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align='center'>
                    Cost for the Month (MTD)
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align='center'>
                    Cost upto this month (YTD)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data1.map((row, index) => (
                  <TableRow>
                    <TableCell align='center'>{row.description}</TableCell>
                    <TableCell align='center'>
                      {Math.round(row.costprev || 0)}
                    </TableCell>
                    <TableCell align='center'>
                      {Math.round(row.costmonth || 0)}
                    </TableCell>
                    <TableCell align='center'>
                      {Math.round(row.costupto || 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      )}
    </Stack>
  );
}
