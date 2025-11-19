import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Alert, AlertDescription } from '../components/ui/alert'
import { CustomTextFieldComponent } from '../components/ui/custom-text-field'
import { InputAdornment } from '@mui/material'
import { Icon } from '@iconify/react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useTransactions } from '../redux/features/transactions/transactions.api'

interface CashInFormData {
  userPhone: string
  amount: string
  pin: string
}

const CashIn = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<CashInFormData>({
    userPhone: '',
    amount: '',
    pin: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { cashIn } = useTransactions()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate form data
      if (!formData.userPhone || !formData.amount || !formData.pin) {
        throw new Error('All fields are required')
      }

      if (!/^\d{4,}$/.test(formData.pin)) {
        throw new Error('PIN must be at least 4 digits')
      }

      if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
        throw new Error('Amount must be a positive number')
      }

      // Call the cash in API
      const result = await cashIn(formData)
      
      if (result.type.endsWith('/fulfilled')) {
        const successMessage = (result.payload as { message?: string } | undefined)?.message || 'Cash in transaction completed successfully!'
        toast.success(successMessage)
        setFormData({
          userPhone: '',
          amount: '',
          pin: ''
        })
      } else {
        throw new Error(result.payload as string || 'Cash in failed')
      }
    } catch (err: unknown) {
      const error = err as Error
      setError(error.message || 'An error occurred during cash in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
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
            <Icon icon="solar:card-send-bold" className="h-5 w-5" />
            Cash In
          </h2>
          <p className="text-muted-foreground mt-4 mb-4 text-left">Serve customers by adding money to their wallet</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <CustomTextFieldComponent
              label="Customer Phone"
              name="userPhone"
              type="tel"
              placeholder="01XXXXXXXXX"
              focused
              required
              fullWidth
              value={formData.userPhone}
              onChange={handleInputChange}
              disabled={loading}
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
              name="amount"
              type="number"
              placeholder="0.00"
              focused
              required
              fullWidth
              value={formData.amount}
              onChange={handleInputChange}
              disabled={loading}
              inputProps={{ step: "0.01", min: "1" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon icon="solar:money-bag-bold" className="h-5 w-5 text-muted-foreground" />
                  </InputAdornment>
                )
              }}
            />

            <CustomTextFieldComponent
              label="Agent PIN"
              name="pin"
              type="password"
              placeholder="At least 4 digits"
              focused
              required
              fullWidth
              value={formData.pin}
              onChange={handleInputChange}
              disabled={loading}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*", minLength: 4 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon icon="solar:lock" className="h-5 w-5 text-muted-foreground" />
                  </InputAdornment>
                )
              }}
            />

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              style={{ height: '56px' }}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Cash In'}
            </Button>
        </form>
      </div>
    </div>
  )
}

export default CashIn
