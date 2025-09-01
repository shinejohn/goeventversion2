import React, { useState } from 'react';
import { CheckIcon, TicketIcon, CalendarIcon, MapPinIcon, ClockIcon, CreditCardIcon, UserIcon, LockIcon, ArrowRightIcon } from 'lucide-react';
import { useNavigationContext } from '../../context/NavigationContext';
interface TicketPurchaseConfirmationProps {
  ticketData: {
    id: string;
    eventName: string;
    date: Date;
    venue: {
      name: string;
      address: string;
    };
    ticketType: string;
    price: number;
    quantity: number;
    fees: number;
  };
  onClose: () => void;
}
export const TicketPurchaseConfirmation = ({
  ticketData,
  onClose
}: TicketPurchaseConfirmationProps) => {
  const {
    navigateTo
  } = useNavigationContext();
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const handlePurchase = () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setPurchaseComplete(true);
    }, 1500);
  };
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  const handleViewTicket = () => {
    navigateTo(`/tickets/${ticketData.id}`);
    onClose();
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        {!purchaseComplete ? <>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Confirm Purchase
            </h2>
            <div className="mb-6">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  {ticketData.eventName}
                </h3>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <CalendarIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                  {formatDate(ticketData.date)}
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <ClockIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                  {formatTime(ticketData.date)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                  {ticketData.venue.name}
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {ticketData.ticketType} x {ticketData.quantity}
                  </span>
                  <span>
                    ${(ticketData.price * ticketData.quantity).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service Fee</span>
                  <span>${ticketData.fees.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-medium">
                  <span>Total</span>
                  <span>
                    $
                    {(ticketData.price * ticketData.quantity + ticketData.fees).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex items-center mb-2">
                  <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="font-medium text-gray-900">Payment Method</h3>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-12 bg-gray-200 rounded mr-2"></div>
                    <span className="text-gray-600">•••• 4242</span>
                  </div>
                  <button className="text-sm text-indigo-600">Change</button>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <LockIcon className="h-4 w-4 mr-1" />
                <span>Secure checkout with 256-bit SSL encryption</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handlePurchase} disabled={processing} className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed flex justify-center items-center">
                {processing ? <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </> : 'Complete Purchase'}
              </button>
            </div>
          </> : <div className="text-center py-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              Purchase Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your tickets have been added to your account
            </p>
            <button onClick={handleViewTicket} className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center">
              View My Ticket
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </button>
          </div>}
      </div>
    </div>;
};