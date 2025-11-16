
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import {
  ArrowRight,
  Shield,
  Smartphone,
  Zap,
  CreditCard,
  Users,
  Globe,
  Lock,
  Clock,
  TrendingUp,
  Bell,
  Fingerprint,
  QrCode,
  Receipt,
  PiggyBank,
  BarChart3,
} from "lucide-react"

export default function FeaturesPage() {
  const featureCategories = [
    {
      title: "Security & Privacy",
      description: "Bank-grade security to protect your financial data",
      features: [
        {
          icon: Shield,
          title: "Advanced Encryption",
          description: "256-bit SSL encryption protects all your transactions and personal data.",
          badge: "Enterprise Grade",
        },
        {
          icon: Fingerprint,
          title: "Biometric Authentication",
          description: "Use fingerprint or face recognition for secure and convenient access.",
          badge: "Secure",
        },
        {
          icon: Lock,
          title: "Multi-Factor Authentication",
          description: "Additional security layers with SMS, email, and app-based verification.",
          badge: "Protected",
        },
      ],
    },
    {
      title: "Payment & Transfers",
      description: "Fast and convenient ways to move your money",
      features: [
        {
          icon: Zap,
          title: "Instant Transfers",
          description: "Send money to anyone instantly, 24/7, even on weekends and holidays.",
          badge: "Real-time",
        },
        {
          icon: QrCode,
          title: "QR Code Payments",
          description: "Pay merchants by simply scanning QR codes - no cash or cards needed.",
          badge: "Contactless",
        },
        {
          icon: Globe,
          title: "International Transfers",
          description: "Send money globally with competitive exchange rates and low fees.",
          badge: "Global",
        },
      ],
    },
    {
      title: "Smart Features",
      description: "Intelligent tools to manage your finances better",
      features: [
        {
          icon: BarChart3,
          title: "Spending Analytics",
          description: "Track your spending patterns with detailed insights and categorization.",
          badge: "AI-Powered",
        },
        {
          icon: PiggyBank,
          title: "Smart Savings",
          description: "Automated savings goals and round-up features to help you save effortlessly.",
          badge: "Automated",
        },
        {
          icon: Bell,
          title: "Smart Notifications",
          description: "Get intelligent alerts for transactions, bills, and spending limits.",
          badge: "Intelligent",
        },
      ],
    },
    {
      title: "Convenience",
      description: "Features designed to make your life easier",
      features: [
        {
          icon: Receipt,
          title: "Bill Management",
          description: "Pay all your bills in one place with automatic scheduling and reminders.",
          badge: "Automated",
        },
        {
          icon: CreditCard,
          title: "Virtual Cards",
          description: "Generate virtual debit cards for online shopping and subscriptions.",
          badge: "Digital",
        },
        {
          icon: Users,
          title: "Group Payments",
          description: "Split bills and expenses with friends and family effortlessly.",
          badge: "Social",
        },
      ],
    },
  ]

  const stats = [
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "< 3s", label: "Average Transaction Time" },
    { number: "256-bit", label: "SSL Encryption" },
    { number: "24/7", label: "Customer Support" },
  ]

  return (
    <> 
      
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-background to-muted py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              All Features
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
              Everything You Need in
              <span className="text-accent block">One Digital Wallet</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Discover all the powerful features that make E-wallet the most comprehensive digital financial solution.
              From advanced security to smart savings, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90">
                Start Using Features
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                View Pricing
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-accent">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="text-accent-foreground">
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-accent-foreground/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Categories */}
        {featureCategories.map((category, categoryIndex) => (
          <section key={categoryIndex} className={`py-20 px-4 ${categoryIndex % 2 === 1 ? "bg-muted" : ""}`}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{category.title}</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {category.features.map((feature, index) => (
                  <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <CardHeader>
                      <div className="relative">
                        <feature.icon className="h-16 w-16 text-accent mx-auto mb-4" />
                        <Badge variant="outline" className="absolute -top-2 -right-2">
                          {feature.badge}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Additional Features Grid */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">More Features</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Additional capabilities that make E-wallet stand out from the competition.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Clock,
                  title: "Transaction History",
                  description: "Complete transaction history with search and filter options.",
                },
                {
                  icon: TrendingUp,
                  title: "Investment Tracking",
                  description: "Monitor your investments and portfolio performance.",
                },
                {
                  icon: Smartphone,
                  title: "Mobile Optimized",
                  description: "Fully responsive design optimized for all mobile devices.",
                },
                {
                  icon: Users,
                  title: "Family Accounts",
                  description: "Manage family finances with shared accounts and controls.",
                },
                {
                  icon: Globe,
                  title: "Multi-Currency",
                  description: "Support for multiple currencies with real-time exchange rates.",
                },
                {
                  icon: Shield,
                  title: "Fraud Protection",
                  description: "Advanced AI-powered fraud detection and prevention.",
                },
              ].map((feature, index) => (
                <Card key={index} className="hover:shadow-md transition-all duration-300">
                  <CardHeader className="pb-3">
                    <feature.icon className="h-8 w-8 text-accent mb-2" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Experience All Features?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Join thousands of users who are already enjoying the full power of E-wallet's comprehensive feature set.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-background text-primary hover:bg-background/90">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
     
    </>
  )
}
