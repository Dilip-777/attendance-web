import { printDivisions } from "@/components/print/mt/divsions";
import MonthSelect from "@/ui-component/MonthSelect";
import { getDivisionRows } from "@/utils/mtr/divisions";
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Department, FixedDepartments, FixedValues } from "@prisma/client";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";

export default function Divisions() {
  const [divisions, setDivisions] = useState<
    (Department & {
      fixedDepartments: (FixedDepartments & { fixedValues: FixedValues })[];
    })[]
  >([]);

  const [startDate, setStartDate] = useState<string>(dayjs().format("MM/YYYY"));

  const [endDate, setEndDate] = useState<string>(dayjs().format("MM/YYYY"));
  const [headcells, setHeadCells] = useState<any[]>([]);

  const fetchDivisions = async () => {
    let months: string[] = [];

    let start = dayjs(startDate, "MM/YYYY");

    while (
      start.isBefore(dayjs(endDate, "MM/YYYY")) ||
      start.isSame(dayjs(endDate, "MM/YYYY"))
    ) {
      months.push(start.format("MM/YYYY"));
      start = start.add(1, "month");
    }

    const res = await axios.get("/api/mtr/division?months=" + months);

    setDivisions(res.data.divisions);
  };

  useEffect(() => {
    fetchDivisions();
  }, [startDate, endDate]);

  useEffect(() => {
    let months: { id: string; label: string }[] = [];

    let start = dayjs(startDate, "MM/YYYY");
    while (
      start.isBefore(dayjs(endDate, "MM/YYYY")) ||
      start.isSame(dayjs(endDate, "MM/YYYY"))
    ) {
      months.push({
        id: start.format("MM/YYYY"),
        label: start.format("MMM'YYYY"),
      });
      start = start.add(1, "month");
    }
    setHeadCells([
      { id: "heading", label: "Division" },
      ...months,
      { id: "total", label: "Total" },
    ]);
  }, [divisions]);

  const rows = useMemo(() => {
    let months: string[] = [];
    let start = dayjs(startDate, "MM/YYYY");

    while (
      start.isBefore(dayjs(endDate, "MM/YYYY")) ||
      start.isSame(dayjs(endDate, "MM/YYYY"))
    ) {
      months.push(start.format("MM/YYYY"));
      start = start.add(1, "month");
    }
    return getDivisionRows(divisions, months);
  }, [divisions]);

  return (
    <Paper
      sx={{
        overflow: "auto",
        p: 3,
        maxHeight: "calc(100vh - 6rem)",
        scrollBehavior: "smooth",
        "&::-webkit-scrollbar": {
          height: 10,
          width: 9,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#bdbdbd",
          borderRadius: 2,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack
          direction="row"
          flexWrap="wrap"
          alignItems="center"
          spacing={2}
          sx={{ width: "100%" }}
        >
          <MonthSelect
            label="Select Start Date"
            value={dayjs(startDate, "MM/YYYY")}
            onChange={(value: Dayjs | null) =>
              setStartDate(value?.format("MM/YYYY") || "")
            }
          />
          <MonthSelect
            label="Select End Date"
            value={dayjs(endDate, "MM/YYYY")}
            onChange={(value: Dayjs | null) =>
              setEndDate(value?.format("MM/YYYY") || "")
            }
          />
        </Stack>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            printDivisions({ headcells, rows });
          }}
        >
          Print
        </Button>
      </Box>
      <Divider sx={{ my: 2 }} />
      <TableContainer
        sx={{
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": {
            width: 9,
            height: 9,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#bdbdbd",
            borderRadius: 2,
          },
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          maxHeight: "64vh",
        }}
      >
        <Table stickyHeader sx={{}} aria-label="sticky table">
          <TableHead>
            <TableRow sx={{ bgcolor: "#e0e0e0" }}>
              {headcells.map((headcell) => (
                <TableCell
                  sx={{ fontWeight: "700", bgcolor: "#e0e0e0" }}
                  key={headcell.id}
                >
                  {headcell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {headcells.map((headcell) => (
                  <TableCell
                    sx={{
                      fontWeight: row.fontWeight || "500",
                    }}
                    key={headcell.id}
                  >
                    {row[headcell.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
