import React from 'react';
import { Users, Target, Award, Globe } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About BlueRakeAgriTech Ghana</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Revolutionizing agricultural financing through innovative risk assessment technology
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center mb-6">
                <Target className="w-8 h-8 text-green-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                To empower Ghanaian farmers with cutting-edge risk assessment tools that enable access to fair and affordable agricultural financing, fostering sustainable farming practices and economic growth in rural communities.
              </p>
            </div>
            <div>
              <div className="flex items-center mb-6">
                <Globe className="w-8 h-8 text-green-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-800">Our Vision</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                To become the leading platform for agricultural risk assessment in West Africa, bridging the gap between farmers and financial institutions while promoting food security and agricultural innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Project BlueRake Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Project BlueRake Agritech Ghana</h2>
            <p className="text-lg text-gray-600 mb-8">
              BlueRakeAgriTech Ghana is a flagship sub-project of Project BlueRake Agritech Ghana, a comprehensive agricultural technology initiative aimed at modernizing Ghana's agricultural sector through innovative solutions and sustainable practices.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Innovation</h3>
                <p className="text-gray-600">Leveraging cutting-edge technology to solve agricultural challenges</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Community</h3>
                <p className="text-gray-600">Building strong partnerships with farmers and local communities</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Impact</h3>
                <p className="text-gray-600">Creating measurable positive change in agricultural productivity</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <img
                src="https://i.imgur.com/KlSUzza.jpeg"
                alt="Mailitafi Adbullahi Mailitafi"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-green-200"
              />
              <h3 className="text-xl font-semibold mb-2">Mailitafi Adbullahi Mailitafi</h3>
              <p className="text-green-600 font-medium mb-3">Agricultural Finance Expert</p>
              <p className="text-gray-600 text-sm">
                Leading agricultural economist with 15+ years experience in rural finance and risk assessment
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <img
                src="https://i.imgur.com/SAGXDVT.jpeg"
                alt="Ishmeal Amoah"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-green-200"
              />
              <h3 className="text-xl font-semibold mb-2">Ishmeal Amoah</h3>
              <p className="text-green-600 font-medium mb-3">Risk Assessment Specialist</p>
              <p className="text-gray-600 text-sm">
                Data scientist specializing in agricultural risk modeling and machine learning applications
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <img
                src="https://i.imgur.com/Qix442a.jpeg"
                alt="Abdul Manarf"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-green-200"
              />
              <h3 className="text-xl font-semibold mb-2">Abdul Manarf</h3>
              <p className="text-green-600 font-medium mb-3">Technology Lead</p>
              <p className="text-gray-600 text-sm">
                Software engineer with expertise in fintech and agricultural technology solutions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Transparency</h3>
              <p className="text-gray-600">Clear, honest communication in all our dealings</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">I</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-gray-600">Continuously improving through technology and creativity</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Empowerment</h3>
              <p className="text-gray-600">Enabling farmers to achieve their full potential</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Sustainability</h3>
              <p className="text-gray-600">Promoting long-term environmental and economic health</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
