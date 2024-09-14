'use client'

import * as React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-200 py-12">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">About</h3>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:underline">Contact Us</Link></li>
            <li><Link href="#" className="hover:underline">About Us</Link></li>
            <li><Link href="#" className="hover:underline">Careers</Link></li>
            <li><Link href="#" className="hover:underline">Flipkart Stories</Link></li>
            <li><Link href="#" className="hover:underline">Press</Link></li>
            <li><Link href="#" className="hover:underline">Flipkart Wholesale</Link></li>
            <li><Link href="#" className="hover:underline">Corporate Information</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Help</h3>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:underline">Payments</Link></li>
            <li><Link href="#" className="hover:underline">Shipping</Link></li>
            <li><Link href="#" className="hover:underline">Cancellation & Returns</Link></li>
            <li><Link href="#" className="hover:underline">FAQ</Link></li>
            <li><Link href="#" className="hover:underline">Report Infringement</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Policy</h3>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:underline">Return Policy</Link></li>
            <li><Link href="#" className="hover:underline">Terms Of Use</Link></li>
            <li><Link href="#" className="hover:underline">Security</Link></li>
            <li><Link href="#" className="hover:underline">Privacy</Link></li>
            <li><Link href="#" className="hover:underline">Sitemap</Link></li>
            <li><Link href="#" className="hover:underline">EPR Compliance</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Social</h3>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:underline">Facebook</Link></li>
            <li><Link href="#" className="hover:underline">Twitter</Link></li>
            <li><Link href="#" className="hover:underline">YouTube</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto mt-12 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Flipkart Clone. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
