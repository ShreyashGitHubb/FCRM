"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/Dialog'
import { useToast } from '../hooks/use-toast'
import Toast from '../components/Toast'
import { canManageUsers } from '../permissions/rolePermissions'
import API from "../utils/axios"

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "sales_executive",
    isActive: true,
    isApproved: true,
  })
  const { toast, toasts } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await API.get("/api/users")
      setUsers(response.data.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingUser ? `/api/users/${editingUser._id}` : `/api/users`
      const method = editingUser ? 'put' : 'post'
      const response = await API[method](url, formData)

      toast({
        title: "Success",
        description: editingUser ? "User updated successfully" : "User created successfully",
      })
      setShowModal(false)
      setEditingUser(null)
      resetForm()
      fetchUsers()
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save user",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      isApproved: user.isApproved,
    })
    setShowModal(true)
  }

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await API.delete(`/api/users/${userId}`)
        toast({
          title: "Success",
          description: "User deleted successfully",
        })
        fetchUsers()
      } catch (error) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to delete user",
          variant: "destructive",
        })
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "sales_executive",
      isActive: true,
      isApproved: true,
    })
  }

  const getRoleBadge = (role) => {
    const variants = {
      super_admin: "destructive",
      admin: "default",
      sales_manager: "secondary",
      sales_executive: "outline",
      support_agent: "secondary",
      customer: "outline",
    }
    return variants[role] || "outline"
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading users...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <Toast toasts={toasts} />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        {/* <Button onClick={() => setShowModal(true)}>Add New User</Button> */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Role</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Approval</th>
                  <th className="text-left p-2">Created</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">
                      <Badge variant={getRoleBadge(user.role)}>
                        {user.role.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge variant={user.isActive ? "default" : "destructive"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge variant={user.isApproved ? "default" : "secondary"}>
                        {user.isApproved ? "Approved" : "Pending"}
                      </Badge>
                    </td>
                    <td className="p-2">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(user._id)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales_executive">Sales Executive</SelectItem>
                  <SelectItem value="sales_manager">Sales Manager</SelectItem>
                  <SelectItem value="support_agent">Support Agent</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isApproved"
                checked={formData.isApproved}
                onChange={(e) => setFormData({ ...formData, isApproved: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="isApproved">Approved</Label>
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => {
                setShowModal(false)
                setEditingUser(null)
                resetForm()
              }}>
                Cancel
              </Button>
              <Button type="submit">{editingUser ? "Update User" : "Create User"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Users
