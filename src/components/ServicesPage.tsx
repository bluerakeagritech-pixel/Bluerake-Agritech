import React from 'react';
import { Calculator, FileText, Wallet, BarChart3, Shield, Users, Smartphone, Globe } from 'lucide-react';

const ServicesPage = () => {
  const services = [
    {
      icon: Calculator,
      title: 'Risk Assessment',
      description: 'Comprehensive farm risk evaluation using advanced algorithms and local data',
      features: ['Weather risk analysis', 'Soil health assessment', 'Crop yield prediction', 'Financial risk scoring']
    },
    {
      icon: FileText,
      title: 'Financial Records Management',
      description: 'Digital platform for tracking farm income, expenses, and financial health',
      features: ['Income tracking', 'Expense management', 'Profit analysis', 'Financial reporting']
    },
    {
      icon: Wallet,
      title: 'Loan Application Support',
      description: 'Streamlined loan application process with partner financial institutions',
      features: ['Application assistance', 'Document preparation', 'Bank partnerships', 'Loan matching']
    },
    {
      icon: BarChart3,
      title: 'Yield Estimation',
      description: 'Satellite-based crop monitoring and yield prediction services',
      features: ['Satellite imagery', 'NDVI analysis', 'Growth monitoring', 'Harvest forecasting']
    },
    {
      icon: Shield,
      title: 'Insurance Guidance',
      description: 'Connect farmers with appropriate agricultural insurance products',
      features: ['Insurance matching', 'Risk coverage', 'Claims support', 'Premium optimization']
    },
    {
      icon: Users,
      title: 'Cooperative Support',
      description: 'Tools and resources for farmer cooperatives and group lending',
      features: ['Group management', 'Collective bargaining', 'Bulk purchasing', 'Shared resources']
    }
  ];

  const features = [
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Accessible on any device, optimized for mobile use in rural areas'
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Available in English, Twi, Ewe, Hausa, and Dagbani'
    },
    {
      icon: Shield,
      title: 'Data Security',
      description: 'Bank-level security to protect farmer data and financial information'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Comprehensive agricultural finance solutions designed for Ghanaian farmers
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What We Offer</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides end-to-end support for farmers seeking agricultural financing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <Icon className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Platform Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built with farmers in mind, our platform is accessible, secure, and easy to use
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-8 text-center shadow-md">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Banking Partners */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Banking Partners</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We work with leading financial institutions to provide farmers with access to credit
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['GCB Bank', 'Agricultural Development Bank', 'Ecobank Ghana', 'Fidelity Bank'].map((bank, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">{bank.charAt(0)}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{bank}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of farmers who are already using AgroRisk Ghana to access better financing
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Create Account
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;