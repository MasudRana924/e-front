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

const withdrawMoneySchema = z.object({
  amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Amount must be a positive number"),
  pin: z.string().regex(/^\d{4,}$/, "PIN must be at least 4 digits"),
  receiverWallet: z.string().min(1, "Receiver wallet is required"),
})

type WithdrawMoneyFormData = z.infer<typeof withdrawMoneySchema>

const WithdrawMoney = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { withdrawMoney, loading, error, lastWithdraw, clearError } = useTransactions()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WithdrawMoneyFormData>({
    resolver: zodResolver(withdrawMoneySchema),
  })


  // Clear error when component mounts
  useEffect(() => {
    clearError()
  }, [clearError])

  // Show success toast when withdraw is successful
  useEffect(() => {
    if (lastWithdraw?.message) {
      toast.success(lastWithdraw.message, {
        description: lastWithdraw.data?.balance 
          ? `New balance: ৳${lastWithdraw.data.balance.toLocaleString()}`
          : undefined,
      })
      reset() // Reset form after successful withdraw
    }
  }, [lastWithdraw, reset])

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      toast.error("Failed to withdraw money", {
        description: error,
      })
    }
  }, [error])

  if (!user) {
    return null
  }

  const onSubmit = async (data: WithdrawMoneyFormData) => {
    try {
      await withdrawMoney(data)
    } catch (error) {
      console.error('Withdraw money error:', error)
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
          <Icon icon="solar:arrow-down-right" className="h-5 w-5" />
          Withdraw Money
        </h2>
        <p className="text-muted-foreground mt-4 mb-4 text-left">Withdraw money from your wallet</p>
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
          label="Receiver Wallet"
          placeholder="Enter receiver wallet"
          focused
          required
          fullWidth
          {...register("receiverWallet")}
          error={!!errors.receiverWallet}
          helperText={errors.receiverWallet?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon icon="solar:wallet" className="h-5 w-5 text-muted-foreground" />
              </InputAdornment>
            )
          }}
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
          {loading ? "Processing..." : "Withdraw Money"}
        </Button>
      </form>
      </div>
    </div>
  )
}

export default WithdrawMoney

