import * as React from "react";
import { render } from "react-dom";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

interface Props {
  value: string;
  date: string;
  field: string;
  handleChange: (
    value: string,
    date: string,
    field: string,
    nextdate: string
  ) => void;
  type: string;
  discard: boolean;
  setDiscard: React.Dispatch<React.SetStateAction<boolean>>;
  changes: any[];
}

export default function TextEditor({
  value,
  date,
  handleChange,
  field,
  type,
  discard,
  changes,
  setDiscard,
}: Props) {
  //   const classes = useStyles(props);

  const [name, setName] = React.useState(value || "");
  const [isNameFocused, setIsNamedFocused] = React.useState(false);

  React.useEffect(() => {
    if (discard) {
      setName(value || "");
    }
  }, [discard]);

  React.useEffect(() => {
    const ch = changes.find((c) => c.date === date);
    if (ch) {
      setName(ch[field] ?? value ?? "");
    }
  }, [changes]);

  React.useEffect(() => {
    setName(value || "");
  }, [value]);

  // console.log(
  //   name ? dayjs(name, "HH:MM") : "ffff",
  //   "sldkfjskljdfkl",
  //   name,
  //   "name"
  // );

  return (
    <div className="TextEditor " style={{ padding: "1rem" }}>
      {/* {!isNameFocused ? (
        <Typography
          //   className={classes.name}
          onClick={() => {
            setIsNamedFocused(true);
          }}
        >
          {name || "-"}
        </Typography>
      ) : ( */}
      {/* <input
        autoFocus
        //   inputProps={{ className: classes.name }}
        value={name}
        style={{
          border: "none",
          outline: "none",
          fontSize: "14px",
          width: "5rem",
          backgroundColor: "#ede7f6",
          padding: "7px",
          paddingRight: 0,
        }}
        onChange={(event) => setName(event.target.value)}
        onBlur={(event) => {
          setIsNamedFocused(false);
          if (name !== "-") {
            handleChange(
              name,
              date,
              field,
              dayjs(date, "DD/MM/YYYY").add(1, "day").format("DD/MM/YYYY")
            );
          }
        }}
        // type={type || "time"}

        type={field.toLowerCase().includes("time") ? "time" : type || "text"}
        onSubmit={(event) => setIsNamedFocused(false)}
        step="60"
      /> */}
      {/* )} */}

      {field === "status" || field === "date" ? (
        <Typography>{name || "-"}</Typography>
      ) : field.toLowerCase().includes("time") ? (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            ampm={false}
            value={name ? dayjs(name, "HH:mm") : null}
            onChange={(d) => {
              setName(d ? d.format("HH:mm") : "");
              handleChange(
                dayjs(d).format("HH:mm"),
                date,
                field,
                dayjs(date, "DD/MM/YYYY").add(1, "day").format("DD/MM/YYYY")
              );
              console.log(d, "date");
            }}
          />
        </LocalizationProvider>
      ) : (
        <TextField
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            handleChange(
              event.target.value,
              date,
              field,
              dayjs(date, "DD/MM/YYYY").add(1, "day").format("DD/MM/YYYY")
            );
          }}
          type={type || "text"}
          style={{ width: "100%" }}
        />
      )}
    </div>
  );
}
