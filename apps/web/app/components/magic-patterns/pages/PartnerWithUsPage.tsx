import React from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
export const PartnerWithUsPage = () => {
  const navigate = useNavigate();
  return <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Partner With Us
          </h1>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Join the Fibonacco ecosystem and grow your business with our network
            of entertainment and community platforms.
          </p>
        </div>
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="prose max-w-none">
              <h2>Why Partner With Fibonacco?</h2>
              <p>
                When's The Fun is part of the Fibonacco ecosystem - a collection
                of interconnected platforms designed to enhance community
                experiences, entertainment discovery, and local business growth.
                By partnering with us, you gain access to our entire network.
              </p>
              <h3>Benefits of Partnership</h3>
              <ul>
                <li>
                  <strong>Expanded Reach</strong> - Access to our diverse
                  audience across multiple platforms
                </li>
                <li>
                  <strong>Cross-Promotion</strong> - Opportunities for
                  visibility across the Fibonacco ecosystem
                </li>
                <li>
                  <strong>Data Insights</strong> - Actionable analytics about
                  your audience and performance
                </li>
                <li>
                  <strong>Technical Integration</strong> - Seamless API
                  connections to our platforms
                </li>
                <li>
                  <strong>Co-Marketing</strong> - Joint marketing initiatives
                  with our team
                </li>
              </ul>
              <h3>Partnership Types</h3>
              <h4>Content Partnerships</h4>
              <p>
                Create and share content across our platforms. Ideal for media
                companies, publishers, and content creators looking to expand
                their audience.
              </p>
              <h4>Technology Partnerships</h4>
              <p>
                Integrate your technology with our ecosystem. Perfect for
                software companies, ticketing platforms, and other tech
                solutions that enhance the entertainment experience.
              </p>
              <h4>Venue & Promoter Partnerships</h4>
              <p>
                Special enhanced visibility and tools for venues and event
                promoters. Get preferred placement and advanced features across
                our platforms.
              </p>
              <h4>Brand Partnerships</h4>
              <p>
                Strategic alliances for brands looking to connect with our
                community. Includes sponsored content, events, and integrated
                campaigns.
              </p>
              <h3>Our Partnership Process</h3>
              <ol>
                <li>
                  <strong>Initial Consultation</strong> - We'll discuss your
                  goals and how our ecosystem can help
                </li>
                <li>
                  <strong>Partnership Design</strong> - Our team will craft a
                  custom partnership plan
                </li>
                <li>
                  <strong>Implementation</strong> - Technical and marketing
                  integration with our platforms
                </li>
                <li>
                  <strong>Measurement & Optimization</strong> - Ongoing analysis
                  and improvement
                </li>
              </ol>
              <h3>Current Partners</h3>
              <p>
                We're proud to work with leading brands, venues, and technology
                providers across the entertainment industry. Our partners
                include major venues, ticketing platforms, media companies, and
                local businesses.
              </p>
              <div className="bg-indigo-50 p-6 rounded-lg mt-8">
                <h3 className="text-indigo-800 mb-3">
                  Ready to explore a partnership?
                </h3>
                <p className="text-indigo-700 mb-4">
                  Contact our partnerships team to discuss how we can work
                  together to achieve your goals.
                </p>
                <button onClick={() => navigate('/contact')} className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                  Contact Partnerships Team
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};