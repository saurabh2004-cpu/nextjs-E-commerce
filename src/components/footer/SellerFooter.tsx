import React from 'react';

const SellerFooter = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-2xl mb-6">Popular categories to sell across India</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 text-center text-sm">
          <div>
            <p>Sell Mobile Online</p>
            <p>Sell Clothes Online</p>
            <p>Sell Sarees Online</p>
            <p>Sell Electronics Online</p>
            <p>Sell Women Clothes Online</p>
          </div>
          <div>
            <p>Sell Shoes Online</p>
            <p>Sell Jewellery Online</p>
            <p>Sell Tshirts Online</p>
            <p>Sell Furniture Online</p>
            <p>Sell Makeup Online</p>
          </div>
          <div>
            <p>Sell Paintings Online</p>
            <p>Sell Watch Online</p>
            <p>Sell Books Online</p>
            <p>Sell Home Products Online</p>
            <p>Sell Kurtis Online</p>
          </div>
          <div>
            <p>Sell Beauty Products Online</p>
            <p>Sell Toys Online</p>
            <p>Sell Appliances Online</p>
            <p>Sell Shirts Online</p>
            <p>Sell Indian Clothes Online</p>
          </div>
        </div>
        <hr className="border-gray-700 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 text-sm">
          <div>
            <h3 className="text-lg mb-4">Sell Online</h3>
            <p>Create Account</p>
            <p>List Products</p>
            <p>Storage & Shipping</p>
            <p>Fees & Commission</p>
            <p>Help & Support</p>
          </div>
          <div>
            <h3 className="text-lg mb-4">Grow Your Business</h3>
            <p>Insights & Tools</p>
            <p>Flipkart Ads</p>
            <p>Flipkart Value Services</p>
            <p>Shopping Festivals</p>
          </div>
          <div>
            <h3 className="text-lg mb-4">Learn More</h3>
            <p>FAQs</p>
            <p>Seller Success Stories</p>
            <p>Seller Blogs</p>
          </div>
          <div>
            <h3 className="text-lg mb-4">Download Mobile App</h3>
            <div className="flex justify-center space-x-4 mb-4">
              <img src="https://via.placeholder.com/150x50" alt="Google Play" className="h-10" />
              <img src="https://via.placeholder.com/150x50" alt="App Store" className="h-10" />
            </div>
            <h3 className="text-lg mb-4">Stay Connected</h3>
            <div className="flex justify-center space-x-4">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <button className="bg-gray-700 text-white py-2 px-4 rounded">Go to Top</button>
        </div>
      </div>
    </footer>
  );
};

export default SellerFooter;
