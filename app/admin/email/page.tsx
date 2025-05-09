import { EmailSender } from "@/components/email-sender"

export default function EmailAdminPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Email Sender</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <EmailSender />
      </div>
    </div>
  )
}
