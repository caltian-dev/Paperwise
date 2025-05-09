import { SimpleCheckoutButton } from "@/components/simple-checkout-button"

export default function ProductPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">Legal Template Package</h2>
          <p className="text-gray-600 mb-4">Complete set of essential legal documents for your business</p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold">$49.99</span>
            <SimpleCheckoutButton productId="template-123" productName="Legal Template Package" price={49.99} />
          </div>
        </div>
      </div>
    </div>
  )
}
