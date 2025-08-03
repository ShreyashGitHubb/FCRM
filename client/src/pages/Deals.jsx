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
import { getStatusColor, formatCurrency, formatDate } from "../lib/utils"
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  CurrencyDollarIcon,
  FunnelIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ClockIcon
} from "@heroicons/react/24/outline"

const Deals = () => {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingDeal, setEditingDeal] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    value: "",
    stage: "initiated",
    probability: 10,
    expectedCloseDate: "",
    contact: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
    },
    notes: "",
  })

  useEffect(() => {
    fetchDeals()
  }, [])

  const fetchDeals = async () => {
    try {
      const res = await API.get("/api/deals")
      setDeals(res.data.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching deals:", error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingDeal) {
        await API.put(`/api/deals/${editingDeal._id}`, formData)
      } else {
        await API.post("/api/deals", formData)
      }
      setShowModal(false)
      setEditingDeal(null)
      resetForm()
      fetchDeals()
    } catch (error) {
      console.error("Error saving deal:", error)
    }
  }

  const handleEdit = (deal) => {
    setEditingDeal(deal)
    setFormData({
      title: deal.title,
      value: deal.value,
      stage: deal.stage,
      probability: deal.probability,
      expectedCloseDate: deal.expectedCloseDate ? deal.expectedCloseDate.split("T")[0] : "",
      contact: deal.contact || {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
      },
      notes: deal.notes || "",
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      value: "",
      stage: "initiated",
      probability: 10,
      expectedCloseDate: "",
      contact: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
      },
      notes: "",
    })
  }

  const [searchTerm, setSearchTerm] = useState("")
  const [stageFilter, setStageFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("list")

  const filteredDeals = deals.filter(deal => {
    const matchesSearch =
      deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (deal.contact?.company && deal.contact.company.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStage = stageFilter === "all" || deal.stage === stageFilter

    return matchesSearch && matchesStage
  })

  const dealsByStage = {
    initiated: deals.filter(d => d.stage === 'initiated'),
    qualification: deals.filter(d => d.stage === 'qualification'),
    proposal: deals.filter(d => d.stage === 'proposal'),
    negotiation: deals.filter(d => d.stage === 'negotiation'),
    won: deals.filter(d => d.stage === 'won'),
    lost: deals.filter(d => d.stage === 'lost'),
  }

  const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0)
  const wonValue = dealsByStage.won.reduce((sum, deal) => sum + (deal.value || 0), 0)
  const pipelineValue = deals.filter(d => !['won', 'lost'].includes(d.stage))
    .reduce((sum, deal) => sum + (deal.value || 0), 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Deals</h1>
            <p className="text-muted-foreground">Manage your sales pipeline</p>
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
            <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
            Deals
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-1"
          >
            Track your sales pipeline and manage deal progression
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
              setEditingDeal(null)
              setShowModal(true)
            }}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Add New Deal
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
                <div className="text-2xl font-bold text-green-600">{formatCurrency(totalValue)}</div>
                <div className="text-sm text-muted-foreground">Total Value</div>
              </div>
              <ArrowTrendingUpIcon className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(pipelineValue)}</div>
                <div className="text-sm text-muted-foreground">Pipeline Value</div>
              </div>
              <ChartBarIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-emerald-600">{formatCurrency(wonValue)}</div>
                <div className="text-sm text-muted-foreground">Won Deals</div>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">{deals.length}</div>
                <div className="text-sm text-muted-foreground">Total Deals</div>
              </div>
              <ClockIcon className="h-8 w-8 text-orange-600" />
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
            <TabsTrigger value="pipeline">Pipeline View</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-sm">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search deals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-2">
                <FunnelIcon className="h-4 w-4 text-muted-foreground" />
                <select
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="all">All Stages</option>
                  <option value="initiated">Initiated</option>
                  <option value="qualification">Qualification</option>
                  <option value="proposal">Proposal</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <Card>
              <CardHeader>
                <CardTitle>Deals ({filteredDeals.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Probability</TableHead>
                      <TableHead>Expected Close</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeals.map((deal) => (
                      <TableRow key={deal._id}>
                        <TableCell className="font-medium">{deal.title}</TableCell>
                        <TableCell>{formatCurrency(deal.value)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(deal.stage)}>
                            {deal.stage}
                          </Badge>
                        </TableCell>
                        <TableCell>{deal.probability}%</TableCell>
                        <TableCell>
                          {deal.expectedCloseDate ? formatDate(deal.expectedCloseDate) : "-"}
                        </TableCell>
                        <TableCell>
                          {deal.contact?.firstName && deal.contact?.lastName
                            ? `${deal.contact.firstName} ${deal.contact.lastName}`
                            : deal.assignedTo?.name || "Unassigned"
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(deal)}
                            className="h-8 w-8 p-0"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredDeals.length === 0 && (
                  <div className="text-center py-12">
                    <CurrencyDollarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No deals found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm || stageFilter !== "all"
                        ? "Try adjusting your search or filter criteria"
                        : "Get started by creating your first deal"
                      }
                    </p>
                    {!searchTerm && stageFilter === "all" && (
                      <Button
                        onClick={() => {
                          resetForm()
                          setEditingDeal(null)
                          setShowModal(true)
                        }}
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Your First Deal
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {Object.entries(dealsByStage).map(([stage, stageDeals]) => (
                <Card key={stage} className="min-h-[400px]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium capitalize flex items-center justify-between">
                      {stage.replace('_', ' ')}
                      <Badge variant="secondary" className="text-xs">
                        {stageDeals.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {stageDeals.map((deal) => (
                      <motion.div
                        key={deal._id}
                        whileHover={{ scale: 1.02 }}
                        className="p-3 border rounded-lg bg-card hover:bg-accent cursor-pointer"
                        onClick={() => handleEdit(deal)}
                      >
                        <div className="font-medium text-sm mb-1">{deal.title}</div>
                        <div className="text-lg font-bold text-green-600 mb-2">
                          {formatCurrency(deal.value)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {deal.probability}% • {deal.contact?.company || 'No company'}
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingDeal ? "Edit Deal" : "Add New Deal"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Enter deal title"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Value *</label>
                <Input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  required
                  placeholder="Enter deal value"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Stage</label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                >
                  <option value="initiated">Initiated</option>
                  <option value="qualification">Qualification</option>
                  <option value="proposal">Proposal</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Probability (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                  placeholder="0-100"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Expected Close Date *</label>
                <Input
                  type="date"
                  value={formData.expectedCloseDate}
                  onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium">Contact Information</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    type="text"
                    value={formData.contact.firstName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, firstName: e.target.value },
                      })
                    }
                    placeholder="Enter first name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input
                    type="text"
                    value={formData.contact.lastName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, lastName: e.target.value },
                      })
                    }
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, email: e.target.value },
                      })
                    }
                    placeholder="Enter email address"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Company</label>
                  <Input
                    type="text"
                    value={formData.contact.company}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, company: e.target.value },
                      })
                    }
                    placeholder="Enter company name"
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
                placeholder="Add any additional notes about this deal..."
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
              {editingDeal ? "Update" : "Create"} Deal
            </Button>
          </DialogFooter>

          <DialogClose onOpenChange={setShowModal} />
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

export default Deals
