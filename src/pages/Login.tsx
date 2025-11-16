/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {Link, useNavigate, useLocation} from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { InputAdornment, IconButton } from "@mui/material"
import { CustomTextFieldComponent } from "../components/ui/custom-text-field"
import { Icon } from "@iconify/react"
import { useToast } from "../components/ui/toast"
import { useAuth } from "../redux/features/auth/auth.api"

const loginSchema = z.object({
  phoneNumber: z.string().regex(/^[0-9]{11}$/, "Phone number must be 11 digits"),
  password: z.string().regex(/^[0-9]{5}$/, "Password must be exactly 5 digits"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const { login, user, loading, error } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    }
  }, [user, navigate, location])

  // Show error if login failed
  useEffect(() => {
    if (error) {
      showToast({
        type: 'error',
        message: error,
        duration: 4000
      })
    }
  }, [error, showToast])

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data)
      
      if (result.type.endsWith('/fulfilled')) {
        showToast({
          type: 'success',
          message: 'Login successful! Welcome back.',
          duration: 3000
        })
        
        // Navigate to dashboard or intended page
        const from = location.state?.from?.pathname || '/dashboard'
        navigate(from, { replace: true })
      }
    } catch (err) {
      // Error handling is done in useEffect above
      console.error('Login error:', err)
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center py-12 px-4 bg-background">
      <Card className="w-full max-w-md relative border-0 shadow-none bg-transparent">
      
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Icon icon="solar:wallet" className="h-8 w-8 text-accent" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-left mt-6 mb-6 text-base text-lg">Sign in to your E-Wallet account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <CustomTextFieldComponent
              label="Phone Number"
              focused
              required
              fullWidth
              {...register("phoneNumber")}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
            />
            <CustomTextFieldComponent
              label="Password"
              focused
              required
              fullWidth
              type={showPassword ? "text" : "password"}
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <Icon icon="solar:eye-closed-bold" className="h-5 w-5" /> : <Icon icon="solar:eye-bold" className="h-5 w-5" />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button 
              type="submit" 
              className="w-full"
              style={{ height: '56px' }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link to="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
