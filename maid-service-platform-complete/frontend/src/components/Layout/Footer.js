import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-2xl">🧹</div>
              <span className="text-xl font-bold">CleanConnect</span>
            </div>
            <p className="text-gray-300 text-sm">
              Connecting customers with professional cleaning service providers for a cleaner, happier home.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>House Cleaning</li>
              <li>Deep Cleaning</li>
              <li>Office Cleaning</li>
              <li>Move-in/Move-out</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>About Us</li>
              <li>Contact</li>
              <li>Careers</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>📞 (555) 123-4567</li>
              <li>📧 support@cleanconnect.com</li>
              <li>📍 123 Clean St, City, ST 12345</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 CleanConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;