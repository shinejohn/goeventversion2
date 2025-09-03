# SSR Compatibility Report

Generated: 2025-09-02T19:08:06.511Z

## Summary

- Files scanned: 254
- Total issues found: 266
- Files with issues: 63

## Issues by Pattern

### window object (39 files)
Suggestion: Wrap in: if (typeof window !== "undefined") { ... }

### document object (22 files)
Suggestion: Wrap in: if (typeof document !== "undefined") { ... }

### localStorage (1 files)
Suggestion: Wrap in: if (typeof window !== "undefined" && window.localStorage) { ... }

### sessionStorage (4 files)
Suggestion: Wrap in: if (typeof window !== "undefined" && window.sessionStorage) { ... }

### navigator object (12 files)
Suggestion: Wrap in: if (typeof navigator !== "undefined") { ... }

### alert/confirm/prompt (29 files)
Suggestion: Replace with React modal or toast component

## High Priority Files (>5 issues)

- apps/web/app/components/magic-patterns/pages/EventDetailPage.tsx (18 issues)
- apps/web/app/components/magic-patterns/components/sharing/ShareEmbedWidget.tsx (18 issues)
- apps/web/app/components/magic-patterns/pages/performers/PerformerDiscoveryPage.tsx (16 issues)
- apps/web/app/components/magic-patterns/context/CheckInContext.tsx (11 issues)
- apps/web/app/components/magic-patterns/pages/book-it/venues/VenueDetailPage.tsx (8 issues)
- apps/web/app/components/magic-patterns/pages/venues/[venueId]/[venueSlug].tsx (7 issues)
- apps/web/app/components/magic-patterns/pages/tickets/TicketDetailPage.tsx (7 issues)
- apps/web/app/components/magic-patterns/pages/performers/PerformerManagementPage.tsx (7 issues)
- apps/web/app/components/magic-patterns/pages/bookings/BookingConfirmationPage.tsx (7 issues)
- apps/web/app/components/magic-patterns/components/hub/gallery/MediaLightbox.tsx (7 issues)
- apps/web/app/components/magic-patterns/components/bookings/ActionButtons.tsx (7 issues)
- apps/web/app/components/magic-patterns/pages/venues/VenueManagementPage.tsx (6 issues)
- apps/web/app/components/magic-patterns/pages/venues/SubmitVenuePage.tsx (6 issues)
- apps/web/app/components/magic-patterns/pages/profile/TicketsPage.tsx (6 issues)
- apps/web/app/components/magic-patterns/components/venue-profile/VenueImageGallery.tsx (6 issues)
- apps/web/app/components/magic-patterns/components/calendar/EventCard.tsx (6 issues)
- apps/web/app/components/magic-patterns/components/bookings/ConfettiCelebration.tsx (6 issues)

## Detailed Issues by File

### apps/web/app/components/magic-patterns/index.tsx

- **Line 5**: document object
  ```typescript
  const container = document.getElementById('root');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

### apps/web/app/components/magic-patterns/pages/help.tsx

- **Line 231**: window object
  ```typescript
  <button className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700" onClick={() => window.location.href = 'tel:+18005551234'}>
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 246**: window object
  ```typescript
  <button className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = 'mailto:support@whensthefun.com'}>
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 216**: alert/confirm/prompt
  ```typescript
  <button className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700" onClick={() => alert('Chat feature would open here')}>
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/pages/TicketsPage.tsx

- **Line 228**: window object
  ```typescript
  {showSharePopup && <SharePopup isOpen={showSharePopup} onClose={() => setShowSharePopup(false)} title={event.title} description={`${event.title} at ${event.venue} on ${event.date}, ${event.time}. Status: ${event.status}`} url={`${window.location.origin}/event/${event.id}`} image={event.image} />}
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 173**: document object
  ```typescript
  const link = document.createElement('a');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 176**: document object
  ```typescript
  document.body.appendChild(link);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 178**: document object
  ```typescript
  document.body.removeChild(link);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

### apps/web/app/components/magic-patterns/pages/HomePage.tsx

- **Line 236**: window object
  ```typescript
  url: `${window.location.origin}/event/${event.id}`,
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 256**: document object
  ```typescript
  const link = document.createElement('a');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 259**: document object
  ```typescript
  document.body.appendChild(link);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 261**: document object
  ```typescript
  document.body.removeChild(link);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

### apps/web/app/components/magic-patterns/pages/GearPage.tsx

