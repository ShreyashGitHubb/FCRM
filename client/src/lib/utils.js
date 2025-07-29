import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount)
}

export function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(date))
}

export function getInitials(name) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

export function getStatusColor(status) {
    const colors = {
        new: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        contacted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        qualified: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        converted: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
        lost: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        pending: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
        completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
        open: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
        resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    }
    return colors[status?.toLowerCase()] || colors.pending
}

export function getRoleColor(role) {
    const colors = {
        super_admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        admin: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
        sales_manager: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        sales_executive: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        support_agent: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
        customer: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    }
    return colors[role?.toLowerCase()] || colors.customer
}

export function getPriorityColor(priority) {
    const colors = {
        high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    }
    return colors[priority?.toLowerCase()] || colors.medium
}