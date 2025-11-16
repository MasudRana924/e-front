
import { Shield, Users, Target, Award, Heart, Zap } from "lucide-react"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Security First",
      description:
        "We prioritize the security of your financial data above all else, using cutting-edge encryption and security protocols.",
    },
    {
      icon: Users,
      title: "Customer-Centric",
      description: "Every decision we make is guided by what's best for our customers and their financial well-being.",
    },
    {
      icon: Target,
      title: "Innovation",
      description: "We continuously innovate to provide the most advanced and user-friendly financial services.",
    },
    {
      icon: Heart,
      title: "Trust & Transparency",
      description: "We build lasting relationships through honest communication and transparent business practices.",
    },
  ]

  const team = [
    {
      name: "Sarah Johnson",
      role: "Chief Executive Officer",
      bio: "Former VP at Goldman Sachs with 15+ years in fintech innovation.",
      image: "/professional-woman-ceo.png",
    },
    {
      name: "Michael Chen",
      role: "Chief Technology Officer",
      bio: "Ex-Google engineer specializing in secure payment systems and mobile architecture.",
      image: "/professional-cto-headshot.png",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Security",
      bio: "Cybersecurity expert with extensive experience in financial data protection.",
      image: "/professional-woman-security-expert-headshot.png",
    },
    {
      name: "David Kim",
      role: "Head of Product",
      bio: "Product strategist focused on creating intuitive user experiences in financial services.",
      image: "/professional-product-manager.png",
    },
  ]

  const stats = [
    { number: "500K+", label: "Active Users" },
    { number: "$2B+", label: "Transactions Processed" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Customer Support" },
  ]

  return (
    <>
      

       
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-background to-muted py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
              About
              <span className="text-accent block">MFS</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              We're on a mission to make financial services accessible, secure, and simple for everyone. Founded in
              2020, MFS has grown to serve hundreds of thousands of users worldwide.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-3xl md:text-4xl font-bold text-accent mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-muted py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  At MFS, we believe that everyone deserves access to secure, fast, and affordable financial services.
                  We're breaking down barriers and making it easier for people to manage their money, send payments, and
                  achieve their financial goals.
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  Our platform combines cutting-edge technology with user-friendly design to create an experience that
                  puts our customers first. We're not just a financial service provider – we're your partner in
                  financial success.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Fintech Innovation</Badge>
                  <Badge variant="secondary">Mobile-First</Badge>
                  <Badge variant="secondary">Security-Focused</Badge>
                  <Badge variant="secondary">Customer-Centric</Badge>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/modern-office-fintech-collaboration.png"
                  alt="MFS team working together"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Values</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                These core values guide everything we do and shape how we serve our customers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-accent/10 rounded-lg">
                        <value.icon className="h-8 w-8 text-accent" />
                      </div>
                      <CardTitle className="text-xl">{value.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{value.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-muted py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Meet Our Team</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our experienced leadership team brings together expertise from top financial institutions and tech
                companies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription className="text-accent font-medium">{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Awards Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12">Recognition & Awards</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <Award className="h-16 w-16 text-accent mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">Best Fintech App 2024</h3>
                <p className="text-muted-foreground">Financial Technology Awards</p>
              </div>

              <div className="flex flex-col items-center">
                <Shield className="h-16 w-16 text-accent mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">Security Excellence</h3>
                <p className="text-muted-foreground">Cybersecurity Innovation Awards</p>
              </div>

              <div className="flex flex-col items-center">
                <Zap className="h-16 w-16 text-accent mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">Innovation Leader</h3>
                <p className="text-muted-foreground">Mobile Banking Excellence</p>
              </div>
            </div>
          </div>
        </section>
      

    
    </>
  )
}
