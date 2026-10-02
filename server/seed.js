const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Job = require('./models/Job');
const Event = require('./models/Event');
const ContactMessage = require('./models/ContactMessage');
const Message = require('./models/Message');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected for Seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Job.deleteMany({});
    await Event.deleteMany({});
    await ContactMessage.deleteMany({});
    await Message.deleteMany({});

    console.log('Existing collections cleared.');

    // Passwords for seed users
    const salt = await bcrypt.genSalt(10);
    const userHashedPassword = await bcrypt.hash('password123', salt);
    const adminHashedPassword = await bcrypt.hash('Admin@123', salt);

    // Create sample users (including system admin)
    const usersData = [
      {
        name: 'System Administrator',
        email: 'admin@alumniconnect.com',
        password: adminHashedPassword,
        role: 'admin',
        department: 'Administration',
        graduationYear: 2015,
        company: 'AlumniConnect',
        jobTitle: 'Platform Administrator',
        location: 'Headquarters',
        bio: 'Super Admin managing system configurations, alumni verification, job postings, and platform events.',
        skills: ['System Administration', 'Security', 'Database Management'],
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
      },
      {
        name: 'Sarah Jenkins',
        email: 'sarah.j@example.com',
        password: userHashedPassword,
        role: 'user',
        department: 'Computer Science',
        graduationYear: 2021,
        company: 'Google',
        jobTitle: 'Senior Software Engineer',
        location: 'Mountain View, CA',
        bio: 'Passionate about full-stack web architectures, cloud computing, and mentoring young developers.',
        skills: ['React', 'Node.js', 'System Design', 'Python', 'AWS'],
        profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
      },
      {
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        password: userHashedPassword,
        department: 'Electrical Engineering',
        graduationYear: 2019,
        company: 'Tesla',
        jobTitle: 'Embedded Systems Lead',
        location: 'Austin, TX',
        bio: 'Working on renewable energy systems, battery tech, and high-performance hardware.',
        skills: ['Embedded C', 'PCB Design', 'IoT', 'C++', 'Robotics'],
        profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80'
      },
      {
        name: 'Priya Sharma',
        email: 'priya.s@example.com',
        password: userHashedPassword,
        department: 'Information Technology',
        graduationYear: 2022,
        company: 'Microsoft',
        jobTitle: 'Product Manager',
        location: 'Seattle, WA',
        bio: 'Driving user-centric products and cloud solutions for enterprise developers worldwide.',
        skills: ['Product Strategy', 'Agile', 'User Research', 'Data Analytics', 'Scrum'],
        profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80'
      },
      {
        name: 'Michael Chang',
        email: 'michael.c@example.com',
        password: userHashedPassword,
        department: 'Business Administration',
        graduationYear: 2018,
        company: 'Goldman Sachs',
        jobTitle: 'Financial Analyst',
        location: 'New York, NY',
        bio: 'Specializing in tech sector equity investments, fintech trends, and startup valuations.',
        skills: ['Financial Modeling', 'Venture Capital', 'Valuation', 'SQL', 'Bloomberg'],
        profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80'
      },
      {
        name: 'Emily Watson',
        email: 'emily.w@example.com',
        password: userHashedPassword,
        department: 'Mechanical Engineering',
        graduationYear: 2020,
        company: 'SpaceX',
        jobTitle: 'Aerospace Propulsion Engineer',
        location: 'Hawthorne, CA',
        bio: 'Designing next-generation rocket engines and thermal insulation systems.',
        skills: ['CAD', 'Thermal Analysis', 'SolidWorks', 'MATLAB', 'Aerodynamics'],
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
      }
    ];

    const createdUsers = await User.insertMany(usersData);
    console.log(`${createdUsers.length} users created successfully.`);

    // Create 5 sample jobs
    const jobsData = [
      {
        title: 'Frontend React Engineer',
        company: 'TechFlow Systems',
        location: 'Remote / San Francisco, CA',
        jobType: 'Full-time',
        description: 'We are seeking an experienced Frontend Developer with strong React.js, TypeScript, and CSS skills to build modern web applications.',
        applicationUrl: 'https://example.com/careers/frontend-engineer',
        postedBy: createdUsers[0]._id
      },
      {
        title: 'Backend Node.js Developer',
        company: 'DataCloud Inc.',
        location: 'Seattle, WA',
        jobType: 'Full-time',
        description: 'Join our backend core team building high-throughput microservices, REST APIs, and MongoDB integrations.',
        applicationUrl: 'https://example.com/careers/backend-developer',
        postedBy: createdUsers[0]._id
      },
      {
        title: 'Product Design Intern',
        company: 'CreativePulse Studio',
        location: 'New York, NY',
        jobType: 'Internship',
        description: 'Great opportunity for recent graduates in CS or Design to gain hands-on experience in UI/UX wireframing and interactive design.',
        applicationUrl: 'https://example.com/careers/ui-ux-intern',
        postedBy: createdUsers[2]._id
      },
      {
        title: 'DevOps & Cloud Engineer',
        company: 'Apex Cloud Solutions',
        location: 'Austin, TX (Hybrid)',
        jobType: 'Contract',
        description: 'Looking for a DevOps engineer with experience in AWS, Docker, CI/CD pipelines, and infrastructure management.',
        applicationUrl: 'https://example.com/careers/devops-contractor',
        postedBy: createdUsers[1]._id
      },
      {
        title: 'Data Analyst - Business Intelligence',
        company: 'FinMetrics Global',
        location: 'Chicago, IL',
        jobType: 'Full-time',
        description: 'Analyze financial datasets, construct interactive dashboards, and drive business decision-making with statistical models.',
        applicationUrl: 'https://example.com/careers/data-analyst',
        postedBy: createdUsers[3]._id
      }
    ];

    const createdJobs = await Job.insertMany(jobsData);
    console.log(`${createdJobs.length} jobs created successfully.`);

    // Create 5 sample events
    const eventsData = [
      {
        title: 'Annual Alumni Homecoming & Gala 2026',
        date: '2026-10-15',
        time: '18:00',
        location: 'University Grand Ballroom & Quad',
        description: 'Reconnect with old classmates, faculty members, and fellow alumni for an evening of networking, dinner, and live music.',
        createdBy: createdUsers[0]._id
      },
      {
        title: 'Tech Careers & Industry Trends Webinar',
        date: '2026-11-02',
        time: '14:00',
        location: 'Online via Zoom',
        description: 'Panel discussion featuring alumni engineers and engineering leads discussing AI developments, job search strategies, and industry shifts.',
        createdBy: createdUsers[2]._id
      },
      {
        title: 'Engineering & Innovation Summit',
        date: '2026-11-20',
        time: '10:00',
        location: 'Innovation Center Auditorium',
        description: 'Showcase of startup prototypes, research papers, and technical keynotes from distinguished engineering alumni.',
        createdBy: createdUsers[1]._id
      },
      {
        title: 'Finance & Venture Capital Workshop',
        date: '2026-12-05',
        time: '16:00',
        location: 'Business School Hall B',
        description: 'Interactive session on startup fundraising, angel investing, and personal finance management hosted by alumni financial analysts.',
        createdBy: createdUsers[3]._id
      },
      {
        title: 'Young Alumni Coffee & Networking Meetup',
        date: '2026-12-18',
        time: '11:00',
        location: 'Campus Cafe & Lounge',
        description: 'Casual morning meet and greet for recent graduates (2020-2025) to share experiences and build local career connections.',
        createdBy: createdUsers[4]._id
      }
    ];

    const createdEvents = await Event.insertMany(eventsData);
    console.log(`${createdEvents.length} events created successfully.`);

    // Create sample private messages
    const messagesData = [
      {
        sender: createdUsers[2]._id, // Alex Rivera
        receiver: createdUsers[1]._id, // Sarah Jenkins
        message: 'Hi Sarah! Great seeing your recent updates on the full-stack architecture project.',
        read: true,
        createdAt: new Date(Date.now() - 3600000 * 5)
      },
      {
        sender: createdUsers[1]._id, // Sarah Jenkins
        receiver: createdUsers[2]._id, // Alex Rivera
        message: 'Thanks Alex! How is the embedded systems project coming along at Tesla?',
        read: true,
        createdAt: new Date(Date.now() - 3600000 * 4)
      },
      {
        sender: createdUsers[2]._id, // Alex Rivera
        receiver: createdUsers[1]._id, // Sarah Jenkins
        message: 'Going great! We are working on new battery hardware controllers. Let us catch up at the Homecoming gala!',
        read: false,
        createdAt: new Date(Date.now() - 3600000 * 2)
      },
      {
        sender: createdUsers[3]._id, // Priya Sharma
        receiver: createdUsers[1]._id, // Sarah Jenkins
        message: 'Hey Sarah, loved your presentation on Cloud Architecture. Are you free for a virtual coffee next week?',
        read: false,
        createdAt: new Date(Date.now() - 3600000 * 1)
      }
    ];

    const createdMessages = await Message.insertMany(messagesData);
    console.log(`${createdMessages.length} sample messages created successfully.`);

    console.log('\n--- SEEDING COMPLETED SUCCESSFULLY ---');
    console.log('Admin Credentials:');
    console.log('🔑 Email: admin@alumniconnect.com | Password: Admin@123 (Role: admin)');
    console.log('\nSample User Credentials:');
    console.log('1. sarah.j@example.com / password123');
    console.log('2. alex.rivera@example.com / password123');
    console.log('3. priya.s@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
