"use client"
import { useState } from "react"
import {
  ChevronUp,
  ChevronDown,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
  Smartphone,
  Monitor,
  ArrowUp,
} from "lucide-react"

const SellerFooter = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const categories = [
    [
      "Sell Mobile Online",
      "Sell Clothes Online",
      "Sell Sarees Online",
      "Sell Electronics Online",
      "Sell Women Clothes Online",
    ],
    [
      "Sell Shoes Online",
      "Sell Jewellery Online",
      "Sell Tshirts Online",
      "Sell Furniture Online",
      "Sell Makeup Online",
    ],
    [
      "Sell Paintings Online",
      "Sell Watch Online",
      "Sell Books Online",
      "Sell Home Products Online",
      "Sell Kurtis Online",
    ],
    [
      "Sell Beauty Products Online",
      "Sell Toys Online",
      "Sell Appliances Online",
      "Sell Shirts Online",
      "Sell Indian Clothes Online",
    ],
  ]

  const footerSections = [
    {
      title: "Sell Online",
      links: ["Create Account", "List Products", "Storage & Shipping", "Fees & Commission", "Help & Support"],
    },
    {
      title: "Grow Your Business",
      links: ["Insights & Tools", "Mykart Ads", "Mykart Value Services", "Shopping Festivals"],
    },
    {
      title: "Learn More",
      links: ["FAQs", "Seller Success Stories", "Seller Blogs"],
    },
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Popular Categories Section */}
      <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Popular Categories to Sell Across India
            </h2>
            <p className="text-gray-400 text-sm lg:text-base">Start selling in these trending categories</p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {categories.map((column, columnIndex) => (
              <div key={columnIndex} className="space-y-3">
                {column.map((category, index) => (
                  <div key={index} className="group">
                    <a
                      href="#"
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm lg:text-base block py-1 hover:translate-x-1 transform transition-transform"
                    >
                      {category}
                    </a>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Mobile Accordion */}
          <div className="md:hidden space-y-4">
            {categories.map((column, columnIndex) => (
              <div key={columnIndex} className="border border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(`category-${columnIndex}`)}
                  className="w-full px-4 py-3 bg-gray-800 flex items-center justify-between text-left hover:bg-gray-700 transition-colors"
                >
                  <span className="font-medium">Category Group {columnIndex + 1}</span>
                  {expandedSection === `category-${columnIndex}` ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
                {expandedSection === `category-${columnIndex}` && (
                  <div className="px-4 py-3 space-y-2 bg-gray-800/50">
                    {column.map((category, index) => (
                      <a
                        key={index}
                        href="#"
                        className="block text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm py-1"
                      >
                        {category}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6 text-blue-400">{section.title}</h3>
              <ul className="space-y-2 lg:space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm lg:text-base hover:translate-x-1 transform transition-transform block"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* App Download & Social Media */}
          <div>
            <h3 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6 text-blue-400">Download Mobile App</h3>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 mb-6 lg:mb-8">
              <div className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 transition-colors px-4 py-2 rounded-lg cursor-pointer group">
                <Smartphone className="h-6 w-6 text-blue-400 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-xs text-gray-400">Get it on</p>
                  <p className="text-sm font-medium">Google Play</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 transition-colors px-4 py-2 rounded-lg cursor-pointer group">
                <Monitor className="h-6 w-6 text-blue-400 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-xs text-gray-400">Download on</p>
                  <p className="text-sm font-medium">App Store</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg lg:text-xl font-semibold mb-4 text-blue-400">Stay Connected</h3>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Youtube, label: "YouTube" },
                { icon: Twitter, label: "Twitter" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5 text-gray-300 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Accordion */}
        <div className="md:hidden space-y-4">
          {footerSections.map((section, index) => (
            <div key={index} className="border border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full px-4 py-3 bg-gray-800 flex items-center justify-between text-left hover:bg-gray-700 transition-colors"
              >
                <span className="font-medium text-blue-400">{section.title}</span>
                {expandedSection === section.title ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
              {expandedSection === section.title && (
                <div className="px-4 py-3 space-y-2 bg-gray-800/50">
                  {section.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href="#"
                      className="block text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm py-1"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Mobile App & Social */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection("mobile-social")}
              className="w-full px-4 py-3 bg-gray-800 flex items-center justify-between text-left hover:bg-gray-700 transition-colors"
            >
              <span className="font-medium text-blue-400">App & Social</span>
              {expandedSection === "mobile-social" ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            {expandedSection === "mobile-social" && (
              <div className="px-4 py-3 bg-gray-800/50">
                <h4 className="font-medium mb-3 text-blue-400">Download App</h4>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 bg-gray-700 px-3 py-2 rounded-lg">
                    <Smartphone className="h-5 w-5 text-blue-400" />
                    <span className="text-sm">Google Play Store</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-700 px-3 py-2 rounded-lg">
                    <Monitor className="h-5 w-5 text-blue-400" />
                    <span className="text-sm">Apple App Store</span>
                  </div>
                </div>

                <h4 className="font-medium mb-3 text-blue-400">Follow Us</h4>
                <div className="flex space-x-3">
                  {[
                    { icon: Facebook, label: "Facebook" },
                    { icon: Instagram, label: "Instagram" },
                    { icon: Linkedin, label: "LinkedIn" },
                    { icon: Youtube, label: "YouTube" },
                    { icon: Twitter, label: "Twitter" },
                  ].map(({ icon: Icon, label }) => (
                    <a
                      key={label}
                      href="#"
                      className="w-8 h-8 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                      aria-label={label}
                    >
                      <Icon className="h-4 w-4 text-gray-300" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="text-gray-400 text-sm">© 2024 Mykart. All rights reserved.</p>
              <p className="text-gray-500 text-xs mt-1">Empowering sellers across India</p>
            </div>

            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <ArrowUp className="h-4 w-4" />
              <span className="text-sm font-medium">Go to Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default SellerFooter
