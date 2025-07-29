import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Avatar, AvatarFallback } from './ui/Avatar'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/DropdownMenu'
import { getRoleColor, getInitials } from '../lib/utils'
import {
    SunIcon,
    MoonIcon,
    UserIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
} from '@heroicons/react/24/outline'

const Header = ({ isCollapsed, setIsCollapsed, isMobile, setIsMobileMenuOpen }) => {
    const { user, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-80'
                } ${isMobile ? 'ml-0' : ''}`}
        >
            <div className="flex items-center justify-between px-6 py-4">
                {/* Left side - Mobile menu button and greeting */}
                <div className="flex items-center space-x-4">
                    {isMobile && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden"
                        >
                            <Bars3Icon className="w-5 h-5" />
                        </Button>
                    )}

                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-2xl font-semibold text-foreground"
                        >
                            Welcome back, {user?.name}! 👋
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-sm text-muted-foreground mt-1"
                        >
                            {currentDate}
                        </motion.p>
                    </div>
                </div>

                {/* Right side - Theme toggle and user menu */}
                <div className="flex items-center space-x-4">
                    {/* Theme toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="relative"
                    >
                        <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {/* User dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback name={user?.name} className="bg-primary text-primary-foreground">
                                        {getInitials(user?.name || 'User')}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-2">
                                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user?.email}
                                    </p>
                                    <Badge
                                        variant="secondary"
                                        className={`w-fit text-xs ${getRoleColor(user?.role)}`}
                                    >
                                        {user?.role?.replace('_', ' ').toUpperCase()}
                                    </Badge>
                                </div>
                            </DropdownMenuLabel>
                            {/* <DropdownMenuSeparator /> */}
                            {/* <DropdownMenuItem className="cursor-pointer">
                                <UserIcon className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <Cog6ToothIcon className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem> */}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="cursor-pointer text-destructive focus:text-destructive"
                                onClick={logout}
                            >
                                <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </motion.header>
    )
}

export default Header