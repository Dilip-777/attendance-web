import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { styled, useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Theme, InputProps } from "@mui/material";
import { useState } from "react";
import { useField, useFormikContext } from "formik";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import InsertDriveFile from "@mui/icons-material/InsertDriveFile";
import { CLOUDINARY_URL, uploadprsetname } from "../../constants";

const StyledCard = styled(Card)(
  ({ theme, isError }: { theme: Theme; isError: boolean }) => ({
    border: isError ? "1px solid" : "2px solid",
    borderColor: theme.palette.grey[400],
    backgroundColor: theme.palette.grey[200],
    width: "11rem",
    height: "9rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingTop: "1rem",
    "&:focus": {
      borderColor: "#00b0ff",
    },
  })
);

interface Props extends InputProps {
  name: string;
  label: string;
}

const FileUpload: React.FC<Props> = ({
  name,
  label,
  ...props
}: {
  name: string;
  label: string;
}) => {
  const { setFieldValue } = useFormikContext<any>();
  const [field, meta] = useField(name);
  const isError = Boolean(meta.touched && meta.error);
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  console.log(process.env);

  const handleChange = async (e: any) => {
    const file1 = e.target.files[0];

    try {
      setLoading(true);
      const formData = new FormData();
      // const formData = new FormData();
      formData.append("file", file1);
      formData.append("upload_preset", uploadprsetname); // Replace with your Cloudinary upload preset name
      formData.append("resource_type", "raw");

      try {
        const response = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        setFieldValue(name, result.secure_url);

        // return result;
      } catch (error) {
        console.log(error);
      }
      // formData.append("myFile", file1);
      // // const { data } = await axios.post("/api/upload", formData);
      // const data = Upload(file1);
      // setFieldValue(name, data.file);
      // console.log();
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ position: "relative", m: 2 }}>
      <FormLabel
        error={isError}
        sx={{ color: "rgb(54, 65, 82)", fontWeight: "700" }}
      >
        {label}
      </FormLabel>
      {field.value && (
        <Box display="flex">
          <IconButton
            onClick={() => {
              setFieldValue(name, undefined);
            }}
            sx={{ position: "absolute", zIndex: 99, float: "right" }}
          >
            <Delete />
          </IconButton>
        </Box>
      )}
      <StyledCard theme={theme} isError={isError}>
        {field.value ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="8rem"
            height="6rem"
          >
            {loading ? (
              <CircularProgress />
            ) : field.value?.mimetype?.indexOf("image") > -1 ? (
              <img
                style={{ maxWidth: "100%", height: "100%" }}
                src={`${field.value}`}
                alt=""
              />
            ) : (
              <Stack alignItems="center">
                <InsertDriveFile sx={{ fontSize: 30 }} />
              </Stack>
            )}
          </Box>
        ) : (
          <IconButton
            sx={{
              borderRadius: "10px 10px 0 0",
              width: "8rem",
              height: "6rem",
              padding: "3rem",
              border: `${isError ? "1px" : "2px"} solid #5e35b1`,
              margin: "auto",
              backgroundColor: "white",
              borderBottom: 0,
              ":hover": {
                backgroundColor: "white",
              },
            }}
            aria-label="upload picture"
            component="label"
          >
            <input onChange={handleChange} hidden {...props} type="file" />
            {loading ? (
              <CircularProgress sx={{ fontSize: 50, color: "#5e35b1" }} />
            ) : (
              <Add sx={{ fontSize: 50, color: "#5e35b1" }} />
            )}
          </IconButton>
        )}

        <Box width="100%" textAlign="center" py="0.7rem" bgcolor="white">
          <Typography fontWeight="500" fontSize="0.8rem">
            {field.value
              ? field.value.slice(0, 18) +
                (field.value.length > 18 ? "..." : "")
              : label.slice(0, 18) + (label.length > 18 ? "..." : "")}
          </Typography>
        </Box>
      </StyledCard>
      {isError && <FormHelperText error>{meta.error}</FormHelperText>}
    </Box>
  );
};

export default FileUpload;
