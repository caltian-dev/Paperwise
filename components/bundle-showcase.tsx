"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Shield } from "lucide-react"
import { TemplatePreview } from "@/components/template-preview"

export function BundleShowcase() {
  const [bundles, setBundles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        const response = await fetch("/api/bundles/featured")
        if (response.ok) {
          const data = await response.json()
          setBundles(data.bundles || [])
        } else {
          // If API fails, use fallback data
          setBundles(fallbackBundles)
        }
      } catch (error) {
        console.error("Error fetching bundles:", error)
        setBundles(fallbackBundles)
      } finally {
        setLoading(false)
      }
    }

    fetchBundles()
  }, [])

  // Fallback bundles in case API fails
  const fallbackBundles = [
    {
      id: "bundle1",
      name: "LLC Bundle",
      description:
        "Essential documents for Limited Liability Companies including Operating Agreement and Board Resolution.",
      price: 69,
      popular: true,
      documents: [{ name: "LLC Operating Agreement" }, { name: "LLC Board Resolution" }],
      category: "business",
    },
    {
      id: "bundle2",
      name: "Corporation Bundle",
      description: "Complete set of documents for incorporating and managing a corporation.",
      price: 149,
      popular: false,
      documents: [
        { name: "First Board Meeting" },
        { name: "Corporate By-Laws" },
        { name: "Meeting Minutes" },
        { name: "Shareholder Agreement" },
      ],
      category: "business",
    },
    {
      id: "bundle3",
      name: "Small Business Bundle (LLC)",
      description: "Comprehensive legal package for LLCs with all essential documents.",
      price: 249,
      popular: false,
      documents: [
        { name: "LLC Operating Agreement" },
        { name: "LLC Board Resolution" },
        { name: "Independent Contractor Agreement (ABC)" },
        { name: "Licensing Agreement" },
        { name: "Non-Disclosure Agreement" },
        { name: "Non-Compete" },
        { name: "Partnership Agreement" },
        { name: "Sales Agreement" },
        { name: "Master Services Agreement" },
      ],
      category: "business",
    },
  ]

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {bundles.map((bundle) => (
        <Card key={bundle.id} className="overflow-hidden h-full">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">{bundle.name}</CardTitle>
              {bundle.popular && <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">Popular</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">{bundle.description}</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p className="font-medium">Includes:</p>
              <ul className="list-disc pl-4 space-y-1">
                {bundle.documents && bundle.documents.map((doc: any, i: number) => <li key={i}>{doc.name}</li>)}
              </ul>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-teal-600" />
              <span className="text-xs text-gray-500">Attorney-drafted</span>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t bg-gray-50 px-6 py-3">
            <div>
              <p className="text-sm font-semibold">${bundle.price}</p>
              <p className="text-xs text-gray-500">Save up to 40%</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                  Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <TemplatePreview template={bundle.name} price={bundle.price} />
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
