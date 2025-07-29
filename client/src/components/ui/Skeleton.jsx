import React from 'react'
import { cn } from '../../lib/utils'

const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-muted", className)}
            {...props}
        />
    )
}

const SkeletonCard = ({ className }) => {
    return (
        <div className={cn("p-6 border rounded-lg space-y-4", className)}>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
        </div>
    )
}

const SkeletonTable = ({ rows = 5, columns = 4 }) => {
    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex space-x-4">
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton key={i} className="h-4 flex-1" />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex space-x-4">
                    {Array.from({ length: columns }).map((_, j) => (
                        <Skeleton key={j} className="h-8 flex-1" />
                    ))}
                </div>
            ))}
        </div>
    )
}

const SkeletonStats = ({ count = 4 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="p-6 border rounded-lg space-y-3">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-4 w-24" />
                </div>
            ))}
        </div>
    )
}

export { Skeleton, SkeletonCard, SkeletonTable, SkeletonStats }