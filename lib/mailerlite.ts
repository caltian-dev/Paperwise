// MailerLite API configuration
const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY
const MAILERLITE_GROUP_ID = process.env.MAILERLITE_GROUP_ID

// Function to add a subscriber to MailerLite
export async function addSubscriberToMailerLite(email: string) {
  if (!MAILERLITE_API_KEY || !MAILERLITE_GROUP_ID) {
    console.error("MailerLite configuration missing")
    return {
      success: false,
      error: "MailerLite configuration missing",
    }
  }

  try {
    // First, check if the subscriber already exists
    const checkResponse = await fetch(`https://api.mailerlite.com/api/v2/subscribers/${email}`, {
      method: "GET",
      headers: {
        "X-MailerLite-ApiKey": MAILERLITE_API_KEY,
        "Content-Type": "application/json",
      },
    })

    const subscriberExists = checkResponse.ok

    // Add or update the subscriber
    const response = await fetch("https://api.mailerlite.com/api/v2/subscribers", {
      method: "POST",
      headers: {
        "X-MailerLite-ApiKey": MAILERLITE_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        resubscribe: true,
        autoresponders: true,
        type: "active", // Directly subscribe without confirmation
        fields: {
          signup_source: "website",
        },
        groups: [MAILERLITE_GROUP_ID], // Add to the specified group
      }),
    })

    const data = await response.json()

    if (response.ok) {
      return {
        success: true,
        data,
        already_subscribed: subscriberExists,
      }
    } else {
      return { success: false, error: data }
    }
  } catch (error) {
    console.error("Error adding subscriber to MailerLite:", error)
    return { success: false, error: "Failed to subscribe" }
  }
}

// Function to send a transactional email using MailerLite
export async function sendTransactionalEmail({
  to,
  subject,
  html,
  templateId,
  variables = {},
}: {
  to: string
  subject?: string
  html?: string
  templateId?: string
  variables?: Record<string, any>
}) {
  if (!MAILERLITE_API_KEY) {
    console.error("MailerLite configuration missing")
    return {
      success: false,
      error: "MailerLite configuration missing",
    }
  }

  try {
    let endpoint = "https://api.mailerlite.com/api/v2/campaigns"
    let payload: any = {
      type: "regular",
      subject: subject || "Message from Paperwise",
      from: "info@paperwise.com", // Update with your sending email
      from_name: "Paperwise",
    }

    if (templateId) {
      // Use a template
      endpoint = `https://api.mailerlite.com/api/v2/campaigns/${templateId}/actions/send`
      payload = {
        ...payload,
        emails: [to],
        variables: variables,
      }
    } else {
      // Send custom HTML
      payload = {
        ...payload,
        html: html,
        emails: [to],
      }
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "X-MailerLite-ApiKey": MAILERLITE_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (response.ok) {
      return { success: true, data }
    } else {
      return { success: false, error: data }
    }
  } catch (error) {
    console.error("Error sending transactional email with MailerLite:", error)
    return { success: false, error: "Failed to send email" }
  }
}
