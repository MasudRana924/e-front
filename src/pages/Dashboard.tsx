import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { ArrowUpRight, ArrowDownLeft, Plus, Eye, EyeOff, Users, Smartphone, Zap, Shield } from 'lucide-react'
import { useSelector } from 'react-redux'
import type { RootState } from '../redux/store'
import { useDashboard } from '../redux/features/dashboard/dashboard.api'

const Dashboard = () => {
  const navigate = useNavigate()
  const [showBalance, setShowBalance] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Get user data from Redux store
  const { user } = useSelector((state: RootState) => state.auth)
  console.log("user",user)
  // Get dashboard data from Redux store
  const { userStats, loading, error, fetchUserStats } = useDashboard()

  // Fetch user stats from API using Redux
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      console.log('No token found, redirecting to login')
      navigate('/login')
      return
    }

    fetchUserStats()

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate, fetchUserStats])

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
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
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
                    {loading ? (
                      <div className="animate-pulse bg-white/20 h-8 w-32 rounded"></div>
                    ) : showBalance ? (
                      `৳${userStats.balance.toLocaleString()}`
                    ) : (
                      '৳••••••'
                    )}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-white hover:bg-white/20"
                    disabled={loading}
                  >
                    {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex space-x-2">
                <Badge className="bg-white/20 text-white border-0">
                  {user?.role || 'USER'}
                </Badge>
                <Badge className={`border-0 ${userStats.walletStatus === "active" ? "bg-green-500" : "bg-red-500"}`}>
                  {userStats.walletStatus.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className="flex justify-between text-sm text-blue-100">
              <span>{user?.phoneNumber || 'N/A'}</span>
              <span>Account: ****{user?.phoneNumber?.slice(-4) || '1234'}</span>
            </div>
          </CardContent>
        </Card>


        {/* Transaction Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Transactions */}
          <Card className="bg-card border border-border shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                  <p className="text-2xl font-bold text-foreground">
                    {loading ? (
                      <div className="animate-pulse bg-muted h-6 w-16 rounded"></div>
                    ) : (
                      userStats.totalTransactions
                    )}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Money Stats */}
          <Card className="bg-card border border-border shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Add Money</p>
                  <p className="text-2xl font-bold text-foreground">
                    {loading ? (
                      <div className="animate-pulse bg-muted h-6 w-16 rounded"></div>
                    ) : (
                      userStats.transactionTypeStats["add-money"]
                    )}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                  <Plus className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Send Money Stats */}
          <Card className="bg-card border border-border shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Send Money</p>
                  <p className="text-2xl font-bold text-foreground">
                    {loading ? (
                      <div className="animate-pulse bg-muted h-6 w-16 rounded"></div>
                    ) : (
                      userStats.transactionTypeStats["send-money"]
                    )}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <ArrowUpRight className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cash Out Stats */}
          <Card className="bg-card border border-border shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cash Out</p>
                  <p className="text-2xl font-bold text-foreground">
                    {loading ? (
                      <div className="animate-pulse bg-muted h-6 w-16 rounded"></div>
                    ) : (
                      userStats.transactionTypeStats["cash-out"]
                    )}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                  <ArrowDownLeft className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
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
                  <Zap className="h-6 w-6 text-yellow-300" />
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
                  <Shield className="h-6 w-6 text-blue-300" />
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
                  <Smartphone className="h-6 w-6 text-red-300" />
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
