import { useAuth } from '../redux/features/auth/auth.api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Icon } from '@iconify/react'

const MyWallet = () => {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Wallet</h1>
        <p className="text-muted-foreground">
          Manage your wallet balance and transactions.
        </p>
      </div>

      {/* Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon="solar:wallet" className="h-5 w-5" />
            Current Balance
          </CardTitle>
          <CardDescription>Your available wallet balance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-green-600">৳12,345.00</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Icon icon="solar:trending-up" className="h-3 w-3 mr-1" />
              +5.2% this month
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Send Money</p>
                <p className="text-2xl font-bold">Send</p>
              </div>
              <Icon icon="solar:send" className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Add Money</p>
                <p className="text-2xl font-bold">Deposit</p>
              </div>
              <Icon icon="solar:plus" className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Transaction</p>
                <p className="text-2xl font-bold">History</p>
              </div>
              <Icon icon="solar:history" className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Card</p>
                <p className="text-2xl font-bold">Manage</p>
              </div>
              <Icon icon="solar:credit-card" className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest wallet activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Icon icon="solar:trending-up" className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Money Received</p>
                  <p className="text-sm text-muted-foreground">From: John Doe</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">+৳500.00</p>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Icon icon="solar:send" className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Money Sent</p>
                  <p className="text-sm text-muted-foreground">To: Jane Smith</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-red-600">-৳200.00</p>
                <p className="text-sm text-muted-foreground">1 day ago</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon icon="solar:plus" className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Deposit</p>
                  <p className="text-sm text-muted-foreground">Bank Transfer</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">+৳1,000.00</p>
                <p className="text-sm text-muted-foreground">3 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MyWallet

