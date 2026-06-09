import { Instructor } from '../types'

export const instructors: Instructor[] = [
  {
    id: 'hitesh',
    name: 'Hitesh H. Teckchandani',
    title: 'Founder & Head Instructor',
    bio: 'Known as "The Salsawala", Hitesh has been the driving force behind the Latin dance movement in Kolkata for over a decade. His passion for Salsa, Bachata, and Kizomba has transformed hundreds of students into confident dancers. He brings the authentic Latin flavor with a signature teaching style that makes every class an unforgettable experience.',
    styles: ['Salsa', 'Bachata', 'Kizomba', 'Mambo', 'Cha-Cha'],
    experience: '12+ Years',
    photoGradient: 'from-red-900 via-red-700 to-red-500',
    social: {
      instagram: 'https://www.instagram.com/salsawalastudios/',
      facebook: 'https://www.facebook.com/salsawala/',
    },
  },
  {
    id: 'priyam',
    name: 'Priyam Bose',
    title: 'Senior Instructor',
    bio: 'Priyam brings a graceful versatility to Salsawala Studios with her expertise spanning Contemporary, Bollywood, and Pilates. Her classes blend technical precision with artistic expression, creating a holistic movement experience. With years of performance and teaching experience, she nurtures each student\'s unique journey.',
    styles: ['Contemporary', 'Bollywood', 'Pilates', 'Body Conditioning'],
    experience: '8+ Years',
    photoGradient: 'from-purple-900 via-purple-700 to-pink-500',
    social: {
      instagram: 'https://www.instagram.com/salsawalastudios/',
    },
  },
  {
    id: 'akash',
    name: 'Akash Agarwal',
    title: 'Hip-Hop Instructor',
    bio: 'Akash brings raw energy and street-style authenticity to every Hip-Hop session. His dynamic teaching approach breaks down complex moves into learnable steps, making Hip-Hop accessible to all levels. From breaking to locking, popping to contemporary urban styles, Akash\'s classes are high-energy and transformative.',
    styles: ['Hip-Hop', 'Breaking', 'Locking', 'Popping', 'Urban Fusion'],
    experience: '6+ Years',
    photoGradient: 'from-blue-900 via-blue-700 to-cyan-500',
    social: {
      instagram: 'https://www.instagram.com/salsawalastudios/',
    },
  },
]