- **Line 83**: window object
  ```typescript
  window.location.href = path;
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 97**: document object
  ```typescript
  const searchInput = document.querySelector('input[placeholder="Search for merchandise, local art, and more..."]') as HTMLInputElement;
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 184**: alert/confirm/prompt
  ```typescript
  alert(`Added ${product.name} to cart!`);
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/pages/EventsPage.tsx

- **Line 417**: window object
  ```typescript
  {eventToShare === event.id && <SharePopup isOpen={true} onClose={() => setEventToShare(null)} title={event.title} description={`${event.title} at ${event.venue} on ${day.date} at ${event.time}`} url={`${window.location.origin}/event/${event.id}`} image={event.image} />}
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 252**: document object
  ```typescript
  const link = document.createElement('a');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 255**: document object
  ```typescript
  document.body.appendChild(link);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 257**: document object
  ```typescript
  document.body.removeChild(link);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

### apps/web/app/components/magic-patterns/pages/EventDetailPage.tsx

- **Line 335**: window object
  ```typescript
  url: window.location.href
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 331**: navigator object
  ```typescript
  if (navigator.share) {
  ```
  **Fix**: Wrap in: if (typeof navigator !== "undefined") { ... }

- **Line 332**: navigator object
  ```typescript
  navigator.share({
  ```
  **Fix**: Wrap in: if (typeof navigator !== "undefined") { ... }

