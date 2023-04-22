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
} from "docx";
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

const header8hr = [
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

const headcells8hr = [
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

const t = ["", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
const tablerow = t.map((x) => {
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text: `${x}`, bold: true })],
        alignment: AlignmentType.CENTER,
      }),
    ],
    width: {
      size: 50,
      type: WidthType.PERCENTAGE,
    },
    margins: {
      top: 100,
      bottom: 100,
      left: 100,
      right: 100,
    },

    columnSpan: 2,
    verticalAlign: VerticalAlign.CENTER,
  });
});

function generateDocument() {
  const cellPadding = {
    top: 100,
    bottom: 100,
    left: 100,
    right: 100,
  };

  const table = new Table({
    rows: [
      new TableRow({
        children: TableHead({ headcells: header8hr }),
      }),
      new TableRow({
        children: [
          //   new TableCell({
          //     children: [new Paragraph("Cell 3")],
          //   }),
          ...TableHead({ headcells: headcells8hr }),
          new TableCell({
            children: [new Paragraph("Cell 4")],
          }),
        ],
      }),
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
          new Paragraph({ text: "Hello YouTube", heading: HeadingLevel.TITLE }),
          new Paragraph({
            text: "Do you want to learn how to create a word document?",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({ text: "Of course you do!" }),
          new Paragraph({ text: "Bullet", bullet: { level: 0 } }),
          new Paragraph({ text: "Point", bullet: { level: 1 } }),
          new Paragraph({ text: "List!", bullet: { level: 0 } }),
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

function App() {
  return (
    <div>
      {/* <button onClick={generateDocument}>Generate Document</button> */}
    </div>
  );
}

export default App;
