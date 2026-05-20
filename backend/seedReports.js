//this file is used to seed the database
// with sample data for testing and development purposes. 
// It creates sample users, opportunities, and applications to populate
// the database with realistic data for testing the application's functionality.
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Use the same connection logic as your main app
const connectDatabase = require('./database.js');
const User = require('./authorization/User.js');
const Opportunity = require('./opportunities/Opportunity.js');
const Application = require('./applications/Applications.js');

const opportunitiesData = [
  { title: 'Software Development Learnership', sector: 'Technology', requirements: ['Matric'], location: 'Johannesburg, Gauteng', closingDate: new Date('2026-08-31'), stipend: 5000, duration: 12, status: 'Approved' },
  { title: 'Electrical Engineering Apprenticeship', sector: 'Technology', requirements: ['N3'], location: 'Durban, KwaZulu-Natal', closingDate: new Date('2026-09-15'), stipend: 6500, duration: 18, status: 'Approved' },
  { title: 'Digital Marketing Internship', sector: 'Marketing', requirements: ['Matric'], location: 'Cape Town, Western Cape', closingDate: new Date('2026-07-31'), stipend: 4000, duration: 6, status: 'Approved' },
  { title: 'Plumbing Apprenticeship', sector: 'Construction', requirements: ['Grade 10'], location: 'Pretoria, Gauteng', closingDate: new Date('2026-10-01'), stipend: 3500, duration: 24, status: 'Approved' },
  { title: 'Business Administration Learnership', sector: 'Business', requirements: ['Matric'], location: 'Polokwane, Limpopo', closingDate: new Date('2026-08-15'), stipend: 4500, duration: 12, status: 'Approved' },
  { title: 'Nursing Learnership', sector: 'Healthcare', requirements: ['Matric', 'Biology'], location: 'Cape Town, Western Cape', closingDate: new Date('2026-09-30'), stipend: 5500, duration: 12, status: 'Approved' },
  { title: 'Accounting Internship', sector: 'Finance', requirements: ['Matric', 'Accounting'], location: 'Johannesburg, Gauteng', closingDate: new Date('2026-08-15'), stipend: 6000, duration: 12, status: 'Approved' },
  { title: 'Retail Management Learnership', sector: 'Retail', requirements: ['Matric'], location: 'Durban, KwaZulu-Natal', closingDate: new Date('2026-10-31'), stipend: 4000, duration: 12, status: 'Approved' },
  { title: 'Teaching Assistant Programme', sector: 'Education', requirements: ['Matric'], location: 'Johannesburg, Gauteng', closingDate: new Date('2026-11-30'), stipend: 4000, duration: 12, status: 'Approved' },
  { title: 'Hospitality Management Learnership', sector: 'Hospitality', requirements: ['Matric'], location: 'Cape Town, Western Cape', closingDate: new Date('2026-09-15'), stipend: 4500, duration: 12, status: 'Approved' },
  { title: 'Manufacturing Technician', sector: 'Manufacturing', requirements: ['Grade 12', 'Mathematics'], location: 'Port Elizabeth, Eastern Cape', closingDate: new Date('2026-08-31'), stipend: 5000, duration: 18, status: 'Approved' }
];

