import { useEffect } from 'react'
import { useAuth } from '../redux/features/auth/auth.api'
import { useAdmin } from '../redux/features/admin/admin.api'
import { Button } from '../components/ui/button'
import { Icon } from '@iconify/react'
import { CustomTextFieldComponent } from '../components/ui/custom-text-field'
import { InputAdornment } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const transferToAgentSchema = z.object({
  agentPhone: z.string().min(1, "Agent phone number is required").regex(/^01[3-9]\d{8}$/, "Please enter a valid Bangladeshi phone number"),
  amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Amount must be a positive number"),
  pin: z.string().regex(/^\d{4,}$/, "PIN must be at least 4 digits"),
})

type TransferToAgentFormData = z.infer<typeof transferToAgentSchema>

const AdminTransferToAgent = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { transferToAgent, adminLoading, adminError, clearAdminError } = useAdmin()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransferToAgentFormData>({
    resolver: zodResolver(transferToAgentSchema),
  })

  // Clear error when component mounts
  useEffect(() => {
    clearAdminError()
  }, [clearAdminError])

  // Show error toast when there's an error
  useEffect(() => {
    if (adminError) {
      toast.error("Failed to transfer money", {
        description: adminError,
      })
    }
  }, [adminError])

  if (!user) {
    return null
  }

  const onSubmit = async (data: TransferToAgentFormData) => {
    try {
      const result = await transferToAgent(data).unwrap()
      toast.success(result.message || 'Money transferred successfully')
      reset() // Reset form after successful transaction
    } catch (error) {
      console.error('Transfer money error:', error)
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
          B2B Send Money to Agent
        </h2>
        <p className="text-muted-foreground mt-4 mb-4 text-left">Transfer money to an agent account</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <CustomTextFieldComponent
          label="Agent Phone Number"
          placeholder="01XXXXXXXXX"
          focused
          required
          fullWidth
          {...register("agentPhone")}
          error={!!errors.agentPhone}
          helperText={errors.agentPhone?.message}
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
          disabled={adminLoading}
        >
          {adminLoading ? "Processing..." : "Transfer Money"}
        </Button>
      </form>
      </div>
    </div>
  )
}

export default AdminTransferToAgent

