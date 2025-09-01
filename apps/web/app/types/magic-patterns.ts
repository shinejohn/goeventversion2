// Auto-generated types from Magic Patterns components
// DO NOT EDIT - Run 'pnpm analyze:mp' to regenerate

import { z } from 'zod';

export const CheckInButtonPropsSchema = z.object({
  venueId: z.string(),
  venueName: z.string(),
  eventId: z.unknown().optional(),
  eventName: z.unknown().optional(),
  eventDate: z.unknown().optional(),
  eventTime: z.unknown().optional(),
  eventImage: z.unknown().optional(),
  variant: z.unknown().optional(),
  size: z.unknown().optional(),
  className: z.unknown().optional(),
  onCheckInComplete: z.unknown().optional(),
});

export type CheckInButtonProps = z.infer<typeof CheckInButtonPropsSchema>;

export const CheckInFeedPropsSchema = z.object({
  type: z.unknown().optional(),
  userId: z.unknown().optional(),
  limit: z.unknown().optional(),
  className: z.unknown().optional(),
  showActions: z.unknown().optional(),
});

export type CheckInFeedProps = z.infer<typeof CheckInFeedPropsSchema>;

export const CheckInModalPropsSchema = z.object({
  venueId: z.string(),
  venueName: z.string(),
  eventId: z.unknown().optional(),
  eventName: z.unknown().optional(),
  eventDate: z.unknown().optional(),
  eventTime: z.unknown().optional(),
  eventImage: z.unknown().optional(),
  isOpen: z.boolean(),
  onClose: z.unknown(),
});

export type CheckInModalProps = z.infer<typeof CheckInModalPropsSchema>;

export const PlannedEventsWidgetPropsSchema = z.object({
  limit: z.unknown().optional(),
  showControls: z.unknown().optional(),
  className: z.unknown().optional(),
});

export type PlannedEventsWidgetProps = z.infer<typeof PlannedEventsWidgetPropsSchema>;

export const InvoicePropsSchema = z.object({
  orderData: z.unknown(),
  customerInfo: z.unknown(),
  deliveryFee: z.number(),
  invoiceNumber: z.string(),
  date: z.string(),
});

export type InvoiceProps = z.infer<typeof InvoicePropsSchema>;

export const TicketPurchaseConfirmationPropsSchema = z.object({
  ticketData: z.date(),
  onClose: z.unknown(),
});

export type TicketPurchaseConfirmationProps = z.infer<typeof TicketPurchaseConfirmationPropsSchema>;

