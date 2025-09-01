import React from 'react';
import { CreditCardIcon, CheckCircleIcon, ClockIcon } from 'lucide-react';
type FinancialBreakdownProps = {
  booking: any;
};
export const FinancialBreakdown = ({
  booking
}: FinancialBreakdownProps) => {
  const {
    pricing,
    paymentStatus,
    depositAmount,
    balanceDueDate
  } = booking;
  // Calculate remaining balance
  const remainingBalance = paymentStatus === 'deposit_paid' ? pricing.total - depositAmount : 0;
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-medium text-gray-900">Financial Details</h2>
      </div>
      <div className="p-6">
        {/* Financial breakdown */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Venue Rate</span>
            <span className="text-gray-900">
              ${pricing.basePrice.toFixed(2)}
            </span>
          </div>
          {pricing.setupCost > 0 && <div className="flex justify-between text-sm">
              <span className="text-gray-600">Setup & Breakdown</span>
              <span className="text-gray-900">
                ${pricing.setupCost.toFixed(2)}
              </span>
            </div>}
          {pricing.additionalServicesCost > 0 && <div className="flex justify-between text-sm">
              <span className="text-gray-600">Additional Services</span>
              <span className="text-gray-900">
                ${pricing.additionalServicesCost.toFixed(2)}
              </span>
            </div>}
          <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
            <span className="font-medium">Subtotal</span>
            <span className="font-medium">${pricing.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 flex items-center">
              Service Fee (10%)
              <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                Includes payment processing, support & insurance
              </span>
            </span>
            <span className="text-gray-900">
              ${pricing.serviceFee.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>${pricing.total.toFixed(2)}</span>
          </div>
        </div>
        {/* Payment status */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-start">
            {paymentStatus === 'paid_in_full' ? <div className="flex-shrink-0 mt-0.5">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              </div> : <div className="flex-shrink-0 mt-0.5">
                <CreditCardIcon className="h-5 w-5 text-amber-500" />
              </div>}
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">
                {paymentStatus === 'paid_in_full' ? 'Paid in Full' : 'Deposit Paid'}
              </h3>
              {paymentStatus === 'deposit_paid' && <div className="mt-2 text-sm text-gray-700">
                  <div className="flex justify-between mb-1">
                    <span>Deposit paid:</span>
                    <span className="font-medium">
                      ${depositAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Balance due:</span>
                    <span className="font-medium">
                      ${remainingBalance.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center text-amber-600 text-xs bg-amber-50 p-2 rounded">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>Balance payment due by {balanceDueDate}</span>
                  </div>
                </div>}
            </div>
          </div>
        </div>
        {/* Payout info for venue owners */}
        {booking.isVenueOwner && <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Payout Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Deposit payout:</span>
                <span className="font-medium">
                  ${(depositAmount * 0.9).toFixed(2)}
                </span>
              </div>
              {paymentStatus === 'deposit_paid' && <div className="flex justify-between">
                  <span className="text-blue-700">
                    Final payout (after event):
                  </span>
                  <span className="font-medium">
                    ${(remainingBalance * 0.9).toFixed(2)}
                  </span>
                </div>}
              <div className="text-xs text-blue-600 mt-1">
                Payouts are processed within 24 hours of payment receipt. Final
                payment will be released 24 hours after event completion.
              </div>
            </div>
          </div>}
      </div>
    </div>;
};