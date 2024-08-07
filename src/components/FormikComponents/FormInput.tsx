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
  name: string;
  label?: string;
  placeHolder: string;
  disabled?: boolean;
  sx?: Object;
}

const FormInput: React.FC<Props> = ({
  name,
  label,
  placeHolder,
  disabled,
  sx,
  ...props
}) => {
  const [field, meta] = useField(name);
  const isError = Boolean(meta.touched && meta.error);
  return (
    <FormControl
      color="secondary"
      fullWidth
      error={isError}
      disabled={disabled}
      sx={{ my: 2 }}
    >
      {label && (
        <FormLabel sx={{ fontWeight: "700", my: 0.5 }}>{label}</FormLabel>
      )}
      <OutlineInputStyle
        sx={{ maxWidth: { xs: 250, xl: 300 }, width: "100%", ...sx }}
        id="input-search-header"
        placeholder={placeHolder}
        aria-describedby="search-helper-text"
        inputProps={{ "aria-label": "weight" }}
        {...field}
        {...props}
      />
      {isError && (
        <FormHelperText sx={{ color: "#f44336" }}>{meta.error}</FormHelperText>
      )}
    </FormControl>
  );
};

export default FormInput;
