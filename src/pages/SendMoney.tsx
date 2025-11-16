import React, { useEffect } from 'react'
import { useAuth } from '../redux/features/auth/auth.api'
import { useTransactions } from '../redux/features/transactions/transactions.api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Send, Phone, Lock } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'

const sendMoneySchema = z.object({
  receiverPhone: z.string().min(1, "Phone number is required").regex(/^01[3-9]\d{8}$/, "Please enter a valid Bangladeshi phone number"),
  amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Amount must be a positive number"),
  pin: z.string().min(1, "PIN is required"),
})

type SendMoneyFormData = z.infer<typeof sendMoneySchema>

const SendMoney = () => {
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
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Money
          </CardTitle>
          <CardDescription>Enter recipient phone number, amount, and your PIN</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="receiverPhone">Recipient Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="receiverPhone"
                  placeholder="01XXXXXXXXX"
                  className="pl-10"
                  {...register("receiverPhone")}
                />
              </div>
              {errors.receiverPhone && <p className="text-sm text-red-500">{errors.receiverPhone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (৳)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                {...register("amount")}
              />
              {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin">Your PIN</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="pin"
                  type="password"
                  placeholder="Enter your PIN"
                  className="pl-10"
                  {...register("pin")}
                />
              </div>
              {errors.pin && <p className="text-sm text-red-500">{errors.pin.message}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Money"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SendMoney

