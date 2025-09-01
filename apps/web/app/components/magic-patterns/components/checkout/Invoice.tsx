import React from 'react';
interface InvoiceProps {
  orderData: any;
  customerInfo: any;
  deliveryFee: number;
  invoiceNumber: string;
  date: string;
}
export const Invoice: React.FC<InvoiceProps> = ({
  orderData,
  customerInfo,
  deliveryFee,
  invoiceNumber,
  date
}) => {
  // Calculate total
  const calculateTotal = () => {
    return orderData.total + deliveryFee;
  };
  // Calculate how the payment will be distributed
  const calculateDistribution = () => {
    const eventOrganizerAmount = orderData.subtotal * 0.9;
    const marketplaceFee = orderData.marketplaceFee;
    return {
      eventOrganizer: eventOrganizerAmount,
      marketplace: marketplaceFee + deliveryFee
    };
  };
  const distribution = calculateDistribution();
  return <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Invoice Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">INVOICE</h1>
            <p className="text-gray-600 mt-1">{invoiceNumber}</p>
            <p className="text-gray-600">Issue Date: {date}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-indigo-600">
              WTF (Where's The Fun)
            </h2>
            <p className="text-gray-600">123 Event Plaza</p>
            <p className="text-gray-600">Clearwater, FL 33755</p>
            <p className="text-gray-600">support@wtfun.com</p>
          </div>
        </div>
      </div>
      {/* Customer & Event Info */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Bill To:</h3>
            <p className="text-gray-700">
              {customerInfo.firstName} {customerInfo.lastName}
            </p>
            <p className="text-gray-700">{customerInfo.email}</p>
            <p className="text-gray-700">{customerInfo.phone}</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Event:</h3>
            <p className="text-gray-700 font-medium">{orderData.event.name}</p>
            <p className="text-gray-700">
              {orderData.event.date} • {orderData.event.time}
            </p>
            <p className="text-gray-700">{orderData.event.venue}</p>
          </div>
        </div>
      </div>
      {/* Line Items */}
      <div className="p-6 border-b border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left font-semibold text-gray-700 pb-3">
                Description
              </th>
              <th className="text-center font-semibold text-gray-700 pb-3">
                Qty
              </th>
              <th className="text-right font-semibold text-gray-700 pb-3">
                Unit Price
              </th>
              <th className="text-right font-semibold text-gray-700 pb-3">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Tickets */}
            {orderData.tickets.map((ticket, index) => <tr key={`ticket-${index}`} className="border-b border-gray-100">
                <td className="py-3 text-gray-800">{ticket.name}</td>
                <td className="py-3 text-center text-gray-800">
                  {ticket.quantity}
                </td>
                <td className="py-3 text-right text-gray-800">
                  ${ticket.price.toFixed(2)}
                </td>
                <td className="py-3 text-right text-gray-800 font-medium">
                  ${(ticket.quantity * ticket.price).toFixed(2)}
                </td>
              </tr>)}
            {/* Addons */}
            {orderData.addons && orderData.addons.map((addon, index) => <tr key={`addon-${index}`} className="border-b border-gray-100">
                  <td className="py-3 text-gray-800">{addon.name}</td>
                  <td className="py-3 text-center text-gray-800">
                    {addon.quantity}
                  </td>
                  <td className="py-3 text-right text-gray-800">
                    ${addon.price.toFixed(2)}
                  </td>
                  <td className="py-3 text-right text-gray-800 font-medium">
                    ${(addon.quantity * addon.price).toFixed(2)}
                  </td>
                </tr>)}
            {/* Fees */}
            <tr className="border-b border-gray-100">
              <td className="py-3 text-gray-800">Marketplace Fee (10%)</td>
              <td className="py-3 text-center text-gray-800">1</td>
              <td className="py-3 text-right text-gray-800">
                ${orderData.marketplaceFee.toFixed(2)}
              </td>
              <td className="py-3 text-right text-gray-800 font-medium">
                ${orderData.marketplaceFee.toFixed(2)}
              </td>
            </tr>
            {/* Delivery Fee */}
            {deliveryFee > 0 && <tr className="border-b border-gray-100">
                <td className="py-3 text-gray-800">SMS Delivery</td>
                <td className="py-3 text-center text-gray-800">1</td>
                <td className="py-3 text-right text-gray-800">
                  ${deliveryFee.toFixed(2)}
                </td>
                <td className="py-3 text-right text-gray-800 font-medium">
                  ${deliveryFee.toFixed(2)}
                </td>
              </tr>}
            {/* Discount */}
            {orderData.promoApplied && <tr className="border-b border-gray-100 text-green-600">
                <td className="py-3">Promo Discount (10%)</td>
                <td className="py-3 text-center">1</td>
                <td className="py-3 text-right">
                  -${(orderData.subtotal * 0.1).toFixed(2)}
                </td>
                <td className="py-3 text-right font-medium">
                  -${(orderData.subtotal * 0.1).toFixed(2)}
                </td>
              </tr>}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} className="pt-4"></td>
              <td className="pt-4 text-right font-bold text-gray-700">
                Subtotal:
              </td>
              <td className="pt-4 text-right font-bold text-gray-900">
                ${orderData.subtotal.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td colSpan={2}></td>
              <td className="text-right font-bold text-gray-700">Fees:</td>
              <td className="text-right font-bold text-gray-900">
                ${(orderData.marketplaceFee + deliveryFee).toFixed(2)}
              </td>
            </tr>
            {orderData.promoApplied && <tr>
                <td colSpan={2}></td>
                <td className="text-right font-bold text-gray-700">
                  Discount:
                </td>
                <td className="text-right font-bold text-green-600">
                  -${(orderData.subtotal * 0.1).toFixed(2)}
                </td>
              </tr>}
            <tr>
              <td colSpan={2}></td>
              <td className="text-right font-bold text-gray-900 text-lg pt-2">
                Total:
              </td>
              <td className="text-right font-bold text-gray-900 text-lg pt-2">
                ${calculateTotal().toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      {/* Payment Allocation */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <h3 className="font-bold text-gray-900 mb-3">Payment Allocation</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-700">Event Organizer:</span>
            <span className="font-medium">
              ${distribution.eventOrganizer.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Marketplace Fee:</span>
            <span className="font-medium">
              ${distribution.marketplace.toFixed(2)}
            </span>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Payment processed via Stripe. Funds are automatically distributed to
          respective parties.
        </p>
      </div>
      {/* Terms */}
      <div className="p-6">
        <h3 className="font-bold text-gray-900 mb-3">Terms & Conditions</h3>
        <p className="text-sm text-gray-600">
          All ticket sales are final. No refunds or exchanges unless the event
          is cancelled by the organizer. In case of event cancellation, refunds
          will be processed automatically within 5-7 business days.
        </p>
        <p className="text-sm text-gray-600 mt-3">
          For questions regarding this invoice, please contact our support team
          at support@wtfun.com or call (555) 123-4567.
        </p>
        <p className="text-sm font-medium text-indigo-600 mt-5 text-center">
          Thank you for your purchase!
        </p>
      </div>
    </div>;
};