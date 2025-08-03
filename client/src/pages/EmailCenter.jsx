"use client"

import { useState, useEffect } from "react"
// import axios from "axios"
// import axios from "../utils/axios";
import API from "../utils/axios"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "../components/ui/Dialog"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"

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
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    fetchTemplates()
    fetchContacts()
    fetchLeads()
  }, [])

  const fetchTemplates = async () => {
    try {
      const res = await API.get("/api/email/templates")
      setTemplates(res.data.data)
    } catch (error) {
      console.error("Error fetching templates:", error)
    }
  }

  const fetchContacts = async () => {
    try {
      const res = await API.get("/api/contacts")
      setContacts(res.data.data)
    } catch (error) {
      console.error("Error fetching contacts:", error)
    }
  }

  const fetchLeads = async () => {
    try {
      const res = await API.get("/api/leads")
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
      <Button onClick={() => setShowDialog(true)} className="mb-4">Compose Email</Button>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compose Email</DialogTitle>
          </DialogHeader>
          <form onSubmit={e => { e.preventDefault(); handleSendEmail(); }}>
            <div className="space-y-4">
              <div>
                <label>Email Template:</label>
                <select className="form-control" value={selectedTemplate} onChange={e => handleTemplateChange(e.target.value)}>
                  <option value="">Select Template</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Subject:</label>
                <Input type="text" value={emailData.subject} onChange={e => setEmailData({ ...emailData, subject: e.target.value })} placeholder="Email subject" />
              </div>
              <div>
                <label>Custom Message:</label>
                <Input as="textarea" rows={4} value={emailData.customMessage} onChange={e => setEmailData({ ...emailData, customMessage: e.target.value })} placeholder="This will replace {{customMessage}} in the template" />
              </div>
              <div>
                <label>Custom Body (if not using template):</label>
                <Input as="textarea" rows={6} value={emailData.body} onChange={e => setEmailData({ ...emailData, body: e.target.value })} placeholder="Custom email body" />
              </div>
              <div>
                <label>Recipients</label>
                <div className="flex gap-2 mb-2">
                  <Button type="button" variant="secondary" onClick={selectAllContacts}>Select All Contacts</Button>
                  <Button type="button" variant="secondary" onClick={clearSelection}>Clear Selection</Button>
                </div>
                <div className="max-h-48 overflow-y-auto border p-2 rounded">
                  <div className="font-semibold mb-1">Contacts</div>
                  {contacts.map(contact => (
                    <div key={contact._id} className="flex items-center mb-1">
                      <input type="checkbox" checked={selectedRecipients.includes(contact._id)} onChange={() => toggleRecipient(contact._id)} className="mr-2" />
                      <span>{contact.firstName} {contact.lastName} ({contact.email}) {contact.account && <span className="text-muted-foreground">- {contact.account.name}</span>}</span>
                    </div>
                  ))}
                  <div className="font-semibold mt-2 mb-1">Leads</div>
                  {leads.map(lead => (
                    <div key={lead._id} className="flex items-center mb-1">
                      <input type="checkbox" checked={selectedRecipients.includes(lead._id)} onChange={() => toggleRecipient(lead._id)} className="mr-2" />
                      <span>{lead.firstName} {lead.lastName} ({lead.email}) {lead.company && <span className="text-muted-foreground">- {lead.company}</span>}</span>
                    </div>
                  ))}
                </div>
              </div>
              {sendResult && (
                <div className={`alert ${sendResult.success ? "alert-success" : "alert-danger"} mt-2`}>
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
              <Button type="submit" disabled={sending || selectedRecipients.length === 0}>{sending ? "Sending..." : `Send Email to ${selectedRecipients.length} Recipients`}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Keep the rest of the page unchanged, e.g., template variables card */}
      <div className="card mt-6">
        <h3>Template Variables</h3>
        <p>You can use these variables in your email templates:</p>
        <ul>
          <li><code>{"{{firstName}}"}</code> - Recipient's first name</li>
          <li><code>{"{{lastName}}"}</code> - Recipient's last name</li>
          <li><code>{"{{company}}"}</code> - Recipient's company</li>
          <li><code>{"{{senderName}}"}</code> - Your name</li>
          <li><code>{"{{customMessage}}"}</code> - Custom message from form</li>
        </ul>
      </div>
    </div>
  )
}

export default EmailCenter
