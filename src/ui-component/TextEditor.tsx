import * as React from "react";
import { render } from "react-dom";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";

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
}

export default function TextEditor({
  value,
  date,
  handleChange,
  field,
  type,
  discard,
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

  return (
    <div className="TextEditor " style={{ padding: "1rem" }}>
      {!isNameFocused ? (
        <Typography
          //   className={classes.name}
          onClick={() => {
            setIsNamedFocused(true);
          }}
        >
          {name || "-"}
        </Typography>
      ) : (
        <input
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
        />
      )}
    </div>
  );
}
