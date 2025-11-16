import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Switch } from "../components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion"
import { Check, X, Star, Shield, Zap, Users, ArrowRight } from "lucide-react"

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: "Basic",
      description: "Perfect for personal use and getting started",
      monthlyPrice: 0,
      annualPrice: 0,
      popular: false,
      features: [
        { name: "Send & receive money", included: true },
        { name: "Basic transaction history", included: true },
        { name: "Mobile app access", included: true },
        { name: "Email support", included: true },
        { name: "2 free ATM withdrawals/month", included: true },
        { name: "Standard transfer limits", included: true },
        { name: "Basic security features", included: true },
        { name: "Priority support", included: false },
        { name: "Advanced analytics", included: false },
        { name: "Multiple accounts", included: false },
        { name: "Business features", included: false },
        { name: "API access", included: false },
      ],
      cta: "Get Started Free",
      highlight: false,
    },
    {
      name: "Premium",
      description: "Enhanced features for power users",
      monthlyPrice: 9.99,
      annualPrice: 99.99,
      popular: true,
      features: [
        { name: "Everything in Basic", included: true },
        { name: "Unlimited ATM withdrawals", included: true },
        { name: "Priority 24/7 support", included: true },
        { name: "Advanced spending analytics", included: true },
        { name: "Higher transfer limits", included: true },
        { name: "Multiple savings goals", included: true },
        { name: "Investment tracking", included: true },
        { name: "Premium security features", included: true },
        { name: "Multiple accounts", included: true },
        { name: "Export transaction data", included: true },
        { name: "Business features", included: false },
        { name: "API access", included: false },
      ],
      cta: "Start Premium Trial",
      highlight: true,
    },
    {
      name: "Business",
      description: "Complete solution for businesses and teams",
      monthlyPrice: 29.99,
      annualPrice: 299.99,
      popular: false,
      features: [
        { name: "Everything in Premium", included: true },
        { name: "Team management", included: true },
        { name: "Business analytics", included: true },
        { name: "Bulk payments", included: true },
        { name: "Invoice management", included: true },
        { name: "API access", included: true },
        { name: "Custom integrations", included: true },
        { name: "Dedicated account manager", included: true },
        { name: "Advanced reporting", included: true },
        { name: "Multi-user permissions", included: true },
        { name: "White-label options", included: true },
        { name: "SLA guarantee", included: true },
      ],
      cta: "Contact Sales",
      highlight: false,
    },
  ]

  const transactionFees = [
    { type: "E-wallet to E-wallet", basic: "Free", premium: "Free", business: "Free" },
    { type: "Bank transfer (domestic)", basic: "$0.50", premium: "Free", business: "Free" },
    { type: "International transfer", basic: "1.5% + $2", premium: "1.0% + $1", business: "0.5%" },
    { type: "ATM withdrawal", basic: "$2.50 (2 free/month)", premium: "Free", business: "Free" },
    { type: "Currency exchange", basic: "1.5% markup", premium: "1.0% markup", business: "0.5% markup" },
  ]

  const pricingFAQ = [
    {
      question: "Can I change my plan anytime?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated amount immediately. When downgrading, the change takes effect at your next billing cycle.",
    },
    {
      question: "Is there a free trial for Premium and Business plans?",
      answer:
        "Yes! We offer a 30-day free trial for Premium plans and a 14-day free trial for Business plans. No credit card required to start your trial.",
    },
    {
      question: "What happens if I exceed my plan limits?",
      answer:
        "If you exceed your plan limits, we'll notify you and offer to upgrade your plan. For occasional overages, we may apply small fees, but we'll always ask for your permission first.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team for a full refund within 30 days of your purchase.",
    },
  ]

  const getPrice = (plan: (typeof plans)[0]) => {
    if (plan.monthlyPrice === 0) return "Free"
    const price = isAnnual ? plan.annualPrice : plan.monthlyPrice
    const period = isAnnual ? "year" : "month"
    return `$${price}/${period}`
  }

  const getSavings = (plan: (typeof plans)[0]) => {
    if (plan.monthlyPrice === 0) return null
    const monthlyCost = plan.monthlyPrice * 12
    const savings = monthlyCost - plan.annualPrice
    return Math.round((savings / monthlyCost) * 100)
  }

  return (
    <>

      
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-background to-muted py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              Transparent Pricing
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
              Choose Your
              <span className="text-accent block">Perfect Plan</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start free and upgrade as you grow. All plans include our core features with no hidden fees or surprises.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`text-sm ${!isAnnual ? "text-primary font-medium" : "text-muted-foreground"}`}>
                Monthly
              </span>
              <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
              <span className={`text-sm ${isAnnual ? "text-primary font-medium" : "text-muted-foreground"}`}>
                Annual
              </span>
              <Badge variant="secondary" className="ml-2">
                Save up to 17%
              </Badge>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <Card
                  key={index}
                  className={`relative transition-all duration-300 hover:scale-105 ${
                    plan.highlight ? "ring-2 ring-accent shadow-xl" : "hover:shadow-lg"
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                    <div className="mt-4">
                      <div className="text-4xl font-bold text-primary">{getPrice(plan)}</div>
                      {isAnnual && getSavings(plan) && (
                        <Badge variant="secondary" className="mt-2">
                          Save {getSavings(plan)}%
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          )}
                          <span className={`text-sm ${feature.included ? "text-foreground" : "text-muted-foreground"}`}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Button
                      className={`w-full ${
                        plan.highlight
                          ? "bg-accent hover:bg-accent/90"
                          : "bg-primary hover:bg-primary/90 text-primary-foreground"
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Transaction Fees */}
        <section className="bg-muted py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Transaction Fees</h2>
              <p className="text-xl text-muted-foreground">Transparent pricing for all your financial transactions</p>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-semibold">Transaction Type</th>
                        <th className="text-center p-4 font-semibold">Basic</th>
                        <th className="text-center p-4 font-semibold">Premium</th>
                        <th className="text-center p-4 font-semibold">Business</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionFees.map((fee, index) => (
                        <tr key={index} className="border-b last:border-b-0">
                          <td className="p-4 font-medium">{fee.type}</td>
                          <td className="p-4 text-center">{fee.basic}</td>
                          <td className="p-4 text-center">{fee.premium}</td>
                          <td className="p-4 text-center">{fee.business}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Why Choose E-wallet?</h2>
              <p className="text-xl text-muted-foreground">
                Built for individuals, optimized for businesses, trusted by thousands
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
                  <CardTitle>Bank-Level Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Your money is protected by the same security standards used by major banks, with insurance up to
                    $250,000.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Zap className="h-12 w-12 text-accent mx-auto mb-4" />
                  <CardTitle>Lightning Fast</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Send money instantly to anyone, anywhere. Most transactions complete in under 3 seconds.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Users className="h-12 w-12 text-accent mx-auto mb-4" />
                  <CardTitle>24/7 Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Our customer support team is available around the clock to help you with any questions or issues.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing FAQ */}
        <section className="bg-muted py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Pricing Questions</h2>
              <p className="text-xl text-muted-foreground">Common questions about our pricing and plans</p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {pricingFAQ.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg px-6 bg-background">
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
        </section>

        {/* CTA Section */}
        <section className="bg-accent py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Star className="h-16 w-16 text-accent-foreground mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-accent-foreground mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-accent-foreground/90 mb-8">
              Join thousands of users who trust E-wallet for their financial needs. Start with our free plan and upgrade
              when you're ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-background text-primary hover:bg-background/90">
                Start Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent bg-transparent"
              >
                Contact Sales
              </Button>
            </div>
            <p className="text-sm text-accent-foreground/70 mt-4">
              30-day money-back guarantee • No setup fees • Cancel anytime
            </p>
          </div>
        </section>
   
    </>
  )
}
