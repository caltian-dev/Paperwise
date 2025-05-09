import { Button } from "@/components/ui/button"
import Link from "next/link"
import { XCircle } from "lucide-react"

export default function CheckoutCancelPage() {
  return (
    <div className="container max-w-md py-16">
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="flex justify-center mb-4">
          <XCircle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. If you have any questions, please contact our support team.
        </p>
        <Button asChild className="bg-teal-600 hover:bg-teal-700">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  )
}
