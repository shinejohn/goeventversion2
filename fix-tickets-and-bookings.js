const { createClient } = require('@supabase/supabase-js');

// Use the correct Supabase URL and service role key
const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixTicketsAndBookings() {
  console.log('🎫 Fixing tickets and bookings...\n');
  
  try {
    // Create tickets for events with proper required fields
    await createTicketsForEvents();
    
    // Create sample bookings with proper required fields
    await createSampleBookings();
    
    console.log('\n✅ Tickets and bookings fixed!');
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  }
}

async function createTicketsForEvents() {
  console.log('🎫 Creating tickets for events...');
  
  const { data: events } = await supabase
    .from('events')
    .select('id, title, price_min, price_max')
    .limit(10);
  
  if (!events) return;
  
  for (const event of events) {
    const basePrice = event.price_min || event.price_max || 25.00;
    
    const tickets = [
      {
        event_id: event.id,
        ticket_number: `TKT-${event.id.slice(0, 8)}-GA-${Date.now()}`,
        ticket_type: 'General Admission',
        quantity: 100,
        price_per_ticket: basePrice,
        total_price: basePrice,
        purchase_date: new Date().toISOString(),
        delivery_method: 'digital',
        status: 'available',
        check_in_code: `CHK-${event.id.slice(0, 8)}-${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString()
      },
      {
        event_id: event.id,
        ticket_number: `TKT-${event.id.slice(0, 8)}-VIP-${Date.now()}`,
        ticket_type: 'VIP',
        quantity: 20,
        price_per_ticket: basePrice * 2,
        total_price: basePrice * 2,
        purchase_date: new Date().toISOString(),
        delivery_method: 'digital',
        status: 'available',
        check_in_code: `CHK-${event.id.slice(0, 8)}-${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString()
      }
    ];
    
    for (const ticket of tickets) {
      const { error } = await supabase
        .from('tickets')
        .upsert(ticket);
      
      if (error) {
        console.log(`⚠️  Failed to create ticket for ${event.title}:`, error.message);
      } else {
        console.log(`✅ Created ticket: ${ticket.ticket_type} for ${event.title}`);
      }
    }
  }
}

async function createSampleBookings() {
  console.log('\n📋 Creating sample bookings...');
  
  const { data: events } = await supabase
    .from('events')
    .select('id, title, venue_id, start_datetime')
    .limit(5);
  
  const { data: performers } = await supabase
    .from('performers')
    .select('id, name')
    .limit(5);
  
  const { data: accounts } = await supabase
    .from('accounts')
    .select('id')
    .limit(1);
  
  if (!events || !performers || !accounts) return;
  
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const performer = performers[i % performers.length];
    const account = accounts[0];
    
    const basePrice = 1000.00;
    const serviceFee = basePrice * 0.1; // 10% service fee
    const subtotal = basePrice + serviceFee;
    
    const booking = {
      event_id: event.id,
      venue_id: event.venue_id,
      performer_id: performer.id,
      user_id: account.id,
      booking_reference: `BK-${Date.now()}-${i}`,
      event_name: event.title,
      event_type: 'music',
      event_date: event.start_datetime,
      start_time: '20:00:00',
      end_time: '23:00:00',
      guest_count: 50,
      contact_person_name: 'Event Organizer',
      contact_person_email: 'organizer@example.com',
      base_price: basePrice,
      service_fee: serviceFee,
      subtotal: subtotal,
      total: subtotal,
      payment_status: 'paid',
      booking_status: 'confirmed',
      created_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('bookings')
      .upsert(booking);
    
    if (error) {
      console.log(`⚠️  Failed to create booking for ${event.title}:`, error.message);
    } else {
      console.log(`✅ Created booking: ${booking.booking_reference} for ${event.title}`);
    }
  }
}

fixTicketsAndBookings().catch(console.error);
