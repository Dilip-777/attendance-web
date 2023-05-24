// import {
//   PDFDownloadLink,
//   PDFViewer,
// } from "@react-pdf/renderer/lib/react-pdf.browser.cjs.js";
import {
  PDFDownloadLink,
  BlobProvider,
} from "@react-pdf/renderer/lib/react-pdf.browser.cjs.js";
import PdfDocument from "@/components/pdfPrint";
import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import { Department, Designations, TimeKeeper } from "@prisma/client";
import getTotalAmountAndRows from "@/utils/get8hr";

function App({
  timekeeper,
  department,
  designations,
  design,
}: {
  timekeeper: TimeKeeper[];
  department: Department;
  designations: Designations[];
}) {
  const fileName = "FinalSheet.pdf";

  const { rows1, totalnetPayable } = getTotalAmountAndRows(
    timekeeper,
    4,
    2023,
    designations,
    department
  );

  return (
    <div className="App">
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
            safety={safety}
            store={store}
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
              safety={safety}
              store={store}
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

export default App;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const timekeeper = await prisma.timeKeeper.findMany({
    where: {
      department: "CCM",
      attendancedate: {
        endsWith: "04/2023",
      },
    },
  });
  const department = await prisma.department.findFirst({
    where: {
      department: "CCM",
    },
  });
  const designations = await prisma.designations.findMany({
    where: {
      departmentname: "CCM",
    },
  });
  return {
    props: {
      timekeeper,
      department,
      designations,
    },
  };
};
