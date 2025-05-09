"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface TestEmailSenderProps {
  templateId: string
  templateName: string
}

export function TestEmailSender({ templateId, templateName }: TestEmailSenderProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [sending, setSending] = useState(false)
  const { toast } = useToast()

  const sendTestEmail = async () => {
    if (!email) {
      toast({
        title: "Missing Email",
        description: "Please enter an email address",
        variant: "destructive",
      })
      return
    }

    setSending(true)
    try {
      const response = await fetch("/api/email-templates/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId,
          email,
          name: name || undefined,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: `Test email sent to ${email}`,
        })
        setEmail("")
        setName("")
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send test email",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending test email:", error)
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Test Email</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="test-email">Recipient Email</Label>
            <Input
              id="test-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="test-name">Recipient Name (Optional)</Label>
            <Input
              id="test-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter recipient name"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={sendTestEmail} disabled={sending} className="w-full">
          {sending ? "Sending..." : `Send Test ${templateName}`}
        </Button>
      </CardFooter>
    </Card>
  )
}
