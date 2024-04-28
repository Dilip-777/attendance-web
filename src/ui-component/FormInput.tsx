import {
  FormControl,
  FormHelperText,
  FormLabel,
  InputProps,
  OutlinedInput,
  styled,
} from "@mui/material";
import { shouldForwardProp } from "@mui/system";
import { useField } from "formik";

const OutlineInputStyle: any = styled(OutlinedInput, { shouldForwardProp })(
  ({ theme }) => ({
    // width: 350,
    // marginLeft: 16,
    paddingLeft: 16,
    paddingRight: 16,
    "& input": {
      background: "transparent !important",
      paddingLeft: "4px !important",
    },
    [theme.breakpoints.down("lg")]: {
      width: 250,
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
      marginLeft: 4,
      background: "#fff",
    },
  })
);

interface Props extends InputProps {
  label?: string;
  sx?: Object;
}

const FormInput: React.FC<Props> = ({ label, disabled, sx, ...props }) => {
  return (
    <FormControl color="secondary" fullWidth disabled={disabled} sx={{ my: 2 }}>
      {label && (
        <FormLabel sx={{ fontWeight: "700", my: 0.5 }}>{label}</FormLabel>
      )}
      <OutlineInputStyle
        sx={{ maxWidth: { xs: 250, xl: 300 }, width: "100%", ...sx }}
        id="input-search-header"
        aria-describedby="search-helper-text"
        inputProps={{ "aria-label": "weight" }}
        {...props}
      />
    </FormControl>
  );
};

export default FormInput;
