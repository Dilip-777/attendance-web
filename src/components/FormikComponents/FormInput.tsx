import {
  FormControl,
  FormHelperText,
  FormLabel,
  InputBase,
  InputProps,
  OutlinedInput,
  styled,
  TextField,
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

const LabelInput = styled(InputBase, { shouldForwardProp })(({ theme }) => ({
  width: "100%",
  background: "#fff",
  border: "none",
  outline: "none",
  padding: "8px 16px",
  fontWeight: "700",
  my: 0.5,
  "& input": {
    color: "#697586",
  },
}));

interface Props extends InputProps {
  name: string;
  label?: string;
  placeHolder: string;
  disabled?: boolean;
  editedableLabel?: boolean;
  labelValue?: string;
  onChangeLabel?: (e: any) => void;
  sx?: Object;
}

const FormInput: React.FC<Props> = ({
  name,
  label,
  placeHolder,
  disabled,
  editedableLabel,
  labelValue,
  onChangeLabel,
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
      {editedableLabel && (
        <LabelInput value={labelValue} onChange={onChangeLabel} />
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
