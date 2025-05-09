"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export function TemplateFinder() {
  const [isOpen, setIsOpen] = useState(false)
  const [businessType, setBusinessType] = useState("")
  const [documentType, setDocumentType] = useState("")

  return (
    <div className="w-full max-w-3xl">
      {!isOpen ? (
        <Button
          variant="outline"
          className="w-full max-w-md mx-auto flex items-center gap-2 border-dashed"
          onClick={() => setIsOpen(true)}
        >
          <Search className="h-4 w-4" />
          Find the right template for your business
        </Button>
      ) : (
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">Find Your Perfect Template</h3>
              <p className="text-sm text-gray-500 text-center">
                Answer a few questions to find the templates that best fit your business needs
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Business Type</label>
                  <Select value={businessType} onValueChange={setBusinessType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="llc">LLC</SelectItem>
                      <SelectItem value="corporation">Corporation</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="sole-proprietor">Sole Proprietor</SelectItem>
                      <SelectItem value="nonprofit">Nonprofit</SelectItem>
                      <SelectItem value="freelancer">Freelancer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Document Type</label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formation">Business Formation</SelectItem>
                      <SelectItem value="contracts">Client/Vendor Contracts</SelectItem>
                      <SelectItem value="employment">Employment Documents</SelectItem>
                      <SelectItem value="website">Website Policies</SelectItem>
                      <SelectItem value="intellectual">Intellectual Property</SelectItem>
                      <SelectItem value="compliance">Compliance Documents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <Search className="mr-2 h-4 w-4" />
                  Find Templates
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
