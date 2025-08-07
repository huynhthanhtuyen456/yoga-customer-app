#!/usr/bin/env node

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore');

// Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyC6y3-r7w8lFICpcV9iupkcndC_ZC2J0yc",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "yogaapp-e48da.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "yogaapp-e48da",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "yogaapp-e48da.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "770594666098",
  appId: process.env.FIREBASE_APP_ID || "1:770594666098:android:5deaeae9c90fbfd07334eb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample data for yoga classes
const sampleClasses = [
  {
    name: "Hatha Yoga Basics",
    description: "Perfect for beginners. Learn fundamental yoga poses and breathing techniques in a gentle, supportive environment.",
    instructor: "Sarah Johnson",
    duration: 60,
    level: "beginner",
    category: "hatha",
    schedule: [
      { day: "Monday", time: "09:00 AM" },
      { day: "Wednesday", time: "09:00 AM" },
      { day: "Friday", time: "09:00 AM" }
    ],
    maxCapacity: 15,
    currentEnrollment: 8,
    price: 25,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    name: "Vinyasa Flow",
    description: "Dynamic flow class combining movement with breath. Build strength and flexibility through continuous sequences.",
    instructor: "Michael Chen",
    duration: 75,
    level: "intermediate",
    category: "vinyasa",
    schedule: [
      { day: "Tuesday", time: "07:00 AM" },
      { day: "Thursday", time: "07:00 AM" },
      { day: "Saturday", time: "08:00 AM" }
    ],
    maxCapacity: 20,
    currentEnrollment: 15,
    price: 30,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    name: "Power Yoga",
    description: "High-intensity yoga workout that builds strength, endurance, and flexibility. Not for the faint-hearted!",
    instructor: "Emma Rodriguez",
    duration: 90,
    level: "advanced",
    category: "power",
    schedule: [
      { day: "Monday", time: "06:00 AM" },
      { day: "Wednesday", time: "06:00 AM" },
      { day: "Friday", time: "06:00 AM" }
    ],
    maxCapacity: 18,
    currentEnrollment: 12,
    price: 35,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    name: "Gentle Yoga",
    description: "Slow-paced, gentle yoga perfect for relaxation and stress relief. Suitable for all levels and ages.",
    instructor: "David Wilson",
    duration: 45,
    level: "beginner",
    category: "gentle",
    schedule: [
      { day: "Tuesday", time: "06:00 PM" },
      { day: "Thursday", time: "06:00 PM" },
      { day: "Sunday", time: "10:00 AM" }
    ],
    maxCapacity: 12,
    currentEnrollment: 6,
    price: 20,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    name: "Meditation & Mindfulness",
    description: "Learn meditation techniques and mindfulness practices to reduce stress and improve mental clarity.",
    instructor: "Lisa Park",
    duration: 30,
    level: "beginner",
    category: "meditation",
    schedule: [
      { day: "Monday", time: "07:00 PM" },
      { day: "Wednesday", time: "07:00 PM" },
      { day: "Saturday", time: "09:00 AM" }
    ],
    maxCapacity: 25,
    currentEnrollment: 18,
    price: 15,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

// Sample data for yoga courses
const sampleCourses = [
  {
    name: "Yoga Foundation Course",
    description: "A comprehensive 8-week course designed for beginners to build a strong yoga foundation. Learn proper alignment, breathing techniques, and basic philosophy.",
    instructor: "Sarah Johnson",
    duration: 24, // hours
    level: "beginner",
    category: "foundation",
    classes: [], // Will be populated with class IDs
    totalClasses: 16,
    price: 299,
    isActive: true,
    startDate: Timestamp.fromDate(new Date('2024-02-01')),
    endDate: Timestamp.fromDate(new Date('2024-03-28')),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    name: "Advanced Ashtanga Workshop",
    description: "Intensive 4-week workshop for experienced practitioners. Master advanced asanas and deepen your practice.",
    instructor: "Emma Rodriguez",
    duration: 32, // hours
    level: "advanced",
    category: "workshop",
    classes: [], // Will be populated with class IDs
    totalClasses: 12,
    price: 499,
    isActive: true,
    startDate: Timestamp.fromDate(new Date('2024-03-01')),
    endDate: Timestamp.fromDate(new Date('2024-03-28')),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

// Sample data for instructors
const sampleInstructors = [
  {
    name: "Sarah Johnson",
    bio: "Certified yoga instructor with 8 years of experience. Specializes in Hatha and Vinyasa yoga. Passionate about making yoga accessible to everyone.",
    specialties: ["Hatha Yoga", "Vinyasa Flow", "Beginner Instruction"],
    experience: 8,
    certifications: ["RYT-500", "Yoga Alliance Certified"],
    rating: 4.8,
    totalStudents: 1200,
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    name: "Michael Chen",
    bio: "Experienced yoga teacher with a background in martial arts. Combines traditional yoga with modern fitness principles.",
    specialties: ["Vinyasa Flow", "Power Yoga", "Strength Building"],
    experience: 6,
    certifications: ["RYT-200", "Personal Trainer"],
    rating: 4.7,
    totalStudents: 800,
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    name: "Emma Rodriguez",
    bio: "Advanced yoga instructor and former professional athlete. Specializes in challenging, high-intensity yoga classes.",
    specialties: ["Power Yoga", "Advanced Asanas", "Athletic Training"],
    experience: 10,
    certifications: ["RYT-500", "Sports Medicine"],
    rating: 4.9,
    totalStudents: 1500,
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

async function seedData() {
  try {
    console.log('🌱 Seeding Firebase with sample data...\n');

    // Add instructors first
    console.log('Adding instructors...');
    const instructorRefs = [];
    for (const instructor of sampleInstructors) {
      const docRef = await addDoc(collection(db, 'instructors'), instructor);
      instructorRefs.push(docRef.id);
      console.log(`✅ Added instructor: ${instructor.name}`);
    }

    // Add classes
    console.log('\nAdding classes...');
    const classRefs = [];
    for (const yogaClass of sampleClasses) {
      const docRef = await addDoc(collection(db, 'classes'), yogaClass);
      classRefs.push(docRef.id);
      console.log(`✅ Added class: ${yogaClass.name}`);
    }

    // Add courses with class references
    console.log('\nAdding courses...');
    for (const course of sampleCourses) {
      // Assign some classes to courses
      course.classes = classRefs.slice(0, 3); // First 3 classes
      const docRef = await addDoc(collection(db, 'courses'), course);
      console.log(`✅ Added course: ${course.name}`);
    }

    console.log('\n🎉 Sample data successfully added to Firebase!');
    console.log(`📊 Added ${sampleInstructors.length} instructors`);
    console.log(`📊 Added ${sampleClasses.length} classes`);
    console.log(`📊 Added ${sampleCourses.length} courses`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

// Run the seeding function
seedData();
