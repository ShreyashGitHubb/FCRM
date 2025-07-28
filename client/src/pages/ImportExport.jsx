"use client"

import { useState } from "react"
import axios from "axios"

const ImportExport = () => {
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0])
    setImportResult(null)
  }

  const handleImport = async (type) => {
    if (!selectedFile) {
      alert("Please select a file first")
      return
    }

    setImporting(true)
    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      const res = await axios.post(`/api/import-export/${type}/import`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      setImportResult(res.data)
    } catch (error) {
      console.error("Import error:", error)
      setImportResult({
        success: false,
        message: error.response?.data?.message || "Import failed",
      })
    } finally {
      setImporting(false)
      setSelectedFile(null)
    }
  }

  const handleExport = async (type) => {
    try {
      const response = await axios.get(`/api/import-export/${type}/export`, {
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `${type}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error("Export error:", error)
      alert("Export failed")
    }
  }

  return (
    <div>
      <h1>Import / Export</h1>

      <div className="card">
        <h3>Export Data</h3>
        <p>Export your CRM data to CSV format for backup or analysis.</p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={() => handleExport("leads")}>
            Export Leads
          </button>
          <button className="btn btn-primary" onClick={() => handleExport("contacts")}>
            Export Contacts
          </button>
          <button className="btn btn-primary" onClick={() => handleExport("deals")}>
            Export Deals
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Import Data</h3>
        <p>Import data from CSV files. Make sure your CSV file has the correct column headers.</p>

        <div className="form-group">
          <label>Select CSV File:</label>
          <input type="file" accept=".csv" onChange={handleFileSelect} className="form-control" />
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            className="btn btn-success"
            onClick={() => handleImport("leads")}
            disabled={importing || !selectedFile}
          >
            {importing ? "Importing..." : "Import Leads"}
          </button>
        </div>

        {importResult && (
          <div
            className={`alert ${importResult.success ? "alert-success" : "alert-danger"}`}
            style={{ marginTop: "15px" }}
          >
            <h4>{importResult.success ? "Import Successful" : "Import Failed"}</h4>
            <p>{importResult.message}</p>
            {importResult.data && (
              <div>
                <p>Success: {importResult.data.successCount} records</p>
                <p>Errors: {importResult.data.errorCount} records</p>
                {importResult.data.errors && importResult.data.errors.length > 0 && (
                  <div>
                    <h5>First few errors:</h5>
                    <ul>
                      {importResult.data.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card">
        <h3>CSV Format Guidelines</h3>
        <h4>Leads CSV Format:</h4>
        <p>Required columns: firstName, lastName, email</p>
        <p>Optional columns: phone, company, status, source, notes</p>

        <h4>Sample CSV Headers:</h4>
        <code>firstName,lastName,email,phone,company,status,source,notes</code>

        <h4>Valid Status Values:</h4>
        <p>new, contacted, qualified, converted, lost</p>

        <h4>Valid Source Values:</h4>
        <p>website, referral, social_media, email_campaign, cold_call, other</p>
      </div>
    </div>
  )
}

export default ImportExport
