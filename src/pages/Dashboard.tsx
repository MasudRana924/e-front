import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Icon } from '@iconify/react'
import { useSelector } from 'react-redux'
import type { RootState } from '../redux/store'
import { useDashboard } from '../redux/features/dashboard/dashboard.api'
import { useAdmin, approveUser, approveAgent } from '../redux/features/admin/admin.api'
import { format } from 'date-fns'
import api from '../redux/baseApi'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'
import { toast } from 'sonner'

type WalletUser = {
  id: string
  name: string
  phone: string
  role: string
}

type Wallet = {
  id: string
  balance: number
  status: string
  user: WalletUser
}

type TransactionItem = {
  id: string
  type: string
  senderWallet: Wallet | null
  receiverWallet: Wallet | null
  time: string
}

type TransactionMeta = {
  total: number
  page: number
  limit: number
  totalPages: number
}

const TRANSACTION_LIMIT = 4

const Dashboard = () => {
  const navigate = useNavigate()
  const [showBalance, setShowBalance] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const hasFetched = useRef(false)
  const [transactions, setTransactions] = useState<TransactionItem[]>([])
  const [transactionsMeta, setTransactionsMeta] = useState<TransactionMeta>({
    total: 0,
    page: 1,
    limit: TRANSACTION_LIMIT,
    totalPages: 1
  })
  const [transactionsLoading, setTransactionsLoading] = useState(true)
  const [transactionsError, setTransactionsError] = useState<string | null>(null)

  // Get user data from Redux store
  const { user } = useSelector((state: RootState) => state.auth)
  // Get dashboard data from Redux store
  const { error, fetchUserStats, balance, balanceLoading, balanceStatus, fetchBalance } = useDashboard()
  // Get admin data
  const { 
    users, 
    usersMeta, 
    usersLoading, 
    approveLoading,
    fetchUsers, 
    approveUser,
    approveAgent
  } = useAdmin()
  const isAgent = user?.role === 'AGENT'
  const isSuperAdmin = user?.role === 'SUPER_ADMIN'
  
  // State for approve modal
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<{ id: string; name: string; role: string } | null>(null)

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

  const fetchTransactions = useCallback(async (page = 1) => {
    setTransactionsLoading(true)
    setTransactionsError(null)

    try {
      const response = await api.get<{ data: TransactionItem[]; meta: TransactionMeta }>('/transaction/me', {
        params: { page, limit: TRANSACTION_LIMIT }
      })

      setTransactions(response.data?.data ?? [])
      setTransactionsMeta(response.data?.meta ?? { total: 0, page, limit: TRANSACTION_LIMIT, totalPages: 1 })
    } catch (error) {
      console.error('Failed to fetch dashboard transactions', error)
      setTransactionsError('Unable to load your recent transactions right now.')
    } finally {
      setTransactionsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isSuperAdmin) {
      fetchTransactions(1)
    }
  }, [fetchTransactions, isSuperAdmin])

  // Fetch users if SUPER_ADMIN
  useEffect(() => {
    if (isSuperAdmin) {
      fetchUsers({ page: 1, limit: 10 })
    }
  }, [isSuperAdmin, fetchUsers])

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
          <h3 className="text-xl font-bold mb-4">
            {isSuperAdmin ? 'Transfer Money Services' : 'Services'}
          </h3>
          <div
            className={`grid grid-cols-1 ${isAgent ? 'md:grid-cols-2 lg:grid-cols-3' : isSuperAdmin ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-4'} gap-3`}
          >
            {isSuperAdmin ? (
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
            ) : isAgent ? (
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

        {/* All Users Table for SUPER_ADMIN */}
        {isSuperAdmin && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">All Users</h3>
            <Card>
              <CardContent className="p-0">
                {usersLoading ? (
                  <div className="p-6">
                    <div className="space-y-2">
                      {[...Array(5)].map((_, index) => (
                        <div key={`skeleton-${index}`} className="flex animate-pulse gap-4">
                          <div className="h-4 w-1/4 rounded bg-muted" />
                          <div className="h-4 w-1/4 rounded bg-muted" />
                          <div className="h-4 w-1/4 rounded bg-muted" />
                          <div className="h-4 w-1/4 rounded bg-muted" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : users.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    No users found.
                  </div>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((userItem) => (
                          <TableRow key={userItem._id}>
                            <TableCell className="font-medium">{userItem.name}</TableCell>
                            <TableCell>{userItem.email}</TableCell>
                            <TableCell>{userItem.phone}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{userItem.role}</Badge>
                            </TableCell>
                            <TableCell>
                              {userItem.agentStatus === 'approved' ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  approved
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                  pending
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedItem({ id: userItem._id, name: userItem.name, role: userItem.role })
                                  setApproveModalOpen(true)
                                }}
                                disabled={userItem.agentStatus === 'approved' || approveLoading}
                              >
                                <Icon icon="solar:check-circle-bold" className="h-4 w-4 mr-1" />
                                Update
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {usersMeta.totalPages > 1 && (
                      <div className="flex items-center justify-between p-4 border-t">
                        <p className="text-sm text-muted-foreground">
                          Page {usersMeta.page} of {usersMeta.totalPages} (Total: {usersMeta.total})
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchUsers({ page: usersMeta.page - 1, limit: 10 })}
                            disabled={usersMeta.page <= 1 || usersLoading}
                          >
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchUsers({ page: usersMeta.page + 1, limit: 10 })}
                            disabled={usersMeta.page >= usersMeta.totalPages || usersLoading}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Approve Modal */}
        <Dialog open={approveModalOpen} onOpenChange={setApproveModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve User</DialogTitle>
              <DialogDescription>
                Are you sure you want to approve <strong>{selectedItem?.name}</strong>? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setApproveModalOpen(false)
                  setSelectedItem(null)
                }}
                disabled={approveLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (!selectedItem) return
                  
                  try {
                    // Use different endpoint based on role
                    let result
                    if (selectedItem.role === 'AGENT') {
                      result = await approveAgent(selectedItem.id).unwrap()
                      console.log('Agent approved result:', result)
                      toast.success('Agent approved successfully')
                    } else {
                      result = await approveUser(selectedItem.id).unwrap()
                      console.log('User approved result:', result)
                      toast.success('User approved successfully')
                    }
                    // Refresh users list
                    await fetchUsers({ page: usersMeta.page, limit: 10 })
                    setApproveModalOpen(false)
                    setSelectedItem(null)
                  } catch (error: any) {
                    console.error('Approve error:', error)
                    const errorMessage = error?.message || error || 'Failed to approve. Please try again.'
                    toast.error(errorMessage)
                  }
                }}
                disabled={approveLoading}
              >
                {approveLoading ? 'Processing...' : 'Confirm Approve'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Recent Transactions - Hide for SUPER_ADMIN */}
        {!isSuperAdmin && (
        <div className="mb-10">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h3 className="text-xl font-bold text-foreground">All Transaction</h3>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>Total: {transactionsMeta.total}</span>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => fetchTransactions(transactionsMeta.page)}
                disabled={transactionsLoading}
              >
                <Icon icon="solar:refresh-linear" className={`h-4 w-4 ${transactionsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {transactionsError && (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-destructive text-sm">
                {transactionsError}
              </div>
            )}

            {transactionsLoading &&
              [...Array(TRANSACTION_LIMIT)].map((_, index) => (
                <Card key={`txn-skeleton-${index}`} className="border-dashed">
                  <CardContent className="p-4">
                    <div className="flex animate-pulse flex-col gap-2">
                      <div className="h-4 w-1/3 rounded bg-muted" />
                      <div className="flex gap-4">
                        <div className="h-3 w-20 rounded bg-muted" />
                        <div className="h-3 w-24 rounded bg-muted" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {!transactionsLoading && !transactions.length && (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">No transactions found yet.</CardContent>
              </Card>
            )}

            {!transactionsLoading &&
              transactions.map((transaction) => {
                const formattedTime = transaction.time
                  ? format(new Date(transaction.time), 'MMM dd, yyyy hh:mm a')
                  : 'N/A'
                const typeLabel = transaction.type.replace(/_/g, ' ')
                const senderPhone = transaction.senderWallet?.user?.phone || 'System'
                const receiverPhone = transaction.receiverWallet?.user?.phone || 'System'

                // Type-specific badge colors
                const typeColors: Record<string, string> = {
                  commission: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  cash_in: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                  cash_out: 'bg-rose-50 text-rose-700 border-rose-200',
                  add_money: 'bg-amber-50 text-amber-700 border-amber-200',
                  send_money: 'bg-sky-50 text-sky-700 border-sky-200',
                }
                const badgeColor = typeColors[transaction.type] || 'bg-muted/40 border-border'

                return (
                  <Card key={transaction.id} className="border border-border/70 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        {/* Left side: Sender and Receiver */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Sender:</span>
                            <span className="font-semibold text-foreground">{senderPhone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Receiver:</span>
                            <span className="font-semibold text-foreground">{receiverPhone}</span>
                          </div>
                        </div>

                        {/* Right side: Type and Time */}
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="outline" className={`capitalize ${badgeColor}`}>
                            {typeLabel}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{formattedTime}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>

          {transactionsMeta.totalPages > 1 && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
              <p className="text-muted-foreground">
                Page {transactionsMeta.page} of {transactionsMeta.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchTransactions(transactionsMeta.page - 1)}
                  disabled={transactionsMeta.page <= 1 || transactionsLoading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchTransactions(transactionsMeta.page + 1)}
                  disabled={transactionsMeta.page >= transactionsMeta.totalPages || transactionsLoading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
        )}

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
