import { useState, useEffect } from "react"
import { motion } from "framer-motion"
// import API from "API"
// import API from "../utils/API";
import API from "../utils/API"
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
import { getStatusColor, formatCurrency, formatDate } from "../lib/utils"
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  UsersIcon,
  CurrencyDollarIcon,
  FunnelIcon,
  MapPinIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline"

const Accounts = () => {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    industry: "",
    type: "prospect",
    size: "small",
    revenue: "",
    employees: "",
    description: "",
    status: "active",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  })

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const res = await API.get("/api/accounts")
      setAccounts(res.data.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching accounts:", error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingAccount) {
        await API.put(`/api/accounts/${editingAccount._id}`, formData)
      } else {
        await API.post("/api/accounts", formData)
      }
      setShowModal(false)
      setEditingAccount(null)
      resetForm()
      fetchAccounts()
    } catch (error) {
      console.error("Error saving account:", error)
    }
  }

  const handleEdit = (account) => {
    setEditingAccount(account)
    setFormData({
      name: account.name,
      website: account.website || "",
      industry: account.industry || "",
      type: account.type,
      size: account.size,
      revenue: account.revenue || "",
      employees: account.employees || "",
      description: account.description || "",
      status: account.status,
      address: account.address || {
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
      name: "",
      website: "",
      industry: "",
      type: "prospect",
      size: "small",
      revenue: "",
      employees: "",
      description: "",
      status: "active",
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
  const [typeFilter, setTypeFilter] = useState("all")
  const [sizeFilter, setSizeFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("list")

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account.industry && account.industry.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (account.website && account.website.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = typeFilter === "all" || account.type === typeFilter
    const matchesSize = sizeFilter === "all" || account.size === sizeFilter

    return matchesSearch && matchesType && matchesSize
  })

  const accountsByType = {
    prospect: accounts.filter(a => a.type === 'prospect'),
    customer: accounts.filter(a => a.type === 'customer'),
    partner: accounts.filter(a => a.type === 'partner'),
    vendor: accounts.filter(a => a.type === 'vendor'),
  }

  const accountsBySize = {
    small: accounts.filter(a => a.size === 'small'),
    medium: accounts.filter(a => a.size === 'medium'),
    large: accounts.filter(a => a.size === 'large'),
    enterprise: accounts.filter(a => a.size === 'enterprise'),
  }

  const getTypeColor = (type) => {
    const colors = {
      prospect: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      customer: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      partner: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      vendor: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
    }
    return colors[type] || colors.prospect
  }

  const getSizeIcon = (size) => {
    switch (size) {
      case 'small': return <UsersIcon className="h-4 w-4" />
      case 'medium': return <ChartBarIcon className="h-4 w-4" />
      case 'large': return <BuildingOfficeIcon className="h-4 w-4" />
      case 'enterprise': return <BuildingOfficeIcon className="h-5 w-5" />
      default: return <UsersIcon className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Accounts</h1>
            <p className="text-muted-foreground">Manage your company accounts</p>
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
            <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
            Accounts
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-1"
          >
            Manage your company accounts and business relationships
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
              setEditingAccount(null)
              setShowModal(true)
            }}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Add New Account
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
                <div className="text-2xl font-bold text-blue-600">{accounts.length}</div>
                <div className="text-sm text-muted-foreground">Total Accounts</div>
              </div>
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{accountsByType.customer.length}</div>
                <div className="text-sm text-muted-foreground">Customers</div>
              </div>
              <UsersIcon className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{accountsByType.prospect.length}</div>
                <div className="text-sm text-muted-foreground">Prospects</div>
              </div>
              <ChartBarIcon className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{accountsBySize.enterprise.length}</div>
                <div className="text-sm text-muted-foreground">Enterprise</div>
              </div>
              <BuildingOfficeIcon className="h-8 w-8 text-purple-600" />
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
                  placeholder="Search accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-2">
                <FunnelIcon className="h-4 w-4 text-muted-foreground" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="prospect">Prospect</option>
                  <option value="customer">Customer</option>
                  <option value="partner">Partner</option>
                  <option value="vendor">Vendor</option>
                </select>

                <select
                  value={sizeFilter}
                  onChange={(e) => setSizeFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="all">All Sizes</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <Card>
              <CardHeader>
                <CardTitle>Accounts ({filteredAccounts.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Contacts</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.map((account) => (
                      <TableRow key={account._id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                <BuildingOfficeIcon className="h-4 w-4 text-blue-600" />
                              </div>
                              {account.name}
                            </div>
                            {account.website && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <GlobeAltIcon className="h-3 w-3" />
                                <a
                                  href={account.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-blue-600 transition-colors"
                                >
                                  {account.website}
                                </a>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{account.industry || "-"}</TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(account.type)}>
                            {account.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getSizeIcon(account.size)}
                            <span className="capitalize">{account.size}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <UsersIcon className="h-4 w-4 text-muted-foreground" />
                            {account.contactCount || 0}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(account)}
                            className="h-8 w-8 p-0"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredAccounts.length === 0 && (
                  <div className="text-center py-12">
                    <BuildingOfficeIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No accounts found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm || typeFilter !== "all" || sizeFilter !== "all"
                        ? "Try adjusting your search or filter criteria"
                        : "Get started by adding your first account"
                      }
                    </p>
                    {!searchTerm && typeFilter === "all" && sizeFilter === "all" && (
                      <Button
                        onClick={() => {
                          resetForm()
                          setEditingAccount(null)
                          setShowModal(true)
                        }}
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Your First Account
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
                  placeholder="Search accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-2">
                <FunnelIcon className="h-4 w-4 text-muted-foreground" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="prospect">Prospect</option>
                  <option value="customer">Customer</option>
                  <option value="partner">Partner</option>
                  <option value="vendor">Vendor</option>
                </select>

                <select
                  value={sizeFilter}
                  onChange={(e) => setSizeFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="all">All Sizes</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>

            {/* Account Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAccounts.map((account) => (
                <motion.div
                  key={account._id}
                  whileHover={{ y: -2 }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-medium">
                              {account.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {account.industry || "No industry specified"}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(account)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={getTypeColor(account.type)}>
                          {account.type}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          {getSizeIcon(account.size)}
                          <span className="capitalize">{account.size}</span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-2">
                      {account.website && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <GlobeAltIcon className="h-4 w-4" />
                          <a
                            href={account.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 transition-colors truncate"
                          >
                            {account.website}
                          </a>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <UsersIcon className="h-4 w-4" />
                        {account.contactCount || 0} contacts
                      </div>

                      {account.revenue && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CurrencyDollarIcon className="h-4 w-4" />
                          {formatCurrency(account.revenue)}
                        </div>
                      )}

                      {account.address && (account.address.city || account.address.state) && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPinIcon className="h-4 w-4" />
                          {[account.address.city, account.address.state].filter(Boolean).join(', ')}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredAccounts.length === 0 && (
              <div className="text-center py-12">
                <BuildingOfficeIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No accounts found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || typeFilter !== "all" || sizeFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Get started by adding your first account"
                  }
                </p>
                {!searchTerm && typeFilter === "all" && sizeFilter === "all" && (
                  <Button
                    onClick={() => {
                      resetForm()
                      setEditingAccount(null)
                      setShowModal(true)
                    }}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Your First Account
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
              {editingAccount ? "Edit Account" : "Add New Account"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Name *</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter company name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Website</label>
                <Input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Industry</label>
                <Input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="e.g., Technology, Healthcare, Finance"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Account Type</label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="prospect">Prospect</option>
                  <option value="customer">Customer</option>
                  <option value="partner">Partner</option>
                  <option value="vendor">Vendor</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Size</label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                >
                  <option value="small">Small (1-50)</option>
                  <option value="medium">Medium (51-200)</option>
                  <option value="large">Large (201-1000)</option>
                  <option value="enterprise">Enterprise (1000+)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Annual Revenue</label>
                <Input
                  type="number"
                  value={formData.revenue}
                  onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Employees</label>
                <Input
                  type="number"
                  value={formData.employees}
                  onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                  placeholder="0"
                />
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
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm min-h-[100px] resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add any additional information about this account..."
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
              {editingAccount ? "Update" : "Create"} Account
            </Button>
          </DialogFooter>

          <DialogClose onOpenChange={setShowModal} />
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

export default Accounts
