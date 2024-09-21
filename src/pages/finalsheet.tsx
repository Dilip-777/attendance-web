import prisma from '@/lib/prisma';
import FormSelect from '@/ui-component/FormSelect';
import MonthSelect from '@/ui-component/MonthSelect';
import getTotalAmountAndRows from '@/utils/getmonthlycount';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  Contractor,
  Deductions,
  Department,
  Designations,
  Employee,
  FixedDesignations,
  FixedValues,
  HOAuditor,
  Payments,
  Safety,
  SeperateSalary,
  Shifts,
  Stores,
  TimeKeeper,
  Workorder,
} from '@prisma/client';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import FinalSheetta from '@/components/Table/finalsheet';
import { print } from '@/components/PrintFinalSheet';
import Details from '@/components/Table/details';
// import PrintModal from "@/components/PrintFinalSheet/PrintModal";
import dynamic from 'next/dynamic';
import {
  Autocomplete,
  Chip,
  FormControl,
  FormLabel,
  TextField,
} from '@mui/material';
import { gethourlycount } from '@/utils/getfinalhourlycount';
import { HourlyPrint } from '@/components/PrintFinalSheet/printhourlyexcel';
import { printMonthly } from '@/components/PrintFinalSheet/printmonthly';
import { getDepartmentwiseCount } from '@/utils/getdepartmentwisecount';
const PrintModal = dynamic(
  () => import('@/components/PrintFinalSheet/PrintModal')
);

interface d extends Department {
  designations: DesignationwithSalary[];
}

interface DesignationwithSalary extends Designations {
  seperateSalary: SeperateSalary[];
  employees: Employee[];
}

interface ContractorwithDepartment extends Contractor {
  departments: d[];
  _count: {
    employee: number;
  };
}

