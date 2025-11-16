import { useEffect } from 'react'
import { useAuth } from '../redux/features/auth/auth.api'
import { useTransactions } from '../redux/features/transactions/transactions.api'
import { Button } from '../components/ui/button'
import { Icon } from '@iconify/react'
import { CustomTextFieldComponent } from '../components/ui/custom-text-field'
import { InputAdornment } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const cashOutSchema = z.object({
  receiverPhone: z.string().min(1, "Agent phone number is required").regex(/^01[3-9]\d{8}$/, "Please enter a valid Bangladeshi phone number"),
  amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Amount must be a positive number"),
  password: z.string().min(1, "Password is required"),
})

type CashOutFormData = z.infer<typeof cashOutSchema>

const CashOut = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cashOut, loading, error, lastCashOut, clearError } = useTransactions()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CashOutFormData>({
    resolver: zodResolver(cashOutSchema),
  })


  // Clear error when component mounts
  useEffect(() => {
    clearError()
  }, [clearError])

  // Show success toast when cash out is successful
  useEffect(() => {
    if (lastCashOut?.message) {
      toast.success(lastCashOut.message, {
        description: lastCashOut.remainingBalance 
          ? `Remaining balance: ৳${lastCashOut.remainingBalance.toLocaleString()}`
          : undefined,
      })
      reset() // Reset form after successful cash out
    }
  }, [lastCashOut, reset])

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      toast.error("Failed to cash out", {
        description: error,
      })
    }
  }, [error])

  if (!user) {
    return null
  }

  const onSubmit = async (data: CashOutFormData) => {
    try {
      await cashOut(data)
    } catch (error) {
      console.error('Cash out error:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
      <Button
        variant="ghost"
        onClick={() => navigate('/dashboard')}
        className="mb-4 -ml-2 flex items-center gap-2 text-black hover:text-black bg-gray-100 dark:bg-gray-800"
      >
        <Icon icon="solar:alt-arrow-left-linear" className="h-5 w-5 text-black" />
        <span className="text-black">Back</span>
      </Button>
      <div className="mb-6 mt-6 text-center">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Icon icon="solar:arrow-down-left" className="h-5 w-5" />
          Cash Out
        </h2>
        <p className="text-muted-foreground mt-4 mb-4 text-left">Cash out to an agent with your password</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <CustomTextFieldComponent
          label="Agent Phone Number"
          placeholder="01XXXXXXXXX"
          focused
          required
          fullWidth
          {...register("receiverPhone")}
          error={!!errors.receiverPhone}
          helperText={errors.receiverPhone?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon icon="solar:phone" className="h-5 w-5 text-muted-foreground" />
              </InputAdornment>
            )
          }}
        />

        <CustomTextFieldComponent
          label="Amount (৳)"
          type="number"
          placeholder="0.00"
          focused
          required
          fullWidth
          inputProps={{ step: "0.01", min: "0" }}
          {...register("amount")}
          error={!!errors.amount}
          helperText={errors.amount?.message}
        />

        <CustomTextFieldComponent
          label="Your Password"
          type="password"
          placeholder="Enter your password"
          focused
          required
          fullWidth
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon icon="solar:lock" className="h-5 w-5 text-muted-foreground" />
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
          {loading ? "Processing..." : "Cash Out"}
        </Button>
      </form>
      </div>
    </div>
  )
}

export default CashOut

