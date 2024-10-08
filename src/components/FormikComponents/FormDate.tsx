import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import { useField, useFormikContext } from "formik";
// import { DatePicker, type DatePickerProps } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { DatePickerProps } from "@mui/x-date-pickers/DatePicker";

interface Props extends DatePickerProps<any> {
  name: string;
  label: string;
  placeHolder: string;
  disabled?: boolean;
  sx?: Object;
}

const FormDate: React.FC<Props> = ({
  name,
  label,
  placeHolder,
  disabled,

  sx,
  ...props
}) => {
  const { setFieldValue } = useFormikContext<any>();
  const [field, meta] = useField(name);
  const [value, setValue] = React.useState<any>(
    field.value ? dayjs(field.value, props.format || "DD/MM/YYYY") : null
  );
  const { onChange, ...other } = field;
  const isError = Boolean(meta.touched && meta.error);

  return (
    <FormControl
      color="secondary"
      error={isError}
      disabled={disabled}
      sx={{ my: 2 }}
    >
      <FormLabel sx={{ fontWeight: "700", my: 0.5 }}>{label}</FormLabel>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          {...other}
          disabled={disabled}
          value={value}
          format="DD/MM/YYYY"
          //   disableFuture
          sx={{
            maxWidth: { xs: 250, xl: 300 },
            width: "100%",
            color: "secondary",
          }}
          onChange={(newValue) => {
            setValue(newValue);
            setFieldValue(name, newValue.format(props?.format || "DD/MM/YYYY"));
          }}
          {...props}
        />
      </LocalizationProvider>
      {isError && (
        <FormHelperText sx={{ color: "#f44336" }}>{meta.error}</FormHelperText>
      )}
    </FormControl>
  );
};

export default FormDate;
