import React from 'react';
// MOCKDATA COMMENTED OUT - Using real database data instead
/* export const mockPerformers = [{
  id: 'performer-1',
  name: 'The Sunset Vibes',
  profileImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  genres: ['Rock/Alternative', 'Indie', 'Pop/Top 40'],
  rating: 4.8,
  reviewCount: 42,
  followerCount: 12500,
  bio: 'The Sunset Vibes are a dynamic indie rock band known for their energetic performances and catchy melodies. With influences ranging from classic rock to modern indie pop, they create a unique sound that resonates with audiences of all ages.',
  yearsActive: 5,
  showsPlayed: 320,
  homeCity: 'Clearwater, FL',
  isVerified: true,
  isTouringNow: true,
  availableForBooking: true,
  hasMerchandise: true,
  hasOriginalMusic: true,
  offersMeetAndGreet: true,
  takesRequests: false,
  availableForPrivateEvents: true,
  isFamilyFriendly: true,
  hasSamples: true,
  trendingScore: 92,
  distanceMiles: 1.2,
  addedDate: '2019-06-15',
  introductoryPricing: false,
  upcomingShows: [{
    date: '2024-06-15',
    venue: 'Capitol Theatre',
    ticketsAvailable: true
  }, {
    date: '2024-06-22',
    venue: 'Jannus Live',
    ticketsAvailable: true
  }, {
    date: '2024-07-04',
    venue: 'Coachman Park',
    ticketsAvailable: false
  }]
}, {
  id: 'performer-2',
  name: 'DJ Coastal',
  profileImage: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  genres: ['Electronic/DJ', 'House', 'Dance'],
  rating: 4.7,
  reviewCount: 38,
  followerCount: 8700,
  bio: "DJ Coastal brings the beach vibes to every set with his unique blend of tropical house and electronic dance music. Known for seamless transitions and crowd-pleasing remixes, he's a staple in the Florida club scene.",
  yearsActive: 7,
  showsPlayed: 450,
  homeCity: 'St. Petersburg, FL',
  isVerified: true,
  isTouringNow: false,
  availableForBooking: true,
  hasMerchandise: false,
  hasOriginalMusic: true,
  offersMeetAndGreet: false,
  takesRequests: true,
  availableForPrivateEvents: true,
  isFamilyFriendly: false,
  hasSamples: true,
  trendingScore: 87,
  distanceMiles: 8.5,
  addedDate: '2018-03-20',
  introductoryPricing: false,
  upcomingShows: [{
    date: '2024-06-20',
    venue: 'The District Lounge',
    ticketsAvailable: true
  }, {
    date: '2024-06-27',
    venue: 'Park & Rec',
    ticketsAvailable: true
  }, {
    date: '2024-07-10',
    venue: 'Ringside Cafe',
    ticketsAvailable: false
  }]
}, {
  id: 'performer-3',
  name: 'Sarah Johnson',
  profileImage: 'https://images.unsplash.com/photo-1549213783-8284d0336c4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  genres: ['Country/Folk', 'Acoustic', 'Americana'],
  rating: 4.9,
  reviewCount: 29,
  followerCount: 5200,
  bio: 'Sarah Johnson captivates audiences with her heartfelt lyrics and soulful voice. Her acoustic folk style draws from traditional country roots while incorporating modern storytelling elements. A true performer who connects with her audience on a personal level.',
  yearsActive: 4,
  showsPlayed: 180,
  homeCity: 'Dunedin, FL',
  isVerified: false,
  isTouringNow: false,
  availableForBooking: true,
  hasMerchandise: true,
  hasOriginalMusic: true,
  offersMeetAndGreet: true,
  takesRequests: true,
  availableForPrivateEvents: true,
  isFamilyFriendly: true,
  hasSamples: true,
  trendingScore: 78,
  distanceMiles: 5.3,
  addedDate: '2020-08-12',
  introductoryPricing: false,
  upcomingShows: [{
    date: '2024-06-22',
    venue: 'Clear Sky on Cleveland',
    ticketsAvailable: false
  }, {
    date: '2024-06-29',
    venue: 'Dunedin Brewery',
    ticketsAvailable: true
  }, {
    date: '2024-07-15',
    venue: 'The Refinery',
    ticketsAvailable: false
  }]
}, {
  id: 'performer-4',
  name: 'Comedy Crew',
  profileImage: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  genres: ['Comedy', 'Improv', 'Stand-up'],
  rating: 4.6,
  reviewCount: 24,
  followerCount: 3800,
  bio: 'The Comedy Crew brings non-stop laughter with their mix of improv, sketch comedy, and stand-up routines. This talented group of comedians tackles everyday situations with a hilarious twist, making each show a unique experience.',
  yearsActive: 3,
  showsPlayed: 120,
  homeCity: 'Tampa, FL',
  isVerified: false,
  isTouringNow: true,
  availableForBooking: true,
  hasMerchandise: true,
  hasOriginalMusic: false,
  offersMeetAndGreet: true,
  takesRequests: false,
  availableForPrivateEvents: true,
  isFamilyFriendly: false,
  hasSamples: false,
  trendingScore: 73,
  distanceMiles: 15.7,
  addedDate: '2021-02-05',
  introductoryPricing: false,
  upcomingShows: [{
    date: '2024-06-25',
    venue: 'Ruth Eckerd Hall',
    ticketsAvailable: true
  }, {
    date: '2024-07-02',
    venue: 'Tampa Improv',
    ticketsAvailable: true
  }, {
    date: '2024-07-09',
    venue: 'Side Splitters Comedy Club',
    ticketsAvailable: false
  }]
}, {
  id: 'performer-5',
  name: 'The Beach Boys Tribute',
  profileImage: 'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  genres: ['Cover Bands', 'Rock/Alternative', 'Pop/Top 40'],
  rating: 4.5,
  reviewCount: 36,
  followerCount: 2900,
  bio: "The Beach Boys Tribute faithfully recreates the iconic sound and harmonies of the legendary band. From 'Surfin' USA' to 'Good Vibrations,' they deliver an authentic experience that transports audiences back to the golden age of surf rock.",
  yearsActive: 8,
  showsPlayed: 410,
  homeCity: 'Clearwater, FL',
  isVerified: true,
  isTouringNow: false,
  availableForBooking: true,
  hasMerchandise: true,
  hasOriginalMusic: false,
  offersMeetAndGreet: true,
  takesRequests: true,
  availableForPrivateEvents: true,
  isFamilyFriendly: true,
  hasSamples: true,
  trendingScore: 65,
  distanceMiles: 2.1,
  addedDate: '2016-11-30',
  introductoryPricing: false,
  upcomingShows: [{
    date: '2024-06-14',
    venue: 'Coachman Park',
    ticketsAvailable: true
  }, {
    date: '2024-06-21',
    venue: 'Pier 60',
    ticketsAvailable: false
  }, {
    date: '2024-07-06',
    venue: 'Capitol Theatre',
    ticketsAvailable: true
  }]
}, {
  id: 'performer-6',
  name: 'Street Art Collective',
  profileImage: 'https://images.unsplash.com/photo-1460480278897-2c8dce96d2f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  genres: ['Hip-Hop/Rap', 'Urban', 'Jazz/Blues'],
  rating: 4.7,
  reviewCount: 31,
  followerCount: 4100,
  bio: 'Street Art Collective is a fusion of musical talent bringing together elements of hip-hop, jazz, and spoken word. Their performances often include live painting and other visual arts, creating a multi-sensory experience that celebrates urban culture.',
  yearsActive: 4,
  showsPlayed: 150,
  homeCity: 'St. Petersburg, FL',
  isVerified: false,
  isTouringNow: false,
  availableForBooking: true,
  hasMerchandise: true,
  hasOriginalMusic: true,
  offersMeetAndGreet: true,
  takesRequests: false,
  availableForPrivateEvents: true,
  isFamilyFriendly: true,
  hasSamples: true,
  trendingScore: 82,
  distanceMiles: 9.3,
  addedDate: '2020-03-15',
  introductoryPricing: false,
  upcomingShows: [{
    date: '2024-06-18',
    venue: 'Downtown Arts District',
    ticketsAvailable: false
  }, {
    date: '2024-06-25',
    venue: 'The Factory',
    ticketsAvailable: true
  }, {
    date: '2024-07-09',
    venue: 'Jannus Live',
    ticketsAvailable: true
  }]
}, {
  id: 'performer-7',
  name: 'Classical Strings Quartet',
  profileImage: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  genres: ['Classical/Orchestra', 'Chamber Music', 'Contemporary'],
  rating: 4.9,
  reviewCount: 27,
  followerCount: 1800,
  bio: 'Classical Strings Quartet performs a diverse repertoire ranging from Baroque masterpieces to contemporary compositions. Their technical precision and emotional depth bring classical music to life in intimate venues and grand concert halls alike.',
  yearsActive: 12,
  showsPlayed: 520,
  homeCity: 'Tampa, FL',
  isVerified: true,
  isTouringNow: true,
  availableForBooking: true,
  hasMerchandise: false,
  hasOriginalMusic: false,
  offersMeetAndGreet: true,
  takesRequests: true,
  availableForPrivateEvents: true,
  isFamilyFriendly: true,
  hasSamples: true,
  trendingScore: 58,
  distanceMiles: 18.2,
  addedDate: '2012-09-22',
  introductoryPricing: false,
  upcomingShows: [{
    date: '2024-06-16',
    venue: 'Ruth Eckerd Hall',
    ticketsAvailable: true
  }, {
    date: '2024-06-23',
    venue: 'Straz Center',
    ticketsAvailable: true
  }, {
    date: '2024-07-07',
    venue: 'Palladium Theater',
    ticketsAvailable: false
  }]
}, {
  id: 'performer-8',
  name: 'Tropical Rhythms',
  profileImage: 'https://images.unsplash.com/photo-1504704911898-68304a7d2807?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  genres: ['Latin', 'World Music', 'Jazz/Blues'],
  rating: 4.8,
  reviewCount: 34,
  followerCount: 3500,
  bio: 'Tropical Rhythms brings the vibrant sounds of Latin America to every performance. Their energetic blend of salsa, merengue, and Latin jazz gets audiences on their feet and dancing. A colorful, high-energy show that transports you to the Caribbean.',
  yearsActive: 6,
  showsPlayed: 280,
  homeCity: 'Clearwater, FL',
  isVerified: true,
  isTouringNow: false,
  availableForBooking: true,
  hasMerchandise: true,
  hasOriginalMusic: true,
  offersMeetAndGreet: false,
  takesRequests: true,
  availableForPrivateEvents: true,
  isFamilyFriendly: true,
  hasSamples: true,
  trendingScore: 77,
  distanceMiles: 3.4,
  addedDate: '2018-06-10',
  introductoryPricing: false,
  upcomingShows: [{
    date: '2024-06-17',
    venue: 'Pier 60',
    ticketsAvailable: false
  }, {
    date: '2024-06-24',
    venue: "Shephard's Beach Resort",
    ticketsAvailable: true
  }, {
    date: '2024-07-08',
    venue: "Coconut Charlie's",
    ticketsAvailable: true
  }]
}, {
  id: 'performer-9',
  name: 'The Neon Lights',
  profileImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  genres: ['Pop/Top 40', 'Synthwave', 'Electronic/DJ'],
  rating: 4.6,
  reviewCount: 22,
  followerCount: 4800,
  bio: 'The Neon Lights create an immersive retro-futuristic experience with their synthwave sound and dazzling visual effects. Drawing inspiration from 80s pop culture and modern electronic music, they deliver a nostalgic yet fresh performance.',
  yearsActive: 3,
  showsPlayed: 95,
  homeCity: 'St. Petersburg, FL',
  isVerified: false,
  isTouringNow: true,
  availableForBooking: true,
  hasMerchandise: true,
  hasOriginalMusic: true,
  offersMeetAndGreet: true,
  takesRequests: false,
  availableForPrivateEvents: true,
  isFamilyFriendly: true,
  hasSamples: true,
  trendingScore: 88,
  distanceMiles: 10.1,
  addedDate: '2021-05-18',
  introductoryPricing: false,
  upcomingShows: [{
    date: '2024-06-19',
    venue: 'Jannus Live',
    ticketsAvailable: true
  }, {
    date: '2024-06-26',
    venue: 'The Bends',
    ticketsAvailable: false
  }, {
    date: '2024-07-03',
    venue: 'State Theatre',
    ticketsAvailable: true
  }]
}, {
  id: 'performer-10',
  name: 'Jazz Fusion Collective',
  profileImage: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  genres: ['Jazz/Blues', 'Fusion', 'Funk'],
  rating: 4.8,
  reviewCount: 19,
  followerCount: 2200,
  bio: 'Jazz Fusion Collective pushes the boundaries of traditional jazz by incorporating elements of funk, rock, and world music. Their improvisational style and technical prowess create a dynamic, ever-evolving sound that appeals to jazz aficionados and casual listeners alike.',
  yearsActive: 5,
  showsPlayed: 210,
  homeCity: 'Tampa, FL',
  isVerified: true,
  isTouringNow: false,
  availableForBooking: true,
  hasMerchandise: false,
  hasOriginalMusic: true,
  offersMeetAndGreet: false,
  takesRequests: false,
  availableForPrivateEvents: true,
  isFamilyFriendly: true,
  hasSamples: true,
  trendingScore: 71,
  distanceMiles: 16.8,
  addedDate: '2019-11-05',
  introductoryPricing: false,
  upcomingShows: [{
    date: '2024-06-21',
    venue: 'Palladium Theater',
    ticketsAvailable: true
  }, {
    date: '2024-06-28',
    venue: "Ruby's Elixir",
    ticketsAvailable: false
  }, {
    date: '2024-07-12',
    venue: 'The Attic',
    ticketsAvailable: true
  }]
}, {
  id: 'performer-11',
  name: 'Acoustic Soul',
  profileImage: 'https://images.unsplash.com/photo-1517230878791-4d28214057c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  genres: ['Soul', 'R&B', 'Acoustic'],
  rating: 4.9,
  reviewCount: 28,
  followerCount: 3900,
  bio: 'Acoustic Soul delivers intimate performances that showcase the power of soulful vocals and stripped-down instrumentation. Their repertoire includes original compositions and fresh interpretations of R&B classics, all delivered with emotional authenticity.',
  yearsActive: 4,
  showsPlayed: 175,
  homeCity: 'Clearwater, FL',
  isVerified: false,
  isTouringNow: false,
  availableForBooking: true,
  hasMerchandise: true,
  hasOriginalMusic: true,
  offersMeetAndGreet: true,
  takesRequests: true,
  availableForPrivateEvents: true,
  isFamilyFriendly: true,
  hasSamples: true,
  trendingScore: 79,
  distanceMiles: 1.8,
  addedDate: '2020-07-15',
  introductoryPricing: false,
  upcomingShows: [{
    date: '2024-06-15',
    venue: 'Clear Sky on Cleveland',
    ticketsAvailable: false
  }, {
    date: '2024-06-22',
    venue: 'Clearwater Main Library',
    ticketsAvailable: false
  }, {
    date: '2024-07-06',
    venue: 'Capitol Theatre',
    ticketsAvailable: true
  }]
}, {
  id: 'performer-12',
  name: 'The Rockabilly Rebels',
  profileImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  genres: ['Rockabilly', 'Rock/Alternative', 'Country/Folk'],
  rating: 4.7,
  reviewCount: 32,
  followerCount: 3100,
  bio: 'The Rockabilly Rebels take you back to the golden age of rock and roll with their high-energy performances. Blending elements of early rock, country, and swing, they deliver an authentic rockabilly experience complete with vintage instruments and period-correct attire.',
  yearsActive: 7,
  showsPlayed: 340,
  homeCity: 'Dunedin, FL',
  isVerified: true,
  isTouringNow: true,
  availableForBooking: true,
  hasMerchandise: true,
  hasOriginalMusic: true,
  offersMeetAndGreet: true,
  takesRequests: true,
  availableForPrivateEvents: true,
  isFamilyFriendly: true,
  hasSamples: true,
  trendingScore: 68,
  distanceMiles: 6.2,
  addedDate: '2017-03-28',
  introductoryPricing: false,
  upcomingShows: [{
    date: '2024-06-16',
    venue: 'Dunedin Brewery',
    ticketsAvailable: true
  }, {
    date: '2024-06-23',
    venue: 'Skippers Smokehouse',
    ticketsAvailable: true
  }, {
    date: '2024-07-07',
    venue: 'Ringside Cafe',
    ticketsAvailable: false
  }]
}, {
  id: 'performer-13',
  name: "Kid's Music Adventure",
  profileImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  genres: ['Kids/Family', 'Educational', 'Folk'],
  rating: 4.8,
  reviewCount: 45,
  followerCount: 2700,
  bio: "Kid's Music Adventure creates interactive musical experiences designed specifically for children and families. Their shows combine educational content with catchy songs and audience participation, making learning fun through the power of music.",
  yearsActive: 8,
  showsPlayed: 420,
  homeCity: 'Clearwater, FL',
  isVerified: true,
  isTouringNow: false,
  availableForBooking: true,
  hasMerchandise: true,
  hasOriginalMusic: true,
  offersMeetAndGreet: true,
  takesRequests: true,
  availableForPrivateEvents: true,
  isFamilyFriendly: true,
  hasSamples: true,
  trendingScore: 63,
  distanceMiles: 2.7,
  addedDate: '2016-05-10',
  introductoryPricing: false,
  upcomingShows: [{
    date: '2024-06-17',
    venue: 'Clearwater Main Library',
    ticketsAvailable: false
  }, {
    date: '2024-06-24',
    venue: 'Moccasin Lake Nature Park',
    ticketsAvailable: false
  }, {
    date: '2024-07-08',
    venue: 'Long Center',
    ticketsAvailable: true
  }]
}, {
  id: 'performer-14',
  name: 'Heavy Metal Thunder',
  profileImage: 'https://images.unsplash.com/photo-1508252592163-5d3c3c559387?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  genres: ['Metal', 'Rock/Alternative', 'Hard Rock'],
  rating: 4.5,
  reviewCount: 29,
  followerCount: 5600,
  bio: 'Heavy Metal Thunder delivers a high-octane performance that pays homage to classic metal while incorporating modern influences. Their show features blistering guitar solos, thunderous drums, and powerful vocals that will satisfy any headbanger.',
  yearsActive: 6,
  showsPlayed: 250,
  homeCity: 'Tampa, FL',
  isVerified: false,
  isTouringNow: true,
  availableForBooking: true,
  hasMerchandise: true,
  hasOriginalMusic: true,
  offersMeetAndGreet: true,
  takesRequests: false,
  availableForPrivateEvents: true,
  isFamilyFriendly: false,
  hasSamples: true,
  trendingScore: 75,
  distanceMiles: 17.5,
  addedDate: '2018-09-12',
  introductoryPricing: false,
  upcomingShows: [{
    date: '2024-06-18',
    venue: 'Brass Mug',
    ticketsAvailable: true
  }, {
    date: '2024-06-25',
    venue: 'Crowbar',
    ticketsAvailable: true
  }, {
    date: '2024-07-09',
    venue: 'Jannus Live',
    ticketsAvailable: true
  }]
}, {
  id: 'performer-15',
  name: 'The Groove Masters',
  profileImage: 'https://images.unsplash.com/photo-1528111029373-08f86825a0e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  genres: ['Funk', 'Soul', 'R&B'],
  rating: 4.8,
  reviewCount: 37,
  followerCount: 4200,
  bio: 'The Groove Masters bring the funk with their tight rhythms and horn-driven sound. This ensemble of seasoned musicians creates an irresistible groove that gets audiences dancing from the first note. Their repertoire spans classic funk, soul, and contemporary R&B.',
  yearsActive: 9,
  showsPlayed: 380,
  homeCity: 'St. Petersburg, FL',
  isVerified: true,
  isTouringNow: false,
  availableForBooking: true,
  hasMerchandise: true,
  hasOriginalMusic: true,
  offersMeetAndGreet: false,
  takesRequests: true,
  availableForPrivateEvents: true,
  isFamilyFriendly: true,
  hasSamples: true,
  trendingScore: 81,
  distanceMiles: 9.8,
  addedDate: '2015-08-15',
  introductoryPricing: false,
  upcomingShows: [{
    date: '2024-06-19',
    venue: "Ruby's Elixir",
    ticketsAvailable: false
  }, {
    date: '2024-06-26',
    venue: 'Ringside Cafe',
    ticketsAvailable: true
  }, {
    date: '2024-07-10',
    venue: 'Jannus Live',
    ticketsAvailable: true
  }]
}, {
  id: 'performer-16',
  name: 'Acoustic Harmony Duo',
  profileImage: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  genres: ['Acoustic', 'Folk', 'Pop/Top 40'],
  rating: 4.9,
  reviewCount: 26,
  followerCount: 1900,
  bio: 'Acoustic Harmony Duo creates an intimate musical experience with their beautiful vocal harmonies and skilled acoustic guitar work. Perfect for smaller venues and private events, they perform a mix of folk classics, contemporary covers, and thoughtful original compositions.',
  yearsActive: 4,
  showsPlayed: 190,
  homeCity: 'Clearwater, FL',
  isVerified: false,
  isTouringNow: false,
  availableForBooking: true,
  hasMerchandise: false,
  hasOriginalMusic: true,
  offersMeetAndGreet: true,
  takesRequests: true,
  availableForPrivateEvents: true,
  isFamilyFriendly: true,
  hasSamples: true,
  trendingScore: 69,
  distanceMiles: 2.3,
  addedDate: '2020-02-10',
  introductoryPricing: false,
  upcomingShows: [{
    date: '2024-06-20',
    venue: 'Clearwater Harbor Marina',
    ticketsAvailable: false
  }, {
    date: '2024-06-27',
    venue: 'Peace Memorial Presbyterian Church',
    ticketsAvailable: false
  }, {
    date: '2024-07-11',
    venue: 'Capitol Theatre',
    ticketsAvailable: true
  }]
}, {
  id: 'performer-17',
  name: 'Reggae Rhythms',
  profileImage: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  genres: ['Reggae', 'World Music', 'Dub'],
  rating: 4.7,
  reviewCount: 33,
  followerCount: 3700,
  bio: "Reggae Rhythms brings the authentic sounds of Jamaica to Florida's Gulf Coast. Their laid-back grooves and positive messages create a relaxed atmosphere that embodies the spirit of reggae music. A perfect soundtrack for beach venues and outdoor festivals.",
  yearsActive: 6,
  showsPlayed: 270,
  homeCity: 'Clearwater, FL',
  isVerified: true,
  isTouringNow: false,
  availableForBooking: true,
  hasMerchandise: true,
  hasOriginalMusic: true,
  offersMeetAndGreet: true,
  takesRequests: true,
  availableForPrivateEvents: true,
  isFamilyFriendly: true,
  hasSamples: true,
  trendingScore: 74,
  distanceMiles: 3.1,
  addedDate: '2018-04-20',
  introductoryPricing: false,
  upcomingShows: [{
    date: '2024-06-21',
    venue: "Shephard's Beach Resort",
    ticketsAvailable: true
  }, {
    date: '2024-06-28',
    venue: 'Pier 60',
    ticketsAvailable: false
  }, {
    date: '2024-07-12',
    venue: 'Jannus Live',
    ticketsAvailable: true
  }]
}, {
  id: 'performer-18',
  name: 'Midnight Blues Band',
  profileImage: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  genres: ['Jazz/Blues', 'Blues Rock', 'Soul'],
  rating: 4.8,
  reviewCount: 41,
  followerCount: 4800,
  bio: 'Midnight Blues Band keeps the blues tradition alive with their soulful performances and masterful musicianship. From slow-burning ballads to foot-stomping shuffles, they explore the full spectrum of blues music while adding their own contemporary twist.',
  yearsActive: 11,
  showsPlayed: 520,
  homeCity: 'Tampa, FL',
  isVerified: true,
  isTouringNow: true,
  availableForBooking: true,
  hasMerchandise: true,
  hasOriginalMusic: true,
  offersMeetAndGreet: false,
  takesRequests: true,
  availableForPrivateEvents: true,
  isFamilyFriendly: true,
  hasSamples: true,
  trendingScore: 70,
  distanceMiles: 16.4,
  addedDate: '2013-11-15',
  introductoryPricing: false,
  upcomingShows: [{
    date: '2024-06-22',
    venue: "Skipper's Smokehouse",
    ticketsAvailable: true
  }, {
    date: '2024-06-29',
    venue: "Ruby's Elixir",
    ticketsAvailable: false
  }, {
    date: '2024-07-13',
    venue: 'Palladium Theater',
    ticketsAvailable: true
  }]
}, {
  id: 'performer-19',
  name: 'Electric Dreamers',
  profileImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  genres: ['Electronic/DJ', 'Synth-Pop', 'Dance'],
  rating: 4.6,
  reviewCount: 25,
  followerCount: 5900,
  bio: 'Electric Dreamers creates immersive electronic soundscapes that blend nostalgic synth textures with modern production techniques. Their live shows feature stunning visuals synchronized with their music, creating a multi-sensory experience for audiences.',
  yearsActive: 3,
  showsPlayed: 85,
  homeCity: 'St. Petersburg, FL',
  isVerified: false,
  isTouringNow: true,
  availableForBooking: true,
  hasMerchandise: true,
  hasOriginalMusic: true,
  offersMeetAndGreet: false,
  takesRequests: false,
  availableForPrivateEvents: true,
  isFamilyFriendly: false,
  hasSamples: true,
  trendingScore: 90,
  distanceMiles: 10.5,
  addedDate: '2021-08-15',
  introductoryPricing: false,
  upcomingShows: [{
    date: '2024-06-23',
    venue: 'Jannus Live',
    ticketsAvailable: true
  }, {
    date: '2024-06-30',
    venue: 'The Bends',
    ticketsAvailable: false
  }, {
    date: '2024-07-14',
    venue: 'State Theatre',
    ticketsAvailable: true
  }]
}, {
  id: 'performer-20',
  name: 'The Bluegrass Pickers',
  profileImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  genres: ['Country/Folk', 'Bluegrass', 'Americana'],
  rating: 4.9,
  reviewCount: 38,
  followerCount: 2600,
  bio: "The Bluegrass Pickers showcase the rich tradition of American bluegrass music with their virtuosic instrumental skills and tight vocal harmonies. From lightning-fast fiddle tunes to heartfelt ballads, they honor the genre's roots while bringing fresh energy to each performance.",
  yearsActive: 7,
  showsPlayed: 310,
  homeCity: 'Dunedin, FL',
  isVerified: true,
  isTouringNow: false,
  availableForBooking: true,
  hasMerchandise: true,
  hasOriginalMusic: true,
  offersMeetAndGreet: true,
  takesRequests: true,
  availableForPrivateEvents: true,
  isFamilyFriendly: true,
  hasSamples: true,
  trendingScore: 67,
  distanceMiles: 5.9,
  addedDate: '2017-06-05',
  introductoryPricing: false,
  upcomingShows: [{
    date: '2024-06-24',
    venue: 'Dunedin Brewery',
    ticketsAvailable: false
  }, {
    date: '2024-07-01',
    venue: 'Skippers Smokehouse',
    ticketsAvailable: true
  }, {
    date: '2024-07-15',
    venue: 'Capitol Theatre',
    ticketsAvailable: true
  }]
}, {
  id: 'performer-21',
  name: 'Electro Swing Collective',
  profileImage: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  genres: ['Electronic/DJ', 'Swing', 'Jazz/Blues'],
  rating: 4.7,
  reviewCount: 22,
  followerCount: 3100,
  bio: 'Electro Swing Collective fuses vintage swing music with modern electronic beats, creating a unique sound that bridges the gap between the 1920s and today. Their high-energy performances feature live instruments alongside electronic elements, getting audiences dancing to this innovative genre.',
  yearsActive: 2,
  showsPlayed: 45,
  homeCity: 'St. Petersburg, FL',
  isVerified: false,
  isTouringNow: false,
  availableForBooking: true,
  hasMerchandise: true,
  hasOriginalMusic: true,
  offersMeetAndGreet: true,
  takesRequests: false,
  availableForPrivateEvents: true,
  isFamilyFriendly: true,
  hasSamples: true,
  trendingScore: 86,
  distanceMiles: 9.7,
  addedDate: '2022-03-10',
  introductoryPricing: true,
  upcomingShows: [{
    date: '2024-06-25',
    venue: 'The Bends',
    ticketsAvailable: false
  }, {
    date: '2024-07-02',
    venue: 'Jannus Live',
    ticketsAvailable: true
  }, {
    date: '2024-07-16',
    venue: "Ruby's Elixir",
    ticketsAvailable: false
  }]
}, {
  id: 'performer-22',
  name: 'Indie Folk Trio',
  profileImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  genres: ['Indie', 'Country/Folk', 'Acoustic'],
  rating: 4.8,
  reviewCount: 18,
  followerCount: 1700,
  bio: 'Indie Folk Trio creates intimate musical experiences with their thoughtful lyrics, delicate harmonies, and organic instrumentation. Their original compositions explore themes of nature, human connection, and personal growth, resonating with audiences seeking authentic musical storytelling.',
  yearsActive: 2,
  showsPlayed: 55,
  homeCity: 'Clearwater, FL',
  isVerified: false,
  isTouringNow: false,
  availableForBooking: true,
  hasMerchandise: true,
  hasOriginalMusic: true,
  offersMeetAndGreet: true,
  takesRequests: true,
  availableForPrivateEvents: true,
  isFamilyFriendly: true,
  hasSamples: true,
  trendingScore: 83,
  distanceMiles: 2.4,
  addedDate: '2022-05-15',
  introductoryPricing: true,
  upcomingShows: [{
    date: '2024-06-26',
    venue: 'Clearwater Main Library',
    ticketsAvailable: false
  }, {
    date: '2024-07-03',
    venue: 'Capitol Theatre',
    ticketsAvailable: true
  }, {
    date: '2024-07-17',
    venue: 'Clear Sky on Cleveland',
    ticketsAvailable: false
  }]
}, {
  id: 'performer-23',
  name: 'Hip-Hop Evolution',
  profileImage: 'https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  genres: ['Hip-Hop/Rap', 'R&B', 'Soul'],
  rating: 4.6,
  reviewCount: 27,
  followerCount: 4200,
  bio: "Hip-Hop Evolution traces the development of hip-hop culture through their music, incorporating elements from old school to contemporary styles. Their performances blend live instrumentation with samples and beats, showcasing the genre's rich history and ongoing innovation.",
  yearsActive: 4,
  showsPlayed: 130,
  homeCity: 'Tampa, FL',
  isVerified: false,
  isTouringNow: true,
  availableForBooking: true,
  hasMerchandise: true,
  hasOriginalMusic: true,
  offersMeetAndGreet: true,
  takesRequests: false,
  availableForPrivateEvents: true,
  isFamilyFriendly: false,
  hasSamples: true,
  trendingScore: 85,
  distanceMiles: 17.2,
  addedDate: '2020-04-12',
  introductoryPricing: false,
  upcomingShows: [{
    date: '2024-06-27',
    venue: 'Crowbar',
    ticketsAvailable: true
  }, {
    date: '2024-07-04',
    venue: 'Jannus Live',
    ticketsAvailable: true
  }, {
    date: '2024-07-18',
    venue: 'The Ritz Ybor',
    ticketsAvailable: true
  }]
}, {
  id: 'performer-24',
  name: 'Classical Guitar Virtuoso',
  profileImage: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  genres: ['Classical/Orchestra', 'Spanish Guitar', 'World Music'],
  rating: 5.0,
  reviewCount: 21,
  followerCount: 1500,
  bio: "Classical Guitar Virtuoso mesmerizes audiences with masterful technique and emotional depth. Specializing in Spanish classical guitar repertoire and original compositions, each performance showcases the instrument's expressive capabilities and rich tonal palette.",
  yearsActive: 15,
  showsPlayed: 580,
  homeCity: 'St. Petersburg, FL',
  isVerified: true,
  isTouringNow: true,
  availableForBooking: true,
  hasMerchandise: false,
  hasOriginalMusic: true,
  offersMeetAndGreet: true,
  takesRequests: false,
  availableForPrivateEvents: true,
  isFamilyFriendly: true,
  hasSamples: true,
  trendingScore: 72,
  distanceMiles: 10.3,
  addedDate: '2009-08-22',
  introductoryPricing: false,
  upcomingShows: [{
    date: '2024-06-28',
    venue: 'Palladium Theater',
    ticketsAvailable: true
  }, {
    date: '2024-07-05',
    venue: 'Capitol Theatre',
    ticketsAvailable: true
  }, {
    date: '2024-07-19',
    venue: 'Ruth Eckerd Hall',
    ticketsAvailable: true
  }]
}, {
  id: 'performer-25',
  name: 'New Wave Revival',
  profileImage: 'https://images.unsplash.com/photo-1453738773917-9c3eff1db985?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  genres: ['New Wave', 'Rock/Alternative', 'Pop/Top 40'],
  rating: 4.7,
  reviewCount: 24,
  followerCount: 2800,
  bio: "New Wave Revival captures the essence of 80s new wave music with their energetic performances and authentic sound. From synth-driven anthems to post-punk classics, they recreate the era's distinctive style while adding their own contemporary edge.",
  yearsActive: 3,
  showsPlayed: 95,
  homeCity: 'Clearwater, FL',
  isVerified: false,
  isTouringNow: false,
  availableForBooking: true,
  hasMerchandise: true,
  hasOriginalMusic: false,
  offersMeetAndGreet: true,
  takesRequests: true,
  availableForPrivateEvents: true,
  isFamilyFriendly: true,
  hasSamples: true,
  trendingScore: 76,
  distanceMiles: 3.5,
  addedDate: '2021-02-18',
  introductoryPricing: false,
  upcomingShows: [{
    date: '2024-06-29',
    venue: 'Capitol Theatre',
    ticketsAvailable: true
  }, {
    date: '2024-07-06',
    venue: 'Jannus Live',
    ticketsAvailable: true
  }, {
    date: '2024-07-20',
    venue: 'State Theatre',
    ticketsAvailable: true
  }]
}]; */