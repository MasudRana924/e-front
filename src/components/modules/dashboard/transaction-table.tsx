"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { Icon } from "@iconify/react"

interface Transaction {
  id: string
  type: "deposit" | "withdraw" | "send" | "receive"
  amount: number
  recipient?: string
  sender?: string
  status: "completed" | "pending" | "failed"
  date: string
  reference: string
}

interface TransactionTableProps {
  transactions: Transaction[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const statusColors = {
  completed: "bg-primary/10 text-primary",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
}

const typeColors = {
  deposit: "bg-blue-100 text-blue-800",
  withdraw: "bg-orange-100 text-orange-800",
  send: "bg-purple-100 text-purple-800",
  receive: "bg-primary/10 text-primary",
}

export function TransactionTable({ transactions, currentPage, totalPages, onPageChange }: TransactionTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Reference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <Badge className={typeColors[transaction.type]}>
                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">৳{transaction.amount.toLocaleString()}</TableCell>
                <TableCell>
                  {transaction.recipient && `To: ${transaction.recipient}`}
                  {transaction.sender && `From: ${transaction.sender}`}
                  {!transaction.recipient && !transaction.sender && "-"}
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[transaction.status]}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell className="font-mono text-sm">{transaction.reference}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}>
            <Icon icon="solar:alt-arrow-left-linear" className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
            <Icon icon="solar:alt-arrow-right-linear" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
