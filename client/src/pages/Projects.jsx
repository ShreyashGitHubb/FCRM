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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs"
import { SkeletonTable } from "../components/ui/Skeleton"
import { getStatusColor, getPriorityColor, formatCurrency, formatDate } from "../lib/utils"
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  FolderIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  FunnelIcon,
  ClockIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline"

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [accounts, setAccounts] = useState([])
  const [contacts, setContacts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "planning",
    priority: "medium",
    startDate: "",
    endDate: "",
    budget: "",
    account: "",
    contact: "",
    teamMembers: [],
    milestones: [],
    assignedTo: "",
  })
  const [error, setError] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    if (user?.role !== "customer") {
      fetchProjects()
      fetchAccounts()
      fetchContacts()
      fetchUsers()
    }
  }, [user])

  const fetchProjects = async () => {
    try {
      const res = await axios.get("/api/projects")
      setProjects(res.data.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching projects:", error)
      setLoading(false)
    }
  }

  const fetchAccounts = async () => {
    try {
      const res = await axios.get("/api/accounts")
      setAccounts(res.data.data)
    } catch (error) {
      console.error("Error fetching accounts:", error)
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
      if (!submitData.assignedTo) {
        // Default to first user in list or leave blank
        submitData.assignedTo = users[0]?._id || ""
      }
      if (editingProject) {
        await axios.put(`/api/projects/${editingProject._id}`, submitData)
      } else {
        await axios.post("/api/projects", submitData)
      }
      setShowModal(false)
      setEditingProject(null)
      resetForm()
      fetchProjects()
    } catch (error) {
      setError(error.response?.data?.message || "Error saving project.")
      console.error("Error saving project:", error)
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({
      name: project.name,
      description: project.description || "",
      status: project.status,
      priority: project.priority,
      startDate: project.startDate ? project.startDate.split("T")[0] : "",
      endDate: project.endDate ? project.endDate.split("T")[0] : "",
      budget: project.budget || "",
      account: project.account?._id || "",
      contact: project.contact?._id || "",
      teamMembers: project.teamMembers?.map((member) => member._id) || [],
      milestones: project.milestones || [],
      assignedTo: project.assignedTo?._id || "",
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      status: "planning",
      priority: "medium",
      startDate: "",
      endDate: "",
      budget: "",
      account: "",
      contact: "",
      teamMembers: [],
      milestones: [],
      assignedTo: "",
    })
  }

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("list")

  const filteredProjects = projects.filter(project => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (project.account?.name && project.account.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const projectsByStatus = {
    planning: projects.filter(p => p.status === 'planning'),
    active: projects.filter(p => p.status === 'active'),
    on_hold: projects.filter(p => p.status === 'on_hold'),
    completed: projects.filter(p => p.status === 'completed'),
    cancelled: projects.filter(p => p.status === 'cancelled'),
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'planning': return <ClockIcon className="h-4 w-4" />
      case 'active': return <ChartBarIcon className="h-4 w-4" />
      case 'on_hold': return <ExclamationTriangleIcon className="h-4 w-4" />
      case 'completed': return <CheckCircleIcon className="h-4 w-4" />
      case 'cancelled': return <ExclamationTriangleIcon className="h-4 w-4" />
      default: return <FolderIcon className="h-4 w-4" />
    }
  }

  const addMilestone = () => {
    setFormData({
      ...formData,
      milestones: [
        ...formData.milestones,
        {
          name: "",
          description: "",
          dueDate: "",
          status: "pending",
        },
      ],
    })
  }

  const updateMilestone = (index, field, value) => {
    const updatedMilestones = [...formData.milestones]
    updatedMilestones[index][field] = value
    setFormData({ ...formData, milestones: updatedMilestones })
  }

  const removeMilestone = (index) => {
    const updatedMilestones = formData.milestones.filter((_, i) => i !== index)
    setFormData({ ...formData, milestones: updatedMilestones })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground">Manage your project portfolio</p>
          </div>
        </div>
        <SkeletonTable rows={8} columns={8} />
      </div>
    )
  }

  if (user?.role === "customer") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You are not authorized to view this page.</p>
        </Card>
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
            <FolderIcon className="h-8 w-8 text-purple-600" />
            Projects
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-1"
          >
            Manage your project portfolio and track progress
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
              setEditingProject(null)
              setShowModal(true)
            }}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Add New Project
          </Button>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{projects.length}</div>
                <div className="text-sm text-muted-foreground">Total Projects</div>
              </div>
              <FolderIcon className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{projectsByStatus.active.length}</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
              <ChartBarIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{projectsByStatus.planning.length}</div>
                <div className="text-sm text-muted-foreground">Planning</div>
              </div>
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{projectsByStatus.completed.length}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">{projectsByStatus.on_hold.length}</div>
                <div className="text-sm text-muted-foreground">On Hold</div>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-orange-600" />
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
                  placeholder="Search projects..."
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
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <Card>
              <CardHeader>
                <CardTitle>Projects ({filteredProjects.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Timeline</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map((project) => (
                      <TableRow key={project._id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium flex items-center gap-2">
                              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                                <FolderIcon className="h-4 w-4 text-purple-600" />
                              </div>
                              {project.name}
                            </div>
                            {project.account && (
                              <div className="text-sm text-muted-foreground">
                                {project.account.name}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(project.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(project.status)}
                              {project.status.replace("_", " ")}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(project.priority)}>
                            {project.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 transition-all duration-300"
                                style={{ width: `${project.progress || 0}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{project.progress || 0}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                              {formatDate(project.startDate)}
                            </div>
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                              {formatDate(project.endDate)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {project.budget ? (
                            <div className="flex items-center gap-1">
                              <CurrencyDollarIcon className="h-4 w-4 text-muted-foreground" />
                              {formatCurrency(project.budget)}
                            </div>
                          ) : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(project)}
                            className="h-8 w-8 p-0"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredProjects.length === 0 && (
                  <div className="text-center py-12">
                    <FolderIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                        ? "Try adjusting your search or filter criteria"
                        : "Get started by creating your first project"
                      }
                    </p>
                    {!searchTerm && statusFilter === "all" && priorityFilter === "all" && (
                      <Button
                        onClick={() => {
                          resetForm()
                          setEditingProject(null)
                          setShowModal(true)
                        }}
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Create Your First Project
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
                  placeholder="Search projects..."
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
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Project Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project._id}
                  whileHover={{ y: -2 }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                            <FolderIcon className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-medium">
                              {project.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {project.account?.name || "No account"}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(project)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(project.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(project.status)}
                            {project.status.replace("_", " ")}
                          </div>
                        </Badge>
                        <Badge className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{project.progress || 0}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 transition-all duration-300"
                            style={{ width: `${project.progress || 0}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                        </div>

                        {project.budget && (
                          <div className="flex items-center gap-2">
                            <CurrencyDollarIcon className="h-4 w-4" />
                            {formatCurrency(project.budget)}
                          </div>
                        )}

                        {project.assignedTo && (
                          <div className="flex items-center gap-2">
                            <UsersIcon className="h-4 w-4" />
                            {project.assignedTo.name}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <FolderIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Get started by creating your first project"
                  }
                </p>
                {!searchTerm && statusFilter === "all" && priorityFilter === "all" && (
                  <Button
                    onClick={() => {
                      resetForm()
                      setEditingProject(null)
                      setShowModal(true)
                    }}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Your First Project
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent style={{ maxWidth: 800 }}>
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <div className="space-y-4">
              <div>
                <label>Project Name:</label>
                <Input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div>
                <label>Description:</label>
                <Input as="textarea" rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label>Status:</label>
                  <select className="form-control" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="on_hold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label>Priority:</label>
                  <select className="form-control" value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label>Start Date:</label>
                  <Input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} required />
                </div>
                <div>
                  <label>End Date:</label>
                  <Input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} required />
                </div>
              </div>
              <div>
                <label>Budget:</label>
                <Input type="number" value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label>Account:</label>
                  <select className="form-control" value={formData.account} onChange={e => setFormData({ ...formData, account: e.target.value })}>
                    <option value="">Select Account</option>
                    {accounts.map(acc => <option key={acc._id} value={acc._id}>{acc.name}</option>)}
                  </select>
                </div>
                <div>
                  <label>Contact:</label>
                  <select className="form-control" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })}>
                    <option value="">Select Contact</option>
                    {contacts.map(c => <option key={c._id} value={c._id}>{c.firstName} {c.lastName}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label>Team Members:</label>
                <select className="form-control" multiple value={formData.teamMembers} onChange={e => setFormData({ ...formData, teamMembers: Array.from(e.target.selectedOptions, option => option.value) })}>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                </select>
              </div>
              {/* Add more fields as needed */}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit">{editingProject ? "Update Project" : "Create Project"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

export default Projects
