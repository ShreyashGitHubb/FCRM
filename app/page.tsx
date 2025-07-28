export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          CRM Application
        </h1>
        <p className="text-gray-600 mb-6">
          This is a full-stack CRM application with separate frontend and
          backend components.
        </p>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-700">
              Frontend: React + Vite (Port 3000)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">
              Backend: Node.js + Express (Port 5000)
            </span>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">To run the application:</p>
          <div className="mt-2 text-xs text-gray-600 space-y-1">
            <p>
              1. Start backend:{" "}
              <code className="bg-gray-100 px-1 rounded">
                cd server && npm start
              </code>
            </p>
            <p>
              2. Start frontend:{" "}
              <code className="bg-gray-100 px-1 rounded">
                cd client && npm run dev
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
