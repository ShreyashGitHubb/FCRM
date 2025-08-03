import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import axios from "../utils/axios";
import { useAuth } from "../context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { SkeletonStats } from "../components/ui/Skeleton"
import { formatCurrency } from "../lib/utils"
import {
  UserGroupIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  TicketIcon,
  ChartBarIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon
} from "@heroicons/react/24/outline"

const Dashboard = () => {
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/dashboard")
      setStats(res.data.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching stats:", error)
      setLoading(false)
    }
  }

  const getStatsForRole = () => {
    const iconMap = {
      leads: UserGroupIcon,
      deals: CurrencyDollarIcon,
      wonDeals: CheckCircleIcon,
      pendingTasks: ClockIcon,
      totalRevenue: ArrowTrendingUpIcon,
      users: UserGroupIcon,
      openTickets: TicketIcon,
      assignedTickets: TicketIcon,
      resolvedTickets: CheckCircleIcon,
      myTickets: TicketIcon,
    }

    switch (user?.role) {
      case "sales_executive":
        return [
          {
            label: "My Leads",
            value: stats.leads || 0,
            icon: UserGroupIcon,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950",
            change: "+12%",
            trend: "up"
          },
          {
            label: "My Deals",
            value: stats.deals || 0,
            icon: CurrencyDollarIcon,
            color: "text-green-600",
            bgColor: "bg-green-50 dark:bg-green-950",
            change: "+8%",
            trend: "up"
          },
          {
            label: "Won Deals",
            value: stats.wonDeals || 0,
            icon: CheckCircleIcon,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950",
            change: "+15%",
            trend: "up"
          },
          {
            label: "Pending Tasks",
            value: stats.pendingTasks || 0,
            icon: ClockIcon,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50 dark:bg-yellow-950",
            change: "-5%",
            trend: "down"
          },
          {
            label: "Total Revenue",
            value: formatCurrency(stats.totalRevenue || 0),
            icon: ArrowTrendingUpIcon,
            color: "text-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-950",
            change: "+22%",
            trend: "up"
          },
        ]
      case "sales_manager":
      case "admin":
      case "super_admin":
        return [
          {
            label: "Total Leads",
            value: stats.leads || 0,
            icon: UserGroupIcon,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950",
            change: "+12%",
            trend: "up"
          },
          {
            label: "Total Deals",
            value: stats.deals || 0,
            icon: CurrencyDollarIcon,
            color: "text-green-600",
            bgColor: "bg-green-50 dark:bg-green-950",
            change: "+8%",
            trend: "up"
          },
          {
            label: "Won Deals",
            value: stats.wonDeals || 0,
            icon: CheckCircleIcon,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950",
            change: "+15%",
            trend: "up"
          },
          {
            label: "Total Users",
            value: stats.users || 0,
            icon: UserGroupIcon,
            color: "text-orange-600",
            bgColor: "bg-orange-50 dark:bg-orange-950",
            change: "+3%",
            trend: "up"
          },
          {
            label: "Open Tickets",
            value: stats.openTickets || 0,
            icon: TicketIcon,
            color: "text-red-600",
            bgColor: "bg-red-50 dark:bg-red-950",
            change: "-10%",
            trend: "down"
          },
          {
            label: "Total Revenue",
            value: formatCurrency(stats.totalRevenue || 0),
            icon: ArrowTrendingUpIcon,
            color: "text-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-950",
            change: "+22%",
            trend: "up"
          },
        ]
      case "support_agent":
        return [
          {
            label: "Assigned Tickets",
            value: stats.assignedTickets || 0,
            icon: TicketIcon,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950",
            change: "+5%",
            trend: "up"
          },
          {
            label: "Open Tickets",
            value: stats.openTickets || 0,
            icon: TicketIcon,
            color: "text-red-600",
            bgColor: "bg-red-50 dark:bg-red-950",
            change: "-8%",
            trend: "down"
          },
          {
            label: "Resolved Tickets",
            value: stats.resolvedTickets || 0,
            icon: CheckCircleIcon,
            color: "text-green-600",
            bgColor: "bg-green-50 dark:bg-green-950",
            change: "+18%",
            trend: "up"
          },
          {
            label: "Pending Tasks",
            value: stats.pendingTasks || 0,
            icon: ClockIcon,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50 dark:bg-yellow-950",
            change: "-3%",
            trend: "down"
          },
        ]
      case "customer":
        return [
          {
            label: "My Tickets",
            value: stats.myTickets || 0,
            icon: TicketIcon,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950",
            change: "+2%",
            trend: "up"
          },
          {
            label: "Open Tickets",
            value: stats.openTickets || 0,
            icon: TicketIcon,
            color: "text-red-600",
            bgColor: "bg-red-50 dark:bg-red-950",
            change: "-15%",
            trend: "down"
          },
          {
            label: "Resolved Tickets",
            value: stats.resolvedTickets || 0,
            icon: CheckCircleIcon,
            color: "text-green-600",
            bgColor: "bg-green-50 dark:bg-green-950",
            change: "+25%",
            trend: "up"
          },
        ]
      default:
        return []
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">📊 Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your CRM activities and performance metrics
          </p>
        </div>
        <SkeletonStats count={6} />
      </div>
    )
  }

  const statsData = getStatsForRole()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-foreground"
        >
          📊 Dashboard
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground mt-2"
        >
          Overview of your CRM activities and performance metrics
        </motion.p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === 'up' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -4 }}
            >
              <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="flex items-center text-xs">
                    <TrendIcon className={`h-3 w-3 mr-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    <span className={`${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 text-left border rounded-lg hover:bg-accent transition-colors"
              >
                <UserGroupIcon className="h-6 w-6 text-blue-600 mb-2" />
                <div className="font-medium">Add Lead</div>
                <div className="text-sm text-muted-foreground">Create new lead</div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 text-left border rounded-lg hover:bg-accent transition-colors"
              >
                <CurrencyDollarIcon className="h-6 w-6 text-green-600 mb-2" />
                <div className="font-medium">New Deal</div>
                <div className="text-sm text-muted-foreground">Create new deal</div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 text-left border rounded-lg hover:bg-accent transition-colors"
              >
                <ClockIcon className="h-6 w-6 text-yellow-600 mb-2" />
                <div className="font-medium">Add Task</div>
                <div className="text-sm text-muted-foreground">Create new task</div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 text-left border rounded-lg hover:bg-accent transition-colors"
              >
                <ChartBarIcon className="h-6 w-6 text-purple-600 mb-2" />
                <div className="font-medium">View Reports</div>
                <div className="text-sm text-muted-foreground">Analytics & insights</div>
              </motion.button>
            </div>
          </CardContent>
        </Card>
      </motion.div> */}
    </motion.div>
  )
}

export default Dashboard
