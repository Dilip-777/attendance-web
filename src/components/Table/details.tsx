import { Typography, Box } from "@mui/material";

interface row {
  label: string;
  value: string;
}

export default function Details({ rows }: { rows: row[] }) {
  return (
    <Box display="flex" flexWrap={"wrap"}>
      {rows.map((row, index) => (
        <Typography key={index} variant="h4" sx={{ mx: 6, my: 2 }}>
          {row.label} : <span style={{ fontWeight: "500" }}>{row.value}</span>
        </Typography>
      ))}

      {/* <Typography variant="h4" sx={{ mx: 6, my: 2 }}>
            Contractor Name :{" "}
            <span style={{ fontWeight: "500" }}>
              {
                contractors.find((c) => c.contractorId === selectedContractor)
                  ?.contractorname
              }
            </span>
          </Typography>
          <Typography variant="h4" sx={{ mx: 6, my: 2 }}>
            Mobile Number :{" "}
            <span style={{ fontWeight: "500" }}>
              {
                contractors.find((c) => c.contractorId === selectedContractor)
                  ?.mobilenumber
              }
            </span>
          </Typography>
          <Typography variant="h4" sx={{ mx: 6, my: 2 }}>
            Office Address :{" "}
            <span style={{ fontWeight: "500" }}>
              {
                contractors.find((c) => c.contractorId === selectedContractor)
                  ?.officeaddress
              }
            </span>
          </Typography> */}
    </Box>
  );
}
