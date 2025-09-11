// MOCKDATA COMMENTED OUT - Using real database data instead
/* export const mockEvents = [
  {
    id: 'event-1',
    slug: 'clearwater-jazz-holiday-2024',
    title: 'Clearwater Jazz Holiday',
    description: `<p>The Clearwater Jazz Holiday is a premier music festival celebrating its 45th anniversary in 2024. Join us for four days of exceptional jazz, funk, blues, and more at the beautiful waterfront Coachman Park in downtown Clearwater.</p>
    <p>This year's lineup features an impressive roster of Grammy-winning artists, emerging talents, and local favorites across three stages. Enjoy delicious food from local vendors, craft beverages, and a vibrant atmosphere that celebrates the rich cultural heritage of jazz music.</p>
    <p>The festival is more than just music - it's a community celebration that supports music education through the Clearwater Jazz Holiday Foundation. A portion of all ticket sales goes directly to funding music programs in local schools.</p>`,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    date: new Date(2024, 9, 15, 17, 0),
    endDate: new Date(2024, 9, 18, 23, 0),
    venue: {
      id: 'venue-1',
      name: 'Coachman Park',
      verified: true,
      address: '301 Drew St, Clearwater, FL 33755',
      neighborhood: 'Downtown'
    },
    category: 'Music',
    ticketPrice: 45,
    ticketsAvailable: true
  },
  {
    id: 'event-2', 
    slug: 'downtown-food-festival',
    title: 'Downtown Food Festival',
    description: `<p>Indulge in the flavors of downtown at our annual Food Festival! Featuring over 30 local restaurants, food trucks, and vendors serving up their signature dishes in the heart of the city.</p>
    <p>From gourmet street food to artisanal desserts, there's something for every palate. Meet the chefs, learn cooking techniques, and discover new favorite spots in your neighborhood.</p>
    <p>Live music, family activities, and cooking demonstrations round out this delicious weekend celebration of local cuisine.</p>`,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    date: new Date(2024, 8, 22, 11, 0),
    endDate: new Date(2024, 8, 24, 20, 0),
    venue: {
      id: 'venue-2',
      name: 'Downtown Plaza',
      verified: true, 
      address: '123 Main St, Clearwater, FL 33755',
      neighborhood: 'Downtown'
    },
    category: 'Food & Drink',
    ticketPrice: 15,
    ticketsAvailable: true
  },
  {
    id: 'event-3',
    slug: 'art-walk-gallery-night',
    title: 'Art Walk Gallery Night',
    description: `<p>Experience the vibrant arts scene of Clearwater during our monthly Art Walk! Explore galleries, meet local artists, and discover unique pieces from emerging and established talents.</p>
    <p>This self-guided tour takes you through the arts district, with special exhibitions, artist demonstrations, and wine tastings at participating venues.</p>
    <p>Free and family-friendly, Art Walk is a celebration of creativity and community that brings together art lovers of all ages.</p>`,
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    date: new Date(2024, 9, 5, 18, 0),
    endDate: new Date(2024, 9, 5, 22, 0),
    venue: {
      id: 'venue-3',
      name: 'Arts District',
      verified: true,
      address: '456 Art Ave, Clearwater, FL 33755', 
      neighborhood: 'Arts District'
    },
    category: 'Arts & Culture',
    ticketPrice: 0,
    ticketsAvailable: true
  },
  {
    id: 'event-4',
    slug: 'sunset-beach-concert',
    title: 'Sunset Beach Concert Series',
    description: `<p>Join us for an evening of music with the sand between your toes! Our Sunset Beach Concert Series features live performances against the stunning backdrop of the Gulf Coast sunset.</p>
    <p>This week featuring local indie rock band "Coastal Drift" with their blend of surf rock and alternative sounds perfect for a beach evening.</p>
    <p>Bring your beach chairs, grab some food from local vendors, and enjoy free live music in one of Florida's most beautiful settings.</p>`,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    date: new Date(2024, 8, 28, 19, 0),
    endDate: new Date(2024, 8, 28, 22, 0),
    venue: {
      id: 'venue-4',
      name: 'Clearwater Beach',
      verified: true,
      address: '25 Causeway Blvd, Clearwater Beach, FL 33767',
      neighborhood: 'Beach'
    },
    category: 'Music', 
    ticketPrice: 0,
    ticketsAvailable: true
  },
  {
    id: 'event-5',
    slug: 'comedy-night-laughs',
    title: 'Comedy Night at The Laugh Track',
    description: `<p>Get ready for a night of side-splitting laughter at Clearwater's premier comedy venue! Featuring a lineup of touring comedians and local favorites guaranteed to keep you entertained.</p>
    <p>Tonight's headliner is Mike Stevens, fresh from his Comedy Central appearance, with opening acts from Tampa Bay's rising comedy stars.</p>
    <p>Food and drink specials all night long. Must be 21+ to attend.</p>`,
    image: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    date: new Date(2024, 8, 30, 20, 0),
    endDate: new Date(2024, 8, 30, 23, 0),
    venue: {
      id: 'venue-5',
      name: 'The Laugh Track',
      verified: true,
      address: '789 Comedy Blvd, Clearwater, FL 33756',
      neighborhood: 'Entertainment District'
    },
    category: 'Comedy',
    ticketPrice: 25,
    ticketsAvailable: true
  },
  {
    id: 'event-6',
    slug: 'farmers-market-saturday',
    title: 'Saturday Farmers Market',
    description: `<p>Start your weekend right at our vibrant farmers market! Fresh produce, artisanal goods, live music, and community spirit come together every Saturday morning.</p>
    <p>Shop directly from local farmers and makers, enjoy fresh breakfast options, and let the kids enjoy the playground area while you browse.</p>
    <p>Rain or shine, we're here every Saturday supporting local agriculture and small businesses.</p>`,
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    date: new Date(2024, 8, 21, 8, 0),
    endDate: new Date(2024, 8, 21, 14, 0),
    venue: {
      id: 'venue-6',
      name: 'Memorial Causeway Park',
      verified: true,
      address: '100 Memorial Causeway, Clearwater, FL 33755',
      neighborhood: 'Bayfront'
    },
    category: 'Community',
    ticketPrice: 0,
    ticketsAvailable: true
  }
]; */