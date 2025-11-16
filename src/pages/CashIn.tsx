import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Alert, AlertDescription } from '../components/ui/alert'
import { useTransactions } from '../redux/features/transactions/transactions.api'

interface CashInFormData {
  phoneNumber: string
  amount: string
  password: string
}

const CashIn = () => {
  const [formData, setFormData] = useState<CashInFormData>({
    phoneNumber: '',
    amount: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const { cashIn } = useTransactions()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError(null)
    if (success) setSuccess(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Validate form data
      if (!formData.phoneNumber || !formData.amount || !formData.password) {
        throw new Error('All fields are required')
      }

      if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
        throw new Error('Amount must be a positive number')
      }

      // Call the cash in API
      const result = await cashIn(formData)
      
      if (result.type.endsWith('/fulfilled')) {
        setSuccess('Cash in transaction completed successfully!')
        setFormData({
          phoneNumber: '',
          amount: '',
          password: ''
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
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-start">Cash In </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="Enter phone number (e.g., 01757922259)"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (৳)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
                disabled={loading}
                min="1"
                step="0.01"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Success Alert */}
            {success && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Process Cash In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CashIn
