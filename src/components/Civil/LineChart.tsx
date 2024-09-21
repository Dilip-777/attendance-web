import { Box } from "@mui/material";
import { ApexOptions } from "apexcharts";
import React from "react";
import Chart from "react-apexcharts";

const LineChart = ({
  series,
  xaxis,
}: {
  series: ApexAxisChartSeries;
  xaxis: string[];
}) => {
  //   const series = [
  //     {
  //       name: "Net Profit",
  //       data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
  //     },
  //     {
  //       name: "Revenue",
  //       data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
  //     },
  //     {
  //       name: "Free Cash Flow",
  //       data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
  //     },
  //   ];
  var options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        // endingShape: "",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: xaxis,
    },

    yaxis: {},
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val + "%";
        },
      },
    },

    fill: {
      opacity: 1,
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Chart options={options} series={series} type="bar" width="700" />
    </Box>
  );
};

export default LineChart;
