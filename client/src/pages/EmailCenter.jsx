"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const EmailCenter = () => {
  const [templates, setTemplates] = useState([])
  const [contacts, setContacts] = useState([])
  const [leads, setLeads] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [selectedRecipients, setSelectedRecipients] = useState([])
  const [emailData, setEmailData] = useState({
    subject: "",
    body: "",
    customMessage: "",
  })
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState(null)

  useEffect(() => {
    fetchTemplates()
    fetchContacts()
    fetchLeads()
  }, [])

  const fetchTemplates = async () => {
    try {
      const res = await axios.get("/api/email/templates")
      setTemplates(res.data.data)
    } catch (error) {
      console.error("Error fetching templates:", error)
    }
  }

  const fetchContacts = async () => {
    try {
      const res = await axios.get("/api/contacts")
      setContacts(res.data.data)
    } catch (error) {
      console.error("Error fetching contacts:", error)
    }
  }

  const fetchLeads = async () => {
    try {
      const res = await axios.get("/api/leads")
      setLeads(res.data.data)
    } catch (error) {
      console.error("Error fetching leads:", error)
    }
  }

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId)
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setEmailData({
        ...emailData,
        subject: template.subject,
      })
    }
  }

  const handleSendEmail = async () => {
    if (selectedRecipients.length === 0) {
      alert("Please select at least one recipient")
      return
    }

    setSending(true)
    setSendResult(null)

    try {
      const res = await axios.post("/api/email/bulk", {
        recipients: selectedRecipients,
        templateId: selectedTemplate,
        subject: emailData.subject,
        body: emailData.body,
        customMessage: emailData.customMessage,
      })
      setSendResult(res.data)
    } catch (error) {
      console.error("Send error:", error)
      setSendResult({
        success: false,
        message: error.response?.data?.message || "Failed to send email",
      })
    } finally {
      setSending(false)
    }
  }

  const toggleRecipient = (id) => {
    setSelectedRecipients((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]))
  }

  const selectAllContacts = () => {
    const allContactIds = contacts.map((c) => c._id)
    setSelectedRecipients(allContactIds)
  }

  const clearSelection = () => {
    setSelectedRecipients([])
  }

  return (
    <div>
      <h1>Email Center</h1>

      <div className="card">
        <h3>Compose Email</h3>

        <div className="form-group">
          <label>Email Template:</label>
          <select
            className="form-control"
            value={selectedTemplate}
            onChange={(e) => handleTemplateChange(e.target.value)}
          >
            <option value="">Select Template</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Subject:</label>
          <input
            type="text"
            className="form-control"
            value={emailData.subject}
            onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
            placeholder="Email subject"
          />
        </div>

        <div className="form-group">
          <label>Custom Message:</label>
          <textarea
            className="form-control"
            rows="4"
            value={emailData.customMessage}
            onChange={(e) => setEmailData({ ...emailData, customMessage: e.target.value })}
            placeholder="This will replace {{customMessage}} in the template"
          />
        </div>

        <div className="form-group">
          <label>Custom Body (if not using template):</label>
          <textarea
            className="form-control"
            rows="6"
            value={emailData.body}
            onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
            placeholder="Custom email body"
          />
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>Recipients ({selectedRecipients.length} selected)</h3>
          <div>
            <button className="btn btn-secondary" onClick={selectAllContacts} style={{ marginRight: "10px" }}>
              Select All Contacts
            </button>
            <button className="btn btn-secondary" onClick={clearSelection}>
              Clear Selection
            </button>
          </div>
        </div>

        <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #ddd", padding: "10px" }}>
          <h4>Contacts</h4>
          {contacts.map((contact) => (
            <div key={contact._id} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
              <input
                type="checkbox"
                checked={selectedRecipients.includes(contact._id)}
                onChange={() => toggleRecipient(contact._id)}
                style={{ marginRight: "10px" }}
              />
              <span>
                {contact.firstName} {contact.lastName} ({contact.email})
                {contact.account && <span style={{ color: "#666" }}> - {contact.account.name}</span>}
              </span>
            </div>
          ))}

          <h4 style={{ marginTop: "20px" }}>Leads</h4>
          {leads.map((lead) => (
            <div key={lead._id} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
              <input
                type="checkbox"
                checked={selectedRecipients.includes(lead._id)}
                onChange={() => toggleRecipient(lead._id)}
                style={{ marginRight: "10px" }}
              />
              <span>
                {lead.firstName} {lead.lastName} ({lead.email})
                {lead.company && <span style={{ color: "#666" }}> - {lead.company}</span>}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <button
          className="btn btn-primary"
          onClick={handleSendEmail}
          disabled={sending || selectedRecipients.length === 0}
        >
          {sending ? "Sending..." : `Send Email to ${selectedRecipients.length} Recipients`}
        </button>

        {sendResult && (
          <div
            className={`alert ${sendResult.success ? "alert-success" : "alert-danger"}`}
            style={{ marginTop: "15px" }}
          >
            <h4>{sendResult.success ? "Email Sent" : "Send Failed"}</h4>
            <p>{sendResult.message}</p>
            {sendResult.data && (
              <div>
                <p>Successful: {sendResult.data.successCount}</p>
                <p>Failed: {sendResult.data.failureCount}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card">
        <h3>Template Variables</h3>
        <p>You can use these variables in your email templates:</p>
        <ul>
          <li>
            <code>{"{{firstName}}"}</code> - Recipient's first name
          </li>
          <li>
            <code>{"{{lastName}}"}</code> - Recipient's last name
          </li>
          <li>
            <code>{"{{company}}"}</code> - Recipient's company
          </li>
          <li>
            <code>{"{{senderName}}"}</code> - Your name
          </li>
          <li>
            <code>{"{{customMessage}}"}</code> - Custom message from form
          </li>
        </ul>
      </div>
    </div>
  )
}

export default EmailCenter
