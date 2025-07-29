import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Card, CardContent } from "../components/ui/Card"
import {
    HomeIcon,
    ExclamationTriangleIcon,
    ArrowLeftIcon
} from "@heroicons/react/24/outline"

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6"
                        >
                            <ExclamationTriangleIcon className="h-10 w-10 text-white" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-4"
                        >
                            <h1 className="text-6xl font-bold text-gray-900 dark:text-white">
                                404
                            </h1>

                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                                Page Not Found
                            </h2>

                            <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                                The page you're looking for doesn't exist or has been moved to another location.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                                <Button
                                    onClick={() => window.history.back()}
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <ArrowLeftIcon className="h-4 w-4" />
                                    Go Back
                                </Button>

                                <Link to="/">
                                    <Button className="flex items-center gap-2 w-full sm:w-auto">
                                        <HomeIcon className="h-4 w-4" />
                                        Go Home
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}

export default NotFound