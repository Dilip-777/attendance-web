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

const FormDate: React.FC<Props> = ({
  name,
  label,
  placeHolder,
  disabled,
  sx,
  ...props
}) => {
  const { values, setFieldValue } = useFormikContext<any>();
  const [field, meta] = useField(name);
  const [value, setValue] = React.useState<any>();
  const { onChange, ...other } = field;
  const isError = Boolean(meta.touched && meta.error);

  return (
    <FormControl error={isError} disabled={disabled} sx={{ my: 2 }}>
      <FormLabel sx={{ color: "rgb(54, 65, 82)" }}>{label}</FormLabel>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          {...other}
          value={value}
          format="DD-MM-YYYY"
          //   disableFuture
          sx={{ width: "100%", minWidth: 300 }}
          onChange={(newValue) => {
            console.log(newValue);

            const date = newValue?.$d;
            const formattedDate = date
              ?.toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              })
              .replace(/\//g, "-");
            setValue(newValue);

            setFieldValue(name, formattedDate);
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