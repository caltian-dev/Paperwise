import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function CheckoutSuccessPage() {
  return (
    <div className="container max-w-md py-16">
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. You can now access your documents from your purchases page.
        </p>
        <Button asChild className="bg-teal-600 hover:bg-teal-700">
          <Link href="/purchases">View My Purchases</Link>
        </Button>
      </div>
    </div>
  )
}
