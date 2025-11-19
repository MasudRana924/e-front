import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Icon } from "@iconify/react"
import { SkeletonCard, SkeletonTestimonial } from "../components/skeleton-loader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"

function Home() {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-background to-muted py-20 px-4 transition-all duration-700 animate-in fade-in-0 slide-in-from-bottom-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 animate-in fade-in-0 slide-in-from-bottom-6 duration-700 delay-200">
              Your Digital Wallet,
              <span className="text-accent block">Simplified</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-in fade-in-0 slide-in-from-bottom-6 duration-700 delay-300">
              Experience secure, fast, and convenient digital wallet services. Send money, pay bills, and manage your
              finances with ease from your mobile device.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in-0 slide-in-from-bottom-6 duration-700 delay-500">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 hover:text-accent-foreground transition-all duration-200 hover:scale-105"
              >
                Get Started Today
                <Icon icon="solar:arrow-right-linear" className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="transition-all duration-200 hover:scale-105 bg-transparent"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Why Choose E-wallet?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We provide cutting-edge digital wallet solutions designed for the modern world.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {isLoading
                ? [...Array(3)].map((_, index) => <SkeletonCard key={index} />)
                : [
                    {
                      icon: "solar:shield-check-bold",
                      title: "Bank-Level Security",
                      desc: "Your transactions are protected with advanced encryption and multi-factor authentication.",
                    },
                    {
                      icon: "solar:bolt-bold",
                      title: "Lightning Fast",
                      desc: "Complete transactions in seconds with our optimized mobile platform.",
                    },
                    {
                      icon: "solar:smartphone-2-bold",
                      title: "Mobile First",
                      desc: "Designed specifically for mobile devices with an intuitive user experience.",
                    },
                  ].map((feature, index) => (
                    <Card
                      key={index}
                      className="text-center transition-all duration-300 hover:shadow-lg hover:scale-105 animate-in fade-in-0 slide-in-from-bottom-4"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardHeader>
                        <Icon icon={feature.icon} className="h-12 w-12 text-accent mx-auto mb-4" />
                        <CardTitle>{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{feature.desc}</CardDescription>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className="bg-muted py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Services</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need for your digital transactions in one secure wallet.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Money Transfer", desc: "Send money instantly to anyone, anywhere" },
                { title: "Bill Payments", desc: "Pay all your bills with just a few taps" },
                { title: "Mobile Banking", desc: "Complete banking services on your phone" },
                { title: "Account Management", desc: "Manage multiple accounts seamlessly" },
              ].map((service, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in fade-in-0 slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{service.desc}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">What Our Users Say</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {isLoading
                ? [...Array(3)].map((_, index) => <SkeletonTestimonial key={index} />)
                : [
                    {
                      name: "Sarah Johnson",
                      role: "Small Business Owner",
                      text: "E-wallet has revolutionized how I handle my business transactions. Fast, secure, and reliable.",
                    },
                    {
                      name: "Michael Chen",
                      role: "Freelancer",
                      text: "The mobile app is incredibly user-friendly. I can manage all my finances on the go.",
                    },
                    {
                      name: "Emily Davis",
                      role: "Student",
                      text: "Perfect for sending money to family and paying bills. The security features give me peace of mind.",
                    },
                  ].map((testimonial, index) => (
                    <Card
                      key={index}
                      className="transition-all duration-300 hover:shadow-lg hover:scale-105 animate-in fade-in-0 slide-in-from-bottom-4"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardHeader>
                        <div className="flex items-center space-x-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Icon key={i} icon="solar:star-bold" className="h-4 w-4 fill-accent text-accent" />
                          ))}
                        </div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <CardDescription>{testimonial.role}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">"{testimonial.text}"</p>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-accent py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-accent-foreground mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-accent-foreground/90 mb-8">
              Join thousands of users who trust E-wallet for their financial needs.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-background text-primary hover:bg-background/90 transition-all duration-200 hover:scale-105"
            >
              Create Your Account
              <Icon icon="solar:arrow-right-linear" className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </div>

    
   
    
  )
}

export default Home
