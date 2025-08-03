import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"
import { Textarea } from "../components/ui/Textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/Dialog"
import { useToast } from "../hooks/use-toast"
import Toast from "../components/Toast"
import { canApproveUsers } from "../permissions/rolePermissions"
import API from "../utils/axios" // ✅ centralized axios instance

const PendingApprovals = () => {
  const [pendingApprovals, setPendingApprovals] = useState([])
  const [loading, setLoading] = useState(true)
  const [rejectionReason, setRejectionReason] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const { toast, toasts } = useToast()

  useEffect(() => {
    fetchPendingApprovals()
  }, [])

  const fetchPendingApprovals = async () => {
    try {
      const response = await API.get("/api/users/pending-approvals")
      setPendingApprovals(response.data.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch pending approvals",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (userId) => {
    try {
      await API.put(`/api/users/${userId}/approve`)
      toast({
        title: "Success",
        description: "User approved successfully",
      })
      fetchPendingApprovals()
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to approve user",
        variant: "destructive",
      })
    }
  }

  const handleReject = async () => {
    if (!selectedUser) return

    try {
      await API.put(`/api/users/${selectedUser}/reject`, {
        rejectionReason,
      })
      toast({
        title: "Success",
        description: "User rejected successfully",
      })
      setShowRejectDialog(false)
      setRejectionReason("")
      setSelectedUser(null)
      fetchPendingApprovals()
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to reject user",
        variant: "destructive",
      })
    }
  }

  const openRejectDialog = (userId) => {
    setSelectedUser(userId)
    setShowRejectDialog(true)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading pending approvals...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <Toast toasts={toasts} />
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Pending Approvals</h1>
        <p className="text-muted-foreground">Review and approve new user registrations</p>
      </div>

      {pendingApprovals.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              <p className="text-lg">No pending approvals</p>
              <p>All user registrations have been processed.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pendingApprovals.map((approval) => (
            <Card key={approval._id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{approval.userId.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{approval.userId.email}</p>
                  </div>
                  <Badge variant="secondary">
                    {approval.userId.role.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Requested:</span>
                      <p className="text-muted-foreground">
                        {new Date(approval.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Role:</span>
                      <p className="text-muted-foreground capitalize">
                        {approval.userId.role.replace("_", " ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(approval.userId._id)}
                      className="flex-1"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => openRejectDialog(approval.userId._id)}
                      className="flex-1"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject User Registration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectionReason">Reason for rejection (optional)</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="mt-1"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectDialog(false)
                  setRejectionReason("")
                  setSelectedUser(null)
                }}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                Reject User
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PendingApprovals
