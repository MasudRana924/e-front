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

const depositSchema = z.object({
  amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Amount must be a positive number"),
  pin: z.string().min(1, "PIN is required"),
})

type DepositFormData = z.infer<typeof depositSchema>

const Deposit = () => {
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
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon="solar:plus" className="h-5 w-5" />
            Add Money
          </CardTitle>
          <CardDescription>Add money to your wallet</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                <Icon icon="solar:lock" className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
              {loading ? "Processing..." : "Add Money"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Deposit

