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

const sendMoneySchema = z.object({
  receiverPhone: z.string().min(1, "Phone number is required").regex(/^01[3-9]\d{8}$/, "Please enter a valid Bangladeshi phone number"),
  amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Amount must be a positive number"),
  pin: z.string().min(1, "PIN is required"),
})

type SendMoneyFormData = z.infer<typeof sendMoneySchema>

const SendMoney = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { sendMoney, loading, error, lastTransaction, clearError } = useTransactions()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SendMoneyFormData>({
    resolver: zodResolver(sendMoneySchema),
  })


  // Clear error when component mounts
  useEffect(() => {
    clearError()
  }, [clearError])

  // Show success toast when transaction is successful
  useEffect(() => {
    if (lastTransaction?.message) {
      toast.success(lastTransaction.message, {
        description: lastTransaction.data?.senderBalance 
          ? `New balance: ৳${lastTransaction.data.senderBalance.toLocaleString()}`
          : undefined,
      })
      reset() // Reset form after successful transaction
    }
  }, [lastTransaction, reset])

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      toast.error("Failed to send money", {
        description: error,
      })
    }
  }, [error])

  if (!user) {
    return null
  }

  const onSubmit = async (data: SendMoneyFormData) => {
    try {
      await sendMoney(data)
    } catch (error) {
      console.error('Send money error:', error)
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
          <Icon icon="solar:plain-2-bold" className="h-5 w-5" />
          Send Money
        </h2>
        <p className="text-muted-foreground mt-4 mb-4 text-left">Enter recipient phone number, amount, and your PIN</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <CustomTextFieldComponent
              label="Recipient Phone Number"
              placeholder="01XXXXXXXXX"
              focused
              required
              fullWidth
              {...register("receiverPhone")}
              error={!!errors.receiverPhone}
              helperText={errors.receiverPhone?.message}
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
              label="Your PIN"
              type="password"
              placeholder="Enter your PIN"
              focused
              required
              fullWidth
              {...register("pin")}
              error={!!errors.pin}
              helperText={errors.pin?.message}
            />

        <Button 
          type="submit" 
          className="w-full"
          style={{ height: '56px' }}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Money"}
        </Button>
      </form>
      </div>
    </div>
  )
}

export default SendMoney

