import React, { useState } from "react";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [documentUrl, setDocumentUrl] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      console.log("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "attendance-web"); // Replace with your Cloudinary upload preset name
    formData.append("resource_type", "raw");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dddvmk9xs/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();
    console.log(result); // Handle the uploaded file here
    // const url = result.url;
    // const link = document.createElement("a");
    // link.href = url;
    // link.download = "finalsheet.docx";
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // URL.revokeObjectURL(url);
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
          <a href={documentUrl} target="_blank" rel="noopener noreferrer">
            {documentUrl.split("/").pop()}
          </a>
        </div>
      )}
    </div>
  );
};

export default Upload;
