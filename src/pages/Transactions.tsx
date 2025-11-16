import React, { useEffect, useState } from 'react'
import { useAuth } from '../redux/features/auth/auth.api'
import { useTransactions } from '../redux/features/transactions/transactions.api'
import { Card, CardContent,  } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { History, ArrowUpRight,  Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

const Transactions = () => {
  const { user } = useAuth()
  const { transactionHistory, historyLoading, error, fetchTransactionHistory, clearError } = useTransactions()
  const [currentPage, setCurrentPage] = useState(1)
  const transactionsPerPage = 5

  // Fetch transaction history when component mounts
  useEffect(() => {
    // Only fetch if not already loading and no data exists
    if (!historyLoading && transactionHistory.length === 0) {
      fetchTransactionHistory()
    }
  }, []) // Empty dependency array to run only once

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      toast.error("Failed to load transactions", {
        description: error,
      })
      clearError()
    }
  }, [error]) // Only depend on error, not clearError

  if (!user) {
    return null
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'add-money':
        return <Plus className="h-4 w-4" />
      case 'send-money':
        return <ArrowUpRight className="h-4 w-4" />
      default:
        return <History className="h-4 w-4" />
    }
  }

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'add-money':
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case 'send-money':
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'add-money':
        return 'Add Money'
      case 'send-money':
        return 'Send Money'
      default:
        return type
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(transactionHistory.length / transactionsPerPage)
  const startIndex = (currentPage - 1) * transactionsPerPage
  const endIndex = startIndex + transactionsPerPage
  const currentTransactions = transactionHistory.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
        <p className="text-muted-foreground">
          View all your transactions.
        </p>
      </div>

      {/* Transactions Table */}
      <Card className="shadow-lg">
        <CardContent className="p-0">
          {historyLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <div className="text-muted-foreground">Loading transactions...</div>
              </div>
            </div>
          ) : transactionHistory.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <div className="text-muted-foreground text-lg">No transactions found</div>
                <div className="text-muted-foreground text-sm">Your transaction history will appear here</div>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 dark:bg-muted/20">
                      <TableHead className="font-semibold text-foreground py-4">Transaction Type</TableHead>
                      <TableHead className="font-semibold text-foreground py-4">Amount</TableHead>
                      <TableHead className="font-semibold text-foreground py-4">Date & Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTransactions.map((transaction, index) => (
                      <TableRow 
                        key={transaction._id} 
                        className={`hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors ${
                          index % 2 === 0 ? 'bg-background' : 'bg-muted/20 dark:bg-muted/10'
                        }`}
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              transaction.type === 'add-money' 
                                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {getTransactionIcon(transaction.type)}
                            </div>
                            <div>
                              <Badge 
                                className={`${getTransactionTypeColor(transaction.type)} font-medium px-3 py-1`}
                              >
                                {getTransactionTypeLabel(transaction.type)}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="font-semibold text-lg text-foreground">
                            ৳{transaction.amount.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="text-sm">
                            <div className="font-medium text-foreground">
                              {formatDate(transaction.createdAt).split(',')[0]}
                            </div>
                            <div className="text-muted-foreground">
                              {formatDate(transaction.createdAt).split(',')[1]?.trim()}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 bg-muted/50 dark:bg-muted/20 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(endIndex, transactionHistory.length)} of {transactionHistory.length} transactions
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="flex items-center gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="flex items-center gap-1"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Transactions

