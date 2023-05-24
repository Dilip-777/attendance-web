import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import { useField, useFormikContext } from "formik";
// import { TimePicker, type TimePickerProps } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import type { TimePickerProps } from "@mui/x-date-pickers/TimePicker";

interface Props extends TimePickerProps<any> {
  name: string;
  label: string;
  placeHolder: string;
  disabled?: boolean;
  sx?: Object;
}

const TimeInput: React.FC<Props> = ({
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
    field.value ? dayjs(field.value, "HH:mm A") : null
  );
  const { onChange, ...other } = field;
  const isError = Boolean(meta.touched && meta.error);

  return (
    <FormControl fullWidth error={isError} disabled={disabled} sx={{ my: 2 }}>
      <FormLabel sx={{ color: "rgb(54, 65, 82)", fontWeight: "700" }}>
        {label}
      </FormLabel>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          {...other}
          disabled={disabled}
          value={value}
          sx={{ maxWidth: { xs: 250, xl: 300 }, width: "100%" }}
          onChange={(newValue) => {
            setValue(newValue);
            setFieldValue(name, newValue.format("HH:mm A"));
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

export default TimeInput;
