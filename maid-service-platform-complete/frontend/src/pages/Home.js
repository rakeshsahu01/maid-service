import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Professional Maid Services at Your Doorstep
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Book trusted, verified cleaning professionals for your home or office
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  to={user.role === 'customer' ? '/customer/book-service' : '/maid/dashboard'}
                  className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors text-lg"
                >
                  {user.role === 'customer' ? 'Book a Service' : 'View Requests'}
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors text-lg"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-3 px-8 rounded-lg transition-colors text-lg"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CleanConnect?
            </h2>
            <p className="text-xl text-gray-600">
              We make finding and booking cleaning services simple and reliable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-3">Verified Professionals</h3>
              <p className="text-gray-600">
                All our cleaning professionals are background-checked and verified for your peace of mind.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-3">Easy Booking</h3>
              <p className="text-gray-600">
                Book your cleaning service in just a few clicks. Choose your preferred time and date.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-3">Secure Payments</h3>
              <p className="text-gray-600">
                Safe and secure payment processing with multiple payment options available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'House Cleaning', price: '$80', duration: '2 hours', icon: '🏠' },
              { name: 'Deep Cleaning', price: '$150', duration: '4 hours', icon: '🧽' },
              { name: 'Office Cleaning', price: '$100', duration: '3 hours', icon: '🏢' },
              { name: 'Move-in/out', price: '$200', duration: '5 hours', icon: '📦' }
            ].map((service, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="text-3xl mb-3">{service.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-2">{service.price}</p>
                  <p className="text-gray-600 text-sm">{service.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of satisfied customers who trust CleanConnect
          </p>
          {!user && (
            <Link
              to="/register"
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors text-lg inline-block"
            >
              Sign Up Today
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;