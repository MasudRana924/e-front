
import { ContactForm } from "../components/contact-form"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Icon } from "@iconify/react"

export default function ContactPage() {
  const contactInfo = [
    {
      icon: "solar:phone-bold",
      title: "Phone Support",
      details: "+1 (555) 123-4567",
      description: "Available 24/7 for urgent matters",
    },
    {
      icon: "solar:letter-bold",
      title: "Email Support",
      details: "support@e-wallet.com", // Updated email domain to match E-wallet branding
      description: "We'll respond within 24 hours",
    },
    {
      icon: "solar:map-point-bold",
      title: "Office Location",
      details: "123 Financial Street, Suite 100",
      description: "New York, NY 10001",
    },
    {
      icon: "solar:clock-circle-bold",
      title: "Business Hours",
      details: "Monday - Friday: 9AM - 6PM EST",
      description: "Weekend support available online",
    },
  ]

  const supportOptions = [
    {
      icon: "solar:chat-round-bold",
      title: "Live Chat",
      description: "Get instant help from our support team",
      action: "Start Chat",
    },
    {
      icon: "solar:phone-calling-bold",
      title: "Phone Support",
      description: "Speak directly with a support specialist",
      action: "Call Now",
    },
    {
      icon: "solar:letter-bold",
      title: "Email Support",
      description: "Send us a detailed message about your issue",
      action: "Send Email",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
     

    
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-background to-muted py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
              Get In
              <span className="text-accent block">Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Have questions about our services? Need help with your account? We're here to help you every step of the
              way.
            </p>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ContactForm />
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-6">Contact Information</h2>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="p-3 bg-accent/10 rounded-lg">
                          <Icon icon={info.icon} className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-primary">{info.title}</h3>
                          <p className="text-foreground font-medium">{info.details}</p>
                          <p className="text-muted-foreground text-sm">{info.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map Placeholder */}
                <Card>
                  <CardHeader>
                    <CardTitle>Our Location</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Icon icon="solar:map-point-bold" className="h-12 w-12 text-accent mx-auto mb-2" />
                        <p className="text-muted-foreground">Interactive map would be embedded here</p>
                        <p className="text-sm text-muted-foreground">123 Financial Street, New York, NY 10001</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Support Options */}
        <section className="bg-muted py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Need Immediate Help?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose the support option that works best for you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {supportOptions.map((option, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Icon icon={option.icon} className="h-12 w-12 text-accent mx-auto mb-4" />
                    <CardTitle className="text-xl">{option.title}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-accent hover:bg-accent/90">{option.action}</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-muted-foreground">
                Find quick answers to common questions about our services.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "How secure are my transactions?",
                  answer:
                    "All transactions are protected with bank-level encryption and multi-factor authentication. We use the latest security protocols to ensure your financial data is safe.",
                },
                {
                  question: "What are your transaction fees?",
                  answer:
                    "We offer transparent pricing with no hidden fees. Basic transfers are free, and premium services have competitive rates clearly displayed in our app.",
                },
                {
                  question: "How long do transfers take?",
                  answer:
                    "Most transfers are completed instantly. International transfers may take 1-3 business days depending on the destination country and local banking systems.",
                },
                {
                  question: "Is customer support available 24/7?",
                  answer:
                    "Yes, our customer support team is available 24/7 through live chat and phone support for urgent matters. Email support is available with responses within 24 hours.",
                },
              ].map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
     

     
    </div>
  )
}
