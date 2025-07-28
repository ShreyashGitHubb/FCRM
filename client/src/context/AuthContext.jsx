"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload.token)
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
      }
    case "LOGOUT":
      localStorage.removeItem("token")
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
      }
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }
    case "AUTH_ERROR":
      localStorage.removeItem("token")
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    token: localStorage.getItem("token"),
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  })

  // Set auth token
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common["Authorization"]
    }
  }

  // Load user
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token)
    }

    try {
      const res = await axios.get("/api/auth/me")
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          token: localStorage.token,
          user: res.data.data,
        },
      })
    } catch (err) {
      dispatch({ type: "AUTH_ERROR" })
    }
  }

  // Login user
  const login = async (email, password) => {
    dispatch({ type: "SET_LOADING", payload: true })

    try {
      const res = await axios.post("/api/auth/login", { email, password })
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          token: res.data.token,
          user: res.data.data,
        },
      })
      setAuthToken(res.data.token)
      return { success: true }
    } catch (err) {
      dispatch({
        type: "AUTH_ERROR",
        payload: err.response?.data?.message || "Login failed",
      })
      return { success: false, message: err.response?.data?.message || "Login failed" }
    }
  }

  // Register user
  const register = async (name, email, password, role) => {
    try {
      const res = await axios.post("/api/auth/register", { name, email, password, role })
      
      // Don't automatically log in after registration
      // User needs to wait for approval
      return { success: true, message: res.data.message }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Registration failed" }
    }
  }

  // Logout
  const logout = () => {
    dispatch({ type: "LOGOUT" })
    setAuthToken(null)
  }

  useEffect(() => {
    loadUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