const applicantsData = [
  { firstName: 'Thabo', lastName: 'Molefe', email: 'thabo.m@example.com', location: 'Johannesburg, Gauteng', qualifications: [{ qualificationName: 'BSc IT', qualificationLevel: "Bachelor's Degree", nqfLevel: 7, institution: 'University of Johannesburg' }] },
  { firstName: 'Lerato', lastName: 'Dlamini', email: 'lerato.d@example.com', location: 'Cape Town, Western Cape', qualifications: [{ qualificationName: 'National Diploma in Marketing', qualificationLevel: 'Diploma', nqfLevel: 6, institution: 'Cape Peninsula University of Technology' }] },
  { firstName: 'Sipho', lastName: 'Khumalo', email: 'sipho.k@example.com', location: 'Durban, KwaZulu-Natal', qualifications: [{ qualificationName: 'N3 Electrical Engineering', qualificationLevel: 'National Senior Certificate', nqfLevel: 4, institution: 'Majuba TVET College' }] },
  { firstName: 'Naledi', lastName: 'Mabaso', email: 'naledi.m@example.com', location: 'Pretoria, Gauteng', qualifications: [{ qualificationName: 'Matric', qualificationLevel: 'National Senior Certificate', nqfLevel: 4, institution: 'Tshwane North TVET College' }] },
  { firstName: 'Kagiso', lastName: 'Ndlovu', email: 'kagiso.n@example.com', location: 'Polokwane, Limpopo', qualifications: [{ qualificationName: 'Diploma in Management', qualificationLevel: 'Diploma', nqfLevel: 6, institution: 'University of Limpopo' }] },
  { firstName: 'Zanele', lastName: 'Buthelezi', email: 'zanele.b@example.com', location: 'Johannesburg, Gauteng', qualifications: [{ qualificationName: 'Honours in Computer Science', qualificationLevel: 'Honours Degree', nqfLevel: 8, institution: 'Wits University' }] },
  { firstName: 'Mandla', lastName: 'Mthembu', email: 'mandla.m@example.com', location: 'Cape Town, Western Cape', qualifications: [{ qualificationName: 'Matric', qualificationLevel: 'National Senior Certificate', nqfLevel: 4, institution: 'West Coast TVET College' }] },
  { firstName: 'Palesa', lastName: 'Mokoena', email: 'palesa.m@example.com', location: 'Durban, KwaZulu-Natal', qualifications: [{ qualificationName: 'BCom Accounting', qualificationLevel: "Bachelor's Degree", nqfLevel: 7, institution: 'University of KwaZulu-Natal' }] },
  { firstName: 'Tebogo', lastName: 'Moloi', email: 'tebogo.m@example.com', location: 'Pretoria, Gauteng', qualifications: [{ qualificationName: 'Advanced Diploma in HR', qualificationLevel: 'Advanced Diploma', nqfLevel: 7, institution: 'Tshwane University of Technology' }] },
  { firstName: 'Buhle', lastName: 'Zulu', email: 'buhle.z@example.com', location: 'Polokwane, Limpopo', qualifications: [{ qualificationName: 'Matric', qualificationLevel: 'National Senior Certificate', nqfLevel: 4, institution: 'Capricorn TVET College' }] }
];

const statuses = ['Pending', 'Shortlisted', 'Rejected'];
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const threeMonthsAgo = new Date();
threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

async function seed() {
  try {
    await connectDatabase();
    console.log('Connected to database');

    await Application.deleteMany({});
    await Opportunity.deleteMany({});
    await User.deleteMany({ email: { $regex: '@example.com' } });
    console.log('Old seed data cleared');

    const users = [];
    const hashedPassword = '$2b$10$drYxIu/its3hJvlnruNkrOgK9lSdg9Pde9dWpoHJfMZaZV38gGdGW'; // 'password123'
    for (let i = 0; i < applicantsData.length; i++) {
      const data = applicantsData[i];
      const user = await User.create({
        ...data,
        password: hashedPassword,
        role: 'applicant',
        signupMethod: 'manual',
        gender: i % 2 === 0 ? 'Female' : 'Male',
        phone: `07${10000000 + i}`,
        skills: []
      });
      users.push(user);
    }
    console.log(`${users.length} applicants created`);

    const opportunities = await Opportunity.insertMany(opportunitiesData);
    console.log(`${opportunities.length} opportunities created`);

    // Log sectors for verification
    const sectorCounts = await Opportunity.aggregate([
      { $group: { _id: "$sector", count: { $sum: 1 } } }
    ]);
    console.log('Opportunities by sector:', sectorCounts);

    const applications = [];
    for (let i = 0; i < 50; i++) {
      const applicant = users[Math.floor(Math.random() * users.length)];
      const opportunity = opportunities[Math.floor(Math.random() * opportunities.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const createdAt = randomDate(threeMonthsAgo, new Date());

      applications.push({
        applicant: applicant._id,
        opportunity: opportunity._id,
        status,
        createdAt
      });
    }
    await Application.insertMany(applications);
    console.log(`${applications.length} applications created`);

    const appCount = await Application.countDocuments();
    console.log(`Total applications in DB now: ${appCount}`);

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();