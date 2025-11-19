import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Icon } from '@iconify/react'
import { useSelector } from 'react-redux'
import type { RootState } from '../redux/store'
import { useDashboard } from '../redux/features/dashboard/dashboard.api'

const Dashboard = () => {
  const navigate = useNavigate()
  const [showBalance, setShowBalance] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const hasFetched = useRef(false)

  // Get user data from Redux store
  const { user } = useSelector((state: RootState) => state.auth)
  // Get dashboard data from Redux store
  const { error, fetchUserStats, balance, balanceLoading, balanceStatus, fetchBalance } = useDashboard()
  const isAgent = user?.role === 'AGENT'

  // Fetch balance from API when dashboard loads
  useEffect(() => {
    if (hasFetched.current) return
    
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      console.log('No token found, redirecting to login')
      navigate('/login')
      return
    }

    hasFetched.current = true
    fetchBalance()
    fetchUserStats()

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle authentication errors
  useEffect(() => {
    if (error && error.includes('401')) {
      localStorage.removeItem('authToken')
      navigate('/login')
    }
  }, [error, navigate])
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="w-8/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Welcome back, {user?.name || 'User'}!
          </h2>
          <p className="text-muted-foreground">{formatDate(currentTime)}</p>
        </div>

        {/* Balance Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-green-600 border-0 text-white shadow-xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-blue-100 text-sm">Available Balance</p>
                <div className="flex items-center space-x-2">
                  <h3 className="text-3xl font-bold">
                    {balanceLoading ? (
                      <div className="animate-pulse bg-white/20 h-8 w-32 rounded"></div>
                    ) : showBalance ? (
                      `৳${balance.toLocaleString()}`
                    ) : (
                      '৳••••••'
                    )}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-white hover:bg-white/20"
                    disabled={balanceLoading}
                  >
                    {showBalance ? <Icon icon="solar:eye-closed-bold" className="h-4 w-4" /> : <Icon icon="solar:eye-bold" className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex space-x-2">
                <Badge className="bg-white/20 text-white border-0">
                  {user?.role || 'USER'}
                </Badge>
                <Badge className={`border-0 ${balanceStatus === "ACTIVE" ? "bg-green-500" : "bg-red-500"}`}>
                  {balanceStatus}
                </Badge>
              </div>
            </div>
            <div className="flex justify-between text-sm text-blue-100">
              <span>{user?.phoneNumber || 'N/A'}</span>
              <span>Account: ****{user?.phoneNumber?.slice(-4) || '1234'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Services Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Services</h3>
          <div
            className={`grid grid-cols-1 ${isAgent ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'} gap-3`}
          >
            {isAgent ? (
              <>
                <Card
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate('/dashboard/add-money')}
                >
                  <CardContent className="p-3 text-center">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Icon icon="solar:card-bold" className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="font-semibold text-sm">Add Money</h4>
                    <p className="text-xs text-muted-foreground mt-1">Top up your agent wallet instantly</p>
                  </CardContent>
                </Card>
                <Card
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate('/dashboard/cash-in')}
                >
                  <CardContent className="p-3 text-center">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Icon icon="solar:card-send-bold" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h4 className="font-semibold text-sm">Agent Cash In</h4>
                    <p className="text-xs text-muted-foreground mt-1">Serve customers with instant cash in</p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                {/* Send Money */}
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/dashboard/send')}>
                  <CardContent className="p-3 text-center">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Icon icon="solar:plain-2-bold" className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-semibold text-sm">Send Money</h4>
                  </CardContent>
                </Card>

                {/* Add Money */}
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/dashboard/add-money')}>
                  <CardContent className="p-3 text-center">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Icon icon="solar:card-bold" className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="font-semibold text-sm">Add Money</h4>
                  </CardContent>
                </Card>

                {/* Cash Out */}
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/dashboard/cash-out')}>
                  <CardContent className="p-3 text-center">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Icon icon="solar:arrow-left-down-bold" className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h4 className="font-semibold text-sm">Cash Out</h4>
                  </CardContent>
                </Card>

                {/* Withdraw Money */}
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/dashboard/withdraw')}>
                  <CardContent className="p-3 text-center">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Icon icon="solar:arrow-right-down-bold" className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h4 className="font-semibold text-sm">Withdraw Money</h4>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* Promotional Cards */}
        <div className="mt-8">
          <div className="flex flex-col md:flex-row gap-4">
            <Card className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold mb-1">🎉 Special Offer!</h3>
                    <p className="text-purple-100 text-sm">2% cashback this month</p>
                  </div>
                  <Icon icon="solar:bolt-bold" className="h-6 w-6 text-yellow-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 border-0 text-white shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold mb-1">🔒 Secure</h3>
                    <p className="text-green-100 text-sm">Bank-level security</p>
                  </div>
                  <Icon icon="solar:shield-check-bold" className="h-6 w-6 text-blue-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 border-0 text-white shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold mb-1">⚡ Fast</h3>
                    <p className="text-orange-100 text-sm">Instant transfers</p>
                  </div>
                  <Icon icon="solar:smartphone-2-bold" className="h-6 w-6 text-red-300" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
