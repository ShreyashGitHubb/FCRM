import React, { useState, useRef, useEffect } from 'react'
import { cn } from '../../lib/utils'

const DropdownMenu = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            {React.Children.map(children, child =>
                React.cloneElement(child, { isOpen, setIsOpen })
            )}
        </div>
    )
}

const DropdownMenuTrigger = ({ children, isOpen, setIsOpen, asChild = false, ...props }) => {
    const handleClick = () => setIsOpen(!isOpen)

    if (asChild) {
        return React.cloneElement(children, {
            onClick: handleClick,
            'aria-expanded': isOpen,
            'aria-haspopup': true,
            ...props
        })
    }

    return (
        <button
            onClick={handleClick}
            aria-expanded={isOpen}
            aria-haspopup={true}
            {...props}
        >
            {children}
        </button>
    )
}

const DropdownMenuContent = ({
    children,
    isOpen,
    className,
    align = 'end',
    sideOffset = 4,
    ...props
}) => {
    if (!isOpen) return null

    const alignmentClasses = {
        start: 'left-0',
        center: 'left-1/2 -translate-x-1/2',
        end: 'right-0'
    }

    return (
        <div
            className={cn(
                "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                alignmentClasses[align],
                className
            )}
            style={{ top: `calc(100% + ${sideOffset}px)` }}
            {...props}
        >
            {children}
        </div>
    )
}

const DropdownMenuItem = React.forwardRef(({
    className,
    inset,
    children,
    onClick,
    ...props
}, ref) => (
    <div
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground cursor-pointer",
            inset && "pl-8",
            className
        )}
        onClick={onClick}
        {...props}
    >
        {children}
    </div>
))
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("-mx-1 my-1 h-px bg-muted", className)}
        {...props}
    />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "px-2 py-1.5 text-sm font-semibold",
            inset && "pl-8",
            className
        )}
        {...props}
    />
))
DropdownMenuLabel.displayName = "DropdownMenuLabel"

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
}