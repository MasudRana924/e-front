import React, { useEffect } from 'react'
import { useAuth } from '../redux/features/auth/auth.api'
import { useTransactions } from '../redux/features/transactions/transactions.api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Icon } from '@iconify/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'

const cashOutSchema = z.object({
  receiverPhone: z.string().min(1, "Agent phone number is required").regex(/^01[3-9]\d{8}$/, "Please enter a valid Bangladeshi phone number"),
  amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Amount must be a positive number"),
  password: z.string().min(1, "Password is required"),
})

type CashOutFormData = z.infer<typeof cashOutSchema>

const CashOut = () => {
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
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon="solar:arrow-down-left" className="h-5 w-5" />
            Cash Out
          </CardTitle>
          <CardDescription>Cash out to an agent with your password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="receiverPhone">Agent Phone Number</Label>
              <div className="relative">
                <Icon icon="solar:phone" className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
              <Label htmlFor="password">Your Password</Label>
              <div className="relative">
                <Icon icon="solar:lock" className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10"
                  {...register("password")}
                />
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? "Processing..." : "Cash Out"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CashOut

