import React, { useState } from 'react';
import { useNavigationContext } from '../context/NavigationContext';
import { Mail, Phone, MapPin, MessageSquare, HelpCircle, Send, AlertCircle, CheckCircle } from 'lucide-react';
export const ContactUsPage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    reason: 'General Inquiry'
  });
  const [errors, setErrors] = useState<{
    [key: string]: string;
  }>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {
          ...prev
        };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  const validateForm = () => {
    const newErrors: {
      [key: string]: string;
    } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message is too short';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setSubmitting(false);
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          reason: 'General Inquiry'
        });
      }, 1500);
    }
  };
  const contactReasons = ['General Inquiry', 'Customer Support', 'Technical Issue', 'Partnership Opportunity', 'Press & Media', 'Careers', 'Billing Question', 'Feature Request', 'Report a Problem'];
  const faqs = [{
    question: 'How do I list my venue on Go Event City?',
    answer: "You can list your venue by creating an account and navigating to the 'List Your Venue' section. Follow the prompts to add your venue details, photos, and availability."
  }, {
    question: 'How do I post an event?',
    answer: "After creating an account, click on 'Create Event' in the navigation menu. Fill out the event details, add images, set ticket prices if applicable, and publish your event."
  }, {
    question: 'What fees do you charge for ticket sales?',
    answer: 'We charge a 5% service fee plus $0.99 per ticket for paid events. There are no fees for free events. Volume discounts are available for larger events.'
  }, {
    question: 'How can I get featured in the community calendar?',
    answer: 'All events submitted to our platform are automatically considered for the community calendar. Events that align with our community guidelines and have complete information are more likely to be featured.'
  }, {
    question: 'How do I become a verified performer?',
    answer: 'Create a performer profile and submit verification documents through your account settings. Our team will review your submission within 3-5 business days.'
  }];
  return <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-white text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold sm:text-5xl mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We're here to help! Reach out with questions, feedback, or support
              needs
            </p>
          </div>
        </div>
      </div>
      {/* Contact Methods */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600 mb-4">
                For general inquiries and support
              </p>
              <a href="mailto:hello@goeventcity.com" className="text-blue-600 font-medium hover:text-blue-800">
                hello@goeventcity.com
              </a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">
                Available Monday-Friday, 9am-5pm ET
              </p>
              <a href="tel:+17275550123" className="text-blue-600 font-medium hover:text-blue-800">
                (727) 555-0123
              </a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600 mb-4">Our headquarters location</p>
              <address className="not-italic text-blue-600 font-medium">
                123 Main Street
                <br />
                Clearwater, FL 33755
              </address>
            </div>
          </div>
        </div>
      </div>
      {/* Contact Form and Map */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send Us a Message
              </h2>
              {submitted ? <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Thank You!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your message has been sent successfully. We'll get back to
                    you as soon as possible.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
                    Send Another Message
                  </button>
                </div> : <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name *
                      </label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`block w-full rounded-md shadow-sm py-2 px-3 border ${errors.name ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`} />
                      {errors.name && <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.name}
                        </p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`block w-full rounded-md shadow-sm py-2 px-3 border ${errors.email ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`} />
                      {errors.email && <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.email}
                        </p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number (Optional)
                      </label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="block w-full rounded-md shadow-sm py-2 px-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <div>
                      <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                        Reason for Contact
                      </label>
                      <select id="reason" name="reason" value={formData.reason} onChange={handleChange} className="block w-full rounded-md shadow-sm py-2 px-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        {contactReasons.map(reason => <option key={reason} value={reason}>
                            {reason}
                          </option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className={`block w-full rounded-md shadow-sm py-2 px-3 border ${errors.subject ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`} />
                    {errors.subject && <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.subject}
                      </p>}
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <textarea id="message" name="message" rows={5} value={formData.message} onChange={handleChange} className={`block w-full rounded-md shadow-sm py-2 px-3 border ${errors.message ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}></textarea>
                    {errors.message && <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.message}
                      </p>}
                  </div>
                  <div className="flex items-center">
                    <input id="privacy" name="privacy" type="checkbox" required className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    <label htmlFor="privacy" className="ml-2 block text-sm text-gray-700">
                      I agree to the{' '}
                      <a href="/privacy" className="text-blue-600 hover:text-blue-800">
                        privacy policy
                      </a>{' '}
                      and consent to being contacted regarding my inquiry.
                    </label>
                  </div>
                  <div>
                    <button type="submit" disabled={submitting} className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${submitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}>
                      {submitting ? <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </> : <>
                          <Send className="h-5 w-5 mr-2" />
                          Send Message
                        </>}
                    </button>
                  </div>
                </form>}
            </div>
            {/* Map and Office Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Our Location
              </h2>
              <div className="bg-gray-200 rounded-lg h-80 mb-6 overflow-hidden">
                {/* This would be replaced with an actual map component in a real implementation */}
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p>Interactive Map Would Appear Here</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Headquarters
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                    <div>
                      <p className="font-medium">When's The Fun</p>
                      <address className="not-italic">
                        123 Main Street
                        <br />
                        Clearwater, FL 33755
                        <br />
                        United States
                      </address>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p>(727) 555-0123</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p>hello@whensthefun.com</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Business Hours:
                  </h4>
                  <ul className="space-y-1 text-gray-600">
                    <li className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span>9:00 AM - 5:00 PM ET</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Saturday:</span>
                      <span>10:00 AM - 2:00 PM ET</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sunday:</span>
                      <span>Closed</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Department Contacts */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Specialized Departments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Customer Support
              </h3>
              <p className="text-gray-600 mb-4">
                For help with your account, bookings, or tickets
              </p>
              <div className="flex items-center text-blue-600 font-medium">
                <Mail className="h-5 w-5 mr-2" />
                <a href="mailto:support@whensthefun.com" className="hover:text-blue-800">
                  support@whensthefun.com
                </a>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Business Development
              </h3>
              <p className="text-gray-600 mb-4">
                For partnership opportunities and business inquiries
              </p>
              <div className="flex items-center text-blue-600 font-medium">
                <Mail className="h-5 w-5 mr-2" />
                <a href="mailto:partnerships@whensthefun.com" className="hover:text-blue-800">
                  partnerships@whensthefun.com
                </a>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Press & Media
              </h3>
              <p className="text-gray-600 mb-4">
                For media inquiries, press kits, and interview requests
              </p>
              <div className="flex items-center text-blue-600 font-medium">
                <Mail className="h-5 w-5 mr-2" />
                <a href="mailto:press@whensthefun.com" className="hover:text-blue-800">
                  press@whensthefun.com
                </a>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Careers</h3>
              <p className="text-gray-600 mb-4">
                For job opportunities and employment questions
              </p>
              <div className="flex items-center text-blue-600 font-medium">
                <Mail className="h-5 w-5 mr-2" />
                <a href="mailto:careers@whensthefun.com" className="hover:text-blue-800">
                  careers@whensthefun.com
                </a>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Technical Support
              </h3>
              <p className="text-gray-600 mb-4">
                For website issues, bugs, or technical problems
              </p>
              <div className="flex items-center text-blue-600 font-medium">
                <Mail className="h-5 w-5 mr-2" />
                <a href="mailto:tech@whensthefun.com" className="hover:text-blue-800">
                  tech@whensthefun.com
                </a>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Community Impact
              </h3>
              <p className="text-gray-600 mb-4">
                For community programs and nonprofit collaborations
              </p>
              <div className="flex items-center text-blue-600 font-medium">
                <Mail className="h-5 w-5 mr-2" />
                <a href="mailto:community@whensthefun.com" className="hover:text-blue-800">
                  community@whensthefun.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* FAQs */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Find quick answers to common questions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <HelpCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </div>)}
          </div>
          <div className="mt-8 text-center">
            <button onClick={() => navigateTo('/faq')} className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              View All FAQs
            </button>
          </div>
        </div>
      </div>
      {/* Help Center CTA */}
      <div className="bg-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need More Help?</h2>
          <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
            Visit our comprehensive Help Center for guides, tutorials, and
            detailed information
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => navigateTo('/help')} className="px-8 py-3 bg-white text-blue-700 font-medium rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              Help Center
            </button>
            <button onClick={() => navigateTo('/support/chat')} className="px-8 py-3 bg-blue-800 text-white font-medium rounded-md hover:bg-blue-900 transition-colors border border-blue-600 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Live Chat Support
            </button>
          </div>
        </div>
      </div>
    </div>;
};