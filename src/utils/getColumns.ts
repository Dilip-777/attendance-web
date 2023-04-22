
interface Column {
  id:
    | "date"
    | "m8"
    | "f8"
    | "m20"
    | "f20"
    | "dm"
    | "qc"
    | "store"
    | "k7m"
    | "k7f"
    | "rmhs"
    | "ps"
    | "hk"
    | "svr"
     | "ele"
    | "lco"
    | "tman"
    | "filter"
    | "po"
    | "bco"
    | "srfilter"
    | "incharge"
    | "mo"
    | "shiftinch"
    | "gc"
    | "svr"
    | "sbo"
    | "lman"
    | "forman"
    | "tmesson"
    | "lmes"
    | "jrele"
    | "helper"
    | "m"
    | "f"
    | "total";
  label: string;
  border?: boolean;
  minWidth?: number;
  align?: "right" | "center" | "left";
  format?: (value: number) => string;
}

export const column8HR: Column[] = [
  {
    id: "date",
    label: "",
    minWidth: 80,
    border: true,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "m8",
    label: "M",
    minWidth: 50,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "f8",
    label: "F",
    minWidth: 50,
    border: true,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "m20",
    label: "M",
    minWidth: 50,
    align: "center",

    format: (value: number) => value.toString(),
  },
  {
    id: "f20",
    label: "F",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "dm",
    label: "M",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "qc",
    label: "M",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "store",
    label: "M",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "k7m",
    label: "M",
    minWidth: 50,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "k7f",
    label: "F",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "rmhs",
    label: "M",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "ps",
    label: "F",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "hk",
    label: "M",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "svr",
    label: "M",
    minWidth: 50,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "total",
    label: "",
    minWidth: 50,
    align: "center",
    format: (value: number) => value.toString(),
  },
];


export const columnlrf: Column[] = [
  {
    id: "date",
    label: "Date",
    minWidth: 150,
    border: true,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "ele",
    label: "ELE",
    minWidth: 100,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "filter",
    label: "Filter",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "srfilter",
    label: "SR Filter",
    minWidth: 100,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "svr",
    label: "SVR",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "lmes",
    label: "LMES",
    minWidth: 100,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "helper",
    label: "Helper",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "total",
    label: "Total",
    minWidth: 100,
    align: "center",
    format: (value: number) => value.toString(),
  },
];

export const columnccm: Column[] = [
  {
    id: "date",
    label: "Date",
    minWidth: 150,
    border: true,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "ele",
    label: "ELE",
    minWidth: 100,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "lco",
    label: "LCO",
    minWidth: 100,
    border: true,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "tman",
    label: "T-Man",
    minWidth: 100,
    align: "center",

    format: (value: number) => value.toString(),
  },
  {
    id: "filter",
    label: "Filter",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "po",
    label: "PO",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "bco",
    label: "BCO",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "srfilter",
    label: "SR-Filter",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "incharge",
    label: "Incharge",
    minWidth: 100,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "mo",
    label: "MO",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "shiftinch",
    label: "Shift-Inch",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "gc",
    label: "GC",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "tmesson",
    label: "T-Mess On",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "svr",
    label: "SVR",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "sbo",
    label: "SBO",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "lmes",
    label: "LMES",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "lman",
    label: "LMAN",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "forman",
    label: "Forman",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "jrele",
    label: "JR ELE",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "helper",
    label: "Helper",
    minWidth: 100,
    align: "center",
    border: true,
    format: (value: number) => value.toString(),
  },
  {
    id: "total",
    label: "Total",
    minWidth: 100,
    align: "center",
    format: (value: number) => value.toString(),
  },
];

 export const columncolony :Column[] = [
  {
    id: "date",
    label: "",
    minWidth: 120,
    border: true,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "m",
    label: "M",
    minWidth: 80,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "f",
    label: "F",
    minWidth: 80,
    border: true,
    align: "center",
    format: (value: number) => value.toString(),
  },
  {
    id: "total",
    label: "",
    minWidth: 80,
    align: "center",
    format: (value: number) => value.toString(),
  },
];