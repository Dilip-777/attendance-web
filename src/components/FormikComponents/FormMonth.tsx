import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateField } from "@mui/x-date-pickers/DateField";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  InputProps,
  TextField,
} from "@mui/material";
import { useField, useFormikContext } from "formik";
import { DatePicker, type DatePickerProps } from "@mui/x-date-pickers";

interface Props extends DatePickerProps<any> {
  name: string;
  label: string;
  placeHolder: string;
  disabled?: boolean;
  sx?: Object;
}

const SelectMonth: React.FC<Props> = ({
  name,
  label,
  placeHolder,
  disabled,
  sx,
  ...props
}) => {
  const { setFieldValue } = useFormikContext<any>();
  const [field, meta] = useField(name);
  //   const [value, setValue] = React.useState<any>(dayjs(field.value) || null);
  const { onChange, ...other } = field;
  const isError = Boolean(meta.touched && meta.error);

  return (
    <FormControl
      error={isError}
      disabled={disabled}
      sx={{ my: 2, maxWidth: { xs: 250, xl: 300 }, width: "100%" }}
    >
      <FormLabel sx={{ color: "rgb(54, 65, 82)", fontWeight: "700" }}>
        {label}
      </FormLabel>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          {...other}
          disabled={disabled}
          views={["month", "year"]}
          //   value={value}
          format="MM/YYYY"
          //   disableFuture
          value={dayjs(field.value, "MM/YYYY")}
          sx={{ maxWidth: { xs: 250, xl: 300 }, width: "100%" }}
          onChange={(newValue) => {
            setFieldValue(name, newValue.format("MM/YYYY"));
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

export default SelectMonth;
