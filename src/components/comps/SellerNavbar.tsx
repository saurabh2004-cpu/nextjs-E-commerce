'use client';
import React, { useState } from 'react';

interface SellerNavBarProps{
 display:string 
}

const SellerNavBar:React.FC<SellerNavBarProps> = ({ display }) => {
  const [showDropdown, setShowDropdown] = useState(null);

  const handleMouseEnter = (index: any) => {
    setShowDropdown(index);
  };

  const handleMouseLeave = () => {
    setShowDropdown(null);
  };

  const menuItems = [
    {
      title: 'Sell Online',
      items: [
        { name: 'Sell Product', endpoint: '/sellProduct' },
        { name: 'Account', endpoint: '/sellerProfile' },
        { name: 'List Products', endpoint: '/sellerProductsList' },
        // { name: 'Analytics', endpoint: '/sellerAnalytics' },
      ],
    },
    {
      title: 'Fees and Commission',
      items: [
        { name: 'Payment Cycle', endpoint: '/payment-cycle' },
        { name: 'Fee Type', endpoint: '/fee-type' },
        { name: 'Calculate Gross Margin', endpoint: '/calculate-gross-margin' },
      ],
    },
    {
      title: 'Grow',
      items: [
        { name: 'FAssured badge', endpoint: '/fassured-badge' },
        { name: 'Insights & Tools', endpoint: '/insights-tools' },
        { name: 'Flipkart Ads', endpoint: '/flipkart-ads' },
        { name: 'Flipkart Value Services', endpoint: '/flipkart-value-services' },
        { name: 'Shopping Festivals', endpoint: '/shopping-festivals' },
        { name: 'Service Partners', endpoint: '/service-partners' },
      ],
    },
    {
      title: 'Learn',
      items: [
        { name: 'FAQs', endpoint: '/faqs' },
        { name: 'Seller Success Stories', endpoint: '/seller-success-stories' },
        { name: 'Seller Blogs', endpoint: '/seller-blogs' },
      ],
    },
  ];

  return (
    <nav className="  bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
          <div className="flex items-center space-x-2">
          <a href="/">
          <span className="font-bold text-blue-600">Flipkart</span>
          <span className="text-xs text-gray-500">
            Explore <span className="text-yellow-500">Plus</span>
          </span>
          </a>
        </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {menuItems.map((menuItem, index) => (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className="text-gray-500 hover:text-blue-700 focus:outline-none focus:text-gray-700"
                  >
                    {menuItem.title}
                  </button>
                  {showDropdown === index && (
                    <div className="  absolute mt-2 w-48 rounded-md shadow-lg">
                      <div className="  rounded-md bg-white shadow-xs">
                        <div
                          className="py-1"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          {menuItem.items.map((item, idx) => (
                            <a
                              key={idx}
                              href={item.endpoint}
                              className="  block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              {item.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <a href="#" className="text-gray-500 hover:text-gray-700">
                Shopsy
              </a>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              className={`${display} ml-4 bg-yellow-500 text-white px-3 py-2 rounded-md text-sm font-medium`}
            >
              <a href="/sellProduct">
                <p>Start Selling</p>
              </a>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SellerNavBar;