- **Line 324**: alert/confirm/prompt
  ```typescript
  alert(`Event saved to your favorites!`);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 326**: alert/confirm/prompt
  ```typescript
  alert(`Event removed from your favorites.`);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 337**: alert/confirm/prompt
  ```typescript
  alert('Sharing functionality: ' + eventData.title);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 340**: alert/confirm/prompt
  ```typescript
  alert('Sharing functionality: ' + eventData.title);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 345**: alert/confirm/prompt
  ```typescript
  alert(`Added to ${type}: ${eventData.title} on ${formatEventDate(eventData.date)}`);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 349**: alert/confirm/prompt
  ```typescript
  alert('Opening friend selection dialog to invite friends to this event');
  ```
  **Fix**: Replace with React modal or toast component

- **Line 492**: alert/confirm/prompt
  ```typescript
  {eventData.categories.slice(0, 3).map((category, index) => <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 cursor-pointer hover:bg-indigo-200" onClick={() => alert(`Showing all ${category} events`)}>
  ```
  **Fix**: Replace with React modal or toast component

- **Line 495**: alert/confirm/prompt
  ```typescript
  {eventData.categories.length > 3 && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 cursor-pointer hover:bg-gray-200" onClick={() => alert('Showing all categories for this event')}>
  ```
  **Fix**: Replace with React modal or toast component

- **Line 512**: alert/confirm/prompt
  ```typescript
  alert(`Viewing organizer: ${eventData.organizer.name}`);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 527**: alert/confirm/prompt
  ```typescript
  alert(`Viewing series: ${eventData.series.name}`);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 728**: alert/confirm/prompt
  ```typescript
  {eventData.socialProof.friendsAttending.slice(0, 5).map((friend, index) => <img key={index} src={friend.image} alt={friend.name} className="h-8 w-8 rounded-full border-2 border-white cursor-pointer" title={friend.name} onClick={() => alert(`Viewing ${friend.name}'s profile`)} />)}
  ```
  **Fix**: Replace with React modal or toast component

- **Line 763**: alert/confirm/prompt
  ```typescript
  alert('Viewing all similar events');
  ```
  **Fix**: Replace with React modal or toast component

- **Line 772**: alert/confirm/prompt
  ```typescript
  alert(`Viewing event: ${item === 1 ? 'Tampa Bay Blues Festival' : 'St. Pete Jazz Festival'}`);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 806**: alert/confirm/prompt
  ```typescript
  alert('Viewing all recommended events');
  ```
  **Fix**: Replace with React modal or toast component

- **Line 871**: alert/confirm/prompt
  ```typescript
  alert('Redirecting to payment processing...');
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/pages/BookItPage.tsx

- **Line 60**: window object
  ```typescript
  window.location.href = path;
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

### apps/web/app/components/magic-patterns/pages/venues/VenueManagementPage.tsx

- **Line 152**: alert/confirm/prompt
  ```typescript
  alert(`Edit venue ${venueId}`);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 159**: alert/confirm/prompt
  ```typescript
  alert(`Delete venue ${venueId}`);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 163**: alert/confirm/prompt
  ```typescript
  alert(`View booking request ${requestId}`);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 167**: alert/confirm/prompt
  ```typescript
  alert(`Approve booking request ${requestId}`);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 171**: alert/confirm/prompt
  ```typescript
  alert(`Decline booking request ${requestId}`);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 178**: alert/confirm/prompt
  ```typescript
  alert(`Saving settings for section: ${section}`);
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/pages/venues/VenueDetailPage.tsx

- **Line 74**: alert/confirm/prompt
  ```typescript
  alert(`Share ${venue.name}`);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 1098**: alert/confirm/prompt
  ```typescript
  alert('Your message has been sent! The venue will respond shortly.');
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/pages/venues/SubmitVenuePage.tsx

- **Line 142**: window object
  ```typescript
  window.scrollTo(0, 0);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 149**: window object
  ```typescript
  window.scrollTo(0, 0);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 163**: window object
  ```typescript
  window.scrollTo(0, 0);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 145**: alert/confirm/prompt
  ```typescript
  alert('Please fill out all required fields before proceeding.');
  ```
  **Fix**: Replace with React modal or toast component

- **Line 155**: alert/confirm/prompt
  ```typescript
  alert('Please agree to the terms and conditions.');
  ```
  **Fix**: Replace with React modal or toast component

- **Line 166**: alert/confirm/prompt
  ```typescript
  alert('An error occurred while submitting your venue. Please try again.');
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/pages/venues/[venueId]/book.tsx

- **Line 315**: window object
  ```typescript
  window.scrollTo(0, 0);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 319**: window object
  ```typescript
  window.scrollTo(0, 0);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 331**: window object
  ```typescript
  window.scrollTo(0, 0);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 335**: window object
  ```typescript
  if (window.confirm('Are you sure you want to cancel? Your booking information will be lost.')) {
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 335**: alert/confirm/prompt
  ```typescript
  if (window.confirm('Are you sure you want to cancel? Your booking information will be lost.')) {
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/pages/venues/[venueId]/[venueSlug].tsx

- **Line 343**: window object
  ```typescript
  url: window.location.href
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 1058**: window object
  ```typescript
  <button onClick={() => window.scrollTo({
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 339**: navigator object
  ```typescript
  if (navigator.share) {
  ```
  **Fix**: Wrap in: if (typeof navigator !== "undefined") { ... }

- **Line 340**: navigator object
  ```typescript
  navigator.share({
  ```
  **Fix**: Wrap in: if (typeof navigator !== "undefined") { ... }

- **Line 348**: alert/confirm/prompt
  ```typescript
  alert(`Share functionality: ${venue.name}`);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 353**: alert/confirm/prompt
  ```typescript
  alert(`Opening message thread with ${venue.name}`);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 358**: alert/confirm/prompt
  ```typescript
  alert('Please select a date for your event');
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/pages/tickets/TicketSelectionPage.tsx

- **Line 121**: sessionStorage
  ```typescript
  sessionStorage.setItem('selectedTickets', JSON.stringify({
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined" && window.sessionStorage) { ... }

### apps/web/app/components/magic-patterns/pages/tickets/TicketMarketplacePage.tsx

- **Line 214**: window object
  ```typescript
  {(showFilters || !window.matchMedia('(max-width: 1024px)').matches) && <div className="lg:w-1/4 w-full">
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 491**: window object
  ```typescript
  <button onClick={() => window.scrollTo({
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

### apps/web/app/components/magic-patterns/pages/tickets/TicketDetailPage.tsx

- **Line 108**: window object
  ```typescript
  window.location.href = path;
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 112**: window object
  ```typescript
  window.location.href = path;
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 144**: document object
  ```typescript
  const link = document.createElement('a');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 147**: document object
  ```typescript
  document.body.appendChild(link);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 149**: document object
  ```typescript
  document.body.removeChild(link);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 156**: document object
  ```typescript
  const downloadAnchorNode = document.createElement('a');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 159**: document object
  ```typescript
  document.body.appendChild(downloadAnchorNode);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

### apps/web/app/components/magic-patterns/pages/social/NotificationsPage.tsx

- **Line 169**: alert/confirm/prompt
  ```typescript
  alert('Friend request accepted!');
  ```
  **Fix**: Replace with React modal or toast component

- **Line 181**: alert/confirm/prompt
  ```typescript
  alert(`Event invitation ${accept ? 'accepted' : 'declined'}!`);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 190**: alert/confirm/prompt
  ```typescript
  alert(`Group invitation ${accept ? 'accepted' : 'declined'}!`);
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/pages/profile/TicketsPage.tsx

- **Line 199**: document object
  ```typescript
  const link = document.createElement('a');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 202**: document object
  ```typescript
  document.body.appendChild(link);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 204**: document object
  ```typescript
  document.body.removeChild(link);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 220**: document object
  ```typescript
  const link = document.createElement('a');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 223**: document object
  ```typescript
  document.body.appendChild(link);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 225**: document object
  ```typescript
  document.body.removeChild(link);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

### apps/web/app/components/magic-patterns/pages/performers/PerformerManagementPage.tsx

- **Line 171**: alert/confirm/prompt
  ```typescript
  alert('Add new performer profile');
  ```
  **Fix**: Replace with React modal or toast component

- **Line 175**: alert/confirm/prompt
  ```typescript
  alert(`Edit performer ${performerId}`);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 182**: alert/confirm/prompt
  ```typescript
  alert(`Delete performer ${performerId}`);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 186**: alert/confirm/prompt
  ```typescript
  alert(`View booking request ${requestId}`);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 190**: alert/confirm/prompt
  ```typescript
  alert(`Approve booking request ${requestId}`);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 194**: alert/confirm/prompt
  ```typescript
  alert(`Decline booking request ${requestId}`);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 201**: alert/confirm/prompt
  ```typescript
  alert(`Saving settings for section: ${section}`);
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/pages/performers/PerformerDiscoveryPage.tsx

- **Line 221**: document object
  ```typescript
  document.addEventListener('mousedown', handleClickOutside);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 223**: document object
  ```typescript
  document.removeEventListener('mousedown', handleClickOutside);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 317**: document object
  ```typescript
  <button className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => document.getElementById('mobile-sort-dropdown')?.classList.toggle('hidden')}>
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 331**: document object
  ```typescript
  document.getElementById('mobile-sort-dropdown')?.classList.add('hidden');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 337**: document object
  ```typescript
  document.getElementById('mobile-sort-dropdown')?.classList.add('hidden');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 343**: document object
  ```typescript
  document.getElementById('mobile-sort-dropdown')?.classList.add('hidden');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 349**: document object
  ```typescript
  document.getElementById('mobile-sort-dropdown')?.classList.add('hidden');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 355**: document object
  ```typescript
  document.getElementById('mobile-sort-dropdown')?.classList.add('hidden');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 361**: document object
  ```typescript
  document.getElementById('mobile-sort-dropdown')?.classList.add('hidden');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 396**: document object
  ```typescript
  <button className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50" onClick={() => document.getElementById('sort-dropdown')?.classList.toggle('hidden')}>
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 409**: document object
  ```typescript
  document.getElementById('sort-dropdown')?.classList.add('hidden');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 415**: document object
  ```typescript
  document.getElementById('sort-dropdown')?.classList.add('hidden');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 421**: document object
  ```typescript
  document.getElementById('sort-dropdown')?.classList.add('hidden');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 427**: document object
  ```typescript
  document.getElementById('sort-dropdown')?.classList.add('hidden');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 433**: document object
  ```typescript
  document.getElementById('sort-dropdown')?.classList.add('hidden');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 439**: document object
  ```typescript
  document.getElementById('sort-dropdown')?.classList.add('hidden');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

### apps/web/app/components/magic-patterns/pages/performers/BookPerformerPage.tsx

- **Line 128**: window object
  ```typescript
  window.scrollTo(0, 0);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 116**: alert/confirm/prompt
  ```typescript
  alert('Please fill in all required fields.');
  ```
  **Fix**: Replace with React modal or toast component

- **Line 133**: alert/confirm/prompt
  ```typescript
  alert('Draft saved! You can return to complete your booking later.');
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/pages/my/dashboard.tsx

- **Line 474**: alert/confirm/prompt
  ```typescript
  alert(`Unfollowed ${entity.name}`);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 540**: alert/confirm/prompt
  ```typescript
  alert(`Bookmarked ${event.title}`);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 547**: alert/confirm/prompt
  ```typescript
  alert(`Removed ${event.title} from recommendations`);
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/pages/hub/[slug]/community.tsx

- **Line 138**: window object
  ```typescript
  window.location.href = `/hub/${slug}/new-thread`;
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 147**: window object
  ```typescript
  window.location.href = `/hub/${slug}/thread/${threadId}`;
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 156**: window object
  ```typescript
  window.location.href = path;
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

### apps/web/app/components/magic-patterns/pages/dashboard/calendars.tsx

- **Line 380**: document object
  ```typescript
  document.getElementById('pending-actions')?.scrollIntoView({
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 285**: alert/confirm/prompt
  ```typescript
  alert(`Delete calendar ${id}`);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 322**: alert/confirm/prompt
  ```typescript
  alert('Bulk edit feature');
  ```
  **Fix**: Replace with React modal or toast component

- **Line 324**: alert/confirm/prompt
  ```typescript
  alert('Export data feature');
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/pages/checkout/CheckoutPaymentPage.tsx

- **Line 18**: sessionStorage
  ```typescript
  const storedOrder = sessionStorage.getItem('selectedTickets');
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined" && window.sessionStorage) { ... }

- **Line 19**: sessionStorage
  ```typescript
  const storedCustomer = sessionStorage.getItem('customerInfo');
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined" && window.sessionStorage) { ... }

- **Line 40**: sessionStorage
  ```typescript
  sessionStorage.setItem('completedOrder', JSON.stringify({
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined" && window.sessionStorage) { ... }

### apps/web/app/components/magic-patterns/pages/checkout/CheckoutDetailsPage.tsx

- **Line 19**: sessionStorage
  ```typescript
  const storedOrder = sessionStorage.getItem('selectedTickets');
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined" && window.sessionStorage) { ... }

- **Line 35**: sessionStorage
  ```typescript
  sessionStorage.setItem('customerInfo', JSON.stringify({
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined" && window.sessionStorage) { ... }

### apps/web/app/components/magic-patterns/pages/checkout/CheckoutConfirmationPage.tsx

- **Line 16**: document object
  ```typescript
  const checkmarkAnimation = document.getElementById('checkmark-animation');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 22**: sessionStorage
  ```typescript
  const completedOrder = sessionStorage.getItem('completedOrder');
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined" && window.sessionStorage) { ... }

- **Line 23**: sessionStorage
  ```typescript
  const storedOrder = sessionStorage.getItem('selectedTickets');
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined" && window.sessionStorage) { ... }

- **Line 24**: sessionStorage
  ```typescript
  const storedCustomer = sessionStorage.getItem('customerInfo');
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined" && window.sessionStorage) { ... }

### apps/web/app/components/magic-patterns/pages/bookings/BookingConfirmationPage.tsx

- **Line 51**: document object
  ```typescript
  const link = document.createElement('a');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 54**: document object
  ```typescript
  document.body.appendChild(link);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 56**: document object
  ```typescript
  document.body.removeChild(link);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 87**: document object
  ```typescript
  const link = document.createElement('a');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 90**: document object
  ```typescript
  document.body.appendChild(link);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 92**: document object
  ```typescript
  document.body.removeChild(link);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 65**: navigator object
  ```typescript
  navigator.clipboard.writeText(bookingUrl);
  ```
  **Fix**: Wrap in: if (typeof navigator !== "undefined") { ... }

### apps/web/app/components/magic-patterns/pages/book-it/VenueMarketplacePage.tsx

- **Line 181**: window object
  ```typescript
  {(showFilters || !window.matchMedia('(max-width: 1024px)').matches) && <div className="lg:w-1/4 w-full">
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 289**: window object
  ```typescript
  <button onClick={() => window.scrollTo({
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

### apps/web/app/components/magic-patterns/pages/book-it/venues/VenueDetailPage.tsx

- **Line 206**: window object
  ```typescript
  url: window.location.href
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 514**: window object
  ```typescript
  <button onClick={() => window.scrollTo({
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 235**: document object
  ```typescript
  const element = document.getElementById(sectionId);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 202**: navigator object
  ```typescript
  if (navigator.share) {
  ```
  **Fix**: Wrap in: if (typeof navigator !== "undefined") { ... }

- **Line 203**: navigator object
  ```typescript
  navigator.share({
  ```
  **Fix**: Wrap in: if (typeof navigator !== "undefined") { ... }

- **Line 211**: alert/confirm/prompt
  ```typescript
  alert(`Share functionality: ${venue.name}`);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 217**: alert/confirm/prompt
  ```typescript
  alert('Please select a date for your event');
  ```
  **Fix**: Replace with React modal or toast component

- **Line 224**: alert/confirm/prompt
  ```typescript
  alert(`Opening message thread with ${venue.name}`);
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/pages/book-it/venues/BookingRequestPage.tsx

- **Line 47**: window object
  ```typescript
  window.scrollTo(0, 0);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 60**: window object
  ```typescript
  window.scrollTo(0, 0);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

### apps/web/app/components/magic-patterns/pages/auth/ResetPasswordPage.tsx

- **Line 25**: window object
  ```typescript
  const urlParams = new URLSearchParams(window.location.search);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

### apps/web/app/components/magic-patterns/pages/auth/EmailVerificationPage.tsx

- **Line 17**: window object
  ```typescript
  const urlParams = new URLSearchParams(window.location.search);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 46**: alert/confirm/prompt
  ```typescript
  alert(`Verification email resent to ${email}`);
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/context/NavigationContext.tsx

- **Line 38**: window object
  ```typescript
  window.location.href = path;
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 49**: window object
  ```typescript
  window.location.href = path;
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

### apps/web/app/components/magic-patterns/context/CheckInContext.tsx

- **Line 256**: window object
  ```typescript
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 259**: window object
  ```typescript
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 94**: localStorage
  ```typescript
  const savedCheckIns = localStorage.getItem('userCheckIns');
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined" && window.localStorage) { ... }

- **Line 109**: localStorage
  ```typescript
  const savedPlannedEvents = localStorage.getItem('userPlannedEvents');
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined" && window.localStorage) { ... }

- **Line 121**: localStorage
  ```typescript
  localStorage.setItem('userCheckIns', JSON.stringify(checkIns));
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined" && window.localStorage) { ... }

- **Line 127**: localStorage
  ```typescript
  localStorage.setItem('userPlannedEvents', JSON.stringify(plannedEvents));
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined" && window.localStorage) { ... }

- **Line 132**: navigator object
  ```typescript
  if (!navigator.geolocation) {
  ```
  **Fix**: Wrap in: if (typeof navigator !== "undefined") { ... }

- **Line 138**: navigator object
  ```typescript
  navigator.geolocation.getCurrentPosition(resolve, reject, {
  ```
  **Fix**: Wrap in: if (typeof navigator !== "undefined") { ... }

- **Line 266**: navigator object
  ```typescript
  navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
  ```
  **Fix**: Wrap in: if (typeof navigator !== "undefined") { ... }

- **Line 263**: alert/confirm/prompt
  ```typescript
  alert('To share on Instagram, please take a screenshot and share it from the Instagram app');
  ```
  **Fix**: Replace with React modal or toast component

- **Line 267**: alert/confirm/prompt
  ```typescript
  alert('Check-in link copied to clipboard!');
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/components/venue-profile/VenueImageGallery.tsx

- **Line 33**: window object
  ```typescript
  window.open(virtualTourUrl, '_blank');
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 50**: window object
  ```typescript
  window.addEventListener('keydown', handleKeyDown);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 51**: window object
  ```typescript
  return () => window.removeEventListener('keydown', handleKeyDown);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 19**: document object
  ```typescript
  document.body.style.overflow = 'hidden';
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 23**: document object
  ```typescript
  document.body.style.overflow = 'auto';
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 35**: alert/confirm/prompt
  ```typescript
  alert('Virtual tour is not available for this venue');
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/components/venue-profile/VenueBookingWidget.tsx

- **Line 32**: alert/confirm/prompt
  ```typescript
  alert('Please fill in all required fields');
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/components/venue-detail/ImageGallery.tsx

- **Line 40**: window object
  ```typescript
  window.addEventListener('keydown', handleKeyDown);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 41**: window object
  ```typescript
  return () => window.removeEventListener('keydown', handleKeyDown);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 16**: document object
  ```typescript
  document.body.style.overflow = 'hidden';
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 20**: document object
  ```typescript
  document.body.style.overflow = 'auto';
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

### apps/web/app/components/magic-patterns/components/ui/SharePopup.tsx

- **Line 31**: window object
  ```typescript
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`, '_blank');
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 38**: window object
  ```typescript
  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 45**: window object
  ```typescript
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 52**: window object
  ```typescript
  window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`;
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 22**: navigator object
  ```typescript
  navigator.clipboard.writeText(url);
  ```
  **Fix**: Wrap in: if (typeof navigator !== "undefined") { ... }

### apps/web/app/components/magic-patterns/components/ui/LocationSelector.tsx

- **Line 38**: navigator object
  ```typescript
  navigator.geolocation.getCurrentPosition(position => {
  ```
  **Fix**: Wrap in: if (typeof navigator !== "undefined") { ... }

- **Line 45**: alert/confirm/prompt
  ```typescript
  alert('Unable to get your current location. Please check your browser permissions.');
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/components/sharing/ShareEmbedWidget.tsx

- **Line 181**: window object
  ```typescript
  window.open(`mailto:?subject=${subject}&body=${body}`);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 185**: window object
  ```typescript
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 188**: window object
  ```typescript
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 191**: window object
  ```typescript
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 100**: document object
  ```typescript
  document.addEventListener('mousedown', handleClickOutside);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 103**: document object
  ```typescript
  document.removeEventListener('mousedown', handleClickOutside);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 148**: document object
  ```typescript
  const textArea = document.createElement('textarea');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 153**: document object
  ```typescript
  document.body.appendChild(textArea);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 156**: document object
  ```typescript
  document.execCommand('copy');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 167**: document object
  ```typescript
  const link = document.createElement('a');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 170**: document object
  ```typescript
  document.body.appendChild(link);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 172**: document object
  ```typescript
  document.body.removeChild(link);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 129**: navigator object
  ```typescript
  if (navigator.clipboard && navigator.clipboard.writeText) {
  ```
  **Fix**: Wrap in: if (typeof navigator !== "undefined") { ... }

- **Line 129**: navigator object
  ```typescript
  if (navigator.clipboard && navigator.clipboard.writeText) {
  ```
  **Fix**: Wrap in: if (typeof navigator !== "undefined") { ... }

- **Line 130**: navigator object
  ```typescript
  navigator.clipboard.writeText(text).then(() => {
  ```
  **Fix**: Wrap in: if (typeof navigator !== "undefined") { ... }

- **Line 281**: navigator object
  ```typescript
  {navigator.share && <button onClick={() => {
  ```
  **Fix**: Wrap in: if (typeof navigator !== "undefined") { ... }

- **Line 282**: navigator object
  ```typescript
  navigator.share({
  ```
  **Fix**: Wrap in: if (typeof navigator !== "undefined") { ... }

- **Line 195**: alert/confirm/prompt
  ```typescript
  alert('Instagram sharing typically requires the mobile app. Copy the link and share it manually on Instagram.');
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/components/settings/NotificationPreferences.tsx

- **Line 63**: window object
  ```typescript
  const confirmed = window.confirm('Are you sure you want to unsubscribe from all notifications? You can re-enable them at any time.');
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 63**: alert/confirm/prompt
  ```typescript
  const confirmed = window.confirm('Are you sure you want to unsubscribe from all notifications? You can re-enable them at any time.');
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/components/profile/SharedCalendars.tsx

- **Line 286**: navigator object
  ```typescript
  navigator.clipboard.writeText(`https://whensthefun.com/calendar/${shareModalOpen}`);
  ```
  **Fix**: Wrap in: if (typeof navigator !== "undefined") { ... }

### apps/web/app/components/magic-patterns/components/navigation/FloatingNav.tsx

- **Line 97**: window object
  ```typescript
  window.location.href = path;
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 16**: document object
  ```typescript
  document.addEventListener('mousedown', handleClickOutside);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 17**: document object
  ```typescript
  return () => document.removeEventListener('mousedown', handleClickOutside);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

### apps/web/app/components/magic-patterns/components/layout/MainHeader.tsx

- **Line 53**: window object
  ```typescript
  setIsScrolled(window.scrollY > 20);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 55**: window object
  ```typescript
  window.addEventListener('scroll', handleScroll);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 56**: window object
  ```typescript
  return () => window.removeEventListener('scroll', handleScroll);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 65**: window object
  ```typescript
  window.location.href = path;
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

### apps/web/app/components/magic-patterns/components/hub-builder/SectionManager.tsx

- **Line 180**: window object
  ```typescript
  const confirmed = window.confirm('Are you sure you want to delete this section?');
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 180**: alert/confirm/prompt
  ```typescript
  const confirmed = window.confirm('Are you sure you want to delete this section?');
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/components/hub-builder/PermissionsRoles.tsx

- **Line 108**: window object
  ```typescript
  const confirmed = window.confirm('Are you sure you want to delete this member tier?');
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 108**: alert/confirm/prompt
  ```typescript
  const confirmed = window.confirm('Are you sure you want to delete this member tier?');
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/components/hub-builder/MonetizationSetup.tsx

- **Line 38**: window object
  ```typescript
  const confirmed = window.confirm('Are you sure you want to delete this membership tier?');
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 109**: window object
  ```typescript
  const confirmed = window.confirm('Are you sure you want to delete this sponsor slot?');
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 38**: alert/confirm/prompt
  ```typescript
  const confirmed = window.confirm('Are you sure you want to delete this membership tier?');
  ```
  **Fix**: Replace with React modal or toast component

- **Line 109**: alert/confirm/prompt
  ```typescript
  const confirmed = window.confirm('Are you sure you want to delete this sponsor slot?');
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/components/hub/gallery/MediaLightbox.tsx

- **Line 39**: window object
  ```typescript
  window.addEventListener('keydown', handleKeyDown);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 41**: window object
  ```typescript
  window.removeEventListener('keydown', handleKeyDown);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 46**: document object
  ```typescript
  document.body.style.overflow = 'hidden';
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 48**: document object
  ```typescript
  document.body.style.overflow = 'auto';
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 62**: alert/confirm/prompt
  ```typescript
  alert(`Downloading ${mediaItem.title}`);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 67**: alert/confirm/prompt
  ```typescript
  alert(`Sharing ${mediaItem.title}`);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 74**: alert/confirm/prompt
  ```typescript
  alert(`Comment submitted: ${comment}`);
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/components/hub/gallery/MediaItem.tsx

- **Line 32**: alert/confirm/prompt
  ```typescript
  alert(`Share ${media.title}`);
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/components/hub/gallery/MediaGrid.tsx

- **Line 39**: window object
  ```typescript
  if (window.innerWidth < 640) return 1;
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 40**: window object
  ```typescript
  if (window.innerWidth < 768) return 2;
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

### apps/web/app/components/magic-patterns/components/hub/events/MapView.tsx

- **Line 33**: window object
  ```typescript
  window.open(`https://maps.google.com/?q=${lat},${lng}`, '_blank');
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

### apps/web/app/components/magic-patterns/components/hub/events/EnhancedEventCard.tsx

- **Line 52**: document object
  ```typescript
  const link = document.createElement('a');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 55**: document object
  ```typescript
  document.body.appendChild(link);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 57**: document object
  ```typescript
  document.body.removeChild(link);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

### apps/web/app/components/magic-patterns/components/hub/analytics/ExportTools.tsx

- **Line 36**: alert/confirm/prompt
  ```typescript
  alert(`Export complete! Your ${selectedFormat.toUpperCase()} file has been downloaded.`);
  ```
  **Fix**: Replace with React modal or toast component

- **Line 189**: alert/confirm/prompt
  ```typescript
  alert('Redirecting to upgrade page...');
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/components/events/EventHero.tsx

- **Line 56**: window object
  ```typescript
  <button onClick={() => window.history.back()} className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full transition-colors duration-150 shadow-md" aria-label="Go back">
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 67**: window object
  ```typescript
  url: window.location.href
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 63**: navigator object
  ```typescript
  if (navigator.share) {
  ```
  **Fix**: Wrap in: if (typeof navigator !== "undefined") { ... }

- **Line 64**: navigator object
  ```typescript
  navigator.share({
  ```
  **Fix**: Wrap in: if (typeof navigator !== "undefined") { ... }

### apps/web/app/components/magic-patterns/components/calendar/EventCard.tsx

- **Line 73**: window object
  ```typescript
  window.open(event.ticketInfo.url, '_blank');
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 216**: window object
  ```typescript
  {showSharePopup && <SharePopup isOpen={showSharePopup} onClose={() => setShowSharePopup(false)} title={event.title} description={`${event.title} at ${event.venue.name} on ${formatEventDate(event.date)}`} url={`${window.location.origin}/event/${event.id}`} image={event.image} />}
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 99**: document object
  ```typescript
  const link = document.createElement('a');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 102**: document object
  ```typescript
  document.body.appendChild(link);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 104**: document object
  ```typescript
  document.body.removeChild(link);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 75**: alert/confirm/prompt
  ```typescript
  alert(`Purchasing tickets for: ${event.title}`);
  ```
  **Fix**: Replace with React modal or toast component

### apps/web/app/components/magic-patterns/components/calendar/CalendarWizard.tsx

- **Line 83**: window object
  ```typescript
  window.scrollTo(0, 0);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 89**: window object
  ```typescript
  window.scrollTo(0, 0);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

### apps/web/app/components/magic-patterns/components/calendar/CalendarEngagementBar.tsx

- **Line 38**: document object
  ```typescript
  <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700" onClick={() => document.getElementById('discussion-tab')?.click()}>
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

### apps/web/app/components/magic-patterns/components/calendar/wizard/AutomationRulesStep.tsx

- **Line 362**: document object
  ```typescript
  const input = document.getElementById('locations') as HTMLInputElement;
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 394**: document object
  ```typescript
  const input = document.getElementById('keywords') as HTMLInputElement;
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 431**: document object
  ```typescript
  const input = document.getElementById('venues-include') as HTMLInputElement;
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 462**: document object
  ```typescript
  const input = document.getElementById('venues-exclude') as HTMLInputElement;
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

### apps/web/app/components/magic-patterns/components/bookings/ConfettiCelebration.tsx

- **Line 5**: window object
  ```typescript
  width: window.innerWidth,
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 6**: window object
  ```typescript
  height: window.innerHeight
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 12**: window object
  ```typescript
  width: window.innerWidth,
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 13**: window object
  ```typescript
  height: window.innerHeight
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 16**: window object
  ```typescript
  window.addEventListener('resize', handleResize);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

- **Line 25**: window object
  ```typescript
  window.removeEventListener('resize', handleResize);
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

### apps/web/app/components/magic-patterns/components/bookings/ActionButtons.tsx

- **Line 34**: document object
  ```typescript
  const link = document.createElement('a');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 37**: document object
  ```typescript
  document.body.appendChild(link);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 39**: document object
  ```typescript
  document.body.removeChild(link);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 72**: document object
  ```typescript
  const link = document.createElement('a');
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 75**: document object
  ```typescript
  document.body.appendChild(link);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 77**: document object
  ```typescript
  document.body.removeChild(link);
  ```
  **Fix**: Wrap in: if (typeof document !== "undefined") { ... }

- **Line 48**: navigator object
  ```typescript
  navigator.clipboard.writeText(bookingUrl);
  ```
  **Fix**: Wrap in: if (typeof navigator !== "undefined") { ... }

### apps/web/app/components/magic-patterns/components/booking/SubmitStep.tsx

- **Line 169**: window object
  ```typescript
  <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium" onClick={() => window.history.back()}>
  ```
  **Fix**: Wrap in: if (typeof window !== "undefined") { ... }

### apps/web/app/components/magic-patterns/components/booking/ConfirmationStep.tsx

- **Line 35**: navigator object
  ```typescript
  navigator.clipboard.writeText(bookingReference);
  ```
  **Fix**: Wrap in: if (typeof navigator !== "undefined") { ... }

- **Line 36**: alert/confirm/prompt
  ```typescript
  alert('Booking reference copied to clipboard!');
  ```
  **Fix**: Replace with React modal or toast component

## Common SSR Fixes

### 1. Conditional Window Access
```typescript
if (typeof window !== "undefined") {
  // Browser-only code here
  window.location.href = "/path";
}
```

### 2. Storage Access Helper
```typescript
const getStorageItem = (key: string) => {
  if (typeof window !== "undefined" && window.localStorage) {
    return localStorage.getItem(key);
  }
  return null;
};
```

### 3. useEffect for Browser APIs
```typescript
useEffect(() => {
  // Browser APIs are safe here
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
```

### 4. Dynamic Imports for Browser-Only Libraries
```typescript
const MyComponent = dynamic(() => import("./BrowserOnlyComponent"), {
  ssr: false
});
```
