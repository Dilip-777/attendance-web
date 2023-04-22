import axios from "axios";
import { useState } from "react";
import * as XLSX from "xlsx";

function App() {
  // on change states
  const [excelFile, setExcelFile] = useState<string | ArrayBuffer | null>(null);
  const [excelFileError, setExcelFileError] = useState<string | null>("");

  // submit
  const [excelData, setExcelData] = useState(null);
  // it will contain array of objects

  // handle File
  const fileType = ["application/vnd.xlsx", "application/vnd.ms-excel"];
  const handleFile = (e: any) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      // console.log(selectedFile.type);
      //   if (selectedFile && fileType.includes(selectedFile.type)) {
      let reader = new FileReader();
      reader.readAsArrayBuffer(selectedFile);
      reader.onload = (e) => {
        setExcelFileError(null);
        setExcelFile(e.target?.result as string | ArrayBuffer | null);
      };
      //   } else {
      //     setExcelFileError("Please select only excel file types");
      //     setExcelFile(null);
      //   }
      // } else {
      //   console.log("plz select your file");
      // }
    }
  };

  const getDate = (excelDate: number) => {
    // const excelDate = 44986;
    const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
    return formattedDate;
  };

  const importing = async (data: any) => {
    console.log(data);

    const body = data.map((data: any) => {
      return {
        contractorid: data.contractor_id.toString(),
        contractorname: data.contractor_name,
        employeeid: data.employee_id.toString(),
        employeename: data.employee_name,
        designation: data.designation,
        department: data.department,
        machineInTime:
          new Date(data.machine_intime * 24 * 60 * 60 * 1000)
            .toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
            .toString() || "8:00",
        machineOutTime:
          new Date(data.machine_outtime * 24 * 60 * 60 * 1000)
            .toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
            .toString() || "17:00",
        machineshift: data.shift || "day",
        attendance: data.attendence.toString(),
        attendancedate: getDate(data.entry_date).toString(),
        overtime: data.overtime.toString(),
        eleave: data.e_leave || "0",
        gender: data.gender || "M",
      };
    });

    const res = await axios.post("/api/test", body);
    console.log(res);

    // const body =

    console.log(body);
  };

  // new Date(timeValue * 24 * 60 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // submit function
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      importing(data);

      setExcelData(data as any);
    } else {
      setExcelData(null);
    }
  };

  return (
    <div className="container">
      {/* upload file section */}
      <div className="form">
        <form className="form-group" autoComplete="off" onSubmit={handleSubmit}>
          <label>
            <h5>Upload Excel file</h5>
          </label>
          <br></br>
          <input
            type="file"
            className="form-control"
            onChange={handleFile}
            required
          ></input>
          {excelFileError && (
            <div className="text-danger" style={{ marginTop: 5 + "px" }}>
              {excelFileError}
            </div>
          )}
          <button
            type="submit"
            className="btn btn-success"
            style={{ marginTop: 5 + "px" }}
          >
            Submit
          </button>
        </form>
      </div>

      <br></br>
      <hr></hr>

      {/* view file section */}
      <h5>View Excel file</h5>
      <div className="viewer">
        {excelData === null && <>No file selected</>}
        {excelData !== null && (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">First Name</th>
                  <th scope="col">Last Name</th>
                  <th scope="col">Gender</th>
                  <th scope="col">Country</th>
                  <th scope="col">Age</th>
                  <th scope="col">Date</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
