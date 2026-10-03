const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Message = require('../models/Message');

const ensureAdminUser = async () => {
  try {
    const adminEmail = 'admin@alumniconnect.com';
    let adminUser = await User.findOne({ email: adminEmail.toLowerCase() });

    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin@123', salt);

      adminUser = await User.create({
        name: 'System Administrator',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        department: 'Administration',
        graduationYear: 2015,
        company: 'AlumniConnect',
        jobTitle: 'Platform Administrator',
        location: 'Headquarters',
        bio: 'Super Admin managing system configurations, alumni verification, job postings, and platform events.',
        skills: ['System Administration', 'Security', 'Database Management'],
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
      });
      console.log('🛡️ Admin Account Verified: admin@alumniconnect.com');
    } else {
      let updated = false;
      if (adminUser.role !== 'admin') {
        adminUser.role = 'admin';
        updated = true;
      }
      const isMatch = await bcrypt.compare('Admin@123', adminUser.password);
      if (!isMatch) {
        const salt = await bcrypt.genSalt(10);
        adminUser.password = await bcrypt.hash('Admin@123', salt);
        updated = true;
      }
      if (updated) {
        await adminUser.save();
        console.log('🛡️ Admin Account Synced: role set to admin');
      }
    }

    // Ensure sample users exist if database is fresh
    const userCount = await User.countDocuments();
    if (userCount <= 1) {
      const salt = await bcrypt.genSalt(10);
      const userHashedPassword = await bcrypt.hash('password123', salt);

      const sarah = await User.create({
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
      });

      const alex = await User.create({
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        password: userHashedPassword,
        role: 'user',
        department: 'Electrical Engineering',
        graduationYear: 2019,
        company: 'Tesla',
        jobTitle: 'Embedded Systems Lead',
        location: 'Austin, TX',
        bio: 'Working on renewable energy systems, battery tech, and high-performance hardware.',
        skills: ['Embedded C', 'PCB Design', 'IoT', 'C++', 'Robotics'],
        profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80'
      });

      const priya = await User.create({
        name: 'Priya Sharma',
        email: 'priya.s@example.com',
        password: userHashedPassword,
        role: 'user',
        department: 'Information Technology',
        graduationYear: 2022,
        company: 'Microsoft',
        jobTitle: 'Product Manager',
        location: 'Seattle, WA',
        bio: 'Driving user-centric products and cloud solutions for enterprise developers worldwide.',
        skills: ['Product Strategy', 'Agile', 'User Research', 'Data Analytics', 'Scrum'],
        profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80'
      });

      console.log('🌱 Seeded default sample users: sarah.j@example.com, alex.rivera@example.com, priya.s@example.com');

      // Seed sample messages between Alex and Sarah
      await Message.create([
        {
          sender: alex._id,
          receiver: sarah._id,
          message: 'Hi Sarah! Great seeing your recent updates on the full-stack architecture project.',
          read: true,
          createdAt: new Date(Date.now() - 3600000 * 5)
        },
        {
          sender: sarah._id,
          receiver: alex._id,
          message: 'Thanks Alex! How is the embedded systems project coming along at Tesla?',
          read: true,
          createdAt: new Date(Date.now() - 3600000 * 4)
        },
        {
          sender: alex._id,
          receiver: sarah._id,
          message: 'Going great! We are working on new battery hardware controllers. Let us catch up at the Homecoming gala!',
          read: false,
          createdAt: new Date(Date.now() - 3600000 * 2)
        },
        {
          sender: priya._id,
          receiver: sarah._id,
          message: 'Hey Sarah, loved your presentation on Cloud Architecture. Are you free for a virtual coffee next week?',
          read: false,
          createdAt: new Date(Date.now() - 3600000 * 1)
        }
      ]);
      console.log('💬 Seeded default sample messages.');
    }
  } catch (err) {
    console.error('Error in ensureAdminUser:', err.message);
  }
};

module.exports = ensureAdminUser;
