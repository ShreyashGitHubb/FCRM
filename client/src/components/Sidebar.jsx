import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { usePermissions } from '../hooks/usePermissions'
import { canApproveUsers } from '../permissions/rolePermissions'
import { cn } from '../lib/utils'
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    HomeIcon,
    UserGroupIcon,
    CurrencyDollarIcon,
    PhoneIcon,
    BuildingOfficeIcon,
    FolderIcon,
    CheckCircleIcon,
    TicketIcon,
    EnvelopeIcon,
    ArrowUpTrayIcon,
    UsersIcon,
    GlobeAltIcon,
    ClockIcon,
    ChartBarIcon,
    DocumentChartBarIcon
} from '@heroicons/react/24/outline'

const iconMap = {
    '/': HomeIcon,
    '/leads': UserGroupIcon,
    '/deals': CurrencyDollarIcon,
    '/contacts': PhoneIcon,
    '/accounts': BuildingOfficeIcon,
    '/projects': FolderIcon,
    '/tasks': CheckCircleIcon,
    '/tickets': TicketIcon,
    '/email-center': EnvelopeIcon,
    '/import-export': ArrowUpTrayIcon,
    '/users': UsersIcon,
    '/portal': GlobeAltIcon,
    '/pending-approvals': ClockIcon,
    '/admin-dashboard': ChartBarIcon,
    '/reports': DocumentChartBarIcon,
}

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const { user } = useAuth()
    const { canAccess } = usePermissions()
    const location = useLocation()

    const getNavItems = () => {
        const allItems = [
            {
                path: "/",
                label: "Dashboard",
                icon: HomeIcon,
            },
            {
                path: "/leads",
                label: "Leads",
                icon: UserGroupIcon,
            },
            {
                path: "/deals",
                label: "Deals",
                icon: CurrencyDollarIcon,
            },
            {
                path: "/contacts",
                label: "Contacts",
                icon: PhoneIcon,
            },
            {
                path: "/accounts",
                label: "Accounts",
                icon: BuildingOfficeIcon,
            },
            {
                path: "/projects",
                label: "Projects",
                icon: FolderIcon,
            },
            {
                path: "/tasks",
                label: "Tasks",
                icon: CheckCircleIcon,
            },
            {
                path: "/tickets",
                label: "Tickets",
                icon: TicketIcon,
            },
            {
                path: "/email-center",
                label: "Email Center",
                icon: EnvelopeIcon,
            },
            {
                path: "/import-export",
                label: "Import/Export",
                icon: ArrowUpTrayIcon,
            },
            {
                path: "/users",
                label: "Users",
                icon: UsersIcon,
            },
            {
                path: "/portal",
                label: "Portal",
                icon: GlobeAltIcon,
            },
        ]

        // Add admin dashboard for admin and superadmin
        if (user?.role === "admin" || user?.role === "super_admin") {
            allItems.push({
                path: "/admin-dashboard",
                label: "Admin Dashboard",
                icon: ChartBarIcon,
            })
            allItems.push({
                path: "/reports",
                label: "Reports & Analytics",
                icon: DocumentChartBarIcon,
            })
        }

        // Add pending approvals for admin and superadmin
        if (canApproveUsers(user?.role)) {
            allItems.push({
                path: "/pending-approvals",
                label: "Pending Approvals",
                icon: ClockIcon,
            })
        }

        // Filter items based on user permissions
        return allItems.filter((item) => canAccess(item.path))
    }

    const navItems = getNavItems()

    const sidebarVariants = {
        expanded: { width: 280 },
        collapsed: { width: 80 }
    }

    const contentVariants = {
        expanded: { opacity: 1, x: 0 },
        collapsed: { opacity: 0, x: -20 }
    }

    return (
        <motion.div
            initial={false}
            animate={isCollapsed ? "collapsed" : "expanded"}
            variants={sidebarVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed left-0 top-0 z-40 h-screen bg-card border-r border-border shadow-lg"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary to-primary/90">
                <AnimatePresence mode="wait">
                    {!isCollapsed && (
                        <motion.div
                            initial="collapsed"
                            animate="expanded"
                            exit="collapsed"
                            variants={contentVariants}
                            transition={{ duration: 0.2 }}
                            className="flex items-center space-x-3"
                        >
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                <span className="text-primary font-bold text-lg">C</span>
                            </div>
                            <div className="text-white">
                                <h3 className="font-semibold text-lg">CRM System</h3>
                                <p className="text-xs text-white/80">
                                    {user?.name} • {user?.role?.replace("_", " ").toUpperCase()}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
                >
                    {isCollapsed ? (
                        <ChevronRightIcon className="w-4 h-4" />
                    ) : (
                        <ChevronLeftIcon className="w-4 h-4" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.path

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <Icon className={cn(
                                "w-5 h-5 flex-shrink-0",
                                isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
                            )} />

                            <AnimatePresence mode="wait">
                                {!isCollapsed && (
                                    <motion.span
                                        initial="collapsed"
                                        animate="expanded"
                                        exit="collapsed"
                                        variants={contentVariants}
                                        transition={{ duration: 0.2 }}
                                        className="font-medium text-sm"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {/* Active indicator
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary-foreground rounded-r-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )} */}
                        </Link>
                    )
                })}

                {navItems.length === 0 && (
                    <div className="text-center py-8">
                        <div className="text-muted-foreground">
                            <div className="text-2xl mb-2">🚫</div>
                            <div className="text-sm font-medium">No Access</div>
                            <div className="text-xs mt-1">
                                Contact your administrator for access.
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </motion.div>
    )
}

export default Sidebar