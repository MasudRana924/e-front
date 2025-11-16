"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion"
import { Icon } from "@iconify/react"

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const faqCategories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: "solar:settings-bold",
      color: "bg-blue-500",
      questions: [
        {
          question: "How do I create an E-wallet account?",
          answer:
            "Creating an E-wallet account is simple. Click 'Get Started' on our homepage, provide your email, phone number, and create a secure password. You'll need to verify your email and phone number to activate your account. The entire process takes less than 5 minutes.",
        },
        {
          question: "What documents do I need for account verification?",
          answer:
            "For account verification, you'll need a government-issued photo ID (driver's license, passport, or national ID card) and proof of address (utility bill, bank statement, or lease agreement) dated within the last 3 months. Our verification process is secure and typically completed within 24 hours.",
        },
        {
          question: "Is there a minimum age requirement?",
          answer:
            "Yes, you must be at least 18 years old to create an E-wallet account. For users under 18, we offer supervised accounts that can be managed by a parent or guardian with full oversight and spending controls.",
        },
        {
          question: "Can I have multiple E-wallet accounts?",
          answer:
            "Each person can have one primary E-wallet account per email address and phone number. However, you can create multiple sub-accounts within your main account for different purposes like savings, business, or family expenses.",
        },
      ],
    },
    {
      id: "security",
      title: "Security & Privacy",
      icon: "solar:shield-check-bold",
      color: "bg-green-500",
      questions: [
        {
          question: "How secure is my money in E-wallet?",
          answer:
            "Your funds are protected by bank-level security measures including 256-bit SSL encryption, multi-factor authentication, and biometric login options. We're regulated by financial authorities and your funds are insured up to $250,000 through our banking partners.",
        },
        {
          question: "What should I do if I suspect unauthorized access?",
          answer:
            "If you suspect unauthorized access, immediately change your password, enable two-factor authentication, and contact our security team at security@e-wallet.com or call our 24/7 hotline. We'll freeze your account temporarily while investigating and reverse any unauthorized transactions.",
        },
        {
          question: "How do you protect my personal information?",
          answer:
            "We use advanced encryption to protect your personal data and never share your information with third parties without your consent. Our privacy policy complies with GDPR and other international privacy standards. You can control your data sharing preferences in your account settings.",
        },
        {
          question: "Can I use biometric authentication?",
          answer:
            "Yes! E-wallet supports fingerprint and face recognition on compatible devices. Biometric authentication adds an extra layer of security and makes accessing your account faster and more convenient. You can enable this feature in your security settings.",
        },
      ],
    },
    {
      id: "transactions",
      title: "Transactions & Transfers",
      icon: "solar:card-bold",
      color: "bg-purple-500",
      questions: [
        {
          question: "How long do transfers take?",
          answer:
            "Transfers between E-wallet users are instant and available 24/7. Bank transfers typically take 1-3 business days, while international transfers can take 3-5 business days depending on the destination country and local banking systems.",
        },
        {
          question: "What are the transfer limits?",
          answer:
            "Daily transfer limits vary by account verification level. Verified accounts can send up to $10,000 per day domestically and $5,000 internationally. Unverified accounts have a $500 daily limit. You can request higher limits by contacting our support team.",
        },
        {
          question: "Can I cancel a transaction?",
          answer:
            "Transactions between E-wallet users cannot be cancelled once sent, as they're processed instantly. Bank transfers can be cancelled within 30 minutes of initiation. International transfers can be cancelled within 1 hour, subject to a cancellation fee.",
        },
        {
          question: "How do I track my transaction history?",
          answer:
            "All your transactions are available in your dashboard under 'Transaction History'. You can filter by date, amount, type, and recipient. You can also download monthly statements and export your transaction data for accounting purposes.",
        },
      ],
    },
    {
      id: "fees",
      title: "Fees & Pricing",
      icon: "solar:card-bold",
      color: "bg-orange-500",
      questions: [
        {
          question: "What fees does E-wallet charge?",
          answer:
            "E-wallet transfers are free between users. We charge $0.50 for domestic bank transfers, 1.5% for international transfers (minimum $2), and $1 for ATM withdrawals. There are no monthly maintenance fees or account setup costs.",
        },
        {
          question: "Are there any hidden fees?",
          answer:
            "No, we believe in transparent pricing. All fees are clearly displayed before you confirm any transaction. You'll see the exact amount you'll pay and what the recipient will receive before completing any transfer or payment.",
        },
        {
          question: "Do you offer premium accounts?",
          answer:
            "Yes, our Premium account ($9.99/month) includes unlimited free ATM withdrawals, priority customer support, higher transfer limits, advanced analytics, and exclusive features. The first month is free for new users.",
        },
        {
          question: "How do currency exchange rates work?",
          answer:
            "We use real-time market rates with a small markup (typically 0.5-1.5%) for currency conversions. Exchange rates are locked in when you initiate the transaction, so you know exactly how much you're paying and the recipient will receive.",
        },
      ],
    },
    {
      id: "support",
      title: "Support & Troubleshooting",
      icon: "solar:question-circle-bold",
      color: "bg-red-500",
      questions: [
        {
          question: "How can I contact customer support?",
          answer:
            "Our customer support is available 24/7 through live chat in the app, email at support@e-wallet.com, or phone at 1-800-E-WALLET. Premium users get priority support with faster response times and dedicated account managers.",
        },
        {
          question: "What if I forgot my password?",
          answer:
            "Click 'Forgot Password' on the login page and enter your email address. We'll send you a secure reset link. For additional security, you may need to verify your identity through SMS or email before creating a new password.",
        },
        {
          question: "My transaction is showing as pending. What should I do?",
          answer:
            "Pending transactions usually resolve within a few hours. This can happen due to network delays, bank processing times, or additional security checks. If a transaction remains pending for more than 24 hours, contact our support team for assistance.",
        },
        {
          question: "How do I close my E-wallet account?",
          answer:
            "You can close your account anytime through your account settings or by contacting support. Make sure to withdraw all funds first, as closed accounts cannot be reactivated. We'll provide a final statement and confirmation of account closure.",
        },
      ],
    },
  ]

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  return (
    <>
   

     
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-background to-muted py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              Help Center
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
              Frequently Asked
              <span className="text-accent block">Questions</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Find answers to common questions about E-wallet. Can't find what you're looking for? Our support team is
              here to help 24/7.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Icon icon="solar:magnifer-bold" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            {searchQuery === "" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {faqCategories.map((category) => (
                  <Card
                    key={category.id}
                    className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                    onClick={() => {
                      const element = document.getElementById(category.id)
                      element?.scrollIntoView({ behavior: "smooth" })
                    }}
                  >
                    <CardHeader className="text-center">
                      <div className={`p-3 rounded-full ${category.color} w-fit mx-auto mb-4`}>
                        <Icon icon={category.icon} className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <CardDescription>{category.questions.length} questions</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}

            {/* FAQ Sections */}
            <div className="space-y-12">
              {filteredCategories.map((category) => (
                <div key={category.id} id={category.id}>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className={`p-2 rounded-full ${category.color}`}>
                      <category.icon className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary">{category.title}</h2>
                  </div>

                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((faq, index) => (
                      <AccordionItem key={index} value={`${category.id}-${index}`} className="border rounded-lg px-6">
                        <AccordionTrigger className="text-left hover:no-underline py-6">
                          <span className="font-medium">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>

            {filteredCategories.length === 0 && searchQuery !== "" && (
              <div className="text-center py-12">
                <Icon icon="solar:question-circle-bold" className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any questions matching "{searchQuery}". Try different keywords or contact our support
                  team.
                </p>
                <Button onClick={() => setSearchQuery("")} variant="outline">
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Contact Support */}
        <section className="bg-muted py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">Still Need Help?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Our support team is available 24/7 to assist you with any questions or concerns.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <Icon icon="solar:chat-round-call-bold" className="h-12 w-12 text-accent mx-auto mb-4" />
                  <CardTitle>Live Chat</CardTitle>
                  <CardDescription>Get instant help from our support team</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-accent hover:bg-accent/90">Start Chat</Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Icon icon="solar:letter-bold" className="h-12 w-12 text-accent mx-auto mb-4" />
                  <CardTitle>Email Support</CardTitle>
                  <CardDescription>Send us a detailed message</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    Send Email
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Icon icon="solar:phone-calling-bold" className="h-12 w-12 text-accent mx-auto mb-4" />
                  <CardTitle>Phone Support</CardTitle>
                  <CardDescription>Call us for immediate assistance</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    1-800-E-WALLET
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      

  
    </>
  )
}
