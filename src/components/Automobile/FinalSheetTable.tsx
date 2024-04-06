import { Grid, Stack, Typography } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Deductions } from "@prisma/client";

const headcells = [
  { id: "vehicleNo", label: "Vehicle No", cell: (row: any) => row.vehicleNo },
  {
    id: "vehicleType",
    label: "Vehicle Type",
    cell: (row: any) => row.vehicleType,
  },
  { id: "charges", label: "Vehicle Charges", cell: (row: any) => row.charges },
  {
    id: "paymentMode",
    label: "Payment Calculate Structure",
    cell: (row: any) => row.paymentMode,
  },
  {
    id: "rate",
    label: "Payment Calculation Rate",
    cell: (row: any) => row.rate,
  },
  {
    id: "running",
    label: "Running (Duration/Distance)",
    cell: (row: any) => (
      <Grid container columnSpacing={4}>
        {row.running.hrs && (
          <>
            <Grid item xs={6}>
              HRS
            </Grid>
            <Grid item xs={6}>
              {row.running.hrs}
            </Grid>
          </>
        )}
        <Grid item xs={6}>
          Days
        </Grid>
        <Grid item xs={6}>
          {row.running.days}
        </Grid>
        {row.running.kms && (
          <>
            <Grid item xs={6}>
              KMS
            </Grid>
            <Grid item xs={6}>
              {row.running.kms}
            </Grid>
          </>
        )}
      </Grid>
    ),
  },
  { id: "taxable", label: "Taxable Amount", cell: (row: any) => row.taxable },
  { id: "gst", label: "GST", cell: (row: any) => row.gst },
  {
    id: "billamount",
    label: "Bill Amount",
    cell: (row: any) => row.billamount,
  },
  { id: "tds", label: "TDS", cell: (row: any) => row.tds },
  { id: "netamount", label: "Net Amount", cell: (row: any) => row.netamount },
];

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
}

export default function FinalSheetTable({
  data,
  total,
  hsdcost,
  cost,
  colspans,
  deduction,
  fixed,
}: Props) {
  const data1 = [
    {
      description: "• Hiring Cost Charged In P & L",
      costprev: cost?.prevHiringCost,
      costmonth: cost?.monthHiringCost,
      costupto: cost?.ytdHiringCost,
    },
    {
      description: "• HSD consumed (in Ltr.)",
      costprev: cost?.prevHsdConsumed,
      costmonth: cost?.monthHsdConsumed,
      costupto: cost?.ytdHsdConsumed,
    },
    {
      description: "• HSD Rate charged (per Ltr.)",
      costprev: cost?.prevHsdRate,
      costmonth: cost?.monthHsdRate,
      costupto: cost?.ytdHsdRate,
    },
    {
      description: "• Cost of HSD",
      costprev: cost?.prevHsdCost,
      costmonth: cost?.monthHsdCost,
      costupto: cost?.ytdHsdCost,
    },
    {
      description: "• Cost borned (Hiring + HSD) by the Compnay",
      costprev: cost?.prevCost,
      costmonth: cost?.monthCost,
      costupto: cost?.ytdCost,
    },
  ];
  return (
    <Stack spacing={3}>
      {data.map((sheet, index) => (
        <Stack key={index}>
          <h3>{sheet.heading}</h3>
          <TableContainer
            sx={{
              // maxHeight: "calc(100vh - 16rem)",
              overflowY: "auto",
              scrollBehavior: "smooth",
              "&::-webkit-scrollbar": {
                height: 10,
                width: 10,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#bdbdbd",
                borderRadius: 2,
              },
            }}
          >
            <Table>
              <TableHead sx={{ bgcolor: "#eeeeee" }}>
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
                        {headcell.cell(row) ?? ""}
                      </TableCell>
                    ))}
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
                        align="center"
                        sx={{ fontWeight: "600", fontSize: "1.1rem" }}
                      >
                        Final Payout Information
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={colspans ? colspans[0] : 7}
                      ></TableCell>
                      <TableCell sx={{ fontWeight: "600" }} colSpan={4}>
                        Net Amount Payable
                      </TableCell>
                      <TableCell sx={{ fontWeight: "600" }}>{total}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={colspans ? colspans[0] : 7}
                      ></TableCell>
                      <TableCell sx={{ fontWeight: "600" }} colSpan={4}>
                        GST Hold (if any)
                      </TableCell>
                      <TableCell sx={{ fontWeight: "600" }}>
                        {(deduction?.gstrelease || 0) -
                          (deduction?.gsthold || 0) || 0}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={colspans ? colspans[0] : 7}
                      ></TableCell>
                      <TableCell sx={{ fontWeight: "600" }} colSpan={4}>
                        Consumables / Chargeable Items
                      </TableCell>
                      <TableCell sx={{ fontWeight: "600" }}>
                        {hsdcost}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={colspans ? colspans[0] : 7}
                      ></TableCell>
                      <TableCell sx={{ fontWeight: "600" }} colSpan={4}>
                        Adjustment of Advance Amount
                      </TableCell>
                      <TableCell sx={{ fontWeight: "600" }}>
                        {deduction?.advance || 0}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={colspans ? colspans[0] : 7}
                      ></TableCell>
                      <TableCell sx={{ fontWeight: "600" }} colSpan={4}>
                        Any Other Deductions (If any)
                      </TableCell>
                      <TableCell sx={{ fontWeight: "600" }}>
                        {deduction?.anyother}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={colspans ? colspans[0] : 7}
                      ></TableCell>
                      <TableCell sx={{ fontWeight: "700" }} colSpan={4}>
                        Final Payable
                      </TableCell>
                      <TableCell sx={{ fontWeight: "600" }}>
                        {Math.round(
                          total +
                            hsdcost +
                            ((deduction?.gstrelease || 0) -
                              (deduction?.gsthold || 0) || 0) -
                            (deduction?.advance || 0) -
                            (deduction?.anyother || 0)
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
          <Typography variant="h4">
            CONTRACTOR MONTHLY COST CHARGED IN PROFIT & LOSS A/C FOR THE CURRENT
            FINANCIAL YEAR
          </Typography>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "#eeeeee" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Descriptions
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Cost for the previous Month
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Cost for the Month (MTD)
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Cost upto this month (YTD)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data1.map((row, index) => (
                  <TableRow>
                    <TableCell align="center">{row.description}</TableCell>
                    <TableCell align="center">{row.costprev}</TableCell>
                    <TableCell align="center">{row.costmonth}</TableCell>
                    <TableCell align="center">{row.costupto}</TableCell>
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
