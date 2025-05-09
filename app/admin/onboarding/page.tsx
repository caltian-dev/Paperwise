"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function OnboardingAdmin() {
  const [sequences, setSequences] = useState([])
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [userId, setUserId] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [initialized, setInitialized] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    checkInitialization()
    fetchData()
  }, [])

  // Update the checkInitialization function to properly initialize the tables
  const checkInitialization = async () => {
    try {
      const response = await fetch("/api/onboarding/init", {
        method: "POST", // Change to POST to ensure tables are created
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      setInitialized(data.success)
      if (data.success) {
        fetchData() // Refresh data after initialization
      }
    } catch (error) {
      console.error("Error checking initialization:", error)
      setError("Failed to check initialization status")
    }
  }

  // Update the fetchData function to handle initialization status from API responses
  const fetchData = async () => {
    setLoading(true)
    try {
      const sequencesResponse = await fetch("/api/onboarding/sequences")
      const emailsResponse = await fetch("/api/onboarding/emails")

      if (sequencesResponse.ok && emailsResponse.ok) {
        const sequencesData = await sequencesResponse.json()
        const emailsData = await emailsResponse.json()

        // Check if tables are initialized from API response
        if (!emailsData.initialized || !sequencesData.initialized) {
          setInitialized(false)
        } else {
          setInitialized(true)
        }

        setSequences(sequencesData.sequences || [])
        setEmails(emailsData.emails || [])
        setError("")
      } else {
        setError("Failed to fetch data")
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  const startOnboarding = async () => {
    if (!userId || !userEmail) {
      toast({
        title: "Missing Information",
        description: "User ID and email are required",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/onboarding/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          email: userEmail,
          name: userName || undefined,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Onboarding sequence started successfully",
        })
        setUserId("")
        setUserEmail("")
        setUserName("")
        fetchData()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to start onboarding sequence",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error starting onboarding:", error)
      toast({
        title: "Error",
        description: "Failed to start onboarding sequence",
        variant: "destructive",
      })
    }
  }

  const sendNextEmail = async (userId: string) => {
    try {
      const response = await fetch("/api/onboarding/send-next", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: data.message || "Email sent successfully",
        })
        fetchData()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send email",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending email:", error)
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (!initialized) {
    return (
      <div className="container mx-auto py-10">
        <Alert className="mb-6">
          <AlertTitle>Database tables not initialized</AlertTitle>
          <AlertDescription>The onboarding system needs to be initialized before use.</AlertDescription>
        </Alert>
        <Button onClick={checkInitialization} className="mt-4">
          Initialize Onboarding System
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Onboarding Email Sequence Management</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="sequences">
        <TabsList className="mb-6">
          <TabsTrigger value="sequences">Active Sequences</TabsTrigger>
          <TabsTrigger value="emails">Sent Emails</TabsTrigger>
          <TabsTrigger value="new">Start New Sequence</TabsTrigger>
        </TabsList>

        <TabsContent value="sequences">
          <Card>
            <CardHeader>
              <CardTitle>Active Onboarding Sequences</CardTitle>
              <CardDescription>View and manage user onboarding email sequences</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading sequences...</p>
              ) : sequences.length === 0 ? (
                <p>No active sequences found.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Started</TableHead>
                      <TableHead>Current Step</TableHead>
                      <TableHead>Last Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sequences.map((sequence: any) => (
                      <TableRow key={sequence.id}>
                        <TableCell className="font-mono text-xs">{sequence.user_id}</TableCell>
                        <TableCell>{sequence.email}</TableCell>
                        <TableCell>{sequence.name || "-"}</TableCell>
                        <TableCell>{formatDate(sequence.started_at)}</TableCell>
                        <TableCell>{sequence.current_step}</TableCell>
                        <TableCell>
                          {sequence.last_email_sent_at ? formatDate(sequence.last_email_sent_at) : "-"}
                        </TableCell>
                        <TableCell>{sequence.completed ? "Completed" : "Active"}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => sendNextEmail(sequence.user_id)}
                            disabled={sequence.completed}
                          >
                            Send Next
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={fetchData} variant="outline">
                Refresh Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="emails">
          <Card>
            <CardHeader>
              <CardTitle>Sent Onboarding Emails</CardTitle>
              <CardDescription>View history of sent onboarding emails</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading email history...</p>
              ) : emails.length === 0 ? (
                <p>No emails have been sent yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Email Type</TableHead>
                      <TableHead>Sent At</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emails.map((email: any) => (
                      <TableRow key={email.id}>
                        <TableCell className="font-mono text-xs">{email.user_id}</TableCell>
                        <TableCell>{email.email}</TableCell>
                        <TableCell>{email.email_type}</TableCell>
                        <TableCell>{formatDate(email.sent_at)}</TableCell>
                        <TableCell>{email.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={fetchData} variant="outline">
                Refresh Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>Start New Onboarding Sequence</CardTitle>
              <CardDescription>Add a user to the onboarding email sequence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter user ID"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name (Optional)</Label>
                  <Input
                    id="name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter user's name"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={startOnboarding}>Start Onboarding Sequence</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add link to CRON_SECRET generator */}
      <div className="mt-8 border-t pt-4">
        <p className="text-sm text-gray-500 mb-2">Admin Tools:</p>
        <Link href="/admin/generate-cron-secret" className="text-sm text-blue-600 hover:underline">
          Generate CRON_SECRET for email automation
        </Link>
      </div>
    </div>
  )
}
