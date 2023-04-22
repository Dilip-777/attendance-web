import {
  FormControl,
  FormHelperText,
  FormLabel,
  InputProps,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  SelectProps,
  styled,
} from "@mui/material";
import { shouldForwardProp } from "@mui/system";
import { useField, useFormikContext } from "formik";
import React, { ChangeEvent, ChangeEventHandler } from "react";

const OutlineInputStyle: any = styled(OutlinedInput, { shouldForwardProp })(
  ({ theme }) => ({
    // width: 350,
    // marginLeft: 16,
    paddingLeft: 10,
    paddingRight: 10,
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

interface Props extends SelectProps {
  name: string;
  label: string;
  placeHolder: string;
  disabled?: boolean;
  options: { value: string | number | boolean; label: string }[];
  sx?: Object;
}

const FormSelect: React.FC<Props> = ({
  name,
  label,
  placeHolder,
  disabled,
  options,
  sx,
  ...props
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);
  const isError = Boolean(meta.touched && meta.error);

  const handleChange = (
    event: SelectChangeEvent<any>,
    child: React.ReactNode
  ) => {
    const { value } = event.target;
    setFieldValue(name, value);
  };

  const { onChange, ...fieldWithoutOnChange } = field;
  return (
    <FormControl error={isError} disabled={disabled} sx={{ my: 2 }}>
      <FormLabel sx={{ color: "rgb(54, 65, 82)", fontWeight: "700" }}>
        {label}
      </FormLabel>
      <Select
        labelId="demo-customized-select-label"
        id="demo-customized-select"
        placeholder={placeHolder}
        onChange={handleChange}
        {...fieldWithoutOnChange}
        {...props}
        input={
          <OutlineInputStyle
            sx={{ width: "100%", minWidth: 300 }}
            placeholder={placeHolder}
          />
        }
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value as any}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {isError && (
        <FormHelperText sx={{ color: "#f44336" }}>{meta.error}</FormHelperText>
      )}
    </FormControl>
  );
};

export default FormSelect;
