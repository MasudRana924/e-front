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

const depositSchema = z.object({
  amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Amount must be a positive number"),
  pin: z.string().regex(/^\d{4,}$/, "PIN must be at least 4 digits"),
})

type DepositFormData = z.infer<typeof depositSchema>

const Deposit = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addMoney, loading, error, lastDeposit, clearError } = useTransactions()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DepositFormData>({
    resolver: zodResolver(depositSchema),
  })


  // Clear error when component mounts
  useEffect(() => {
    clearError()
  }, [clearError])

  // Show success toast when deposit is successful
  useEffect(() => {
    if (lastDeposit?.message) {
      toast.success(lastDeposit.message, {
        description: `New balance: ৳${lastDeposit.data.balance.toLocaleString()}`,
      })
      reset() // Reset form after successful deposit
    }
  }, [lastDeposit, reset])

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      toast.error("Failed to add money", {
        description: error,
      })
    }
  }, [error])

  if (!user) {
    return null
  }

  const onSubmit = async (data: DepositFormData) => {
    try {
      await addMoney(data)
    } catch (error) {
      console.error('Add money error:', error)
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
          <Icon icon="solar:plus" className="h-5 w-5" />
          Add Money
        </h2>
        <p className="text-muted-foreground mt-4 mb-4 text-left">Add money to your wallet</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
          label="Your PIN"
          type="password"
          placeholder="At least 4 digits"
          focused
          required
          fullWidth
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*", minLength: 4 }}
          {...register("pin")}
          error={!!errors.pin}
          helperText={errors.pin?.message}
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
          {loading ? "Processing..." : "Add Money"}
        </Button>
      </form>
      </div>
    </div>
  )
}

export default Deposit

