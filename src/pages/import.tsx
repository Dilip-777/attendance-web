import React, { useState } from "react";
import Box from "@mui/material/Box";
import FormSelect from "@/ui-component/FormSelect";
import axios from "axios";
import { useSession } from "next-auth/react";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [documentUrl, setDocumentUrl] = useState("");
  const { data: session } = useSession();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      console.log("No file selected");
      return;
    }

    const formData = new FormData();

    formData.append("myFile", file);
    const { data } = await axios.post("/api/upload", formData);
    setDocumentUrl(data.file.newFilename);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  }

  return (
    <div>
      <h1>Upload a document</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
        />
        <button type="submit">Upload</button>
      </form>
      {documentUrl && (
        <div>
          <p>Document uploaded:</p>
          <a
            href={`/uploadedFiles/${documentUrl}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {documentUrl.split("/").pop()}
          </a>
        </div>
      )}
      <Box>
        <FormSelect
          label="Select"
          handleChange={(e) => console.log(e)}
          value="1"
          options={[
            { label: "Option 1", value: "1" },
            { label: "Option 2", value: "2" },
            { label: "Option 3", value: "3" },
          ]}
        />
      </Box>
    </div>
  );
};

export default Upload;
