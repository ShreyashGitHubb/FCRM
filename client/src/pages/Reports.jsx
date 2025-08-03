import { useState, useEffect } from "react"
import { motion } from "framer-motion"
// import axios from "axios"
import axios from "../utils/axios";
import { useAuth } from "../context/AuthContext"
import { Button } from "../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs"
import { getStatusColor, getPriorityColor, formatCurrency, formatDate } from "../lib/utils"
import {
    ChartBarIcon,
    DocumentChartBarIcon,
    UserGroupIcon,
    BuildingOfficeIcon,
    CurrencyDollarIcon,
    CalendarIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ArrowDownTrayIcon,
    EyeIcon,
    FolderIcon,
    TicketIcon,
    EnvelopeIcon
} from "@heroicons/react/24/outline"

const Reports = () => {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({})
    const [recentActivity, setRecentActivity] = useState([])
    const [topPerformers, setTopPerformers] = useState([])
    const [conversionRates, setConversionRates] = useState({})
    const [revenueData, setRevenueData] = useState([])
    const [projectStatus, setProjectStatus] = useState({})
    const [ticketMetrics, setTicketMetrics] = useState({})
    const { user } = useAuth()

    useEffect(() => {
        if (user?.role === 'admin' || user?.role === 'super_admin') {
            fetchReportData()
        }
    }, [user])

    const fetchReportData = async () => {
        try {
            setLoading(true)

            // Fetch all data in parallel
            const [
                statsRes,
                activityRes,
                performersRes,
                conversionRes,
                revenueRes,
                projectRes,
                ticketRes
            ] = await Promise.all([
                axios.get("/api/analytics/overview"),
                axios.get("/api/analytics/recent-activity"),
                axios.get("/api/analytics/top-performers"),
                axios.get("/api/analytics/conversion-rates"),
                axios.get("/api/analytics/revenue"),
                axios.get("/api/analytics/project-status"),
                axios.get("/api/analytics/ticket-metrics")
            ])

            setStats(statsRes.data)
            setRecentActivity(activityRes.data)
            setTopPerformers(performersRes.data)
            setConversionRates(conversionRes.data)
            setRevenueData(revenueRes.data)
            setProjectStatus(projectRes.data)
            setTicketMetrics(ticketRes.data)

            setLoading(false)
        } catch (error) {
            console.error("Error fetching report data:", error)
            setLoading(false)
        }
    }

    const downloadReport = async (type) => {
        try {
            const response = await axios.get(`/api/reports/download/${type}`, {
                responseType: 'blob'
            })

            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${type}_report_${new Date().toISOString().split('T')[0]}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (error) {
            console.error("Error downloading report:", error)
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
                        <p className="text-muted-foreground">Comprehensive business insights</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <div className="animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    if (user?.role !== 'admin' && user?.role !== 'super_admin') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="p-8 text-center">
                    <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
                    <p className="text-muted-foreground">Only administrators can access reports and analytics.</p>
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
                        <DocumentChartBarIcon className="h-8 w-8 text-blue-600" />
                        Reports & Analytics
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground mt-1"
                    >
                        Comprehensive business insights and performance metrics
                    </motion.p>
                </div>

{/*                 <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-2"
                >
                    <Button variant="outline" onClick={() => downloadReport('comprehensive')}>
                        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                        Download Full Report
                    </Button>
                    <Button variant="outline" onClick={() => downloadReport('executive')}>
                        <EyeIcon className="h-4 w-4 mr-2" />
                        Executive Summary
                    </Button>
                </motion.div> */}
            </div>

            {/* Key Metrics Cards */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-blue-600">{stats.totalRevenue || 0}</div>
                                <div className="text-sm text-muted-foreground">Total Revenue</div>
                            </div>
                            <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-green-600">{stats.totalLeads || 0}</div>
                                <div className="text-sm text-muted-foreground">Total Leads</div>
                            </div>
                            <UserGroupIcon className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-purple-600">{stats.totalDeals || 0}</div>
                                <div className="text-sm text-muted-foreground">Active Deals</div>
                            </div>
                            <BuildingOfficeIcon className="h-8 w-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-orange-600">{stats.totalProjects || 0}</div>
                                <div className="text-sm text-muted-foreground">Active Projects</div>
                            </div>
                            <FolderIcon className="h-8 w-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Charts and Analytics */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
                        <TabsTrigger value="projects">Project Metrics</TabsTrigger>
                        <TabsTrigger value="support">Support Analytics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Conversion Funnel */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ChartBarIcon className="h-5 w-5" />
                                        Lead Conversion Funnel
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {Object.entries(conversionRates).map(([stage, rate]) => (
                                            <div key={stage} className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="capitalize">{stage.replace('_', ' ')}</span>
                                                    <span className="font-medium">{rate}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${rate}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Top Performers */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <UserGroupIcon className="h-5 w-5" />
                                        Top Performers
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {topPerformers.map((performer, index) => (
                                            <div key={performer._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-medium">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{performer.name}</div>
                                                        <div className="text-sm text-muted-foreground">{performer.role}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-medium">{performer.dealsClosed}</div>
                                                    <div className="text-sm text-muted-foreground">deals closed</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ClockIcon className="h-5 w-5" />
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {recentActivity.map((activity, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 border-b last:border-b-0">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <div className="flex-1">
                                                <div className="text-sm">{activity.description}</div>
                                                <div className="text-xs text-muted-foreground">{formatDate(activity.timestamp)}</div>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {activity.type}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="sales" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Revenue Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CurrencyDollarIcon className="h-5 w-5" />
                                        Revenue Trend
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {revenueData.map((month, index) => (
                                            <div key={index} className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span>{month.month}</span>
                                                    <span className="font-medium">{formatCurrency(month.revenue)}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div
                                                        className="bg-green-600 h-3 rounded-full transition-all duration-300"
                                                        style={{ width: `${(month.revenue / Math.max(...revenueData.map(m => m.revenue))) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Deal Status */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BuildingOfficeIcon className="h-5 w-5" />
                                        Deal Status Distribution
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {Object.entries(stats.dealStatus || {}).map(([status, count]) => (
                                            <div key={status} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Badge className={getStatusColor(status)}>
                                                        {status.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                                <span className="font-medium">{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="projects" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Project Status */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FolderIcon className="h-5 w-5" />
                                        Project Status Overview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {Object.entries(projectStatus).map(([status, data]) => (
                                            <div key={status} className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="capitalize">{status.replace('_', ' ')}</span>
                                                    <span className="font-medium">{data.count} projects</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${(data.count / Object.values(projectStatus).reduce((sum, d) => sum + d.count, 0)) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Avg. Progress: {data.avgProgress}%
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Project Timeline */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CalendarIcon className="h-5 w-5" />
                                        Project Timeline
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {stats.recentProjects?.map(project => (
                                            <div key={project._id} className="p-3 border rounded-lg">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="font-medium">{project.name}</div>
                                                    <Badge className={getStatusColor(project.status)}>
                                                        {project.status}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1 text-sm text-muted-foreground">
                                                    <div>Progress: {project.progress}%</div>
                                                    <div>Due: {formatDate(project.endDate)}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="support" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Ticket Metrics */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TicketIcon className="h-5 w-5" />
                                        Support Ticket Metrics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {Object.entries(ticketMetrics).map(([metric, value]) => (
                                            <div key={metric} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <span className="capitalize">{metric.replace('_', ' ')}</span>
                                                <span className="font-medium">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Response Time */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ClockIcon className="h-5 w-5" />
                                        Average Response Time
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-600">
                                            {stats.avgResponseTime || '2.5'} hours
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-2">
                                            Average time to first response
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </motion.div>
    )
}

export default Reports 
