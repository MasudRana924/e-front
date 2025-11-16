/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {Link, useNavigate} from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { Icon } from "@iconify/react"
import { Checkbox } from "../components/ui/checkbox"
import { signupUser } from "../redux/features/auth/auth.api"
import type { AppDispatch, RootState } from "../redux/store"
import { useSelector,useDispatch } from "react-redux"
import { useToast } from "../components/ui/toast"
import { Button } from "../components/ui/button"
import { CustomTextFieldComponent } from "../components/ui/custom-text-field"
import { InputAdornment, IconButton } from "@mui/material"

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().regex(/^[0-9]{11}$/, "Phone number must be 11 digits"),
  role: z.enum(["USER", "AGENT"]).refine((value) => value !== undefined, {
    message: "Please select a role",
  }),
  password: z.string().regex(/^[0-9]{5}$/, "Password must be exactly 5 digits"),
})

type SignupFormData = z.infer<typeof signupSchema>

export function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"USER" | "AGENT" | null>(null)
  const dispatch = useDispatch<AppDispatch>();
  const { error } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (error) {
      showToast({
        type: 'error',
        message: error,
        duration: 4000
      });
    }
  }, [error]);

  // Handle role selection
  const handleRoleChange = (role: "USER" | "AGENT") => {
    setSelectedRole(role);
    setValue("role", role);
  };

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true)

    try {
      console.log("Form data being sent:", data);
      const result = await dispatch(signupUser(data)).unwrap();
      console.log("Registration successful:", result);
      showToast({
        type: 'success',
        message: 'Account created successfully!',
        duration: 3000
      });
      // You can add navigation here if needed
      navigate('/login');
    } catch (err: any) {
      console.error("Registration error:", err);
      // Show the actual error message from the API
      const errorMessage = typeof err === 'string' ? err : (err?.message || "Failed to create account. Please try again.");
      showToast({
        type: 'error',
        message: errorMessage,
        duration: 4000
      });
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center py-12 px-4 bg-background">
      <Card className="w-full max-w-md relative border-0 shadow-none bg-transparent">
        

        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Icon icon="solar:wallet" className="h-8 w-8 text-accent" />
          </div>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Join E-Wallet MFS today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <CustomTextFieldComponent
              label="Name"
              type="text"
              placeholder="Enter your name"
              focused
              required
              fullWidth
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <CustomTextFieldComponent
              label="Email"
              type="email"
              placeholder="Enter your email"
              focused
              required
              fullWidth
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <CustomTextFieldComponent
              label="Phone Number"
              type="tel"
              placeholder="01XXXXXXXXX"
              focused
              required
              fullWidth
              {...register("phoneNumber")}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
            />

            <CustomTextFieldComponent
              label="Password (5 digits)"
              type={showPassword ? "text" : "password"}
              placeholder="Enter 5-digit password"
              focused
              required
              fullWidth
              inputProps={{ maxLength: 5 }}
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

            <div className="space-y-3">
              <Label>Select Your Role</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="USER"
                    checked={selectedRole === "USER"}
                    onCheckedChange={() => handleRoleChange("USER")}
                  />
                  <Label htmlFor="USER" className="text-sm font-normal cursor-pointer">
                    User
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="AGENT"
                    checked={selectedRole === "AGENT"}
                    onCheckedChange={() => handleRoleChange("AGENT")}
                  />
                  <Label htmlFor="AGENT" className="text-sm font-normal cursor-pointer">
                    Agent
                  </Label>
                </div>
              </div>
              {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full"
              style={{ height: '56px' }}
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}