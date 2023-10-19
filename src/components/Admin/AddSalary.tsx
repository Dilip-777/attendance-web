import FormSelect from '@/ui-component/FormSelect';
import {
  Button,
  CircularProgress,
  Divider,
  FormHelperText,
  FormLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Contractor } from '@prisma/client';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Props {
  contractors: Contractor[];
  designation: string;
  handleClose: () => void;
  fetchDesignations: () => void;
}

export default function AddSalary({ contractors, designation, handleClose, fetchDesignations }: Props) {
  const [contractor, setContractor] = useState(contractors[0].contractorId);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchSalary = async () => {
    const res = await axios.get('/api/salary?contractorId=' + contractor + '&designationId=' + designation);
    if (res.data) {
      setValue(res.data.salary);
    } else {
      setValue('');
    }
  };

  const handleSubmit = async () => {
    if (!value) {
      setError(true);
      return;
    }
    setLoading(true);
    const res = await axios.post('/api/salary', {
      contractorId: contractor,
      designationId: designation,
      salary: parseInt(value),
    });
    setLoading(false);

    handleClose();
  };

  useEffect(() => {
    fetchSalary();
  }, [contractor, designation]);
  console.log(value);

  return (
    <Paper
      sx={{
        pt: '1rem',
        px: '2rem',
        overflow: 'hidden auto',
        scrollBehavior: 'smooth',
        '&::-webkit-scrollbar': {
          width: 8,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#bdbdbd',
          borderRadius: 2,
        },
      }}
    >
      <Typography variant="h3" sx={{ mb: 1 }}>
        Add Salary
      </Typography>
      <Divider />
      <Stack spacing={2} sx={{ mt: 2 }}>
        <FormSelect
          value={contractor}
          label="Contractor"
          options={contractors.map((contractor) => ({
            label: contractor.contractorname,
            value: contractor.contractorId,
          }))}
          handleChange={(e) => setContractor(e as string)}
          placeholder="Select Contractor"
        />
        <Stack>
          <FormLabel error={error} sx={{ fontWeight: '700' }}>
            Salary
          </FormLabel>
          <TextField
            value={value}
            error={error}
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
            }}
            // label="Salary"
            variant="outlined"
            placeholder="Enter Salary"
            fullWidth
          />
          {error && <FormHelperText error>Please enter salary</FormHelperText>}
        </Stack>

        <Button
          variant="contained"
          sx={{ float: 'right', mr: 10, width: 300 }}
          disabled={loading}
          onClick={() => handleSubmit()}
        >
          Submit
          {loading && <CircularProgress size={15} sx={{ ml: 1, color: '#364152' }} />}
        </Button>
      </Stack>
    </Paper>
  );
}
