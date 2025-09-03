import React, { useState } from 'react';
import { CalendarIcon, MapPinIcon, MusicIcon, ClockIcon, DollarSignIcon, UsersIcon, CheckCircleIcon, BuildingIcon, InfoIcon, ArrowRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
export const GigCreatorPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: '',
    performerType: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    venue: '',
    budget: '',
    audienceSize: '',
    requirements: '',
    equipmentProvided: false,
    accommodationProvided: false,
    mealProvided: false,
    transportationProvided: false,
    isPaid: true,
    isRecurring: false,
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      checked
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // In a real app, this would send the data to the server
    navigate('/book-it/gig-confirmation');
  };
  const eventTypes = ['Wedding', 'Corporate Event', 'Private Party', 'Concert', 'Festival', 'Club Night', 'Restaurant Performance', 'Charity Event', 'Birthday Party', 'Anniversary', 'Holiday Celebration', 'Other'];
  const performerTypes = ['Band', 'Solo Musician', 'DJ', 'Classical Ensemble', 'Jazz Group', 'Cover Band', 'Tribute Act', 'Singer-Songwriter', 'Comedian', 'Magician', 'Dance Group', 'Other'];
  return <div className="min-h-screen bg-gray-50">
      <div className="bg-purple-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold sm:text-4xl">Post a Gig</h1>
          <p className="mt-3 text-xl text-purple-100 max-w-3xl">
            Find the perfect performer for your event by creating a detailed gig
            listing
          </p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Gig Details Section */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Gig Details
                  </h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Gig Title *
                      </label>
                      <input type="text" name="title" id="title" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" placeholder="e.g., 'Live Band Needed for Wedding Reception'" value={formData.title} onChange={handleChange} />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description *
                      </label>
                      <textarea name="description" id="description" rows={4} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" placeholder="Describe the gig, your expectations, and any specific details performers should know" value={formData.description} onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">
                          Event Type *
                        </label>
                        <select id="eventType" name="eventType" required className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" value={formData.eventType} onChange={handleChange}>
                          <option value="">Select Event Type</option>
                          {eventTypes.map(type => <option key={type} value={type}>
                              {type}
                            </option>)}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="performerType" className="block text-sm font-medium text-gray-700">
                          Performer Type *
                        </label>
                        <select id="performerType" name="performerType" required className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" value={formData.performerType} onChange={handleChange}>
                          <option value="">Select Performer Type</option>
                          {performerTypes.map(type => <option key={type} value={type}>
                              {type}
                            </option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Date and Time Section */}
                <div className="pt-4 border-t border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Date and Time
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Date *
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CalendarIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="date" name="date" id="date" required className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md" value={formData.date} onChange={handleChange} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                        Start Time *
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <ClockIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="time" name="startTime" id="startTime" required className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md" value={formData.startTime} onChange={handleChange} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                        End Time *
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <ClockIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="time" name="endTime" id="endTime" required className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md" value={formData.endTime} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="isRecurring" name="isRecurring" type="checkbox" className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded" checked={formData.isRecurring} onChange={handleCheckboxChange} />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="isRecurring" className="font-medium text-gray-700">
                          This is a recurring gig
                        </label>
                        <p className="text-gray-500">
                          Check if you need a performer for multiple dates
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Location Section */}
                <div className="pt-4 border-t border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Location
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        City/Area *
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPinIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="text" name="location" id="location" required className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md" placeholder="e.g., 'Clearwater, FL'" value={formData.location} onChange={handleChange} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="venue" className="block text-sm font-medium text-gray-700">
                        Venue Name (if known)
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <BuildingIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="text" name="venue" id="venue" className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md" placeholder="e.g., 'Clearwater Beach Resort'" value={formData.venue} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Compensation & Requirements Section */}
                <div className="pt-4 border-t border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Compensation & Requirements
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                        Budget/Pay *
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSignIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="text" name="budget" id="budget" required className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md" placeholder="e.g., '$300-500' or 'Negotiable'" value={formData.budget} onChange={handleChange} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="audienceSize" className="block text-sm font-medium text-gray-700">
                        Expected Audience Size
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UsersIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="text" name="audienceSize" id="audienceSize" className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md" placeholder="e.g., '50-100 guests'" value={formData.audienceSize} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
                      Special Requirements or Preferences
                    </label>
                    <textarea name="requirements" id="requirements" rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" placeholder="e.g., 'Looking for a band that can play both jazz and pop covers' or 'Must have experience with wedding ceremonies'" value={formData.requirements} onChange={handleChange} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <fieldset>
                        <legend className="text-sm font-medium text-gray-700">
                          What's provided?
                        </legend>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input id="equipmentProvided" name="equipmentProvided" type="checkbox" className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded" checked={formData.equipmentProvided} onChange={handleCheckboxChange} />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="equipmentProvided" className="font-medium text-gray-700">
                                Sound equipment
                              </label>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input id="accommodationProvided" name="accommodationProvided" type="checkbox" className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded" checked={formData.accommodationProvided} onChange={handleCheckboxChange} />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="accommodationProvided" className="font-medium text-gray-700">
                                Accommodation
                              </label>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input id="mealProvided" name="mealProvided" type="checkbox" className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded" checked={formData.mealProvided} onChange={handleCheckboxChange} />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="mealProvided" className="font-medium text-gray-700">
                                Meals
                              </label>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input id="transportationProvided" name="transportationProvided" type="checkbox" className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded" checked={formData.transportationProvided} onChange={handleCheckboxChange} />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="transportationProvided" className="font-medium text-gray-700">
                                Transportation
                              </label>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                    <div>
                      <fieldset>
                        <legend className="text-sm font-medium text-gray-700">
                          Compensation Type
                        </legend>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input id="isPaid" name="isPaid" type="radio" className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300" checked={formData.isPaid} onChange={() => setFormData(prev => ({
                              ...prev,
                              isPaid: true
                            }))} />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="isPaid" className="font-medium text-gray-700">
                                Paid gig
                              </label>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input id="isNotPaid" name="isPaid" type="radio" className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300" checked={!formData.isPaid} onChange={() => setFormData(prev => ({
                              ...prev,
                              isPaid: false
                            }))} />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="isNotPaid" className="font-medium text-gray-700">
                                Exposure/volunteer opportunity
                              </label>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  </div>
                </div>
                {/* Contact Information Section */}
                <div className="pt-4 border-t border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                        Contact Name *
                      </label>
                      <input type="text" name="contactName" id="contactName" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" value={formData.contactName} onChange={handleChange} />
                    </div>
                    <div>
                      <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                        Email Address *
                      </label>
                      <input type="email" name="contactEmail" id="contactEmail" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" value={formData.contactEmail} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input type="tel" name="contactPhone" id="contactPhone" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" value={formData.contactPhone} onChange={handleChange} />
                    </div>
                  </div>
                </div>
                {/* Submit Button */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-end">
                    <button type="button" className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" onClick={() => navigate('/book')}>
                      Cancel
                    </button>
                    <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                      Post Gig
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-6 bg-purple-50 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <InfoIcon className="h-5 w-5 text-purple-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-purple-800">
                Tips for a successful gig posting
              </h3>
              <div className="mt-2 text-sm text-purple-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Be specific about your requirements and expectations</li>
                  <li>Include clear details about compensation</li>
                  <li>Provide information about your venue and audience</li>
                  <li>Respond promptly to performer inquiries</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};