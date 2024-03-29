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
import React from "react";

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

  if (field.value) {
    const option = options.find((option) => option.value === field.value);
    if (option === undefined) {
      setFieldValue(name, "", false);
    }
  }

  // if (
  //   options.find((option) => option.value === field.value) === undefined &&
  //   !field.value
  // )
  //   setFieldValue(name, "");

  const { onChange, ...fieldWithoutOnChange } = field;
  return (
    <FormControl
      fullWidth
      error={isError}
      disabled={disabled}
      sx={{ my: 2, maxWidth: { xs: 250, xl: 300 }, width: "100%" }}
    >
      <FormLabel color="secondary" sx={{ fontWeight: "700", my: 0.5 }}>
        {label}
      </FormLabel>
      <Select
        color="secondary"
        labelId="demo-customized-select-label"
        id="demo-customized-select"
        placeholder={placeHolder}
        onChange={handleChange}
        {...fieldWithoutOnChange}
        {...props}
        input={
          <OutlineInputStyle
            sx={{ maxWidth: { xs: 250, xl: 300 }, width: "100%" }}
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
