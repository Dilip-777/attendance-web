import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import {
  Autocomplete,
  Box,
  Button,
  FormLabel,
  Paper,
  Stack,
  TextField,
} from '@mui/material';
import MonthSelect from '@/ui-component/MonthSelect';
import dayjs, { Dayjs } from 'dayjs';
import {
  Contractor,
  DebitNote,
  FixedValues,
  HOAuditor,
  OtherAddition,
  OtherDeduction,
} from '@prisma/client';
import prisma from '@/lib/prisma';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import axios from 'axios';

export default function NoteSheet({
  contractors,
}: {
  contractors: Contractor[];
}) {
  const [value, setValue] = useState<string>(dayjs().format('MM/YYYY'));
  const [selectedContractor, setSelectedContractor] = useState<string>(
    contractors.length > 0 && contractors[0].contractorId
      ? contractors[0]?.contractorId
      : ''
  );
  const [hoCommercial, setHoCommercial] = useState<
    | (HOAuditor & {
        debitNotes: DebitNote[];
        otherAdditions: OtherAddition[];
        otherDeductions: OtherDeduction[];
      })
    | null
  >(null);
  const [fixedData, setFixedData] = useState<FixedValues | null>(null);

  const contractor = contractors.find(
    (c) => c.contractorId === selectedContractor
  );

  const fetchData = async () => {
    const res = await axios.get(
      '/api/notesheet?contractorId=' + contractor?.id + '&month=' + value
    );

    if (res.data) {
      setHoCommercial(res.data.hoCommercial);
      setFixedData(res.data.fixedData);
    }
  };

  useEffect(() => {
    fetchData();
  }, [contractor, value]);

  console.log(hoCommercial, fixedData);

  const onChange = (value: Dayjs | null) =>
    setValue(value?.format('MM/YYYY') || '');

  console.log(
    hoCommercial?.debitNotes.length,
    150 + ((hoCommercial?.debitNotes.length || 0) + 10) * 1
  );
  const generatePdf = () => {
    let extra = 0;
    const doc = new jsPDF();

    const logoUrl = '/logo.png';
    doc.addImage(logoUrl, 'PNG', 20, 10, 25, 20);

    doc.setFontSize(18);
    doc.text('NOTE SHEET', 100, 20);

    doc.line(5, 35, 200, 35);
    doc.line(60, 10, 60, 400);

    // Body content
    doc.setFontSize(10);
    doc.text('R/MD.Sir,', 5, 40);

    doc.setFont('Helvetica', 'bold');

    doc.text('DOR', 5, 50);

    doc.text('SAP', 5, 60);

    doc.text('TDS', 5, 70);

    doc.text('GST', 5, 80);

    doc.text('GSTR-1', 5, 90);

    doc.text('GSTR-3B', 5, 100);

    doc.text('WO', 5, 110);

    doc.text('Remarks', 5, 120);

    doc.setFont('Helvetica', 'normal');

    doc.text(hoCommercial?.date || '-', 30, 50);

    doc.text(hoCommercial?.sapstatus || '-', 30, 60);

    doc.text(hoCommercial?.tdsstatus || '-', 30, 70);

    doc.text(hoCommercial?.gststatus || '-', 30, 80);

    doc.text(hoCommercial?.gstr1 || '-', 30, 90);

    doc.text(hoCommercial?.gstr3b || '-', 30, 100);

    doc.text(hoCommercial?.wostatus || '-', 30, 110);

    doc.text(hoCommercial?.remarks || '-', 30, 120, { maxWidth: 30 });

    // Content
    doc.setFont('Helvetica', 'bold');

    doc.text('Contractor Name: ', 70, 60);

    doc.text('Work Description: ', 70, 70);

    doc.text('Bill Details:', 70, 90);

    doc.text('Invoice No: ', 70, 100);

    doc.text('Invoice Date: ', 70, 110);

    doc.text('Total Bill Amount: ', 70, 120);

    doc.text('TDS: ', 70, 130);

    doc.text('Net Payable: ', 70, 140);

    hoCommercial?.debitNotes.forEach((debitNote, index) => {
      doc.text(`Debit Note ${index + 1}: `, 70, 150 + 10 * index);
    });

    let start1 = 150 + 10 * (hoCommercial?.debitNotes.length || 0);

    hoCommercial?.otherDeductions.forEach((otherDeduction, index) => {
      doc.text(`${otherDeduction.label}: `, 70, start1 + 10 * index);
    });

    start1 += 10 * (hoCommercial?.otherDeductions.length || 0);

    hoCommercial?.otherAdditions.forEach((otherAddition, index) => {
      doc.text(`${otherAddition.label}: `, 70, start1 + 10 * index);
    });

    doc.text(
      'Final Payable: ',
      70,
      150 +
        10 * (hoCommercial?.debitNotes.length || 0) +
        10 * (hoCommercial?.otherDeductions.length || 0) +
        10 * (hoCommercial?.otherAdditions.length || 0)
    );

    doc.setFont('Helvetica', 'normal');
    doc.text(contractor?.contractorname || '-', 110, 60);

    doc.text(hoCommercial?.workDescription || '-', 110, 70, { maxWidth: 90 });

    doc.text(hoCommercial?.invoiceNo || '-', 110, 100);

    doc.text(hoCommercial?.date || '-', 110, 110);

    doc.text(
      'Rs. ' + hoCommercial?.totalbillAmount.toLocaleString('en-IN') || '-',
      110,
      120
    );

    doc.text(
      'Rs. ' +
        (hoCommercial?.tds || 0).toLocaleString('en-IN') +
        '   @ ' +
        (contractor?.tds || 0)?.toString() +
        '%',
      110,
      130
    );

    doc.text(
      'Rs. ' + hoCommercial?.netbillAmount.toLocaleString('en-IN') || '-',
      110,
      140
    );

    hoCommercial?.debitNotes.forEach((debitNote, index) => {
      extra += debitNote.netamount;
      doc.text(
        'Rs. ' + debitNote.netamount.toLocaleString('en-IN') || '-',
        110,
        150 + 10 * index
      );
    });

    let start = 150 + 10 * (hoCommercial?.debitNotes.length || 0);

    hoCommercial?.otherDeductions.forEach((otherDeduction, index) => {
      extra += otherDeduction.amount;
      doc.text(
        'Rs. ' + otherDeduction.amount.toLocaleString('en-IN') || '-',
        110,
        start + 10 * index
      );
    });

    start += 10 * (hoCommercial?.otherDeductions.length || 0);

    hoCommercial?.otherAdditions.forEach((otherAddition, index) => {
      extra -= otherAddition.amount;
      doc.text(
        'Rs. ' + otherAddition.amount.toLocaleString('en-IN') || '-',
        110,
        start + 10 * index
      );
    });

    doc.text(
      'Rs. ' +
        ((hoCommercial?.netbillAmount || 0) - extra).toLocaleString('en-IN'),
      110,
      150 +
        10 * (hoCommercial?.debitNotes.length || 0) +
        10 * (hoCommercial?.otherDeductions.length || 0) +
        10 * (hoCommercial?.otherAdditions.length || 0)
    );
    doc.save('note_sheet.pdf');
  };

  return (
    <Paper
      sx={{
        p: 3,
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
          <FormLabel sx={{ fontWeight: '700' }}>Select Contractor</FormLabel>
          <Autocomplete
            options={contractors.map((c) => ({
              value: c.contractorId || '',
              label: c.contractorname,
            }))}
            value={contractors
              .map((c) => ({
                value: c.contractorId || '',
                label: c.contractorname,
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
      </Stack>
      <Button
        onClick={generatePdf}
        variant='contained'
        color='secondary'
        sx={{
          mt: 2,
        }}
      >
        Download
      </Button>
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

  const contractors = await prisma.contractor.findMany({
    orderBy: { contractorname: 'asc' },
    where: {
      servicedetail: {
        notIn: ['Civil'],
      },
    },
  });

  return {
    props: { contractors },
  };
};
