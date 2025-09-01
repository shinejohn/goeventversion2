import React, { useEffect, useState, createElement, Component } from 'react';
import { ChevronLeftIcon, CalendarIcon, MapPinIcon, ClockIcon, ShareIcon, DownloadIcon, UserIcon, SlidersIcon, ExternalLinkIcon, InfoIcon, TicketIcon, CheckIcon, XIcon } from 'lucide-react';
import { useNavigationContext } from '../../context/NavigationContext';
const safeDateFormat = (date: Date | null | undefined) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return 'Date not available';
  }
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};
const safeTimeFormat = (date: Date | null | undefined) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return 'Time not available';
  }
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
};
// Generate a simple QR code placeholder to avoid external API dependency
const generateQRCodeDataURL = (data: string) => {
  try {
    // Create a simple SVG QR code placeholder
    const size = 250;
    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="white" stroke="#000" stroke-width="2"/>
        <rect x="20" y="20" width="30" height="30" fill="black"/>
        <rect x="70" y="20" width="30" height="30" fill="black"/>
        <rect x="120" y="20" width="30" height="30" fill="black"/>
        <rect x="170" y="20" width="30" height="30" fill="black"/>
        <rect x="220" y="20" width="10" height="30" fill="black"/>
        <text x="${size / 2}" y="${size - 10}" text-anchor="middle" font-family="Arial" font-size="12" fill="black">${data}</text>
      </svg>
    `;
    // Safe base64 encoding with fallback
    try {
      return `data:image/svg+xml;base64,${btoa(svg)}`;
    } catch (btoa_error) {
      console.warn('btoa encoding failed, using URI encoding:', btoa_error);
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    }
  } catch (error) {
    console.error('QR code generation error:', error);
    // Return a simple fallback
    return 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="250" height="250"%3E%3Crect width="250" height="250" fill="%23f3f4f6"/%3E%3Ctext x="125" y="125" text-anchor="middle" font-family="Arial" font-size="14" fill="%236b7280"%3ETicket QR%3C/text%3E%3C/svg%3E';
  }
};
export const TicketDetailPage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  const [isQrEnlarged, setIsQrEnlarged] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [scanAnimation, setScanAnimation] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferEmail, setTransferEmail] = useState('');
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [ticketData, setTicketData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Fetch ticket data
  useEffect(() => {
    const fetchTicketData = async () => {
      setIsLoading(true);
      try {
        // API call would go here
        await new Promise(resolve => setTimeout(resolve, 500));
        // Empty ticket data structure instead of mock data
        setTicketData({
          id: '',
          eventName: '',
          date: new Date(),
          endDate: new Date(),
          venue: {
            name: '',
            address: ''
          },
          ticketType: '',
          section: '',
          row: null,
          seat: null,
          validEntryTimes: '',
          ticketHolder: '',
          qrCode: generateQRCodeDataURL(''),
          eventImage: '',
          requirements: [],
          whatToBring: [],
          venuePolicies: []
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching ticket data:', error);
        setIsLoading(false);
      }
    };
    fetchTicketData();
  }, []);
  // Safe navigation function
  const safeNavigate = (path: string) => {
    try {
      if (navigateTo && typeof navigateTo === 'function') {
        navigateTo(path);
      } else {
        window.location.href = path;
      }
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = path;
    }
  };
  // Handle confirm transfer with error handling
  const handleConfirmTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simulate API call to transfer ticket
      setTimeout(() => {
        setTransferSuccess(true);
        setTimeout(() => {
          setShowTransferModal(false);
          safeNavigate('/profile/tickets');
        }, 2000);
      }, 1000);
    } catch (error) {
      console.error('Transfer error:', error);
      showSuccess('Transfer failed. Please try again.');
    }
  };
  // Handle download PDF with better error handling
  const handleDownloadPDF = () => {
    try {
      if (!ticketData) return;
      // Create a simple text-based ticket for download
      const ticketText = [`Event: ${ticketData.eventName}`, `Date: ${safeDateFormat(ticketData.date)}`, `Time: ${safeTimeFormat(ticketData.date)} - ${safeTimeFormat(ticketData.endDate)}`, `Venue: ${ticketData.venue.name}`, `Address: ${ticketData.venue.address}`, `Ticket Type: ${ticketData.ticketType}`, `Section: ${ticketData.section || 'N/A'}`, `Row: ${ticketData.row || 'N/A'}`, `Seat: ${ticketData.seat || 'N/A'}`, `Valid Entry Times: ${ticketData.validEntryTimes}`, `Ticket Holder: ${ticketData.ticketHolder}`, `Ticket ID: ${ticketData.id}`, '', 'Present this ticket and valid ID for entry.', 'This ticket is non-transferable and non-refundable.'].join('\n');
      // Create download link with better error handling
      try {
        const blob = new Blob([ticketText], {
          type: 'text/plain;charset=utf-8'
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `ticket_${ticketData.id}.txt`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showSuccess('Ticket downloaded successfully');
      } catch (blobError) {
        console.error('Blob creation failed:', blobError);
        // Fallback method
        const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(ticketText);
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', dataStr);
        downloadAnchorNode.setAttribute('download', `ticket_${ticketData.id}.txt`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        showSuccess('Ticket downloaded successfully');
      }
    } catch (error) {
      console.error('Download failed:', error);
      showSuccess('Download failed. Please try again.');
    }
  };
  const showSuccess = (message: string) => {
    try {
      setSuccessMessage(message);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Show success message error:', error);
    }
  };
  // Simulate scanning effect
  useEffect(() => {
    const interval = setInterval(() => {
      setScanAnimation(true);
      setTimeout(() => {
        setScanAnimation(false);
      }, 1500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  // Auto-brightness for scanning
  useEffect(() => {
    // Increase brightness when QR is enlarged
    if (isQrEnlarged) {
      setBrightness(100);
    }
  }, [isQrEnlarged]);
  // Handle add to wallet
  const handleAddToWallet = () => {
    // In a real app, this would generate a wallet pass
    showSuccess('Ticket added to your digital wallet');
  };
  // Handle transfer ticket
  const handleTransferTicket = () => {
    setTransferEmail('');
    setTransferSuccess(false);
    setShowTransferModal(true);
  };
  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>;
  }
  if (!ticketData) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6">
          <TicketIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Ticket Not Found</h2>
          <p className="mt-2 text-gray-600">
            The ticket you're looking for could not be found or has expired.
          </p>
          <button onClick={() => navigateTo('/profile/tickets')} className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Back to My Tickets
          </button>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button onClick={() => navigateTo('/profile/tickets')} className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Back to My Tickets
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 flex items-center">
          <CheckIcon className="h-5 w-5 mr-2" />
          {successMessage}
        </div>}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Header Image */}
        <div className="rounded-t-lg overflow-hidden h-32 md:h-48 w-full mb-4">
          {ticketData.eventImage ? <img src={ticketData.eventImage} alt={ticketData.eventName} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-gray-200 flex items-center justify-center">
              <TicketIcon className="h-12 w-12 text-gray-400" />
            </div>}
        </div>

        {/* Main Ticket Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          {/* QR Code Section */}
          <div className={`relative p-6 flex flex-col items-center justify-center border-b border-gray-200 ${isQrEnlarged ? 'bg-white' : ''}`} style={{
          filter: `brightness(${brightness}%)`
        }}>
            {/* QR Code */}
            <div className={`relative cursor-pointer transition-all duration-300 ${isQrEnlarged ? 'scale-125' : ''}`} onClick={() => setIsQrEnlarged(!isQrEnlarged)}>
              <img src={ticketData.qrCode} alt="Ticket QR Code" className="h-56 w-56" />
              {/* Scan Animation */}
              {scanAnimation && <div className="absolute inset-0 overflow-hidden">
                  <div className="h-1 bg-green-500 opacity-70 animate-qrScan"></div>
                </div>}
              {!isQrEnlarged && <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="bg-black bg-opacity-50 text-white text-xs font-medium px-2 py-1 rounded">
                    Tap to enlarge
                  </div>
                </div>}
            </div>
            {/* Ticket ID */}
            <p className="mt-4 text-sm text-gray-500">
              Ticket ID: {ticketData.id}
            </p>
            {/* Brightness Control */}
            {isQrEnlarged && <div className="mt-4 w-full max-w-xs flex items-center">
                <SlidersIcon className="h-4 w-4 text-gray-400 mr-2" />
                <input type="range" min="50" max="150" value={brightness} onChange={e => setBrightness(parseInt(e.target.value))} className="w-full" />
              </div>}
          </div>

          {/* Event Details */}
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-900 mb-4">
              {ticketData.eventName}
            </h1>
            <div className="space-y-3 mb-6">
              <div className="flex items-start">
                <CalendarIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-gray-900">
                    {safeDateFormat(ticketData.date)}
                  </p>
                  <p className="text-gray-600">
                    {safeTimeFormat(ticketData.date)} -{' '}
                    {safeTimeFormat(ticketData.endDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPinIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-gray-900">{ticketData.venue.name}</p>
                  <p className="text-gray-600">{ticketData.venue.address}</p>
                  <a href={`https://maps.google.com/?q=${ticketData.venue.address}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-sm flex items-center mt-1">
                    Get directions
                    <ExternalLinkIcon className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <TicketIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-gray-900">{ticketData.ticketType}</p>
                  {ticketData.section && <p className="text-gray-600">
                      Section: {ticketData.section}
                      {ticketData.row && ` • Row: ${ticketData.row}`}
                      {ticketData.seat && ` • Seat: ${ticketData.seat}`}
                    </p>}
                  <p className="text-gray-600">
                    Valid Entry: {ticketData.validEntryTimes}
                  </p>
                </div>
              </div>
            </div>

            {/* Ticket Holder */}
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                <h2 className="font-medium text-gray-900">Ticket Holder</h2>
              </div>
              <p className="mt-2 text-gray-700">
                This ticket belongs to{' '}
                <strong>{ticketData.ticketHolder}</strong>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button onClick={handleAddToWallet} className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Add to Wallet
              </button>
              <button onClick={handleTransferTicket} className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <ShareIcon className="h-4 w-4 mr-1.5" />
                Transfer
              </button>
              <button onClick={handleDownloadPDF} className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <DownloadIcon className="h-4 w-4 mr-1.5" />
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Important Info Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <InfoIcon className="h-5 w-5 text-gray-400 mr-2" />
              Important Information
            </h2>
            <div className="space-y-6">
              {/* Entry Requirements */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Entry Requirements
                </h3>
                <ul className="space-y-1">
                  {ticketData.requirements.length > 0 ? ticketData.requirements.map((req: string, index: number) => <li key={index} className="text-gray-600 flex items-start">
                          <span className="text-indigo-500 mr-2">•</span>
                          {req}
                        </li>) : <li className="text-gray-600">
                      No specific requirements listed
                    </li>}
                </ul>
              </div>
              {/* What to Bring */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  What to Bring
                </h3>
                <ul className="space-y-1">
                  {ticketData.whatToBring.length > 0 ? ticketData.whatToBring.map((item: string, index: number) => <li key={index} className="text-gray-600 flex items-start">
                          <span className="text-indigo-500 mr-2">•</span>
                          {item}
                        </li>) : <li className="text-gray-600">No recommendations listed</li>}
                </ul>
              </div>
              {/* Venue Policies */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Venue Policies
                </h3>
                <ul className="space-y-1">
                  {ticketData.venuePolicies.length > 0 ? ticketData.venuePolicies.map((policy: string, index: number) => <li key={index} className="text-gray-600 flex items-start">
                          <span className="text-indigo-500 mr-2">•</span>
                          {policy}
                        </li>) : <li className="text-gray-600">
                      No specific venue policies listed
                    </li>}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Help Link */}
        <div className="text-center mb-8">
          <button onClick={() => navigateTo('/help')} className="text-indigo-600 hover:text-indigo-800 font-medium">
            Need help with your ticket?
          </button>
        </div>
      </div>

      {/* Transfer Ticket Modal */}
      {showTransferModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button onClick={() => setShowTransferModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <XIcon className="h-5 w-5" />
            </button>
            {!transferSuccess ? <>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Transfer Ticket
                </h2>
                <p className="text-gray-600 mb-6">
                  Enter the email address of the person you want to transfer
                  your ticket to.
                </p>
                <form onSubmit={handleConfirmTransfer}>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Recipient Email
                    </label>
                    <input type="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="friend@example.com" value={transferEmail} onChange={e => setTransferEmail(e.target.value)} required />
                  </div>
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">
                      Ticket Details
                    </h3>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="font-medium">{ticketData.eventName}</p>
                      <p className="text-sm text-gray-600">
                        {safeDateFormat(ticketData.date)} •{' '}
                        {safeTimeFormat(ticketData.date)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {ticketData.ticketType}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button type="button" onClick={() => setShowTransferModal(false)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                      Transfer Ticket
                    </button>
                  </div>
                </form>
              </> : <div className="text-center py-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <CheckIcon className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-medium text-gray-900 mb-2">
                  Transfer Successful!
                </h2>
                <p className="text-gray-600">
                  Your ticket has been sent to {transferEmail}
                </p>
              </div>}
          </div>
        </div>}

      {/* CSS for QR scan animation */}
      <style jsx>{`
        @keyframes qrScan {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(100%);
          }
        }
        .animate-qrScan {
          animation: qrScan 1.5s linear;
        }
      `}</style>
    </div>;
};