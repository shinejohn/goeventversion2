import React, { useState } from 'react';
import { useNavigationContext } from '../context/NavigationContext';
import { Briefcase, MapPin, Clock, ChevronDown, ChevronUp, Users, Heart, Award, Coffee, Zap, Globe } from 'lucide-react';
export const CareersPage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  const [openJobId, setOpenJobId] = useState<string | null>(null);
  const toggleJob = (id: string) => {
    if (openJobId === id) {
      setOpenJobId(null);
    } else {
      setOpenJobId(id);
    }
  };
  const departments = ['All Departments', 'Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Customer Success', 'Operations'];
  const locations = ['All Locations', 'Clearwater, FL', 'Tampa, FL', 'Remote'];
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const jobs = [{
    id: 'eng-001',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Clearwater, FL',
    type: 'Full-time',
    posted: '2 weeks ago',
    description: "We're looking for a Senior Frontend Engineer to help build and improve our event discovery and booking platform. You'll work with modern JavaScript frameworks to create intuitive, responsive user interfaces.",
    responsibilities: ['Develop new features and improve existing ones using React and TypeScript', 'Collaborate with designers to implement pixel-perfect UI components', 'Write clean, maintainable, and well-tested code', 'Optimize application performance and responsiveness', 'Participate in code reviews and contribute to technical discussions'],
    requirements: ['5+ years of experience in frontend development', 'Strong proficiency with React, TypeScript, and modern JavaScript', 'Experience with responsive design and cross-browser compatibility', 'Understanding of web accessibility standards', 'Excellent problem-solving skills and attention to detail']
  }, {
    id: 'eng-002',
    title: 'Backend Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    posted: '1 week ago',
    description: "Join our backend team to build scalable APIs and services that power our event platform. You'll work on features that help connect communities through events.",
    responsibilities: ['Design and implement RESTful APIs and microservices', 'Optimize database queries and ensure data integrity', 'Implement authentication, authorization, and security measures', 'Collaborate with frontend engineers to integrate APIs', 'Write automated tests and documentation'],
    requirements: ['3+ years of experience in backend development', 'Proficiency with Node.js and Express', 'Experience with SQL and NoSQL databases', 'Understanding of API design principles', 'Knowledge of cloud services (AWS, Azure, or GCP)']
  }, {
    id: 'prod-001',
    title: 'Product Manager',
    department: 'Product',
    location: 'Tampa, FL',
    type: 'Full-time',
    posted: '3 days ago',
    description: "We're seeking a Product Manager to help define and execute our product strategy. You'll work closely with engineering, design, and business teams to deliver features that delight our users.",
    responsibilities: ['Define product requirements and create roadmaps', 'Conduct user research and gather feedback', 'Prioritize features based on business impact and user needs', 'Collaborate with engineering and design teams', 'Analyze metrics to measure feature success'],
    requirements: ['3+ years of product management experience', 'Strong analytical and problem-solving skills', 'Excellent communication and stakeholder management', 'Experience with agile development methodologies', 'Data-driven approach to decision making']
  }, {
    id: 'des-001',
    title: 'UX/UI Designer',
    department: 'Design',
    location: 'Clearwater, FL',
    type: 'Full-time',
    posted: '5 days ago',
    description: "Join our design team to create beautiful, intuitive experiences for our users. You'll help shape how people discover and engage with events in their communities.",
    responsibilities: ['Design user-centered interfaces for web and mobile applications', 'Create wireframes, prototypes, and high-fidelity mockups', 'Conduct user research and usability testing', 'Collaborate with product and engineering teams', 'Maintain and evolve our design system'],
    requirements: ['3+ years of experience in UX/UI design', 'Proficiency with design tools like Figma or Sketch', 'Strong portfolio demonstrating user-centered design', 'Understanding of accessibility standards', 'Excellent visual design skills']
  }, {
    id: 'mkt-001',
    title: 'Content Marketing Specialist',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
    posted: '1 week ago',
    description: "We're looking for a Content Marketing Specialist to create compelling content that helps grow our audience and engage our community of event organizers and attendees.",
    responsibilities: ['Develop and execute content strategy across multiple channels', 'Create blog posts, social media content, and email campaigns', 'Collaborate with design team on visual content', 'Analyze content performance and optimize based on data', 'Stay up-to-date with industry trends and best practices'],
    requirements: ['2+ years of content marketing experience', 'Excellent writing and editing skills', 'Experience with SEO and content optimization', 'Familiarity with content management systems', 'Creative thinking and storytelling abilities']
  }, {
    id: 'cs-001',
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'Tampa, FL',
    type: 'Full-time',
    posted: '3 days ago',
    description: "Join our Customer Success team to help event organizers and venues succeed on our platform. You'll be their advocate and ensure they have an exceptional experience.",
    responsibilities: ['Onboard new customers and provide ongoing support', 'Develop strategies to increase customer retention and satisfaction', 'Identify upsell opportunities and collaborate with sales team', 'Gather customer feedback and share insights with product team', 'Build and maintain strong relationships with key customers'],
    requirements: ['3+ years of customer success or account management experience', 'Strong communication and relationship-building skills', 'Problem-solving mindset and attention to detail', 'Experience with CRM software', 'Passion for events and community building']
  }];
  const filteredJobs = jobs.filter(job => {
    if (selectedDepartment !== 'All Departments' && job.department !== selectedDepartment) {
      return false;
    }
    if (selectedLocation !== 'All Locations' && job.location !== selectedLocation) {
      return false;
    }
    return true;
  });
  const benefits = [{
    title: 'Competitive Compensation',
    description: 'Salary packages that recognize your skills and experience, plus equity options to share in our success.',
    icon: <Award className="h-8 w-8 text-indigo-600" />
  }, {
    title: 'Health & Wellness',
    description: 'Comprehensive health, dental, and vision insurance for you and your dependents.',
    icon: <Heart className="h-8 w-8 text-indigo-600" />
  }, {
    title: 'Flexible Work',
    description: 'Remote-friendly environment with flexible hours to help you maintain work-life balance.',
    icon: <Clock className="h-8 w-8 text-indigo-600" />
  }, {
    title: 'Professional Growth',
    description: 'Learning stipend, conference budget, and career development opportunities.',
    icon: <Zap className="h-8 w-8 text-indigo-600" />
  }, {
    title: 'Team Building',
    description: 'Regular team retreats, social events, and opportunities to connect with colleagues.',
    icon: <Users className="h-8 w-8 text-indigo-600" />
  }, {
    title: 'Generous PTO',
    description: 'Unlimited vacation policy, paid holidays, and paid parental leave.',
    icon: <Globe className="h-8 w-8 text-indigo-600" />
  }];
  return <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl mb-6">
              Join Our Team
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Help us build the future of community events and local experiences
            </p>
            <button onClick={() => navigateTo('#open-positions')} className="px-8 py-3 bg-white text-purple-600 font-medium rounded-md hover:bg-purple-50 transition-colors">
              View Open Positions
            </button>
          </div>
        </div>
      </div>
      {/* Our Mission */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission & Values
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                At When's The Fun, we're passionate about bringing communities
                together through shared experiences. We believe that local
                events are the heartbeat of vibrant communities, and we're
                building the technology to make these experiences more
                accessible and enjoyable for everyone.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our team is made up of people who care deeply about community,
                technology, and creating meaningful connections. We're looking
                for passionate individuals who share our values and want to make
                a positive impact.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mt-1">
                    <span className="text-purple-600 font-bold text-sm">1</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      Community First
                    </h3>
                    <p className="mt-1 text-gray-600">
                      We prioritize the needs of the communities we serve in
                      every decision we make.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mt-1">
                    <span className="text-purple-600 font-bold text-sm">2</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      Innovation with Purpose
                    </h3>
                    <p className="mt-1 text-gray-600">
                      We embrace new ideas and technologies that solve real
                      problems for our users.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mt-1">
                    <span className="text-purple-600 font-bold text-sm">3</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      Inclusivity & Diversity
                    </h3>
                    <p className="mt-1 text-gray-600">
                      We believe in creating a platform and a workplace that
                      welcomes everyone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Team collaboration" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
      {/* Benefits */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Work With Us
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              We offer competitive benefits and a supportive work environment to
              help you thrive.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>)}
          </div>
        </div>
      </div>
      {/* Team Culture */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
              <div className="h-64 rounded-lg overflow-hidden shadow-md">
                <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Team meeting" className="w-full h-full object-cover" />
              </div>
              <div className="h-64 rounded-lg overflow-hidden shadow-md">
                <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Team collaboration" className="w-full h-full object-cover" />
              </div>
              <div className="h-64 rounded-lg overflow-hidden shadow-md">
                <img src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Office space" className="w-full h-full object-cover" />
              </div>
              <div className="h-64 rounded-lg overflow-hidden shadow-md">
                <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Team discussion" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Team Culture
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We believe that great work happens when people feel valued,
                supported, and empowered. Our culture is built on collaboration,
                continuous learning, and work-life balance.
              </p>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Collaborative Environment
                  </h3>
                  <p className="text-gray-600">
                    We work together across teams and departments, sharing ideas
                    and feedback to create the best possible solutions.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Continuous Learning
                  </h3>
                  <p className="text-gray-600">
                    We encourage growth through mentorship, learning stipends,
                    and opportunities to work on challenging projects.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Work-Life Balance
                  </h3>
                  <p className="text-gray-600">
                    We value results over hours worked and provide flexibility
                    to help you balance your professional and personal life.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Open Positions */}
      <div id="open-positions" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Open Positions</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Join our team and help build the future of community events
            </p>
          </div>
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select id="department" name="department" className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)}>
                {departments.map(dept => <option key={dept} value={dept}>
                    {dept}
                  </option>)}
              </select>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select id="location" name="location" className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}>
                {locations.map(loc => <option key={loc} value={loc}>
                    {loc}
                  </option>)}
              </select>
            </div>
          </div>
          <div className="space-y-4">
            {filteredJobs.length === 0 ? <div className="bg-white p-8 text-center rounded-lg shadow-md">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No positions found
                </h3>
                <p className="text-gray-500 mb-4">
                  We don't have any open positions matching your criteria at the
                  moment.
                </p>
                <button onClick={() => {
              setSelectedDepartment('All Departments');
              setSelectedLocation('All Locations');
            }} className="text-indigo-600 font-medium hover:text-indigo-800">
                  View all positions
                </button>
              </div> : filteredJobs.map(job => <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 cursor-pointer" onClick={() => toggleJob(job.id)}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {job.title}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-2">
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            {job.department}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {job.type}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex items-center">
                        <span className="text-sm text-gray-500 mr-4">
                          Posted {job.posted}
                        </span>
                        <button className="text-indigo-600 hover:text-indigo-800">
                          {openJobId === job.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  {openJobId === job.id && <div className="px-6 pb-6 border-t border-gray-200 pt-4">
                      <div className="prose max-w-none">
                        <p className="mb-4">{job.description}</p>
                        <h4 className="text-lg font-bold text-gray-900 mt-6 mb-3">
                          Responsibilities:
                        </h4>
                        <ul className="list-disc pl-5 space-y-2">
                          {job.responsibilities.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                        <h4 className="text-lg font-bold text-gray-900 mt-6 mb-3">
                          Requirements:
                        </h4>
                        <ul className="list-disc pl-5 space-y-2">
                          {job.requirements.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                      </div>
                      <div className="mt-8">
                        <button onClick={() => navigateTo(`/careers/apply/${job.id}`)} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Apply for this position
                        </button>
                      </div>
                    </div>}
                </div>)}
          </div>
        </div>
      </div>
      {/* Diversity & Inclusion */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Diversity & Inclusion
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                At When's The Fun, we believe that diverse teams build better
                products. We're committed to creating an inclusive workplace
                where everyone feels valued, respected, and empowered to do
                their best work.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We actively work to eliminate bias in our hiring process and
                create equal opportunities for people of all backgrounds. Our
                commitment to diversity extends beyond our team to the
                communities we serve and the events we help promote.
              </p>
              <p className="text-lg text-gray-600">
                We encourage applications from candidates of all backgrounds,
                identities, and experiences. We're especially interested in
                hearing from candidates who can bring unique perspectives to our
                team.
              </p>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <img src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Diverse team collaborating" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
      {/* Hiring Process */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Our Hiring Process
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              What to expect when you apply to join our team
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                Application Review
              </h3>
              <p className="text-gray-600">
                Our hiring team reviews your application and resume to assess
                your qualifications and experience.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                Initial Interview
              </h3>
              <p className="text-gray-600">
                A video call with a hiring manager to discuss your background,
                skills, and interest in the role.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                Skills Assessment
              </h3>
              <p className="text-gray-600">
                Depending on the role, you may complete a skills assessment or
                technical interview to demonstrate your abilities.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 text-xl font-bold mb-4">
                4
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                Final Interviews
              </h3>
              <p className="text-gray-600">
                Meet with team members and leadership to discuss the role in
                more detail and ensure mutual fit.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* CTA Section */}
      <div className="bg-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't See the Right Role?</h2>
          <p className="text-xl text-indigo-200 mb-8 max-w-3xl mx-auto">
            We're always looking for talented people to join our team. Send us
            your resume and we'll keep you in mind for future opportunities.
          </p>
          <button onClick={() => navigateTo('/careers/general-application')} className="px-8 py-3 bg-white text-indigo-700 font-medium rounded-md hover:bg-indigo-50 transition-colors">
            Submit General Application
          </button>
        </div>
      </div>
    </div>;
};