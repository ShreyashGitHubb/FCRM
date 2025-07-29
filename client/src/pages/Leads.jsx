import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Badge } from "../components/ui/Badge"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "../components/ui/Dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../components/ui/Table"
import { SkeletonTable } from "../components/ui/Skeleton"
import { getStatusColor } from "../lib/utils"
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  UserGroupIcon,
  FunnelIcon
} from "@heroicons/react/24/outline"

const Leads = () => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    status: "new",
    source: "website",
    notes: "",
    assignedTo: "",
  })
  const [users, setUsers] = useState([])
  const [error, setError] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    fetchLeads()
    if (user?.role === "admin" || user?.role === "super_admin") {
      fetchUsers()
    }
  }, [])

  const fetchLeads = async () => {
    try {
      const res = await axios.get("/api/leads")
      setLeads(res.data.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching leads:", error)
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users")
      setUsers(res.data.data)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      let submitData = { ...formData }
      // Only send assignedTo if admin/super_admin and selected
      if (user?.role !== "admin" && user?.role !== "super_admin") {
        delete submitData.assignedTo
      } else if (submitData.assignedTo === "") {
        delete submitData.assignedTo
      }
      if (editingLead) {
        await axios.put(`/api/leads/${editingLead._id}`, submitData)
      } else {
        await axios.post("/api/leads", submitData)
      }
      setShowModal(false)
      setEditingLead(null)
      resetForm()
      fetchLeads()
    } catch (error) {
      setError(error.response?.data?.message || "Error saving lead.")
      console.error("Error saving lead:", error)
    }
  }

  const handleEdit = (lead) => {
    setEditingLead(lead)
    setFormData({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone || "",
      company: lead.company || "",
      status: lead.status,
      source: lead.source,
      notes: lead.notes || "",
      assignedTo: lead.assignedTo?._id || "",
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      status: "new",
      source: "website",
      notes: "",
      assignedTo: "",
    })
  }

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || lead.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Leads</h1>
            <p className="text-muted-foreground">Manage your sales leads</p>
          </div>
        </div>
        <SkeletonTable rows={8} columns={6} />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-foreground flex items-center gap-2"
          >
            <UserGroupIcon className="h-8 w-8 text-blue-600" />
            Leads
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-1"
          >
            Manage your sales leads and track conversion progress
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={() => {
              resetForm()
              setEditingLead(null)
              setShowModal(true)
            }}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Add New Lead
          </Button>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <FunnelIcon className="h-4 w-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{leads.length}</div>
            <div className="text-sm text-muted-foreground">Total Leads</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {leads.filter(l => l.status === 'qualified').length}
            </div>
            <div className="text-sm text-muted-foreground">Qualified</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">
              {leads.filter(l => l.status === 'converted').length}
            </div>
            <div className="text-sm text-muted-foreground">Converted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {leads.filter(l => l.status === 'new').length}
            </div>
            <div className="text-sm text-muted-foreground">New</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Leads ({filteredLeads.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead._id}>
                    <TableCell className="font-medium">
                      {lead.firstName} {lead.lastName}
                    </TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.company || "-"}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">{lead.source.replace('_', ' ')}</TableCell>
                    <TableCell>{lead.assignedTo?.name || "Unassigned"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(lead)}
                        className="h-8 w-8 p-0"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredLeads.length === 0 && (
              <div className="text-center py-12">
                <UserGroupIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No leads found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Get started by creating your first lead"
                  }
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <Button
                    onClick={() => {
                      resetForm()
                      setEditingLead(null)
                      setShowModal(true)
                    }}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Your First Lead
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingLead ? "Edit Lead" : "Add New Lead"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name *</label>
                <Input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  placeholder="Enter first name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name *</label>
                <Input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email *</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="Enter email address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Company</label>
                <Input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Source</label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                >
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="social_media">Social Media</option>
                  <option value="email_campaign">Email Campaign</option>
                  <option value="cold_call">Cold Call</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {(user?.role === "admin" || user?.role === "super_admin") && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Assign To</label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                >
                  <option value="">Select User</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.role.replace('_', ' ')})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <textarea
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm min-h-[80px] resize-none"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any additional notes..."
              />
            </div>
          </form>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
            >
              {editingLead ? "Update" : "Create"} Lead
            </Button>
          </DialogFooter>

          <DialogClose onOpenChange={setShowModal} />
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

export default Leads
