import AutoComplete from '@/ui-component/Autocomplete';
import FormInput from '@/ui-component/FormInput';
import FormSelect from '@/ui-component/FormSelect';
import MonthSelect from '@/ui-component/MonthSelect';
import NavigateBefore from '@mui/icons-material/NavigateBefore';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  Modal,
  Slide,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Contractor, Deductions, GstRelease } from '@prisma/client';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

const style = {
  position: 'absolute',
  overflowY: 'auto',
  borderRadius: '15px',
  bgcolor: 'background.paper',
  boxShadow: 24,
};

export default function AddDeductions({
  handleClose,
  deduction,
  contractors,
  open,
}: {
  handleClose: () => void;
  deduction: GstRelease | undefined;
  contractors: Contractor[];
  open: boolean;
}) {
  const [contractorId, setContractorId] = useState<string>('');
  const [month, setMonth] = useState<string>(dayjs().format('MM/YYYY'));
  const [invoiceNo, setInvoiceNo] = useState<string>('');
  const [invoiceDate, setInvoiceDate] = useState<Dayjs>(dayjs());
  const [gstin, setGstin] = useState<string>('');
  const [gstHoldDate, setGstHoldDate] = useState<Dayjs>(dayjs());
  const [gstReleaseDate, setGstReleaseDate] = useState<Dayjs>(dayjs());
  const [gsthold, setGsthold] = useState<number>(0);
  const [gstrelease, setGstrelease] = useState<number>(0);
  const [advance, setAdvance] = useState<number>(0);
  const [anyother, setAnyother] = useState<number>(0);
  const [paidIn, setPaidIn] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [addition, setAddition] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await axios.post('/api/deductions/release', {
        contractorId: contractorId,
        month: month,
        invoiceNo: invoiceNo,
        invoiceDate: invoiceDate.format('DD/MM/YYYY'),
        gstin: gstin,
        gstHoldDate: gstHoldDate.format('DD/MM/YYYY'),
        gstReleaseDate: gstReleaseDate.format('DD/MM/YYYY'),
        gsthold: Number(gsthold),
        paidIn: paidIn,

        gstrelease: gstrelease,
        advance: advance,
        anyother: anyother,
        addition: addition,
        remarks: remarks,
      });
      handleClose();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deduction) {
      setContractorId(deduction.contractorId);
      setMonth(deduction.month);
      setGsthold(deduction.gsthold);
      setGstrelease(deduction.gstrelease);
      setAdvance(deduction.advance);
      setAnyother(deduction.anyother);
      setRemarks(deduction?.remarks || '');
      setAddition(deduction.addition);
      setPaidIn(deduction?.paidIn || '');
      setInvoiceNo(deduction?.invoiceNo || '');
      setGstin(deduction?.gstin || '');
      setInvoiceDate(dayjs(deduction?.invoiceDate));
      setGstHoldDate(dayjs(deduction?.gstHoldDate));
      setGstReleaseDate(dayjs(deduction?.gstReleaseDate));
    }
  }, [deduction]);

  return (
    <div>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        sx={{ display: 'flex', justifyContent: ' flex-end' }}
      >
        <Slide
          direction={'left'}
          timeout={500}
          in={open}
          mountOnEnter
          unmountOnExit
        >
          <Box
            p={{ xs: 0, sm: 2 }}
            width={{ xs: '100%', sm: 400 }}
            height={{ xs: '70%', sm: '100%' }}
            top={{ xs: '30%', sm: '0' }}
            sx={style}
          >
            <Stack sx={{ overflowY: 'auto' }} p={3}>
              <Typography sx={{ fontSize: '1.2rem', fontWeight: '700' }}>
                <IconButton
                  onClick={handleClose}
                  sx={{
                    // zIndex: 2,
                    padding: '5px',

                    marginRight: '1rem',
                    background: 'white',
                    ':hover': { background: 'white' },
                  }}
                >
                  <NavigateBefore fontSize='large' />
                </IconButton>
                Deductions
              </Typography>
              <Divider />
              <FormControl fullWidth sx={{ mt: 2 }} color='secondary'>
                <Stack width='100%' spacing={4}>
                  <AutoComplete
                    options={contractors.map((contractor) => ({
                      label: contractor.contractorname,
                      value: contractor.contractorId,
                    }))}
                    // ={(e) => setContractorId(e as string)}
                    value={contractorId}
                    setValue={(e) => setContractorId(e as string)}
                    label='Contractor'
                  />
                  <MonthSelect
                    value={dayjs(month, 'MM/YYYY')}
                    onChange={(value: Dayjs | null) =>
                      setMonth(value?.format('MM/YYYY') || '')
                    }
                  />

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box
                      sx={{
                        minWidth: 200,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <FormLabel sx={{ fontWeight: '700' }}>
                        Invoice Date
                      </FormLabel>
                      <DatePicker
                        value={invoiceDate}
                        onChange={(newValue) => {
                          setInvoiceDate(newValue as Dayjs);
                        }}
                        format='DD/MM/YYYY'
                      />
                    </Box>
                  </LocalizationProvider>

                  <FormInput
                    label='Invoice No.'
                    fullWidth
                    value={invoiceNo}
                    onChange={(e) => setInvoiceNo(e.target.value)}
                  />

                  <FormInput
                    label='GSTIN'
                    fullWidth
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                  />

                  <FormInput
                    label='GST Hold'
                    fullWidth
                    value={gsthold}
                    onChange={(e) => setGsthold(e.target.value as any)}
                    type='number'
                  />

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box
                      sx={{
                        minWidth: 200,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <FormLabel sx={{ fontWeight: '700' }}>
                        GST Hold Date
                      </FormLabel>
                      <DatePicker
                        value={gstHoldDate}
                        onChange={(newValue) => {
                          setGstHoldDate(newValue as Dayjs);
                        }}
                        format='DD/MM/YYYY'
                      />
                    </Box>
                  </LocalizationProvider>

                  <FormInput
                    label='Misc. Payment'
                    fullWidth
                    value={gstrelease}
                    onChange={(e) => setGstrelease(Number(e.target.value))}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box
                      sx={{
                        minWidth: 200,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <FormLabel sx={{ fontWeight: '700' }}>
                        GST Release Date
                      </FormLabel>
                      <DatePicker
                        value={gstReleaseDate}
                        onChange={(newValue) => {
                          setGstReleaseDate(newValue as Dayjs);
                        }}
                        format='DD/MM/YYYY'
                      />
                    </Box>
                  </LocalizationProvider>
                  <FormInput
                    label='Advance'
                    fullWidth
                    value={advance}
                    onChange={(e) => setAdvance(Number(e.target.value))}
                  />
                  <FormInput
                    label='Any Other Deduction'
                    fullWidth
                    value={anyother}
                    onChange={(e) => setAnyother(Number(e.target.value))}
                  />
                  <FormInput
                    label='Any Other Addition'
                    fullWidth
                    value={addition}
                    onChange={(e) => setAddition(Number(e.target.value))}
                  />
                  <FormInput
                    label='Paid In'
                    fullWidth
                    value={paidIn}
                    onChange={(e) => setPaidIn(e.target.value)}
                  />
                  <FormInput
                    label='Remarks'
                    fullWidth
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </Stack>
                <Button
                  type='submit'
                  variant='contained'
                  sx={{ mt: 3, float: 'right' }}
                  disabled={loading}
                  onClick={() => handleSubmit()}
                  color='secondary'
                >
                  Submit
                  {loading && (
                    <CircularProgress
                      size={15}
                      sx={{ ml: 1, color: '#364152' }}
                    />
                  )}
                </Button>
              </FormControl>
            </Stack>
          </Box>
        </Slide>
      </Modal>
    </div>
  );
}
