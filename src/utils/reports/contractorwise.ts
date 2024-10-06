import {
  Contractor,
  Employee,
  FixedDesignations,
  FixedValues,
} from '@prisma/client';
import dayjs from 'dayjs';

interface Props {
  contractors: (Contractor & {
    fixedValues: (FixedValues & {
      designations: FixedDesignations[];
    })[];
    employee: Employee[];
  })[];
  month: string;
}

export const getContractorWiseReport = ({ contractors, month }: Props) => {
  const daysInMonth = dayjs(month, 'MM/YYYY').daysInMonth();
  const rows: any[] = [];
  contractors.forEach((contractor) => {
    if (contractor.contractorId === 'AK002') {
      console.log(contractor);
    }
    contractor.fixedValues.forEach((fixedValue) => {
      fixedValue.designations.forEach((designation) => {
        const otDays =
          designation.othrs / (designation.allowed_wrking_hr_per_day || 1);

        const manpower = contractor.employee.filter(
          (employee) => employee.designationId === designation.designationId
        ).length;

        const avgmanpower = Math.round(
          (designation.mandays + otDays) / (daysInMonth || 1)
        );
        const totalamount = designation.mandaysamount + designation.otamount;
        const servicechargeamount = Math.round(
          (fixedValue.servicechargeRate * totalamount) / 100
        );
        const taxable = totalamount + servicechargeamount;
        const gst = Math.round((taxable * fixedValue.gstValue) / 100);
        const billamount = taxable + gst;
        const tds = Math.round((taxable * fixedValue.tdsValue) / 100);
        const netpayable = billamount - tds;

        rows.push({
          contractorCode: contractor.contractorId,
          contractorName: contractor.contractorname,
          month: month,
          billno: fixedValue.billno,
          billdate: fixedValue.billdate,
          nature: contractor.areaofwork,
          department: designation.department,
          designation: designation.designation,
          manpower: manpower,
          totaldays: daysInMonth,
          avgmanpower: avgmanpower,
          shifthrs: designation.allowed_wrking_hr_per_day,
          mandays: designation.mandays,
          rate: designation.salary,
          mandaysamount: designation.mandays * designation.salary,
          othrs: designation.othrs,
          otamount: designation.otamount,
          totalamount: totalamount,
          servicecharge: fixedValue.servicechargeRate,
          servicechargeamount: Math.round(
            (fixedValue.servicechargeRate * totalamount) / 100
          ),
          taxable,
          gst,
          billamount,
          tds,
          netpayable,
        });
      });
    });
  });
  return rows;
};
