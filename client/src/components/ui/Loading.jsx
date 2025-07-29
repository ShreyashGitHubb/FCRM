import React from 'react'
import { motion } from 'framer-motion'
import { BuildingOfficeIcon } from '@heroicons/react/24/outline'

const Loading = ({ message = "Loading...", fullScreen = false }) => {
    const containerClasses = fullScreen
        ? "fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
        : "flex items-center justify-center p-8"

    return (
        <div className={containerClasses}>
            <div className="text-center">
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                        scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4"
                >
                    <BuildingOfficeIcon className="h-8 w-8 text-white" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-lg font-medium text-foreground mb-2">
                        {message}
                    </h3>
                    <div className="flex justify-center space-x-1">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 1, 0.5]
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                }}
                                className="w-2 h-2 bg-primary rounded-full"
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export const LoadingSpinner = ({ size = "md", className = "" }) => {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
        xl: "w-12 h-12"
    }

    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={`${sizeClasses[size]} border-2 border-primary border-t-transparent rounded-full ${className}`}
        />
    )
}

export const LoadingDots = ({ className = "" }) => {
    return (
        <div className={`flex space-x-1 ${className}`}>
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.2
                    }}
                    className="w-2 h-2 bg-current rounded-full"
                />
            ))}
        </div>
    )
}

export default Loading