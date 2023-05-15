import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from "@mui/material";

// constant
const headerSX = {
  "& .MuiCardHeader-action": { mr: 0 },
};

// ==============================|| CUSTOM MAIN CARD ||============================== //

const MainCard = ({
  border = true,
  boxShadow,
  children,
  content = true,
  contentClass = "",
  contentSX = {},
  darkTitle,
  secondary,
  shadow,

  sx = {},
  title,
  ...others
}: {
  border?: boolean;
  boxShadow?: boolean;
  children: React.ReactNode;
  content?: boolean;
  contentClass?: string;
  contentSX?: any;
  darkTitle?: boolean;
  secondary?: React.ReactNode;
  shadow?: string;
  sx?: any;
  title?: string;
}) => {
  return (
    <Card
      {...others}
      sx={{
        border: border ? "1px solid" : "none",
        borderColor: "#90caf9" + 25,
        ":hover": {
          boxShadow: boxShadow
            ? shadow || "0 2px 14px 0 rgb(32 40 45 / 8%)"
            : "inherit",
        },
        ...sx,
      }}
    >
      {title && (
        <CardHeader
          sx={headerSX}
          title={
            darkTitle ? <Typography variant="h3">{title}</Typography> : title
          }
          action={secondary}
        />
      )}
      {title && <Divider />}
      {content && (
        <CardContent sx={contentSX} className={contentClass}>
          {children}
        </CardContent>
      )}
      {!content && children}
    </Card>
  );
};

export default MainCard;
