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

const withdrawMoneySchema = z.object({
  amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Amount must be a positive number"),
  pin: z.string().min(1, "PIN is required"),
  receiverWallet: z.string().min(1, "Receiver wallet is required"),
})

type WithdrawMoneyFormData = z.infer<typeof withdrawMoneySchema>

const WithdrawMoney = () => {
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
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon="solar:arrow-down-right" className="h-5 w-5" />
            Withdraw Money
          </CardTitle>
          <CardDescription>Withdraw money from your wallet</CardDescription>
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
              <Label htmlFor="receiverWallet">Receiver Wallet</Label>
              <div className="relative">
                <Icon icon="solar:wallet" className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="receiverWallet"
                  placeholder="Enter receiver wallet"
                  className="pl-10"
                  {...register("receiverWallet")}
                />
              </div>
              {errors.receiverWallet && <p className="text-sm text-red-500">{errors.receiverWallet.message}</p>}
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
              {loading ? "Processing..." : "Withdraw Money"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default WithdrawMoney

