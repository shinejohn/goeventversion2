import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUpIcon, MapPinIcon, MusicIcon, DollarSignIcon, CalendarIcon, DownloadIcon, InfoIcon, ArrowRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
export const MarketReportPage = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState('Clearwater, FL');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [timeRange, setTimeRange] = useState('last6Months');
  // Mock data for charts
  const gigsByGenre = [{
    name: 'Rock/Alternative',
    value: 124
  }, {
    name: 'DJ/Electronic',
    value: 85
  }, {
    name: 'Jazz/Blues',
    value: 42
  }, {
    name: 'Classical',
    value: 28
  }, {
    name: 'Country/Folk',
    value: 56
  }, {
    name: 'Pop/Top 40',
    value: 98
  }];
  const avgPayByGenre = [{
    name: 'Rock/Alt',
    value: 450
  }, {
    name: 'DJ/Electronic',
    value: 550
  }, {
    name: 'Jazz/Blues',
    value: 400
  }, {
    name: 'Classical',
    value: 500
  }, {
    name: 'Country/Folk',
    value: 350
  }, {
    name: 'Pop/Top 40',
    value: 425
  }];
  const demandTrend = [{
    month: 'Jan',
    gigs: 45,
    avgPay: 400
  }, {
    month: 'Feb',
    gigs: 52,
    avgPay: 420
  }, {
    month: 'Mar',
    gigs: 48,
    avgPay: 410
  }, {
    month: 'Apr',
    gigs: 70,
    avgPay: 450
  }, {
    month: 'May',
    gigs: 95,
    avgPay: 480
  }, {
    month: 'Jun',
    gigs: 120,
    avgPay: 500
  }];
  const gigsByVenueType = [{
    name: 'Weddings',
    value: 85
  }, {
    name: 'Corporate Events',
    value: 65
  }, {
    name: 'Restaurants/Bars',
    value: 120
  }, {
    name: 'Private Parties',
    value: 45
  }, {
    name: 'Festivals',
    value: 25
  }, {
    name: 'Other',
    value: 15
  }];
  const COLORS = ['#8b5cf6', '#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#6b7280'];
  const locations = ['Clearwater, FL', 'St. Petersburg, FL', 'Tampa, FL', 'Dunedin, FL', 'Largo, FL'];
  const genres = ['All Genres', 'Rock/Alternative', 'DJ/Electronic', 'Jazz/Blues', 'Classical', 'Country/Folk', 'Pop/Top 40'];
  // Top opportunities based on selected filters
  const topOpportunities = [{
    title: 'Wedding Season Demand',
    description: 'High demand for wedding bands and DJs from May-October',
    growth: '+35%',
    avgPay: '$500-800',
    competition: 'Medium'
  }, {
    title: 'Restaurant Circuit',
    description: 'Consistent demand for solo and duo acts at local restaurants',
    growth: '+15%',
    avgPay: '$200-350',
    competition: 'High'
  }, {
    title: 'Corporate Events',
    description: 'Growing market for professional performers for corporate functions',
    growth: '+22%',
    avgPay: '$600-1200',
    competition: 'Low'
  }, {
    title: 'Tourist Venues',
    description: 'Seasonal opportunities at beachfront venues and tourist attractions',
    growth: '+40%',
    avgPay: '$300-500',
    competition: 'Medium'
  }];
  // Market insights based on selected filters
  const marketInsights = ['Wedding bookings typically require 3-6 months advance notice', 'Corporate events value professional appearance and reliability over genre specificity', 'Restaurants prefer performers who can engage with diners without overwhelming conversation', 'Venues are increasingly looking for performers who bring their own following', 'Most venues book 2-3 months in advance for weekend slots', 'Having a diverse repertoire increases booking opportunities by 40%'];
  return <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold sm:text-4xl">
                Performer Market Report
              </h1>
              <p className="mt-3 text-xl text-purple-100 max-w-3xl">
                Data-driven insights to help you find gigs and maximize your
                bookings
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-purple-700 bg-white hover:bg-purple-50" onClick={() => console.log('Download report')}>
                <DownloadIcon className="h-5 w-5 mr-2" />
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select id="location" name="location" className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md" value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}>
                {locations.map(location => <option key={location} value={location}>
                    {location}
                  </option>)}
              </select>
            </div>
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                Genre
              </label>
              <select id="genre" name="genre" className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md" value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
                {genres.map(genre => <option key={genre} value={genre}>
                    {genre}
                  </option>)}
              </select>
            </div>
            <div>
              <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700 mb-1">
                Time Range
              </label>
              <select id="timeRange" name="timeRange" className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md" value={timeRange} onChange={e => setTimeRange(e.target.value)}>
                <option value="last3Months">Last 3 Months</option>
                <option value="last6Months">Last 6 Months</option>
                <option value="lastYear">Last Year</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* Market Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Market Overview: {selectedLocation}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">433</h3>
                <p className="text-sm text-gray-500">Total Gigs Available</p>
              </div>
            </div>
            <div className="mt-3 text-sm text-green-600 flex items-center">
              <TrendingUpIcon className="h-4 w-4 mr-1" />
              +12% from previous period
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <DollarSignIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">$425</h3>
                <p className="text-sm text-gray-500">Average Pay Per Gig</p>
              </div>
            </div>
            <div className="mt-3 text-sm text-green-600 flex items-center">
              <TrendingUpIcon className="h-4 w-4 mr-1" />
              +5% from previous period
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <MusicIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Rock/Alt</h3>
                <p className="text-sm text-gray-500">Most In-Demand Genre</p>
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              28% of all gig listings
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <MapPinIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Restaurants
                </h3>
                <p className="text-sm text-gray-500">Top Venue Type</p>
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              33% of available gigs
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gigs by Genre */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Gigs by Genre
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gigsByGenre} margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" name="Number of Gigs" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Average Pay by Genre */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Average Pay by Genre
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={avgPayByGenre} margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={value => [`$${value}`, 'Average Pay']} />
                  <Bar dataKey="value" fill="#6366f1" name="Average Pay" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Demand Trend */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Demand Trend (Last 6 Months)
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={demandTrend} margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="gigs" stroke="#8b5cf6" name="Number of Gigs" />
                  <Line yAxisId="right" type="monotone" dataKey="avgPay" stroke="#14b8a6" name="Average Pay ($)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Gigs by Venue Type */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Gigs by Venue Type
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={gigsByVenueType} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={({
                  name,
                  percent
                }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {gigsByVenueType.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value} gigs`, props.payload.name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      {/* Top Opportunities */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Top Opportunities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topOpportunities.map((opportunity, index) => <div key={index} className="bg-white rounded-lg shadow-md p-4 border-t-4 border-purple-500">
              <h3 className="text-lg font-medium text-gray-900">
                {opportunity.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {opportunity.description}
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="block text-gray-500">Growth</span>
                  <span className="font-medium text-green-600">
                    {opportunity.growth}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-500">Avg Pay</span>
                  <span className="font-medium text-gray-900">
                    {opportunity.avgPay}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-500">Competition</span>
                  <span className="font-medium text-gray-900">
                    {opportunity.competition}
                  </span>
                </div>
              </div>
            </div>)}
        </div>
      </div>
      {/* Market Insights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Market Insights
        </h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <ul className="space-y-3">
            {marketInsights.map((insight, index) => <li key={index} className="flex">
                <CheckCircleIcon className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{insight}</span>
              </li>)}
          </ul>
          <div className="mt-6 bg-purple-50 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <InfoIcon className="h-5 w-5 text-purple-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-purple-800">Pro Tip</h3>
                <div className="mt-2 text-sm text-purple-700">
                  Performers who include videos and audio samples on their
                  profiles receive 3x more booking inquiries than those without
                  media.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* CTA Section */}
      <div className="bg-purple-50 py-12 mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Ready to get more bookings?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Use these insights to optimize your performer profile and start
              applying to gigs that match your skills and preferences.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
              <button type="button" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700" onClick={() => navigate('/book-it/gigs')}>
                Browse Available Gigs
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </button>
              <button type="button" className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" onClick={() => navigate('/performers/profile/edit')}>
                Optimize Your Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};