import { Metadata } from "next"
import {
  Shield,
  Truck,
  Headphones,
  Award,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"

export const metadata: Metadata = {
  title: "About Us - BW Crackers",
  description:
    "Learn about BW Crackers - your premier destination for high-quality firecrackers and fireworks from Sivakasi, India.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="container mx-auto px-4 relative text-center">
          <h1 className="text-5xl md:text-7xl text-white font-bold mb-6 drop-shadow-lg">
            About{" "}
            <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
              BW Crackers
            </span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Your premier destination for high-quality firecrackers and fireworks.
            Bringing joy and light to celebrations for over a decade.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-8">
              Our Story
            </h2>
            <div className="text-gray-600 space-y-4 text-lg leading-relaxed">
              <p>
                Welcome to BW Crackers, your premier destination for
                high-quality firecrackers and fireworks. Based in Sivakasi, the
                fireworks capital of India, we have been bringing joy and light
                to celebrations for over a decade.
              </p>
              <p>
                Our commitment to safety, quality, and customer satisfaction sets
                us apart. All our products are certified and tested to ensure a
                spectacular yet safe experience for your family and loved ones.
              </p>
              <p>
                We source directly from the finest manufacturers in Sivakasi,
                ensuring that every product meets the highest standards of
                quality while offering the best prices in the market with our
                signature 80% discount on MRP.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-12">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Safety First",
                desc: "All products are certified and rigorously tested for maximum safety.",
                color: "text-green-500",
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                desc: "Quick and secure delivery across India with careful handling.",
                color: "text-blue-500",
              },
              {
                icon: Headphones,
                title: "24/7 Support",
                desc: "Round the clock customer service to help you with your orders.",
                color: "text-purple-500",
              },
              {
                icon: Award,
                title: "Premium Quality",
                desc: "Top-notch products sourced directly from Sivakasi manufacturers.",
                color: "text-orange-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-12">
            Get In Touch
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-orange-50 border border-orange-100">
              <MapPin className="h-8 w-8 text-orange-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Address</h3>
              <p className="text-gray-600 text-sm">
                Sivakasi, Tamil Nadu, India
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-orange-50 border border-orange-100">
              <Phone className="h-8 w-8 text-orange-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Phone</h3>
              <p className="text-gray-600 text-sm">+91 98765 43210</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-orange-50 border border-orange-100">
              <Mail className="h-8 w-8 text-orange-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Email</h3>
              <p className="text-gray-600 text-sm">info@bwcrackers.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
