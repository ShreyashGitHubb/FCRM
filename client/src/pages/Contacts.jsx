import { useState, useEffect } from "react"
import { motion } from "framer-motion"
// import axios from "axios"
// import axios from "../utils/axios";
import API from "../utils/axios"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs"
import { SkeletonTable } from "../components/ui/Skeleton"
import { getStatusColor, formatDate } from "../lib/utils"
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  FunnelIcon,
  UserGroupIcon,
  MapPinIcon
} from "@heroicons/react/24/outline"

const Contacts = () => {
  const [contacts, setContacts] = useState([])
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    mobile: "",
    jobTitle: "",
    department: "",
    account: "",
    status: "active",
    notes: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  })

  useEffect(() => {
    fetchContacts()
    fetchAccounts()
  }, [])

  const fetchContacts = async () => {
    try {
      const res = await API.get("/api/contacts")
      setContacts(res.data.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching contacts:", error)
      setLoading(false)
    }
  }

  const fetchAccounts = async () => {
    try {
      const res = await API.get("/api/accounts")
      setAccounts(res.data.data)
    } catch (error) {
      console.error("Error fetching accounts:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingContact) {
        await API.put(`/api/contacts/${editingContact._id}`, formData)
      } else {
        await API.post("/api/contacts", formData)
      }
      setShowModal(false)
      setEditingContact(null)
      resetForm()
      fetchContacts()
    } catch (error) {
      console.error("Error saving contact:", error)
    }
  }

  const handleEdit = (contact) => {
    setEditingContact(contact)
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone || "",
      mobile: contact.mobile || "",
      jobTitle: contact.jobTitle || "",
      department: contact.department || "",
      account: contact.account._id,
      status: contact.status,
      notes: contact.notes || "",
      address: contact.address || {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      mobile: "",
      jobTitle: "",
      department: "",
      account: "",
      status: "active",
      notes: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
    })
  }

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("list")

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch =
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.jobTitle && contact.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.account?.name && contact.account.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || contact.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const contactsByStatus = {
    active: contacts.filter(c => c.status === 'active'),
    inactive: contacts.filter(c => c.status === 'inactive'),
    prospect: contacts.filter(c => c.status === 'prospect'),
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Contacts</h1>
            <p className="text-muted-foreground">Manage your contact directory</p>
          </div>
        </div>
        <SkeletonTable rows={8} columns={7} />
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
            Contacts
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-1"
          >
            Manage your contact directory and relationships
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
              setEditingContact(null)
              setShowModal(true)
            }}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Add New Contact
          </Button>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{contacts.length}</div>
                <div className="text-sm text-muted-foreground">Total Contacts</div>
              </div>
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{contactsByStatus.active.length}</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
              <UserIcon className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{contactsByStatus.prospect.length}</div>
                <div className="text-sm text-muted-foreground">Prospects</div>
              </div>
              <BuildingOfficeIcon className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-600">{contactsByStatus.inactive.length}</div>
                <div className="text-sm text-muted-foreground">Inactive</div>
              </div>
              <UserIcon className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="cards">Card View</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-sm">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="prospect">Prospect</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <Card>
              <CardHeader>
                <CardTitle>Contacts ({filteredContacts.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.map((contact) => (
                      <TableRow key={contact._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <UserIcon className="h-4 w-4 text-blue-600" />
                            </div>
                            {contact.firstName} {contact.lastName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <EnvelopeIcon className="h-4 w-4 text-muted-foreground" />
                            {contact.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          {contact.phone || contact.mobile ? (
                            <div className="flex items-center gap-2">
                              <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                              {contact.phone || contact.mobile}
                            </div>
                          ) : "-"}
                        </TableCell>
                        <TableCell>{contact.jobTitle || "-"}</TableCell>
                        <TableCell>
                          {contact.account?.name ? (
                            <div className="flex items-center gap-2">
                              <BuildingOfficeIcon className="h-4 w-4 text-muted-foreground" />
                              {contact.account.name}
                            </div>
                          ) : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(contact.status)}>
                            {contact.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(contact)}
                            className="h-8 w-8 p-0"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredContacts.length === 0 && (
                  <div className="text-center py-12">
                    <UserGroupIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No contacts found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm || statusFilter !== "all"
                        ? "Try adjusting your search or filter criteria"
                        : "Get started by adding your first contact"
                      }
                    </p>
                    {!searchTerm && statusFilter === "all" && (
                      <Button
                        onClick={() => {
                          resetForm()
                          setEditingContact(null)
                          setShowModal(true)
                        }}
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Your First Contact
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cards" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-sm">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="prospect">Prospect</option>
                </select>
              </div>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContacts.map((contact) => (
                <motion.div
                  key={contact._id}
                  whileHover={{ y: -2 }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-medium">
                              {contact.firstName} {contact.lastName}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {contact.jobTitle || "No title"}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(contact)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </div>

                      <Badge className={getStatusColor(contact.status)}>
                        {contact.status}
                      </Badge>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <EnvelopeIcon className="h-4 w-4" />
                        {contact.email}
                      </div>

                      {(contact.phone || contact.mobile) && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <PhoneIcon className="h-4 w-4" />
                          {contact.phone || contact.mobile}
                        </div>
                      )}

                      {contact.account?.name && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <BuildingOfficeIcon className="h-4 w-4" />
                          {contact.account.name}
                        </div>
                      )}

                      {contact.address && (contact.address.city || contact.address.state) && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPinIcon className="h-4 w-4" />
                          {[contact.address.city, contact.address.state].filter(Boolean).join(', ')}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredContacts.length === 0 && (
              <div className="text-center py-12">
                <UserGroupIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No contacts found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Get started by adding your first contact"
                  }
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <Button
                    onClick={() => {
                      resetForm()
                      setEditingContact(null)
                      setShowModal(true)
                    }}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Your First Contact
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingContact ? "Edit Contact" : "Add New Contact"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                <label className="text-sm font-medium">Mobile</label>
                <Input
                  type="text"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="Enter mobile number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Job Title</label>
                <Input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  placeholder="Enter job title"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Enter department"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Account *</label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  value={formData.account}
                  onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                  required
                >
                  <option value="">Select Account</option>
                  {accounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="prospect">Prospect</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium">Address Information</h4>

              <div className="space-y-2">
                <label className="text-sm font-medium">Street Address</label>
                <Input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value }
                  })}
                  placeholder="Enter street address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <Input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value }
                    })}
                    placeholder="Enter city"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">State</label>
                  <Input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, state: e.target.value }
                    })}
                    placeholder="Enter state"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">ZIP Code</label>
                  <Input
                    type="text"
                    value={formData.address.zipCode}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, zipCode: e.target.value }
                    })}
                    placeholder="Enter ZIP code"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Country</label>
                  <Input
                    type="text"
                    value={formData.address.country}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, country: e.target.value }
                    })}
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <textarea
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm min-h-[100px] resize-none"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any additional notes about this contact..."
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
              {editingContact ? "Update" : "Create"} Contact
            </Button>
          </DialogFooter>

          <DialogClose onOpenChange={setShowModal} />
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

export default Contacts