export default function FinalSheet({
  contractors,
  workorders,
  // departments,
  designations,
  shifts,
}: {
  contractors: ContractorwithDepartment[];
  workorders: Workorder[];
  // departments: d[];
  designations: DesignationwithSalary[];
  shifts: Shifts[];
}) {
  const [value, setValue] = useState<string>(dayjs().format('MM/YYYY'));
  const [selectedContractor, setSelectedContractor] = useState<string>(
    contractors.length > 0 && contractors[0].contractorId
      ? contractors[0]?.contractorId
      : ''
  );
  const [departments, setDepartments] = useState<d[]>([]);
  const [rows, setRows] = useState<any>([]);
  const [timekeepers, setTimekeepers] = useState<TimeKeeper[]>([]);
  const [totalPayable, setTotalPayable] = useState<number>(0);
  const [department, setDepartment] = useState<string>(
    departments?.length > 0 ? departments[0].department : ''
  );
  const [selectedDepartments, setSelectedDepartments] = useState<d[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [store, setStore] = useState<Stores | null>(null);
  const [safety, setSafety] = useState<Safety[]>([]);
  const [details, setDetails] = useState<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [totalsRows, setTotalsRows] = useState<any>([]);
  const [hourlyrows, setHourlyRows] = useState<any>([]);
  const [hourlytotals, setHourlyTotals] = useState<any>();
  const [deduction, setDeduction] = useState<Deductions | null>(null);
  const [hoCommercial, setHoCommercial] = useState<HOAuditor | null>(null);
  const [fixedValues, setFixedValues] = useState<
    | (FixedValues & {
        designations: FixedDesignations[];
      })
    | null
  >(null);
  const [fixedvaluesTrack, setFixedValuesTrack] = useState<
    {
      departmentId: string;
      mandays: number;
      amount: number;
      servicecharges: number;
      mandaysamount: number;
    }[]
  >([]);
  const [fixed, setFixed] = useState<any>(null);
  const f = contractors.find((c) => c.contractorId === selectedContractor);
  const [payment, setPayment] = useState<Payments | null>(null);

  const { data: session } = useSession();

  const fetchPayments = async () => {
    const res = await axios.get(
      `/api/payments?contractorId=${selectedContractor}&month=${value}`
    );
    setPayment(res.data);
  };

  const daysInMonth = dayjs(value, 'MM/YYYY').daysInMonth();

  const fetchHourlyRows = () => {
    let totalOtDays = 0;
    const { rows, total, otdays, otHrs } = gethourlycount(
      timekeepers,
      f as Contractor,
      departments.filter((d) => d.basicsalary_in_duration === 'Hourly'),
      fixedValues,
      daysInMonth,
      shifts
    );

    console.log(otHrs);

    totalOtDays += otdays;
    setHourlyRows(rows);

    setHourlyTotals(total);
    let totalrows: any[] = [];
    const totals: any = {};

    setTotalPayable(0);

    let r1 = { ...rows };

    let d1: {
      departmentId: string;
      mandays: number;
      amount: number;
      servicecharges: number;
      mandaysamount: number;
    }[] = [];

    selectedDepartments
      .filter((d) => d.basicsalary_in_duration !== 'Hourly')
      .forEach((d) => {
        const { rows1, totalnetPayable, otdays, otHrs } = getTotalAmountAndRows(
          timekeepers.filter((t: TimeKeeper) => t.department === d.department),
          dayjs(value, 'MM/YYYY').month() + 1,
          dayjs(value, 'MM/YYYY').year(),
          selectedContractor,
          contractors.find(
            (c) => c.contractorId === selectedContractor
          ) as Contractor,

          designations.filter(
            (de) =>
              d.designations.find((des) => des.id === de.id) &&
              de.employees.length > 0
          ),
          fixedValues?.designations || null
        );

        console.log(rows1);

        totalOtDays += otdays;
        rows1.forEach((item) => {
          const { date, ...values } = item;
          if (!totals[date]) {
            totals[date] = { date, total: 0 };
          }
          totals[date][d.department] = item.total;
          totals[date].total += item.total;
        });
        totalrows.push({ date: d.department, ...rows1[rows1.length - 1] });

        const mandays = rows1[0];
        const mandaysamount = rows1[2];
        const servicecharges = rows1[7];
        const billamount = rows1[10];

        // d1.push({
        //   departmentId: d.id,
        //   mandays: Math.round(row2.total),
        //   amount: Math.round(row.total),
        // });

        d1.push({
          departmentId: d.id,
          mandays: mandays.total,
          mandaysamount: mandaysamount.total,
          servicecharges: servicecharges.total,
          amount: billamount.total,
        });

        r1 = { ...r1, [d.department]: rows1 };

        // setRows({ ...rows, [d.department]: rows1 });
        setTotalPayable((prev) => prev + totalnetPayable);
      });

    const totalOfTotal: any = { date: 'Total', total: 0 };
    Object.keys(totals).forEach((key) => {
      totalOfTotal[key] = totals[key].total;
      totalOfTotal.total += totals[key].total;
    });

    setTotalsRows(totals);
    setRows(r1);

    const departwise = getDepartmentwiseCount({
      timekeeper: timekeepers,
      contractor: f as Contractor,
      departments: departments.filter(
        (d) => d.basicsalary_in_duration === 'Hourly'
      ),
      fixedValues: fixedValues,
      month: value,
      shifts: shifts,
    });

    setFixedValuesTrack([...departwise, ...d1]);

    setFixed({
      mandays: (total.mandays || 0) + (totals['Total Man days']?.total || 0),
      gst: (total.gst || 0) + (totals['GST']?.total || 0),
      tds: (total.tds || 0) + (totals['TDS']?.total || 0),
      othrs: (total.othrs || 0) + (totals['Overtime Hrs.']?.total || 0),
      otdays: parseFloat(totalOtDays.toFixed(2)),
      mandaysamount:
        (total.mandaysamount || 0) + (totals['Man Days Amount']?.total || 0),
      basicamount:
        ((total.mandaysamount as number) || 0) +
        ((total.otamount as number) || 0) +
        (totals['Man Days Amount']?.total || 0) +
        (totals['OT Amount']?.total || 0),
      billamount: (total.billamount || 0) + (totals['Bill Amount']?.total || 0),
      servicecharges:
        (total.servicechargeamount || 0) +
        (totals['Service Charge Amount']?.total || 0),
    });
  };

  const fetchHoCommercial = async () => {
    const c = contractors.find((c) => c.contractorId === selectedContractor);
    const res = await axios.get(`/api/hoauditor?contractorId=${c?.id}`);
    setHoCommercial(res.data);
  };

  useEffect(() => {
    fetchHoCommercial();
  }, [selectedContractor]);

  const fetchDeductions = async () => {
    const res = await axios.get(
      `/api/deductions?contractorId=${selectedContractor}&date=${value}`
    );
    setDeduction(res.data);
  };

  useEffect(() => {
    fetchDeductions();
  }, [selectedContractor, value]);

  useEffect(() => {
    fetchHourlyRows();
  }, [departments, timekeepers, fixedValues]);

  const handleClose = () => {
    setOpen(false);
  };

  const fetchFixedValues = async () => {
    const res = await axios.get(
      `/api/fixedvalues?contractorId=${selectedContractor}&month=${value}`
    );
    setFixedValues(res.data);
  };

  const handleFixedValues = async () => {
    let fixedDesignations: any[] = [];

    console.log(f?.departments);

    f?.departments.forEach((d) => {
      d.designations.forEach((de) => {
        console.log(de, 'designation', de.designation);

        const designation = designations.find((des) => des.id === de.id);
        if (designation?.employees.length !== 0)
          fixedDesignations.push({
            designationId: de.id,
            designation: de.designation,
            gender: de.gender,
            allowed_wrking_hr_per_day: de.allowed_wrking_hr_per_day,
            servicecharge: de.servicecharge,
            basicsalary_in_duration: de.basicsalary_in_duration,
            salary:
              designation?.seperateSalary.find(
                (a) => a.contractorId === selectedContractor
              )?.salary || de.basicsalary,
          });
      });
    });

    const body = {
      contractorId: selectedContractor,
      month: value,
      salarymen8hr: f?.salarymen8hr,
      salarymen12hr: f?.salarymen12hr,
      salarysvr8hr: f?.salarysvr8hr,
      salarysvr12hr: f?.salarysvr12hr,
      salarywomen8hr: f?.salarywomen8hr,

      designations: fixedDesignations,
      fixedvaluesTrack,
      noofmanpower: f?._count.employee,
      billno: hoCommercial?.invoiceNo,
      billdate: hoCommercial?.date,
      ...fixed,
    };

    try {
      await axios.post('/api/fixedvalues', body);
      fetchFixedValues();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (f?.departments) {
      setDepartments(f.departments);
    }
  }, [selectedContractor]);

  const fetchStoreAndSafety = async () => {
    const res = await axios.get(
      `/api/stores?contractorid=${selectedContractor}&month=${value}`
    );
    setStore(res.data);
    const res1 = await axios.get(
      `/api/safety?contractorid=${selectedContractor}&month=${value}`
    );
    setSafety(res1.data);
  };

  const fetchTimekeepers = async () => {
    const res = await axios.get(
      `/api/gettimekeeper?contractor=${selectedContractor}&month=${value}`
    );

    setTimekeepers(res.data);
  };

  const fetchPayouts = async () => {
    const res = await axios.get(
      `/api/payouttracker?contractorid=${selectedContractor}&month=${value}`
    );

    setDetails(res.data);
  };

  const fetchAll = async () => {
    setLoading(true);
    await fetchFixedValues();
    await fetchStoreAndSafety();
    await fetchPayouts();
    await fetchTimekeepers();
    await fetchPayments();
    setLoading(false);
  };

  const handleHourlyPrint = () => {
    HourlyPrint({
      rows: hourlyrows,
      total: 0,
      departments: departments.filter(
        (d) => d.basicsalary_in_duration === 'Hourly'
      ),
      contractor: f as Contractor,
      month: value,
      payouttracker: details?.payoutracker,
      prevMonthAmount: Math.ceil(details?.prevMonthAmount),
      prevprevMonthAmount: Math.ceil(details?.prevprevMonthAmount),
      prevYearAmount: Math.ceil(details?.prevYearAmount),
      safety: safety[0],
      store: store,
      totals: hourlytotals,
      workorder: w,
      deduction: deduction,
      hoCommercial: hoCommercial,
      payment: payment,
    });
  };

  const handleMonthlyPrint = () => {
    printMonthly({
      designations: designations,
      departments: selectedDepartments.filter(
        (d) => d.basicsalary_in_duration !== 'Hourly'
      ),
      total: totalPayable,
      rows: rows,
      safety: safety[0],
      store: store,
      contractor: f as Contractor,
      date: value,
      workorder: w,
      month: value,
      payouttracker: details?.payoutracker,
      prevMonthAmount: Math.ceil(details?.prevMonthAmount),
      prevprevMonthAmount: Math.ceil(details?.prevprevMonthAmount),
      prevYearAmount: Math.ceil(details?.prevYearAmount),
      totals: totalsRows,
      deduction: deduction,
      hoCommercial: hoCommercial,
      payment: payment,
    });
  };

  useEffect(() => {
    fetchAll();
  }, [selectedContractor, value, selectedDepartments]);

  // console.log(timekeepers, rows, totalPayable, loading);

  const onChange = (value: Dayjs | null) =>
    setValue(value?.format('MM/YYYY') || '');

  const w = workorders.find((c) => c.contractorId === f?.contractorId);

  return loading ? (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      width='100%'
      height='90vh'
    >
      <CircularProgress sx={{ color: '#673ab7' }} />
    </Box>
  ) : (
    <Paper
      sx={{
        overflow: 'auto',
        p: 3,
        maxHeight: 'calc(100vh - 6rem)',
        scrollBehavior: 'smooth',
        '&::-webkit-scrollbar': {
          height: 10,
          width: 9,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#bdbdbd',
          borderRadius: 2,
        },
      }}
    >
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Stack
            direction='row'
            flexWrap='wrap'
            alignItems='center'
            spacing={2}
            sx={{ width: '100%' }}
          >
            <Box sx={{ minWidth: 240 }}>
              <FormLabel sx={{ fontWeight: '700' }}>
                Select Contractor
              </FormLabel>
              <Autocomplete
                options={contractors.map((c) => ({
                  value: c.contractorId || '',
                  label: c.contractorname,
                }))}
                value={contractors
                  .map((c) => ({
                    value: c.contractorId || '',
                    label: c.contractorname + ' - ' + c.contractorId,
                  }))
                  .find((c) => c.value === selectedContractor)}
                onChange={(e, value) =>
                  setSelectedContractor(value?.value as string)
                }
                clearIcon={null}
                disableClearable={true}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>
            <MonthSelect
              label='Select Date'
              value={dayjs(value, 'MM/YYYY')}
              onChange={onChange}
            />
            <FormControl sx={{ minWidth: '15rem' }}>
              <FormLabel sx={{ fontWeight: '700' }}>Department</FormLabel>

              <Autocomplete
                onChange={(event: any, newValue: string | null) => {
                  if (
                    !selectedDepartments.find((d) => d.department === newValue)
                  ) {
                    console.log(newValue);

                    const d = departments.find(
                      (d) => d.department === newValue
                    );
                    console.log(d, departments);

                    if (d) {
                      setSelectedDepartments([...selectedDepartments, d as d]);
                    }
                  }
                  setInputValue('');
                }}
                value={inputValue}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                id='controllable-states-demo'
                options={[
                  ...departments
                    .filter((d) => d.basicsalary_in_duration !== 'Hourly')
                    .map((d) => d.department),
                ]}
                renderInput={(params) => (
                  <TextField {...params} placeholder='Select a Department' />
                )}
                clearIcon={null}
              />
            </FormControl>
          </Stack>
          {!fixedValues && session?.user?.role === 'Corporate' && (
            <Button
              variant='contained'
              color='secondary'
              sx={{ height: 'fit-content' }}
              onClick={handleFixedValues}
            >
              Freeze
            </Button>
          )}
          {fixedValues && session?.user?.role === 'Corporate' && (
            <Button
              variant='contained'
              color='secondary'
              sx={{ height: 'fit-content' }}
              onClick={async () => {
                await axios.delete(
                  `/api/fixedvalues?contractorId=${selectedContractor}&month=${value}`
                );
                fetchFixedValues();

                // setFixedValues(null);
              }}
            >
              Unfreeze
            </Button>
          )}

          {/* <Button
            variant="contained"
            sx={{
              ml: "auto",
              width: "7rem",
              alignSelf: "flex-end",
              justifySelf: "space-between",
              mb: 2,
            }}
            onClick={() => setOpen(true)}
          >
            Print
          </Button> */}
          {/* <PrintPdf
            designations={designations}
            department={
              departments.find((d) => d.department === department) as Department
            }
            totalnetPayable={totalPayable}
            rows1={rows}
            store={store}
            safety={safety}
            details={details}
          /> */}
        </Box>
        <Divider sx={{ my: 2 }} />
        <Stack direction='row' spacing={2}>
          {selectedDepartments.map((d) => (
            <Chip
              key={d.department}
              label={d.department}
              onDelete={() =>
                setSelectedDepartments(
                  selectedDepartments.filter(
                    (department) => department.department !== d.department
                  )
                )
              }
            />
          ))}
        </Stack>
        <Typography variant='h4' sx={{ mb: 4, my: 2 }}>
          Contractor Details :
        </Typography>
        <Details
          rows={[
            { label: 'Contractor Id', value: selectedContractor.toString() },
            { label: 'Contractor Name', value: f?.contractorname as string },
            { label: 'Mobile Number', value: f?.mobilenumber as string },
            { label: 'Office Address', value: f?.officeaddress as string },
            { label: 'Pan Number', value: f?.pancardno as string },
            { label: 'Area of Work', value: f?.areaofwork as string },
            {
              label: 'Type of Contractor',
              value: f?.typeofcontractor as string,
            },
          ]}
        />
        <Divider sx={{ my: 2 }} />
        <Typography variant='h4' sx={{ mt: 2, mb: 4 }}>
          Service Details :
        </Typography>
        <Details
          rows={[
            { label: 'Work Order Id', value: w?.id as string },
            { label: 'Nature of Work', value: w?.nature as string },
            { label: 'Location', value: w?.location as string },
            { label: 'Start Date', value: w?.startDate as string },
            { label: 'End Date', value: w?.endDate as string },
          ]}
        />
      </Box>
      <Divider sx={{ my: 2 }} />
      {loading ? (
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          width='100%'
          height='90vh'
        >
          <CircularProgress sx={{ color: '#673ab7' }} />
        </Box>
      ) : (
        <FinalSheetta
          rows={rows}
          total={totalPayable}
          department={departments.find((d) => d.department === department)}
          storededuction={store?.totalAmount || 0}
          safetydeduction={safety[0]?.totalAmount ?? 0}
          designations={designations}
          departments={selectedDepartments}
          totals={totalsRows}
          hourlyrows={hourlyrows}
          hourlytotals={hourlytotals}
          handleHourlyPrint={handleHourlyPrint}
          handleMonthlyPrint={handleMonthlyPrint}
          deduction={deduction}
        />
      )}
      <Divider sx={{ my: 2 }} />
      <Typography variant='h4' sx={{ mt: 2, mb: 4 }}>
        Contractors Monthly Cost Charged in Profit & Loss for a Financial Year :
      </Typography>
      <Details
        rows={[
          {
            label: 'Cost of Previous Month',
            value: Math.ceil(details?.prevMonthAmount || 0)?.toString(),
          },
          {
            label: 'Cost of the Month',
            value: Math.ceil(details?.prevprevMonthAmount || 0)?.toString(),
          },
          {
            label: 'Cost Upto This Month',
            value: Math.ceil(totalPayable).toString(),
          },
          {
            label: 'Cost Of the Previous Year',
            value: Math.ceil(details?.prevYearAmount || 0)?.toString(),
          },
        ]}
      />

      <Divider sx={{ my: 2 }} />
      <Typography variant='h4' sx={{ mt: 2, mb: 4 }}>
        Bank Account Information :
      </Typography>
      <Details
        rows={[
          { label: 'Beneficial Name', value: f?.beneficialname as string },
          { label: 'Account Number', value: f?.bankaccountnumber as string },
          { label: 'IFSC Code', value: f?.ifscno as string },
          {
            label: 'Payment Date',
            value: payment?.paymentdate || ('-' as string),
          },
          {
            label: 'Payment Reference Number',
            value: payment?.paymentrefno || '-',
          },
          {
            label: 'Paid Amount',
            value: payment?.paidamount.toString() || '-',
          },
        ]}
      />
      <PrintModal
        contractor={f as Contractor}
        date={value}
        open={open}
        // setOpen={setOpen}
        handleClose={handleClose}
      />
    </Paper>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  if (
    !(
      session.user?.role === 'Corporate' ||
      session.user?.role === 'AccountsTaxation'
    )
  ) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const contractors = await prisma.contractor.findMany({
    orderBy: { contractorname: 'asc' },
    where: {
      servicedetail: {
        notIn: ['Fixed', 'Equipment / Vehicle Hiring'],
      },
    },
    include: {
      _count: {
        select: {
          employee: true,
        },
      },

      departments: {
        include: {
          designations: {
            include: {
              employees: {
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  const workorders = await prisma.workorder.findMany();
  const designations = await prisma.designations.findMany({
    include: {
      seperateSalary: true,
      employees: {
        take: 1,
      },
    },
  });

  const shifts = await prisma.shifts.findMany();
  return {
    props: { contractors, workorders, designations, shifts },
  };
};
