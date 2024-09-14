import { useRouter } from 'next/navigation';
import React, { useState } from 'react';


const categories = [
  {
    name: "Fashion",
    subcategories: [
      "All",
      "Men's T-Shirts",
      "Men's Casual Shirts",
      "Men's Formal Shirts",
      "Men's Kurtas",
      "Men's Ethnic Sets",
      "Men's Blazers",
      "Men's Raincoat",
      "Men's Windcheaters",
      "Men's Suit",
      "Men's Fabrics",
    ],
  },
  {
    name: "TV and Appliances",
    subcategories: [
      "All",
      "Men's T-Shirts",
      "Men's Casual Shirts",
      "Men's Formal Shirts",
      "Men's Kurtas",
      "Men's Ethnic Sets",
      "Men's Blazers",
      "Men's Raincoat",
      "Men's Windcheaters",
      "Men's Suit",
      "Men's Fabrics",
    ],
  },
  {
    name: "Mobiles and Tablets",
    subcategories: [
      "All",
      "Men's T-Shirts",
      "Men's Casual Shirts",
      "Men's Formal Shirts",
      "Men's Kurtas",
      "Men's Ethnic Sets",
      "Men's Blazers",
      "Men's Raincoat",
      "Men's Windcheaters",
      "Men's Suit",
      "Men's Fabrics",
    ],
  },
  {
    name: "Electronics",
    subcategories: [
      "All",
      "Men's T-Shirts",
      "Men's Casual Shirts",
      "Men's Formal Shirts",
      "Men's Kurtas",
      "Men's Ethnic Sets",
      "Men's Blazers",
      "Men's Raincoat",
      "Men's Windcheaters",
      "Men's Suit",
      "Men's Fabrics",
    ],
  },
  {
    name: "Beauty, Toys & More",
    subcategories: [
      "All",
      "Men's T-Shirts",
      "Men's Casual Shirts",
      "Men's Formal Shirts",
      "Men's Kurtas",
      "Men's Ethnic Sets",
      "Men's Blazers",
      "Men's Raincoat",
      "Men's Windcheaters",
      "Men's Suit",
      "Men's Fabrics",
    ],
  },
  {
    name: "Home and Kitchen",
    subcategories: [
      "All",
      "Men's T-Shirts",
      "Men's Casual Shirts",
      "Men's Formal Shirts",
      "Men's Kurtas",
      "Men's Ethnic Sets",
      "Men's Blazers",
      "Men's Raincoat",
      "Men's Windcheaters",
      "Men's Suit",
      "Men's Fabrics",
    ],
  },
  {
    name: "Furniture",
    subcategories: [
      "All",
      "Men's T-Shirts",
      "Men's Casual Shirts",
      "Men's Formal Shirts",
      "Men's Kurtas",
      "Men's Ethnic Sets",
      "Men's Blazers",
      "Men's Raincoat",
      "Men's Windcheaters",
      "Men's Suit",
      "Men's Fabrics",
    ],
  },
  {
    name: "Travel",
    subcategories: [
      "All",
      "Men's T-Shirts",
      "Men's Casual Shirts",
      "Men's Formal Shirts",
      "Men's Kurtas",
      "Men's Ethnic Sets",
      "Men's Blazers",
      "Men's Raincoat",
      "Men's Windcheaters",
      "Men's Suit",
      "Men's Fabrics",
    ],
  },
  {
    name: "Grocery",
    subcategories: [
      "All",
      "Men's T-Shirts",
      "Men's Casual Shirts",
      "Men's Formal Shirts",
      "Men's Kurtas",
      "Men's Ethnic Sets",
      "Men's Blazers",
      "Men's Raincoat",
      "Men's Windcheaters",
      "Men's Suit",
      "Men's Fabrics",
    ],
  },
];

const Navigation = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const router = useRouter()

  const handleMouseEnter = (index) => {
    setOpenDropdown(index);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  const handleCategoryClick = (category:string)=>{
    router.push(`/products-by-category?category=${encodeURIComponent(category)}`)
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button onClick={()=>handleCategoryClick(category.name)} className=" text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:text-gray-900 focus:outline-none">
                    {category.name}
                  </button>
                  {openDropdown === index && (
                    <div className="absolute left-0 top-10 w-48 bg-white shadow-lg rounded-md z-10" onMouseLeave={handleMouseLeave}>
                      <div className="py-1 ">
                        {/* {category.subcategories.map((subcategory, subIndex) => (
                          <a
                            key={subIndex}
                            href="#"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            {subcategory}
                          </a>
                        ))} */}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {/* Add more top-level menu items here if needed */}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
