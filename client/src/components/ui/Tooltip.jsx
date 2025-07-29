import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'

const Tooltip = ({
    children,
    content,
    side = 'top',
    align = 'center',
    delayDuration = 700,
    className
}) => {
    const [isVisible, setIsVisible] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const triggerRef = useRef(null)
    const timeoutRef = useRef(null)

    const showTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true)
            updatePosition()
        }, delayDuration)
    }

    const hideTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        setIsVisible(false)
    }

    const updatePosition = () => {
        if (!triggerRef.current) return

        const rect = triggerRef.current.getBoundingClientRect()
        const tooltipOffset = 8

        let x = 0
        let y = 0

        // Calculate position based on side
        switch (side) {
            case 'top':
                x = rect.left + rect.width / 2
                y = rect.top - tooltipOffset
                break
            case 'bottom':
                x = rect.left + rect.width / 2
                y = rect.bottom + tooltipOffset
                break
            case 'left':
                x = rect.left - tooltipOffset
                y = rect.top + rect.height / 2
                break
            case 'right':
                x = rect.right + tooltipOffset
                y = rect.top + rect.height / 2
                break
        }

        setPosition({ x, y })
    }

    useEffect(() => {
        const handleScroll = () => {
            if (isVisible) {
                updatePosition()
            }
        }

        window.addEventListener('scroll', handleScroll, true)
        window.addEventListener('resize', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll, true)
            window.removeEventListener('resize', handleScroll)
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [isVisible])

    const getTooltipClasses = () => {
        const baseClasses = "absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-lg pointer-events-none whitespace-nowrap dark:bg-gray-700"

        let transformClasses = ""
        switch (side) {
            case 'top':
                transformClasses = "-translate-x-1/2 -translate-y-full"
                break
            case 'bottom':
                transformClasses = "-translate-x-1/2"
                break
            case 'left':
                transformClasses = "-translate-x-full -translate-y-1/2"
                break
            case 'right':
                transformClasses = "-translate-y-1/2"
                break
        }

        return cn(baseClasses, transformClasses, className)
    }

    const getArrowClasses = () => {
        const baseClasses = "absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45"

        switch (side) {
            case 'top':
                return cn(baseClasses, "top-full left-1/2 -translate-x-1/2 -translate-y-1/2")
            case 'bottom':
                return cn(baseClasses, "bottom-full left-1/2 -translate-x-1/2 translate-y-1/2")
            case 'left':
                return cn(baseClasses, "left-full top-1/2 -translate-x-1/2 -translate-y-1/2")
            case 'right':
                return cn(baseClasses, "right-full top-1/2 translate-x-1/2 -translate-y-1/2")
            default:
                return baseClasses
        }
    }

    return (
        <>
            <div
                ref={triggerRef}
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                onFocus={showTooltip}
                onBlur={hideTooltip}
                className="inline-block"
            >
                {children}
            </div>

            <AnimatePresence>
                {isVisible && content && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.1 }}
                        className={getTooltipClasses()}
                        style={{
                            left: position.x,
                            top: position.y,
                        }}
                    >
                        {content}
                        <div className={getArrowClasses()} />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Tooltip