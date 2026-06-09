export interface EventData {
  id: string
  title: string
  description: string
  date: string
  time: string
  venue: string
  price: number
  capacity: number
  enrolled: number
  type: 'workshop' | 'social' | 'performance' | 'competition'
  gradient: string
  tag: string
}

export const upcomingEvents: EventData[] = [
  {
    id: '1',
    title: 'Salsa Bootcamp Intensive',
    description: 'A 3-hour deep-dive into Salsa technique, musicality, and partner work. Perfect for dancers who want to level up quickly.',
    date: '2026-06-21',
    time: '4:00 PM – 7:00 PM',
    venue: 'Salsawala Studios, Park Street',
    price: 2500,
    capacity: 30,
    enrolled: 18,
    type: 'workshop',
    gradient: 'from-red-900 to-orange-700',
    tag: 'Workshop',
  },
  {
    id: '2',
    title: 'Latin Social Night',
    description: 'Monthly social dancing event! Dance the night away with Salsa, Bachata, and Kizomba. All levels welcome. Live DJ!',
    date: '2026-06-28',
    time: '8:00 PM – 12:00 AM',
    venue: 'Salsawala Studios, Park Street',
    price: 500,
    capacity: 80,
    enrolled: 45,
    type: 'social',
    gradient: 'from-purple-900 to-pink-700',
    tag: 'Social',
  },
  {
    id: '3',
    title: 'Bachata Sensual Workshop',
    description: 'Master the art of Bachata Sensual with Hitesh. Learn body rolls, dips, and the musicality that makes Bachata so captivating.',
    date: '2026-07-05',
    time: '5:00 PM – 8:00 PM',
    venue: 'Salsawala Studios, Park Street',
    price: 2000,
    capacity: 20,
    enrolled: 12,
    type: 'workshop',
    gradient: 'from-rose-900 to-red-700',
    tag: 'Workshop',
  },
  {
    id: '4',
    title: 'Annual Dance Showcase 2026',
    description: 'Our biggest event of the year! Watch our talented students perform across 15+ dance styles. Open to the public.',
    date: '2026-08-15',
    time: '6:00 PM onwards',
    venue: 'Rabindra Sadan, Kolkata',
    price: 300,
    capacity: 500,
    enrolled: 210,
    type: 'performance',
    gradient: 'from-gold-600 to-amber-500',
    tag: 'Performance',
  },
]
