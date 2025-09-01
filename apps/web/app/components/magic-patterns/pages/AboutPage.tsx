import React, { memo } from 'react';
export const AboutPage = () => {
  return <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            About When's The Fun
          </h1>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Connecting communities through shared experiences and memorable
            events.
          </p>
        </div>
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="prose max-w-none">
              <h2>Our Story</h2>
              <p>
                When's The Fun was founded in 2020 with a simple mission: to
                help people discover and enjoy events in their community. What
                began as a local calendar for a small town has grown into a
                comprehensive platform connecting event-goers, performers,
                venues, and businesses across the country.
              </p>
              <p>
                Our founders, a group of event enthusiasts and technology
                innovators, recognized that finding meaningful local experiences
                was often challenging. Information was scattered across multiple
                platforms, details were incomplete, and discovering new events
                outside your immediate circle was difficult.
              </p>
              <h3>Our Mission</h3>
              <p>
                We believe that shared experiences build stronger communities.
                Our mission is to make it easy for anyone to discover, attend,
                and create events that bring people together. We're committed to
                supporting local businesses, artists, and venues while helping
                people find experiences that enrich their lives.
              </p>
              <h3>What We Do</h3>
              <p>
                When's The Fun provides a comprehensive platform for the entire
                event ecosystem:
              </p>
              <ul>
                <li>
                  <strong>For Event-Goers</strong> - Discover events, buy
                  tickets, and connect with like-minded people
                </li>
                <li>
                  <strong>For Venues</strong> - List your space, manage
                  bookings, and reach new audiences
                </li>
                <li>
                  <strong>For Performers</strong> - Find opportunities, manage
                  your calendar, and grow your following
                </li>
                <li>
                  <strong>For Event Creators</strong> - Promote your events,
                  sell tickets, and analyze performance
                </li>
              </ul>
              <h3>Our Values</h3>
              <ul>
                <li>
                  <strong>Community First</strong> - We prioritize building
                  meaningful connections and supporting local communities
                </li>
                <li>
                  <strong>Inclusivity</strong> - We strive to make events
                  accessible and welcoming to everyone
                </li>
                <li>
                  <strong>Quality</strong> - We focus on providing reliable,
                  high-quality information and experiences
                </li>
                <li>
                  <strong>Innovation</strong> - We continuously improve our
                  platform to better serve our users
                </li>
                <li>
                  <strong>Transparency</strong> - We're open and honest in how
                  we operate and communicate
                </li>
              </ul>
              <h3>Part of the Fibonacco Ecosystem</h3>
              <p>
                When's The Fun is proud to be part of the Fibonacco ecosystem, a
                family of platforms dedicated to enhancing community
                experiences, entertainment discovery, and local business growth.
                Through this network, we're able to provide expanded services
                and reach to our users and partners.
              </p>
              <h3>Join Us</h3>
              <p>
                Whether you're looking for something fun to do this weekend,
                managing a venue, performing at events, or creating community
                gatherings, we invite you to join When's The Fun. Together, we
                can build more vibrant, connected communities through shared
                experiences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};