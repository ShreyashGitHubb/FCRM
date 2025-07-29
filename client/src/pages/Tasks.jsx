import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import axios from "axios"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs"
import { SkeletonTable } from "../components/ui/Skeleton"
import { getStatusColor, formatDate } from "../lib/utils"
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  CalendarIcon
} from "@heroicons/react/24/outline"

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
    assignedTo: "",
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await axios.get("/api/tasks")
      setTasks(res.data.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching tasks:", error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingTask) {
        await axios.put(`/api/tasks/${editingTask._id}`, formData)
      } else {
        await axios.post("/api/tasks", formData)
      }
      setShowModal(false)
      setEditingTask(null)
      resetForm()
      fetchTasks()
    } catch (error) {
      console.error("Error saving task:", error)
    }
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      assignedTo: task.assignedTo._id,
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      dueDate: "",
      assignedTo: "",
    })
  }

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("list")

  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const tasksByStatus = {
    pending: tasks.filter(t => t.status === 'pending'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    completed: tasks.filter(t => t.status === 'completed'),
    cancelled: tasks.filter(t => t.status === 'cancelled'),
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return ExclamationTriangleIcon
      case 'high': return ExclamationTriangleIcon
      case 'medium': return ClockIcon
      case 'low': return CheckCircleIcon
      default: return ClockIcon
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 dark:bg-red-950'
      case 'high': return 'text-orange-600 bg-orange-50 dark:bg-orange-950'
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950'
      case 'low': return 'text-green-600 bg-green-50 dark:bg-green-950'
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Tasks</h1>
            <p className="text-muted-foreground">Manage your tasks and assignments</p>
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
            <CheckCircleIcon className="h-8 w-8 text-blue-600" />
            Tasks
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-1"
          >
            Organize and track your tasks and assignments
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
              setEditingTask(null)
              setShowModal(true)
            }}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Add New Task
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
                <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
                <div className="text-sm text-muted-foreground">Total Tasks</div>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{tasksByStatus.pending.length}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{tasksByStatus.in_progress.length}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
              <CalendarIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{tasksByStatus.completed.length}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
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
            <TabsTrigger value="board">Board View</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-sm">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
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
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="all">All Priority</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            {/* Task Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task) => {
                const PriorityIcon = getPriorityIcon(task.priority)
                return (
                  <motion.div
                    key={task._id}
                    whileHover={{ y: -2 }}
                    className="group"
                  >
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base font-medium line-clamp-2">
                            {task.title}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(task)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(task.status)}>
                            {task.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getPriorityColor(task.priority)}>
                            <PriorityIcon className="h-3 w-3 mr-1" />
                            {task.priority}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        {task.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        <div className="space-y-2 text-xs text-muted-foreground">
                          {task.dueDate && (
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              Due: {formatDate(task.dueDate)}
                            </div>
                          )}
                          {task.assignedTo && (
                            <div>
                              Assigned to: {task.assignedTo.name}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <CheckCircleIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No tasks found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Get started by creating your first task"
                  }
                </p>
                {!searchTerm && statusFilter === "all" && priorityFilter === "all" && (
                  <Button
                    onClick={() => {
                      resetForm()
                      setEditingTask(null)
                      setShowModal(true)
                    }}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Your First Task
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="board" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
                <Card key={status} className="min-h-[400px]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium capitalize flex items-center justify-between">
                      {status.replace('_', ' ')}
                      <Badge variant="secondary" className="text-xs">
                        {statusTasks.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {statusTasks.map((task) => {
                      const PriorityIcon = getPriorityIcon(task.priority)
                      return (
                        <motion.div
                          key={task._id}
                          whileHover={{ scale: 1.02 }}
                          className="p-3 border rounded-lg bg-card hover:bg-accent cursor-pointer"
                          onClick={() => handleEdit(task)}
                        >
                          <div className="font-medium text-sm mb-2">{task.title}</div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getPriorityColor(task.priority)}>
                              <PriorityIcon className="h-3 w-3 mr-1" />
                              {task.priority}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {task.dueDate && `Due: ${formatDate(task.dueDate)}`}
                          </div>
                        </motion.div>
                      )
                    })}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit Task" : "Add New Task"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title *</label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Enter task title"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm min-h-[80px] resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter task description..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Due Date *</label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
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
              {editingTask ? "Update" : "Create"} Task
            </Button>
          </DialogFooter>

          <DialogClose onOpenChange={setShowModal} />
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

export default Tasks
