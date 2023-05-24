import {
  PDFDownloadLink,
  BlobProvider,
} from "@react-pdf/renderer/lib/react-pdf.browser.cjs.js";
import PdfDocument from "@/components/pdfPrint";
import {
  Department,
  Designations,
  Safety,
  Stores,
  TimeKeeper,
} from "@prisma/client";

function PrintPdf({
  department,
  designations,
  rows1,
  totalnetPayable,
  store,
  safety,
  details,
}: {
  department: Department;
  designations: Designations[];
  rows1: any[];
  totalnetPayable: number;
  store: Stores | null;
  safety: Safety | null;
  details: any;
}) {
  const fileName = "FinalSheet.pdf";

  //   const { rows1, totalnetPayable } = getTotalAmountAndRows(
  //     timekeeper,
  //     4,
  //     2023,
  //     designations,
  //     department
  //   );

  return (
    <div className="PrintPdf">
      {/* <PDFViewer width={800} height={500} showToolbar={false}>
        <PdfDocument />
      </PDFViewer> */}
      <BlobProvider
        document={
          <PdfDocument
            rows={rows1}
            total={totalnetPayable}
            department={department}
            designations={designations}
            store={store}
            safety={safety}
            details={details}
          />
        }
      >
        {({ url, loading }: { url: string; loading: boolean }) => {
          if (loading) {
            return <div>Loading...</div>;
          }

          return (
            <a href={url} download="FinalSheet.pdf">
              Download PDF
            </a>
          );
        }}
      </BlobProvider>
      <div className="download-link">
        <PDFDownloadLink
          document={
            <PdfDocument
              rows={rows1}
              total={totalnetPayable}
              department={department}
              designations={designations}
              store={store}
              safety={safety}
              details={details}
            />
          }
          fileName={fileName}
        >
          {({ loading }: { loading: boolean }) =>
            loading ? "Loading..." : "Download Invoice"
          }
        </PDFDownloadLink>
      </div>
    </div>
  );
}

export default PrintPdf;
