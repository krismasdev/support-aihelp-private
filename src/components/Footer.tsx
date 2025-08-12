import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1">
            <h3 className="text-2xl font-bold mb-4">YouMatter.ai</h3>
            <p className="text-gray-400 text-sm">
              Real support for what you're going through—from a smart, caring system that adapts to you.
            </p>
          </div>

          {/* Links */}
          <div className="col-span-1 md:col-span-2">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="#privacy" 
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#terms" 
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      Terms and Conditions
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Support</h4>
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="#contact" 
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#help" 
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      Help Center
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 YouMatter.ai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;