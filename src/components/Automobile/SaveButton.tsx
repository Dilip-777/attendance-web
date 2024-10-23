import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { useRouter } from 'next/router';
import { CircularProgress } from '@mui/material';

export default function SaveButton({
  contractorId,
  month,
  cost,
  fixedValues,
  total,
  fixed,
}: {
  contractorId: string;
  month: string;
  cost: {
    monthHiringCost: number;
    monthHsdCost: number;
    monthHsdConsumed: number;
    monthHsdRate: number;
    monthCost: number;
  };
  fixedValues: any;
  total: number;
  fixed: any;
}) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (fixedValues) {
        await axios.delete(`/api/finalCalculations?id=${fixedValues.id}`);
        router.replace(router.asPath);
        return;
      }
      await axios.post('/api/finalCalculations', {
        contractorId: contractorId,
        month: month,
        hiringCharged: parseFloat(cost.monthHiringCost.toFixed(2)),
        hsdCost: parseFloat(cost.monthHsdCost.toFixed(2)),
        hsdConsumed: parseFloat(cost.monthHsdConsumed.toFixed(2)),
        hsdRateCharged: parseFloat(cost.monthHsdRate.toFixed(2)),
        totalCost: parseFloat(cost.monthCost.toFixed(2)),
        finalPayable: parseFloat(total.toFixed(2)),
        fixed: fixed,
      });
      router.replace(router.asPath);
      setOpen(true);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  return (
    <>
      <Button
        variant='contained'
        color='secondary'
        onClick={() => handleSubmit()}
        disabled={loading}
      >
        {loading && (
          <CircularProgress size={15} sx={{ mr: 1, color: '#364152' }} />
        )}
        {fixedValues ? 'Unfreeze' : 'freeze'}
      </Button>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity='success'
          variant='filled'
          sx={{ width: '100%' }}
        >
          Changes Successfully Saved!
        </Alert>
      </Snackbar>
    </>
  );
}
