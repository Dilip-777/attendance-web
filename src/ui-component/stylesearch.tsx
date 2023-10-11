import Search from '@mui/icons-material/Search';
import { InputAdornment, OutlinedInput, OutlinedInputProps, alpha, styled } from '@mui/material';

interface Props extends OutlinedInputProps {}

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 300,
  height: 40,
  marginRight: 30,

  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

interface Props extends OutlinedInputProps {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchInput({ filter, setFilter, placeholder }: Props) {
  return (
    <StyledSearch
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      placeholder={placeholder}
      startAdornment={
        <InputAdornment position="start">
          <Search />
        </InputAdornment>
      }
    />
  );
}
