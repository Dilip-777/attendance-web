import TableHead from "@/components/PrintFinalSheet/tableHead";
import { Note } from "@mui/icons-material";
import {
  Document,
  HeadingLevel,
  Paragraph,
  Packer,
  SectionProperties,
  Table,
  TableRow,
  TableCell,
  WidthType,
  TextRun,
  TextDirection,
  VerticalAlign,
  AlignmentType,
  Spacing,
} from "docx";
import _ from "lodash";
// import { saveAs } from "file-saver";

interface Headcell {
  id: string;
  label: string;
  colspan?: number;
}

const createHeadcell = (id: string, label: string, colspan?: number) => {
  return {
    id,
    label,
    colspan,
  };
};

const headers = [
  createHeadcell("date", "Date", 1),
  createHeadcell("8MW", "8MW", 2),
  createHeadcell("20MW", "20MW", 2),
  createHeadcell("DM", "DM Plant", 1),
  createHeadcell("QC", "QC", 1),
  createHeadcell("Store", "Store", 1),
  createHeadcell("K7", "K7 & 1-6PROC", 2),
  createHeadcell("RMHS", "RMHS", 1),
  createHeadcell("PS", "PS", 1),
  createHeadcell("HK", "HK", 1),
  createHeadcell("SVR", "SVR", 1),
  createHeadcell("total", "Total", 1),
];

const headcells = [
  createHeadcell("date", "", 1),
  createHeadcell("m8", "M", 1),
  createHeadcell("f8", "F", 1),
  createHeadcell("m20", "M", 1),
  createHeadcell("f20", "F", 1),
  createHeadcell("dm", "M", 1),
  createHeadcell("qc", "M", 1),
  createHeadcell("store", "M", 1),
  createHeadcell("k7m", "M", 1),
  createHeadcell("k7f", "F", 1),
  createHeadcell("rmhs", "M", 1),
  createHeadcell("ps", "F", 1),
  createHeadcell("hk", "M", 1),
  createHeadcell("svr", "M", 1),
  createHeadcell("total", "Total", 1),
];

export function generateDocument(rows: any) {

  const table = new Table({
    rows: [
      new TableRow({
        children: TableHead({ headcells: headers }),
      }),
      new TableRow({
        children: [
          ...headcells.map((headcell) => (
            new TableCell({
            children: [new Paragraph({
            children: [new TextRun({ text: `${headcell.label}`, bold: true })],
            alignment: AlignmentType.CENTER,
          })],
          })
          )),
        ],
      }),
      ...rows.map((row: any) => (

          new TableRow({
              children: [
          ...headcells.map((headcell) => (
            new TableCell({
            children: [new Paragraph({
            children: [new TextRun({ text: `${_.get(row, headcell.id)}` })],
            alignment: AlignmentType.CENTER,
          })],
          })
          )),
        ],
    })
    ))
    ],
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    //   cellMargin: cellPadding,
  });

  let doc = new Document({
    sections: [
      {
        children: [
        //   new Paragraph({ text: "Hello YouTube", heading: HeadingLevel.TITLE }),
          new Paragraph({
            text: "Plant 1",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            
          }),
            new Paragraph({
            text: "Contractor's Payment Approval Sheet",
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.CENTER,
            spacing: {
                after: 100,
            }
            }),
           
          table,
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    const url = URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-document.docx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}