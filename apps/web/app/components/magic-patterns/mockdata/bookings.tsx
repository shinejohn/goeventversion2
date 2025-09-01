import React from 'react';
// Empty structure for bookings data
export const mockConfirmedBooking = {
  bookingId: '',
  eventName: '',
  eventType: '',
  date: '',
  startTime: '',
  endTime: '',
  setupTime: '',
  breakdownTime: '',
  guestCount: 0,
  depositAmount: 0,
  depositDate: '',
  finalPaymentDate: '',
  balanceDueDate: '',
  paymentStatus: '',
  pricing: {
    basePrice: 0,
    setupCost: 0,
    breakdownCost: 0,
    additionalServicesCost: 0,
    subtotal: 0,
    serviceFee: 0,
    total: 0
  },
  venue: {
    id: '',
    name: '',
    images: [],
    location: {
      address: '',
      coordinates: {
        lat: 0,
        lng: 0
      }
    },
    contactPerson: {
      name: '',
      phone: '',
      email: ''
    },
    checkInInstructions: '',
    parkingInformation: '',
    houseRules: []
  },
  additionalServices: [],
  specialRequests: '',
  isVenueOwner: false
};