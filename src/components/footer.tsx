
import { Smartphone, Mail, Phone, MapPin, Shield, Zap, Users } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">E-wallet</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Secure and convenient digital wallet services for everyone. 
              Your trusted partner for all financial transactions.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Zap className="h-3 w-3" />
                <span>Fast</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>Trusted</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <div className="space-y-2">
              <a href="/" className="block text-muted-foreground hover:text-primary transition-colors duration-200 text-sm">
                Home
              </a>
              <a href="/dashboard" className="block text-muted-foreground hover:text-primary transition-colors duration-200 text-sm">
                Dashboard
              </a>
              <a href="/transactions" className="block text-muted-foreground hover:text-primary transition-colors duration-200 text-sm">
                Transactions
              </a>
              <a href="/profile" className="block text-muted-foreground hover:text-primary transition-colors duration-200 text-sm">
                Profile
              </a>
              <a href="/about" className="block text-muted-foreground hover:text-primary transition-colors duration-200 text-sm">
                About
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Services</h3>
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">Send Money</p>
              <p className="text-muted-foreground text-sm">Add Money</p>
              <p className="text-muted-foreground text-sm">Cash Out</p>
              <p className="text-muted-foreground text-sm">Bill Payments</p>
              <p className="text-muted-foreground text-sm">Mobile Banking</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <div className="p-1.5 bg-primary/10 rounded-md">
                  <Phone className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm">+880 1234 567890</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <div className="p-1.5 bg-primary/10 rounded-md">
                  <Mail className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm">support@ewallet.com</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <div className="p-1.5 bg-primary/10 rounded-md">
                  <MapPin className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm">Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-muted-foreground text-sm">
                &copy; 2024 E-wallet. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a href="/privacy" className="hover:text-primary transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-primary transition-colors duration-200">
                Terms of Service
              </a>
              <a href="/security" className="hover:text-primary transition-colors duration-200">
                Security
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
