import React, { createContext, useContext, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline'

const ToastContext = createContext()

export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([])

    const addToast = (toast) => {
        const id = Date.now()
        const newToast = { id, ...toast }
        setToasts(prev => [...prev, newToast])

        // Auto remove after duration
        setTimeout(() => {
            removeToast(id)
        }, toast.duration || 5000)
    }

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }

    const toast = {
        success: (message, options = {}) => addToast({ type: 'success', message, ...options }),
        error: (message, options = {}) => addToast({ type: 'error', message, ...options }),
        warning: (message, options = {}) => addToast({ type: 'warning', message, ...options }),
        info: (message, options = {}) => addToast({ type: 'info', message, ...options }),
    }

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    )
}

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <Toast key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
                ))}
            </AnimatePresence>
        </div>
    )
}

const Toast = ({ toast, onRemove }) => {
    const icons = {
        success: CheckCircleIcon,
        error: XCircleIcon,
        warning: ExclamationTriangleIcon,
        info: InformationCircleIcon,
    }

    const colors = {
        success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400',
        error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400',
        info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400',
    }

    const Icon = icons[toast.type]

    return (
        <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.3 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
            className={`
        flex items-center p-4 rounded-lg border shadow-lg backdrop-blur-sm max-w-sm
        ${colors[toast.type]}
      `}
        >
            <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
            <div className="flex-1">
                {toast.title && (
                    <div className="font-medium text-sm mb-1">{toast.title}</div>
                )}
                <div className="text-sm">{toast.message}</div>
            </div>
            <button
                onClick={onRemove}
                className="ml-3 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            >
                <XMarkIcon className="h-4 w-4" />
            </button>
        </motion.div>
    )
}

export default Toast