// Email templates for various transactional emails

export function getPurchaseConfirmationTemplate({
  customerName,
  documentName,
  documentType,
  purchaseId,
  downloadLink,
  expiryDate,
}: {
  customerName: string
  documentName: string
  documentType: string
  purchaseId: string
  downloadLink: string
  expiryDate: string
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Purchase Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #14b8a6;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 5px 5px;
        }
        .button {
          display: inline-block;
          background-color: #14b8a6;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Thank You for Your Purchase!</h1>
      </div>
      <div class="content">
        <p>Hello ${customerName},</p>
        
        <p>Thank you for purchasing <strong>${documentName}</strong>. Your ${documentType} is now ready for download.</p>
        
        <p><strong>Purchase Details:</strong></p>
        <ul>
          <li>Document: ${documentName}</li>
          <li>Purchase ID: ${purchaseId}</li>
          <li>Download available until: ${expiryDate}</li>
        </ul>
        
        <p>You can download your document using the link below:</p>
        
        <p style="text-align: center;">
          <a href="${downloadLink}" class="button">Download Your Document</a>
        </p>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        
        <p>Best regards,<br>The Paperwise Team</p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Paperwise. All rights reserved.</p>
        <p>This email was sent to confirm your recent purchase.</p>
      </div>
    </body>
    </html>
  `
}

// Onboarding Email Templates
export const onboardingEmailTemplates = {
  welcome: (userName: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Paperwise</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #14b8a6;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 5px 5px;
        }
        .button {
          display: inline-block;
          background-color: #14b8a6;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Welcome to Paperwise!</h1>
      </div>
      <div class="content">
        <p>Hello ${userName},</p>
        
        <p>Welcome to Paperwise! We're excited to have you join our community of small business owners, entrepreneurs, and professionals who trust us for their legal document needs.</p>
        
        <p>Here's what you can do with your new account:</p>
        <ul>
          <li>Browse our extensive library of legal templates</li>
          <li>Purchase and download documents instantly</li>
          <li>Access your purchased documents anytime</li>
          <li>Get updates on new templates and resources</li>
        </ul>
        
        <p style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_URL}" class="button">Explore Templates</a>
        </p>
        
        <p>If you have any questions or need assistance, our support team is here to help.</p>
        
        <p>Best regards,<br>The Paperwise Team</p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Paperwise. All rights reserved.</p>
      </div>
    </body>
    </html>
  `,

  featuredTemplates: (userName: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Discover Our Most Popular Templates</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #14b8a6;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 5px 5px;
        }
        .template {
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        .template:last-child {
          border-bottom: none;
        }
        .button {
          display: inline-block;
          background-color: #14b8a6;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Discover Our Most Popular Templates</h1>
      </div>
      <div class="content">
        <p>Hello ${userName},</p>
        
        <p>We wanted to share some of our most popular legal templates that other business owners like you have found valuable:</p>
        
        <div class="template">
          <h3>LLC Operating Agreement</h3>
          <p>Essential for any LLC, this document outlines ownership structure, member responsibilities, and operating procedures.</p>
        </div>
        
        <div class="template">
          <h3>Independent Contractor Agreement</h3>
          <p>Protect your business when working with contractors by clearly defining the scope of work, payment terms, and intellectual property rights.</p>
        </div>
        
        <div class="template">
          <h3>Non-Disclosure Agreement (NDA)</h3>
          <p>Safeguard your confidential information when sharing it with employees, partners, or other businesses.</p>
        </div>
        
        <p style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_URL}" class="button">View All Templates</a>
        </p>
        
        <p>Remember, all our templates are attorney-drafted and regularly updated to comply with current laws.</p>
        
        <p>Best regards,<br>The Paperwise Team</p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Paperwise. All rights reserved.</p>
      </div>
    </body>
    </html>
  `,

  bundleValue: (userName: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Save with Our Document Bundles</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #14b8a6;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 5px 5px;
        }
        .bundle {
          margin-bottom: 20px;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 5px;
        }
        .savings {
          color: #e53e3e;
          font-weight: bold;
        }
        .button {
          display: inline-block;
          background-color: #14b8a6;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Save with Our Document Bundles</h1>
      </div>
      <div class="content">
        <p>Hello ${userName},</p>
        
        <p>Did you know you can save up to 50% by purchasing our document bundles? Get all the legal documents you need for your business at a fraction of the cost:</p>
        
        <div class="bundle">
          <h3>Small Business Bundle (LLC)</h3>
          <p>Everything you need to establish and run your LLC, including Operating Agreement, Employment Agreement, and more.</p>
          <p class="savings">Save 40% compared to buying documents individually!</p>
        </div>
        
        <div class="bundle">
          <h3>Small Business Bundle (Corporation)</h3>
          <p>Essential documents for corporations, including Bylaws, Shareholder Agreement, and Employment Contracts.</p>
          <p class="savings">Save 45% compared to buying documents individually!</p>
        </div>
        
        <div class="bundle">
          <h3>Startup Founder Bundle</h3>
          <p>All the legal documents startup founders need, from formation to funding.</p>
          <p class="savings">Save 50% compared to buying documents individually!</p>
        </div>
        
        <p style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_URL}#templates-bundles" class="button">View All Bundles</a>
        </p>
        
        <p>Our bundles are designed to provide comprehensive legal coverage for your specific business needs.</p>
        
        <p>Best regards,<br>The Paperwise Team</p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Paperwise. All rights reserved.</p>
      </div>
    </body>
    </html>
  `,

  tips: (userName: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Legal Tips for Your Business</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #14b8a6;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 5px 5px;
        }
        .tip {
          margin-bottom: 15px;
          padding-left: 20px;
          border-left: 3px solid #14b8a6;
        }
        .button {
          display: inline-block;
          background-color: #14b8a6;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Legal Tips for Your Business</h1>
      </div>
      <div class="content">
        <p>Hello ${userName},</p>
        
        <p>Running a business comes with many legal considerations. Here are some valuable tips to help protect your business:</p>
        
        <div class="tip">
          <h3>Always Use Written Contracts</h3>
          <p>Verbal agreements can lead to misunderstandings and disputes. Always document your business relationships with proper contracts.</p>
        </div>
        
        <div class="tip">
          <h3>Protect Your Intellectual Property</h3>
          <p>Register trademarks for your business name and logo, and use NDAs when sharing sensitive information.</p>
        </div>
        
        <div class="tip">
          <h3>Keep Business and Personal Finances Separate</h3>
          <p>Maintain separate bank accounts and credit cards for your business to preserve your liability protection.</p>
        </div>
        
        <div class="tip">
          <h3>Review and Update Your Legal Documents Regularly</h3>
          <p>As your business grows and laws change, make sure your legal documents stay current.</p>
        </div>
        
        <p style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_URL}/blog" class="button">Read More Tips on Our Blog</a>
        </p>
        
        <p>We're here to help you navigate the legal aspects of your business with confidence.</p>
        
        <p>Best regards,<br>The Paperwise Team</p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Paperwise. All rights reserved.</p>
      </div>
    </body>
    </html>
  `,

  feedback: (userName: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>How's Your Experience with Paperwise?</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #14b8a6;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 5px 5px;
        }
        .button {
          display: inline-block;
          background-color: #14b8a6;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .rating {
          text-align: center;
          margin: 20px 0;
        }
        .rating a {
          display: inline-block;
          margin: 0 5px;
          text-decoration: none;
          font-size: 24px;
          color: #14b8a6;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>How's Your Experience with Paperwise?</h1>
      </div>
      <div class="content">
        <p>Hello ${userName},</p>
        
        <p>We hope you're finding Paperwise helpful for your legal document needs. We'd love to hear about your experience so far.</p>
        
        <p>How would you rate your experience with Paperwise?</p>
        
        <div class="rating">
          <a href="${process.env.NEXT_PUBLIC_URL}/feedback?rating=1">★</a>
          <a href="${process.env.NEXT_PUBLIC_URL}/feedback?rating=2">★★</a>
          <a href="${process.env.NEXT_PUBLIC_URL}/feedback?rating=3">★★★</a>
          <a href="${process.env.NEXT_PUBLIC_URL}/feedback?rating=4">★★★★</a>
          <a href="${process.env.NEXT_PUBLIC_URL}/feedback?rating=5">★★★★★</a>
        </div>
        
        <p>Your feedback helps us improve our service and better meet your needs. If you have any specific comments or suggestions, please reply to this email.</p>
        
        <p style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_URL}/contact" class="button">Contact Support</a>
        </p>
        
        <p>Thank you for being part of the Paperwise community!</p>
        
        <p>Best regards,<br>The Paperwise Team</p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Paperwise. All rights reserved.</p>
      </div>
    </body>
    </html>
  `,
}
