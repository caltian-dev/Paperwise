"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Check, FileText, Shield, Star, Zap, Award, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { TemplatePreview } from "@/components/template-preview"
import { NewsletterSignup } from "@/components/newsletter-signup"
// import { SiteHeader } from "@/components/site-header" // Remove this import
// import { BundleShowcase } from "@/components/bundle-showcase"
// import { CustomRequestForm } from "@/components/custom-request-form"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Function to handle hash changes and select the appropriate tab
    const handleHashChange = () => {
      if (window.location.hash === "#templates-bundles") {
        // Find the bundles tab trigger and click it
        const bundlesTab = document.querySelector('[value="bundles"]')
        if (bundlesTab) {
          ;(bundlesTab as HTMLElement).click()
        }
      }
    }

    // Check hash on initial load
    handleHashChange()

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Remove the SiteHeader component from here */}
      <main className="flex-1">
        <section className="py-20 md:py-28">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <div className="mb-2"></div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none font-heading">
                    Legal protection <span className="text-teal-600">without the legal fees</span>
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Attorney-drafted legal templates that save you thousands in legal fees. Fast, simple, and affordable
                    legal documents without the subscription.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white" size="lg" asChild>
                    <Link href="#templates">
                      Browse templates
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="lg">
                        See how it works
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>How Paperwise Works</DialogTitle>
                        <DialogDescription>Get the legal documents you need in 3 simple steps</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-6 py-4">
                        <div className="flex items-start gap-4">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                            1
                          </div>
                          <div className="grid gap-1">
                            <h4 className="font-medium">Choose your template</h4>
                            <p className="text-sm text-gray-500">
                              Browse our library of attorney-drafted templates designed for small businesses.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                            2
                          </div>
                          <div className="grid gap-1">
                            <h4 className="font-medium">Customize with ease</h4>
                            <p className="text-sm text-gray-500">
                              Follow our simple instructions to personalize the template for your specific needs.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                            3
                          </div>
                          <div className="grid gap-1">
                            <h4 className="font-medium">Download and use</h4>
                            <p className="text-sm text-gray-500">
                              Get instant access to your document in Word and PDF formats, ready to use.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <Button className="bg-teal-600 hover:bg-teal-700">Get started now</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-teal-600" />
                    <span>Attorney-drafted</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-teal-600" />
                    <span>One-time purchase</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-teal-600" />
                    <span>Instant download</span>
                  </div>
                </div>
                <div className="mt-6"></div>
              </motion.div>
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] lg:h-[450px] lg:w-[450px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-teal-100 rounded-full opacity-70"></div>

                  {/* Enhanced Document Illustration */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-4/5 h-4/5">
                      {/* Document stack effect - more defined */}
                      <div className="absolute top-6 left-6 w-full h-full bg-teal-200 rounded-lg transform rotate-[-10deg] shadow-md"></div>
                      <div className="absolute top-3 left-3 w-full h-full bg-teal-100 rounded-lg transform rotate-[-5deg] shadow-md"></div>

                      {/* Main document */}
                      <div className="absolute inset-0 bg-white rounded-lg shadow-lg flex flex-col p-6 border border-gray-100">
                        {/* Document header with logo */}
                        <div className="w-full flex items-center mb-6 border-b pb-4">
                          <div className="h-10 w-10 bg-teal-600 rounded-full flex items-center justify-center mr-4">
                            <FileText className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="h-4 bg-teal-600 rounded w-1/2 mb-2"></div>
                            <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                          </div>
                        </div>

                        {/* Document content lines - more defined */}
                        <div className="space-y-3 flex-1">
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>

                        {/* Signature area - more defined */}
                        <div className="mt-6 border-t border-gray-100 pt-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                              <div className="h-4 w-32 bg-teal-50 border border-teal-200 rounded"></div>
                            </div>
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center mr-2">
                                <Check className="h-4 w-4 text-teal-600" />
                              </div>
                              <div className="h-3 bg-teal-600 rounded w-16"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Seal/Stamp effect */}
                      <div className="absolute -bottom-6 -right-6 h-20 w-20 bg-teal-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                        <Shield className="h-10 w-10 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute -right-4 -top-4 rounded-lg bg-white p-4 shadow-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-teal-600" />
                      <span className="text-sm font-medium">Attorney-Approved</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -left-4 rounded-lg bg-white p-4 shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="text-xl font-bold text-teal-600">$3,500</div>
                      <span className="text-sm">Average savings</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-gray-50 py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-heading">
                  Why choose Paperwise?
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our legal templates are designed to save you time, money, and stress.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {[
                {
                  icon: <Shield className="h-6 w-6 text-teal-700" />,
                  title: "Attorney-Drafted",
                  description:
                    "All templates are created by experienced business attorneys with 15+ years of experience to ensure legal compliance and protection.",
                },
                {
                  icon: <Zap className="h-6 w-6 text-teal-700" />,
                  title: "Simple & Fast",
                  description:
                    "Easy to customize templates with clear instructions. Download instantly and use right away, saving you hours of research and writing.",
                },
                {
                  icon: <FileText className="h-6 w-6 text-teal-700" />,
                  title: "No Subscription",
                  description:
                    "One-time purchase for each template. No recurring fees or hidden costs. Pay only for what you need, when you need it.",
                },
                {
                  icon: <Award className="h-6 w-6 text-teal-700" />,
                  title: "Money-Back Guarantee",
                  description:
                    "7-day satisfaction guarantee. If you're not completely satisfied, we'll refund your purchase with no questions asked.",
                },
                {
                  icon: <ArrowRight className="h-6 w-6 text-teal-700" />,
                  title: "Regular Updates",
                  description:
                    "Our templates are regularly reviewed and updated to ensure they remain compliant with changing laws and regulations.",
                },
                {
                  icon: <Mail className="h-6 w-6 text-teal-700" />,
                  title: "Custom Options",
                  description:
                    "Need something specific? We offer customization services to tailor our templates to your unique business requirements and industry needs.",
                },
              ].map((feature, index) => (
                <motion.div key={index} variants={fadeIn}>
                  <Card className="border-0 shadow-md h-full">
                    <CardHeader className="pb-2">
                      <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100">
                        {feature.icon}
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="templates" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700">Templates</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-heading">
                  Legal templates for every need
                </h2>
              </div>
            </motion.div>

            <Tabs defaultValue="business" className="mt-12" id="templates-tabs">
              <div className="flex justify-center">
                <TabsList className="flex flex-wrap">
                  <TabsTrigger
                    value="business"
                    className="data-[state=active]:font-bold data-[state=active]:bg-teal-100 data-[state=active]:text-teal-800"
                  >
                    Business Formation
                  </TabsTrigger>
                  <TabsTrigger
                    value="contracts"
                    className="data-[state=active]:font-bold data-[state=active]:bg-teal-100 data-[state=active]:text-teal-800"
                  >
                    Contracts
                  </TabsTrigger>
                  <TabsTrigger
                    value="employment"
                    className="data-[state=active]:font-bold data-[state=active]:bg-teal-100 data-[state=active]:text-teal-800"
                  >
                    Employment
                  </TabsTrigger>
                  <TabsTrigger
                    value="realestate"
                    className="data-[state=active]:font-bold data-[state=active]:bg-teal-100 data-[state=active]:text-teal-800"
                  >
                    Real Estate
                  </TabsTrigger>
                  <TabsTrigger
                    value="website"
                    className="data-[state=active]:font-bold data-[state=active]:bg-teal-100 data-[state=active]:text-teal-800"
                  >
                    Website Policies
                  </TabsTrigger>
                  <TabsTrigger
                    value="bundles"
                    className="data-[state=active]:font-bold data-[state=active]:bg-teal-100 data-[state=active]:text-teal-800"
                  >
                    Bundles
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="business" className="mt-6">
                <motion.div
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={staggerContainer}
                >
                  {[
                    {
                      name: "LLC Operating Agreement",
                      description:
                        "Comprehensive agreement that outlines the ownership structure and operating procedures for your LLC.",
                      price: 24.99,
                      popular: true,
                    },
                    {
                      name: "LLC Board Resolution",
                      description: "Formal document that records decisions made by an LLC's board or managers.",
                      price: 14.99,
                      popular: false,
                    },
                    {
                      name: "Corporate By-Laws",
                      description:
                        "Essential document that defines how your corporation will be governed and operated.",
                      price: 24.99,
                      popular: false,
                    },
                    {
                      name: "First Board Meeting",
                      description:
                        "Template for documenting the initial meeting of a corporation's board of directors.",
                      price: 19.99,
                      popular: false,
                    },
                    {
                      name: "Meeting Minutes",
                      description:
                        "Template for documenting important discussions and decisions made during corporate meetings.",
                      price: 14.99,
                      popular: false,
                    },
                    {
                      name: "Shareholder Agreement",
                      description:
                        "Defines the relationship between shareholders and protects minority shareholder rights.",
                      price: 29.99,
                      popular: false,
                    },
                    {
                      name: "Partnership Agreement",
                      description:
                        "Legally binding document that outlines the rights and responsibilities of each partner in your business.",
                      price: 29.99,
                      popular: false,
                    },
                    {
                      name: "Business Plan Template Overview",
                      description:
                        "Structured template to help you create a comprehensive business plan for funding or strategic planning.",
                      price: 19.99,
                      popular: false,
                    },
                    {
                      name: "Business LOI",
                      description:
                        "Letter of Intent template for business transactions, acquisitions, or partnerships.",
                      price: 14.99,
                      popular: false,
                    },
                  ].map((templateData, index) => (
                    <motion.div key={templateData.name} variants={fadeIn}>
                      <Card key={templateData.name} className="overflow-hidden h-full">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">{templateData.name}</CardTitle>
                            {templateData.popular && (
                              <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">Popular</Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-500">{templateData.description}</p>
                          <div className="mt-4 flex items-center gap-2">
                            <Shield className="h-4 w-4 text-teal-600" />
                            <span className="text-xs text-gray-500">Attorney-drafted</span>
                          </div>
                        </CardContent>
                        <CardFooter className="flex items-center justify-between border-t bg-gray-50 px-6 py-3">
                          <div>
                            <p className="text-sm font-semibold">
                              {templateData.name === "Business Plan Template Overview"
                                ? "Free"
                                : `$${templateData.price}`}
                            </p>
                            <p className="text-xs text-gray-500">One-time purchase</p>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                                Preview
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[700px]">
                              <TemplatePreview template={templateData.name} price={templateData.price} />
                            </DialogContent>
                          </Dialog>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
              <TabsContent value="contracts" className="mt-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      name: "Master Services Agreement",
                      description:
                        "Comprehensive framework agreement that governs the overall relationship between service provider and client.",
                      price: 29.99,
                      popular: true,
                    },
                    {
                      name: "Independent Contractor Agreement (ABC)",
                      description:
                        "Compliant with ABC test requirements for properly classifying independent contractors in applicable states.",
                      price: 24.99,
                      popular: false,
                    },
                    {
                      name: "Independent Contractor Agreement (Non-ABC)",
                      description:
                        "Standard independent contractor agreement for states without ABC test requirements.",
                      price: 19.99,
                      popular: false,
                    },
                    {
                      name: "Non-Disclosure Agreement (NDA)",
                      description:
                        "Protect your confidential information when sharing it with employees, contractors, or potential business partners.",
                      price: 14.99,
                      popular: false,
                    },
                    {
                      name: "Non-Compete Agreement",
                      description:
                        "Legally enforceable agreement to prevent unfair competition from former employees or business partners.",
                      price: 19.99,
                      popular: false,
                    },
                    {
                      name: "Sales Agreement",
                      description:
                        "Formalize your sales process with a clear contract that protects both parties and ensures smooth transactions.",
                      price: 19.99,
                      popular: false,
                    },
                    {
                      name: "Licensing Agreement",
                      description:
                        "Protect your intellectual property while allowing others to use it under specific terms and conditions.",
                      price: 24.99,
                      popular: false,
                    },
                    {
                      name: "Promissory Note",
                      description: "Legally binding document that outlines the terms of a loan between parties.",
                      price: 14.99,
                      popular: false,
                    },
                    {
                      name: "Affiliate Agreement",
                      description:
                        "Establish terms for marketing partnerships where affiliates promote your products or services for a commission.",
                      price: 19.99,
                      popular: false,
                    },
                    {
                      name: "Influencer Agreement",
                      description:
                        "Define the relationship between brands and content creators for marketing campaigns and sponsorships.",
                      price: 24.99,
                      popular: true,
                    },
                    {
                      name: "DMCA Takedown",
                      description:
                        "Protect your intellectual property online with a formal notice to request removal of infringing content.",
                      price: 14.99,
                      popular: false,
                    },
                    {
                      name: "HIPAA Business Associate Agreement (BAA)",
                      description:
                        "Essential agreement for healthcare providers to ensure third-party vendors protect patient information.",
                      price: 24.99,
                      popular: false,
                    },
                    {
                      name: "Client Intake Form",
                      description:
                        "Professional form to collect essential information from new clients and establish the relationship.",
                      price: 9.99,
                      popular: false,
                    },
                    {
                      name: "Waiver of Liability Form",
                      description:
                        "Protect your business from potential legal claims by having participants acknowledge and accept risks.",
                      price: 14.99,
                      popular: false,
                    },
                  ].map((templateData) => (
                    <Card key={templateData.name} className="overflow-hidden h-full">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{templateData.name}</CardTitle>
                          {templateData.popular && (
                            <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">Popular</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">{templateData.description}</p>
                        <div className="mt-4 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-teal-600" />
                          <span className="text-xs text-gray-500">Attorney-drafted</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex items-center justify-between border-t bg-gray-50 px-6 py-3">
                        <div>
                          <p className="text-sm font-semibold">
                            {templateData.name === "Business Plan Template Overview"
                              ? "Free"
                              : `$${templateData.price}`}
                          </p>
                          <p className="text-xs text-gray-500">One-time purchase</p>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[700px]">
                            <TemplatePreview template={templateData.name} price={templateData.price} />
                          </DialogContent>
                        </Dialog>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="employment" className="mt-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      name: "Employee Handbook",
                      description:
                        "Complete template for creating a professional employee handbook that covers policies and procedures.",
                      price: 29.99,
                      popular: true,
                    },
                    {
                      name: "Employee Agreement",
                      description:
                        "Comprehensive agreement that clearly defines the employment relationship, responsibilities, and terms.",
                      price: 24.99,
                      popular: false,
                    },
                    {
                      name: "Employee Review Form",
                      description: "Structured format for conducting and documenting employee performance evaluations.",
                      price: 14.99,
                      popular: false,
                    },
                    {
                      name: "Employee Termination Agreement",
                      description:
                        "Legally compliant template for properly documenting employee termination and separation terms.",
                      price: 19.99,
                      popular: false,
                    },
                    {
                      name: "Job Offer Template",
                      description: "Professional template for extending employment offers to potential new hires.",
                      price: 14.99,
                      popular: false,
                    },
                  ].map((templateData) => (
                    <Card key={templateData.name} className="overflow-hidden h-full">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{templateData.name}</CardTitle>
                          {templateData.popular && (
                            <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">Popular</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">{templateData.description}</p>
                        <div className="mt-4 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-teal-600" />
                          <span className="text-xs text-gray-500">Attorney-drafted</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex items-center justify-between border-t bg-gray-50 px-6 py-3">
                        <div>
                          <p className="text-sm font-semibold">
                            {templateData.name === "Business Plan Template Overview"
                              ? "Free"
                              : `$${templateData.price}`}
                          </p>
                          <p className="text-xs text-gray-500">One-time purchase</p>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[700px]">
                            <TemplatePreview template={templateData.name} price={templateData.price} />
                          </DialogContent>
                        </Dialog>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="realestate" className="mt-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      name: "Real Estate Purchase Agreement",
                      description:
                        "Comprehensive contract for buying or selling real property with all necessary legal protections.",
                      price: 29.99,
                      popular: true,
                    },
                    {
                      name: "Residential Lease",
                      description: "Legally compliant lease agreement for residential rental properties.",
                      price: 24.99,
                      popular: false,
                    },
                    {
                      name: "Short Term Rental",
                      description: "Specialized agreement for vacation rentals or other short-term property rentals.",
                      price: 19.99,
                      popular: false,
                    },
                    {
                      name: "Real Estate LOI",
                      description: "Letter of Intent template for real estate transactions and negotiations.",
                      price: 14.99,
                      popular: false,
                    },
                  ].map((templateData) => (
                    <Card key={templateData.name} className="overflow-hidden h-full">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{templateData.name}</CardTitle>
                          {templateData.popular && (
                            <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">Popular</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">{templateData.description}</p>
                        <div className="mt-4 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-teal-600" />
                          <span className="text-xs text-gray-500">Attorney-drafted</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex items-center justify-between border-t bg-gray-50 px-6 py-3">
                        <div>
                          <p className="text-sm font-semibold">
                            {templateData.name === "Business Plan Template Overview"
                              ? "Free"
                              : `$${templateData.price}`}
                          </p>
                          <p className="text-xs text-gray-500">One-time purchase</p>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[700px]">
                            <TemplatePreview template={templateData.name} price={templateData.price} />
                          </DialogContent>
                        </Dialog>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="website" className="mt-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      name: "Website Privacy Policy (GDPR/CCPA compliant)",
                      description:
                        "Comprehensive policy that explains how your website collects, uses, and protects visitor information, compliant with major privacy regulations.",
                      price: 14.99,
                      popular: true,
                    },
                    {
                      name: "Website Terms and Conditions",
                      description:
                        "Essential agreement between your website and its users that limits liability and sets usage rules.",
                      price: 14.99,
                      popular: false,
                    },
                    {
                      name: "Return and Refund Policy",
                      description:
                        "Clear policy that outlines your business's approach to returns, refunds, and exchanges.",
                      price: 9.99,
                      popular: false,
                    },
                    {
                      name: "Website Terms and Conditions Health and Wellness",
                      description:
                        "Specialized terms of service for health, fitness, and wellness websites with appropriate disclaimers and protections.",
                      price: 19.99,
                      popular: false,
                    },
                    {
                      name: "Website Privacy Policy Health and Wellness (GDPR/CCPA/HIPAA compliant)",
                      description:
                        "Specialized privacy policy for health and wellness businesses that handles sensitive health information appropriately.",
                      price: 19.99,
                      popular: false,
                    },
                  ].map((templateData) => (
                    <Card key={templateData.name} className="overflow-hidden h-full">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{templateData.name}</CardTitle>
                          {templateData.popular && (
                            <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">Popular</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">{templateData.description}</p>
                        <div className="mt-4 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-teal-600" />
                          <span className="text-xs text-gray-500">Attorney-drafted</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex items-center justify-between border-t bg-gray-50 px-6 py-3">
                        <div>
                          <p className="text-sm font-semibold">
                            {templateData.name === "Business Plan Template Overview"
                              ? "Free"
                              : `$${templateData.price}`}
                          </p>
                          <p className="text-xs text-gray-500">One-time purchase</p>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[700px]">
                            <TemplatePreview template={templateData.name} price={templateData.price} />
                          </DialogContent>
                        </Dialog>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent id="templates-bundles" value="bundles" className="mt-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      name: "LLC Bundle",
                      description:
                        "Essential documents for Limited Liability Companies including Operating Agreement and Board Resolution.",
                      price: 34.99,
                      popular: true,
                      items: ["LLC Operating Agreement", "LLC Board Resolution"],
                    },
                    {
                      name: "Corporation Bundle",
                      description: "Complete set of documents for incorporating and managing a corporation.",
                      price: 79.99,
                      popular: false,
                      items: ["First Board Meeting", "Corporate By-Laws", "Meeting Minutes", "Shareholder Agreement"],
                    },
                    {
                      name: "Employment Bundle",
                      description: "Comprehensive set of employment documents for hiring and managing employees.",
                      price: 89.99,
                      popular: false,
                      items: [
                        "Employee Handbook",
                        "Employee Review Form",
                        "Employee Agreement",
                        "Employee Termination Agreement",
                        "Job Offer Template",
                      ],
                    },
                    {
                      name: "Contract Bundle",
                      description: "Essential contracts for business operations and protecting your interests.",
                      price: 99.99,
                      popular: false,
                      items: [
                        "Independent Contractor Agreement (Non-ABC)",
                        "Independent Contractor Agreement (ABC)",
                        "Licensing Agreement",
                        "Non-Disclosure Agreement",
                        "Non-Compete",
                        "Partnership Agreement",
                        "Sales Agreement",
                        "Master Services Agreement",
                      ],
                    },
                    {
                      name: "Real Estate Bundle",
                      description: "Complete set of documents for real estate transactions and property management.",
                      price: 79.99,
                      popular: false,
                      items: [
                        "Promissory Note",
                        "Real Estate Purchase Agreement",
                        "Residential Lease",
                        "Real Estate LOI",
                        "Short Term Rental",
                      ],
                    },
                    {
                      name: "Website Disclaimers",
                      description: "Essential legal documents for your website to protect your business.",
                      price: 29.99,
                      popular: false,
                      items: [
                        "Return and Refund Policy",
                        "Website Terms and Conditions",
                        "Website Privacy Policy (GDPR/CCPA compliant)",
                      ],
                    },
                    {
                      name: "Small Business Bundle (Corporation)",
                      description: "Comprehensive legal package for corporations with all essential documents.",
                      price: 149.99,
                      popular: true,
                      items: [
                        "First Board Meeting",
                        "Corporate By-Laws",
                        "Meeting Minutes",
                        "Shareholder Agreement",
                        "Independent Contractor Agreement (ABC)",
                        "Independent Contractor",
                        "Licensing Agreement",
                        "Non-Disclosure Agreement",
                        "Non-Compete",
                        "Partnership Agreement",
                        "Sales Agreement",
                        "Master Services Agreement",
                      ],
                    },
                    {
                      name: "Small Business Bundle (LLC)",
                      description: "Comprehensive legal package for LLCs with all essential documents.",
                      price: 129.99,
                      popular: false,
                      items: [
                        "LLC Operating Agreement",
                        "LLC Board Resolution",
                        "Independent Contractor Agreement",
                        "Independent Contractor Agreement (ABC)",
                        "Licensing Agreement",
                        "Non-Disclosure Agreement",
                        "Non-Compete",
                        "Partnership Agreement",
                        "Sales Agreement",
                        "Master Services Agreement",
                      ],
                    },
                    {
                      name: "Influencer/Content Creator Bundle",
                      description:
                        "Essential legal documents for influencers, content creators, and e-commerce businesses.",
                      price: 129.99,
                      popular: true,
                      items: [
                        "Affiliate Agreement",
                        "DMCA Takedown",
                        "Independent Contractor Agreement (Non-ABC)",
                        "Independent Contractor Agreement (ABC)",
                        "Influencer Agreement",
                        "Master Services Agreement",
                        "Non-Disclosure Agreement",
                        "Return and Refund Policy",
                        "Sales Agreement",
                        "Website Terms and Conditions",
                        "Website Privacy Policy (GDPR/CCPA compliant)",
                      ],
                    },
                    {
                      name: "Healthcare/Wellness Small Business Bundle",
                      description: "Specialized legal documents for healthcare providers and wellness businesses.",
                      price: 129.99,
                      popular: false,
                      items: [
                        "Client Intake Form",
                        "HIPAA Business Associate Agreement (BAA)",
                        "Independent Contractor Agreement (Non-ABC)",
                        "Independent Contractor Agreement (ABC)",
                        "Master Services Agreement",
                        "Non-Compete",
                        "Return and Refund Policy",
                        "Waiver of Liability Form",
                        "Website Terms and Conditions Health and Wellness",
                        "Website Privacy Policy Health and Wellness (GDPR/CCPA/HIPAA compliant)",
                      ],
                    },
                  ].map((bundle) => (
                    <Card key={bundle.name} className="overflow-hidden h-full">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{bundle.name}</CardTitle>
                          {bundle.popular && (
                            <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">Popular</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 mb-4">{bundle.description}</p>
                        <div className="text-xs text-gray-600 space-y-1">
                          <p className="font-medium">Includes:</p>
                          <ul className="list-disc pl-4 space-y-1">
                            {bundle.items.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-teal-600" />
                          <span className="text-xs text-gray-500">Attorney-drafted</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex items-center justify-between border-t bg-gray-50 px-6 py-3">
                        <div>
                          <p className="text-sm font-semibold">
                            {bundle.name.includes("Business Plan") ? "Free" : `$${bundle.price}`}
                          </p>
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
              </TabsContent>
            </Tabs>
            <div className="mt-12 flex justify-center">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700" asChild>
                <Link href="#templates">
                  View all templates
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="bundles" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700">Bundles</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-heading">
                  Save with our bundle packages
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get multiple templates at a discounted price with our carefully curated bundles.
                </p>
              </div>
            </motion.div>

            <div className="mt-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    name: "LLC Bundle",
                    description:
                      "Essential documents for Limited Liability Companies including Operating Agreement and Board Resolution.",
                    price: 34.99,
                    popular: true,
                    items: ["LLC Operating Agreement", "LLC Board Resolution"],
                  },
                  {
                    name: "Corporation Bundle",
                    description: "Complete set of documents for incorporating and managing a corporation.",
                    price: 79.99,
                    popular: false,
                    items: ["First Board Meeting", "Corporate By-Laws", "Meeting Minutes", "Shareholder Agreement"],
                  },
                  {
                    name: "Employment Bundle",
                    description: "Comprehensive set of employment documents for hiring and managing employees.",
                    price: 89.99,
                    popular: false,
                    items: [
                      "Employee Handbook",
                      "Employee Review Form",
                      "Employee Agreement",
                      "Employee Termination Agreement",
                      "Job Offer Template",
                    ],
                  },
                  {
                    name: "Contract Bundle",
                    description: "Essential contracts for business operations and protecting your interests.",
                    price: 99.99,
                    popular: false,
                    items: [
                      "Independent Contractor Agreement (Non-ABC)",
                      "Independent Contractor Agreement (ABC)",
                      "Licensing Agreement",
                      "Non-Disclosure Agreement",
                      "Non-Compete",
                      "Partnership Agreement",
                      "Sales Agreement",
                      "Master Services Agreement",
                    ],
                  },
                  {
                    name: "Real Estate Bundle",
                    description: "Complete set of documents for real estate transactions and property management.",
                    price: 79.99,
                    popular: false,
                    items: [
                      "Promissory Note",
                      "Real Estate Purchase Agreement",
                      "Residential Lease",
                      "Real Estate LOI",
                      "Short Term Rental",
                    ],
                  },
                  {
                    name: "Website Disclaimers",
                    description: "Essential legal documents for your website to protect your business.",
                    price: 29.99,
                    popular: false,
                    items: [
                      "Return and Refund Policy",
                      "Website Terms and Conditions",
                      "Website Privacy Policy (GDPR/CCPA compliant)",
                    ],
                  },
                  {
                    name: "Small Business Bundle (Corporation)",
                    description: "Comprehensive legal package for corporations with all essential documents.",
                    price: 149.99,
                    popular: true,
                    items: [
                      "First Board Meeting",
                      "Corporate By-Laws",
                      "Meeting Minutes",
                      "Shareholder Agreement",
                      "Independent Contractor Agreement (ABC)",
                      "Independent Contractor",
                      "Licensing Agreement",
                      "Non-Disclosure Agreement",
                      "Non-Compete",
                      "Partnership Agreement",
                      "Sales Agreement",
                      "Master Services Agreement",
                    ],
                  },
                  {
                    name: "Small Business Bundle (LLC)",
                    description: "Comprehensive legal package for LLCs with all essential documents.",
                    price: 129.99,
                    popular: false,
                    items: [
                      "LLC Operating Agreement",
                      "LLC Board Resolution",
                      "Independent Contractor Agreement",
                      "Independent Contractor Agreement (ABC)",
                      "Licensing Agreement",
                      "Non-Disclosure Agreement",
                      "Non-Compete",
                      "Partnership Agreement",
                      "Sales Agreement",
                      "Master Services Agreement",
                    ],
                  },
                  {
                    name: "Influencer/Content Creator Bundle",
                    description:
                      "Essential legal documents for influencers, content creators, and e-commerce businesses.",
                    price: 129.99,
                    popular: true,
                    items: [
                      "Affiliate Agreement",
                      "DMCA Takedown",
                      "Independent Contractor Agreement (Non-ABC)",
                      "Independent Contractor Agreement (ABC)",
                      "Influencer Agreement",
                      "Master Services Agreement",
                      "Non-Disclosure Agreement",
                      "Return and Refund Policy",
                      "Sales Agreement",
                      "Website Terms and Conditions",
                      "Website Privacy Policy (GDPR/CCPA compliant)",
                    ],
                  },
                  {
                    name: "Healthcare/Wellness Small Business Bundle",
                    description: "Specialized legal documents for healthcare providers and wellness businesses.",
                    price: 129.99,
                    popular: false,
                    items: [
                      "Client Intake Form",
                      "HIPAA Business Associate Agreement (BAA)",
                      "Independent Contractor Agreement (Non-ABC)",
                      "Independent Contractor Agreement (ABC)",
                      "Master Services Agreement",
                      "Non-Compete",
                      "Return and Refund Policy",
                      "Waiver of Liability Form",
                      "Website Terms and Conditions Health and Wellness",
                      "Website Privacy Policy Health and Wellness (GDPR/CCPA/HIPAA compliant)",
                    ],
                  },
                ].map((bundle) => (
                  <Card key={bundle.name} className="overflow-hidden h-full">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{bundle.name}</CardTitle>
                        {bundle.popular && (
                          <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">Popular</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 mb-4">{bundle.description}</p>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p className="font-medium">Includes:</p>
                        <ul className="list-disc pl-4 space-y-1">
                          {bundle.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-teal-600" />
                        <span className="text-xs text-gray-500">Attorney-drafted</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t bg-gray-50 px-6 py-3">
                      <div>
                        <p className="text-sm font-semibold">
                          {bundle.name.includes("Business Plan") ? "Free" : `$${bundle.price}`}
                        </p>
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
            </div>

            <div className="mt-8 text-center">
              <Button
                size="lg"
                className="bg-teal-600 hover:bg-teal-700"
                asChild
                onClick={() => {
                  // Find the bundles tab trigger and click it
                  const bundlesTab = document.querySelector('[value="bundles"]')
                  if (bundlesTab) {
                    ;(bundlesTab as HTMLElement).click()
                  }
                }}
              >
                <Link href="#templates-bundles">
                  View all bundles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-gray-50 py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700">Pricing</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-heading">
                  Simple, transparent pricing
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  No subscriptions. No hidden fees. Just pay for what you need.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeIn}>
                <Card className="border-0 shadow-md h-full">
                  <CardHeader>
                    <CardTitle>Individual Templates</CardTitle>
                    <CardDescription>Perfect for specific needs</CardDescription>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-3xl font-bold">$9.99</span>
                      <span className="ml-1 text-sm text-gray-500">- $29.99</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {[
                        "One-time purchase",
                        "Instant download",
                        "Easy customization",
                        "Available in Word",
                        "Attorney-drafted",
                        "7-day money-back guarantee",
                      ].map((feature) => (
                        <li key={feature} className="flex items-center">
                          <Check className="mr-2 h-4 w-4 text-teal-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700" asChild>
                      <Link href="#templates">Browse templates</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
              <motion.div variants={fadeIn}>
                <Card className="border-0 shadow-xl relative h-full">
                  <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-teal-600 px-3 py-1 text-xs font-medium text-white">
                    Most Popular
                  </div>
                  <CardHeader>
                    <CardTitle>Bundle Packages</CardTitle>
                    <CardDescription>Save with our curated bundles</CardDescription>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-3xl font-bold">$29.99</span>
                      <span className="ml-1 text-sm text-gray-500">- $149.99</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {[
                        "Multiple related templates",
                        "Save up to 50% vs. individual purchase",
                        "All Individual Template features",
                        "Consistent formatting across documents",
                        "Complementary legal protection",
                        "Perfect for new businesses",
                      ].map((feature) => (
                        <li key={feature} className="flex items-center">
                          <Check className="mr-2 h-4 w-4 text-teal-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700" asChild>
                      <Link href="#bundles">View bundles</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
              <motion.div variants={fadeIn}>
                <Card className="border-0 shadow-md h-full">
                  <CardHeader>
                    <CardTitle>Custom Legal Solution</CardTitle>
                    <CardDescription>Tailored to your specific needs</CardDescription>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-3xl font-bold">Custom</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {[
                        "Consultation with an attorney",
                        "Customized legal documents",
                        "Industry-specific compliance",
                        "Personalized legal strategy",
                        "Ongoing support available",
                        "Perfect for complex situations",
                      ].map((feature) => (
                        <li key={feature} className="flex items-center">
                          <Check className="mr-2 h-4 w-4 text-teal-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700" asChild>
                      <Link href="mailto:hellopaperwise@gmail.com">Contact us</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="testimonials" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700">Testimonials</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-heading">
                  What our customers say
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of satisfied small business owners who trust Paperwise.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {[
                {
                  quote:
                    "Paperwise saved me over $3,000 in legal fees when starting my e-commerce business. The templates were easy to customize and gave me peace of mind knowing they were attorney-drafted.",
                  author: "Sarah J.",
                  role: "E-commerce Founder",
                  company: "Bloom Boutique",
                  image: "/placeholder.svg?height=50&width=50&text=SJ",
                },
                {
                  quote:
                    "As a freelancer, I needed a solid contract but couldn't afford expensive legal services. Paperwise was the perfect solution - professional, affordable, and easy to use.",
                  author: "Michael T.",
                  role: "Graphic Designer",
                  company: "Creative Spark Design",
                  image: "/placeholder.svg?height=50&width=50&text=MT",
                },
                {
                  quote:
                    "The business starter pack had everything I needed to launch my consulting practice. I was up and running with proper legal protection in less than a day.",
                  author: "Rebecca L.",
                  role: "Marketing Consultant",
                  company: "Bright Path Consulting",
                  image: "/placeholder.svg?height=50&width=50&text=RL",
                },
                {
                  quote:
                    "I was worried about legal compliance for my SaaS startup. The privacy policy and terms of service templates were exactly what I needed and saved me thousands.",
                  author: "David K.",
                  role: "SaaS Founder",
                  company: "CloudFlow",
                  image: "/placeholder.svg?height=50&width=50&text=DK",
                },
                {
                  quote:
                    "The LLC operating agreement template was comprehensive and saved me hours of research. My attorney was impressed with the quality when he reviewed it.",
                  author: "Jennifer P.",
                  role: "Real Estate Investor",
                  company: "Summit Properties",
                  image: "/placeholder.svg?height=50&width=50&text=JP",
                },
                {
                  quote:
                    "As a small business owner, legal documents were intimidating. Paperwise made the process simple and affordable. I recommend it to every entrepreneur I meet.",
                  author: "Robert M.",
                  role: "Restaurant Owner",
                  company: "Harvest Table",
                  image: "/placeholder.svg?height=50&width=50&text=RM",
                },
              ].map((testimonial, index) => (
                <motion.div key={index} variants={fadeIn}>
                  <Card key={index} className="border-0 shadow-md h-full">
                    <CardHeader className="pb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 fill-current text-yellow-400" />
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">"{testimonial.quote}"</p>

                      <div className="mt-4">
                        <p className="text-sm font-semibold">{testimonial.author}</p>
                        <p className="text-xs text-gray-500">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="faq" className="bg-gray-50 py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700">FAQ</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-heading">
                  Frequently asked questions
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Find answers to common questions about our legal templates.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="mx-auto max-w-3xl py-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question: "Are these templates legally binding?",
                    answer:
                      "Our templates are drafted by experienced attorneys and are designed to be legally binding when properly completed and executed according to the instructions provided. Each template includes clear guidance on how to customize and finalize the document for your specific situation. As always we recommend consulting with an attorney for any specific questions.",
                  },
                  {
                    question: "How do I customize the templates?",
                    answer:
                      "Each template comes with clear instructions for customization. You'll receive both PDF and editable Word document formats, allowing you to easily modify the template to fit your specific needs. The templates include highlighted sections that need your attention and detailed notes explaining what information to include.",
                  },
                  {
                    question: "Do I need to hire an attorney to review the documents?",
                    answer:
                      "While our templates are professionally drafted, we recommend consulting with an attorney for complex situations or if you have specific legal concerns. Our templates are designed to provide a solid foundation but cannot replace personalized legal advice for unique or complicated circumstances.",
                  },
                  {
                    question: "What happens after I purchase a template?",
                    answer:
                      "After completing your purchase, you'll receive an immediate email with download links for your templates in fully editable Word format, along with detailed instructions for customization and use. You'll have instant access to your documents and can begin using them right away.",
                  },
                  {
                    question: "Do you offer refunds?",
                    answer:
                      "Yes, we offer a 7-day money-back guarantee. If you're not satisfied with your purchase for any reason, contact our support team within 7 days for a full refund. We stand behind the quality of our templates and want you to be completely satisfied with your purchase.",
                  },
                  {
                    question: "Can I use these templates for multiple businesses?",
                    answer:
                      "Each template purchase is for use with one business entity. If you need templates for multiple businesses, you'll need to purchase separate licenses or contact us about a multi-business package. This ensures that each business has properly customized documents that reflect its specific needs and circumstances.",
                  },
                  {
                    question: "What if I need more help?",
                    answer:
                      "If you need assistance with your documents, you can contact our support team online at hellopaperwise@gmail.com. For more complex legal needs or customized documents tailored to your specific situation, consider our Custom Legal Solutions service, which provides direct access to experienced attorneys who can create bespoke legal documents for your business.",
                  },
                ].map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b">
                    <AccordionTrigger className="text-left font-medium py-4">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-500 pb-4">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <div className="mt-8 flex justify-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Mail className="mr-2 h-4 w-4" />
                      Have another question?
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ask us anything</DialogTitle>
                      <DialogDescription>We'll get back to you as soon as possible.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Your name" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Your email address" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="question">Your question</Label>
                        <textarea
                          id="question"
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="What would you like to know?"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" className="bg-teal-600 hover:bg-teal-700" asChild>
                        <Link href="mailto:hellopaperwise@gmail.com">Send question</Link>
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-12 md:py-16" id="newsletter-section">
          <div className="container px-4 md:px-6">
            <div className="rounded-lg bg-teal-50 p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-2/3">
                  <Badge className="mb-2 bg-teal-100 text-teal-800 hover:bg-teal-200">Free Resource</Badge>
                  <h3 className="text-2xl font-bold mb-2 font-heading">Small Business Legal Checklist</h3>
                  <p className="text-gray-600 mb-4">
                    Download our free legal checklist to ensure your business has all the essential legal documents it
                    needs to operate safely and successfully.
                  </p>
                  <NewsletterSignup />
                </div>
                <div className="md:w-1/3">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center justify-center h-40 bg-gray-100 rounded mb-4">
                      <FileText className="h-16 w-16 text-teal-600" />
                    </div>
                    <div className="text-center">
                      <h4 className="font-medium mb-1">Legal Checklist PDF</h4>
                      <p className="text-sm text-gray-500">12 essential documents for small businesses</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-teal-600 py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center text-white"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-heading">
                  Ready to protect your business?
                </h2>
                <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get started with our attorney-drafted legal templates today.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100" asChild>
                  <Link href="#templates">
                    Browse templates
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-teal-700" asChild>
                  <Link href="mailto:hellopaperwise@gmail.com">Contact us</Link>
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm">
                <Shield className="h-5 w-5" />
                <span>7-day money-back guarantee on all templates</span>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-gray-50">
        <div className="container px-4 py-12 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-teal-600" />
                <span className="text-xl font-bold tracking-tight">Paperwise</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Attorney-drafted legal templates for small business owners, solo entrepreneurs, and freelancers.
              </p>
            </div>
            <div></div>
            <div>
              <h3 className="text-sm font-semibold">Company</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-gray-500 hover:text-teal-600 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-500 hover:text-teal-600 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:hellopaperwise@gmail.com"
                    className="text-gray-500 hover:text-teal-600 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Legal</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="/terms-of-service" className="text-gray-500 hover:text-teal-600 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-gray-500 hover:text-teal-600 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookie-policy" className="text-gray-500 hover:text-teal-600 transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/disclaimer" className="text-gray-500 hover:text-teal-600 transition-colors">
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-xs text-gray-500">© {new Date().getFullYear()} Paperwise. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <Link href="#" className="text-gray-500 hover:text-teal-600 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </Link>
                <Link href="#" className="text-gray-500 hover:text-teal-600 transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </Link>
                <Link href="#" className="text-gray-500 hover:text-teal-600 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-gray-400">
          <Link href="/admin/documents" className="hover:text-teal-600 transition-colors">
            Admin
          </Link>
        </div>
      </footer>
    </div>
  )
}
