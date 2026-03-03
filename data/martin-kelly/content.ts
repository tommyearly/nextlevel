export const SITE = {
  name: 'Costa del Sol Golf',
  phone: '086 600 6202',
  phoneE164: '+353 86 600 6202',
  tagline: 'Golf holidays on the Costa del Sol — for Irish travellers',
} as const;

export type Course = {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  shortDescription: string;
  holes: number;
  par: number;
  image: string;
  featured?: boolean;
};

export type Accommodation = {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  shortDescription: string;
  image: string;
  featured?: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
};

export const COURSES: Course[] = [
  {
    id: '1',
    name: 'Real Club Valderrama',
    slug: 'real-club-valderrama',
    location: 'Sotogrande',
    description:
      'Officially voted Europe\'s No. 1 Golf Course. Home to the Volvo Masters and host to the 1997 Ryder Cup. A bucket-list round for any Irish golfer — challenging, immaculate, and unforgettable.',
    shortDescription: 'Europe\'s No. 1 course. Ryder Cup venue. A must-play for serious golfers.',
    holes: 18,
    par: 71,
    image: '/images/courses/valderrama.jpg',
    featured: true,
  },
  {
    id: '2',
    name: 'Flamingos Golf Club',
    slug: 'flamingos-golf-club',
    location: 'Cancelada, between Marbella and Estepona',
    description:
      'Challenging layout with breathtaking views of the Mediterranean and the mountains. Popular with Irish groups for its mix of playability and scenery. Easy reach from Malaga airport.',
    shortDescription: 'Stunning sea and mountain views. Perfect for groups from Ireland.',
    holes: 18,
    par: 72,
    image: '/images/courses/flamingos.jpg',
    featured: true,
  },
  {
    id: '3',
    name: 'La Zagaleta New Course',
    slug: 'la-zagaleta',
    location: 'Benahavís',
    description:
      'Par-70 course that merges golf with nature. Inaugurated in 2005, it offers a premium experience in the hills above the coast — ideal for those flying from Dublin or Cork seeking something special.',
    shortDescription: 'Golf meets nature. Exclusive setting in the hills above the coast.',
    holes: 18,
    par: 70,
    image: '/images/courses/zagaleta.jpg',
    featured: true,
  },
  {
    id: '4',
    name: 'Santa María Golf & Country Club',
    slug: 'santa-maria-golf',
    location: 'Marbella',
    description:
      'A favourite with Irish visitors: great conditioning, friendly clubhouse, and excellent value. Direct flights from Ireland to Malaga make it an easy choice for a long weekend or week-long break.',
    shortDescription: 'Great value and conditioning. Popular with Irish groups.',
    holes: 18,
    par: 72,
    image: '/images/courses/santa-maria.jpg',
    featured: false,
  },
  {
    id: '5',
    name: 'Aloha Golf Club',
    slug: 'aloha-golf-club',
    location: 'Marbella',
    description:
      'Javier Arana design with mature trees and strategic bunkering. A classic Costa del Sol experience, well suited to groups travelling from Ireland for a week of sun and golf.',
    shortDescription: 'Classic design. Mature parkland. Ideal for Irish golf breaks.',
    holes: 18,
    par: 72,
    image: '/images/courses/aloha.jpg',
    featured: false,
  },
];

export const ACCOMMODATION: Accommodation[] = [
  {
    id: '1',
    name: 'El Fuerte Marbella',
    slug: 'el-fuerte-marbella',
    location: 'Marbella',
    description:
      'Historic hotel with sea views and a relaxed atmosphere. Perfect base for Irish golfers — close to courses, beach, and old town. We have preferential rates and flexible cancellation.',
    shortDescription: 'Historic Marbella favourite. Sea views and great location.',
    image: '/images/accommodation/el-fuerte.jpg',
    featured: true,
  },
  {
    id: '2',
    name: 'Puente Romano Marbella',
    slug: 'puente-romano-marbella',
    location: 'Marbella',
    description:
      'Five-star resort with its own beach, tennis, and spa. Ideal for groups who want top-end accommodation and easy access to the best Costa del Sol courses. Popular with Irish couples and fourballs.',
    shortDescription: 'Five-star resort. Beach, spa, and top golf access.',
    image: '/images/accommodation/puente-romano.jpg',
    featured: true,
  },
  {
    id: '3',
    name: 'Westin La Quinta Golf Resort',
    slug: 'westin-la-quinta',
    location: 'Estepona',
    description:
      'Golf-focused resort with 27 holes on site. Fly into Malaga from Dublin or Cork, transfer in under an hour, and play from the moment you arrive. We can package rooms with rounds across the coast.',
    shortDescription: '27 holes on site. Golf-first resort. Easy from Irish airports.',
    image: '/images/accommodation/westin-la-quinta.jpg',
    featured: true,
  },
  {
    id: '4',
    name: 'Gran Meliá Don Pepe',
    slug: 'gran-melia-don-pepe',
    location: 'Marbella',
    description:
      'Luxury on the Golden Mile. Pool, beach, and excellent dining. We book many Irish groups here for a mix of golf and relaxation — preferential rates and cancellation terms when you book through us.',
    shortDescription: 'Golden Mile luxury. Pool, beach, and golf packages.',
    image: '/images/accommodation/don-pepe.jpg',
    featured: false,
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Patrick M.',
    location: 'Dublin',
    text: 'Booked a week for our society from Dublin. Flights to Malaga are grand, and the whole trip was seamless — courses, hotels, transfers. Will definitely use again.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Siobhan & John',
    location: 'Cork',
    text: 'We wanted a mix of golf and a few days by the sea. They put together a perfect package: Valderrama once and two other courses, plus a lovely hotel in Marbella. Couldn\'t fault it.',
    rating: 5,
  },
  {
    id: '3',
    name: 'David K.',
    location: 'Galway',
    text: 'First time organising a golf trip from Ireland. They handled everything — tee times, accommodation, even suggested the best courses for our handicap range. Professional from start to finish.',
    rating: 5,
  },
];

export const PACKAGE_STEPS = [
  {
    step: 1,
    title: 'Choose your dates',
    description: 'Tell us when you want to travel from Ireland. We\'ll check availability across the best Costa del Sol courses and hotels.',
  },
  {
    step: 2,
    title: 'Pick your courses & stay',
    description: 'Select from 70+ courses between Malaga and Gibraltar and our hand-picked accommodation. We have preferential rates and tee-time access.',
  },
  {
    step: 3,
    title: 'We design your package',
    description: 'We put together your tailor-made quote: golf, accommodation, and optional transfers or car hire. No hidden extras.',
  },
  {
    step: 4,
    title: 'Book and travel',
    description: 'Confirm with a deposit. Fly Dublin or Cork to Malaga, and we take care of the rest. Your golf break, stress-free.',
  },
];

export const EXTRAS = [
  {
    title: 'Golf club rental',
    description: 'Quality sets on the Costa del Sol so you can travel light from Ireland.',
  },
  {
    title: 'Transfers',
    description: 'Airport to hotel and course transfers. We arrange it all.',
  },
  {
    title: 'Car hire',
    description: 'Flexible car rental for those who want to explore between rounds.',
  },
  {
    title: 'Excursions',
    description: 'Sightseeing, tapas tours, or a day off the fairways — we can add it.',
  },
];

export const FAQ_ITEMS = [
  {
    q: 'Do you only cover the Costa del Sol?',
    a: 'Yes. We specialise only in the Costa del Sol — from Malaga to Gibraltar. This means we know the courses, hotels, and logistics inside out and can offer the best value and availability for Irish travellers.',
  },
  {
    q: 'How do I get there from Ireland?',
    a: 'Direct flights from Dublin and Cork to Malaga run year-round. Flight time is around 2.5 hours. We can include airport transfers in your package so you\'re collected and dropped off without hassle.',
  },
  {
    q: 'What\'s included in a typical package?',
    a: 'Packages are tailor-made. Usually: accommodation, green fees and pre-booked tee times, and optionally transfers, car hire, or club rental. We quote in euros and will give you a clear breakdown before you book.',
  },
  {
    q: 'What are your cancellation terms?',
    a: 'When you book through us you benefit from better cancellation conditions than booking direct. We\'ll explain the terms for your chosen accommodation and courses before you confirm.',
  },
  {
    q: 'Can you help with society or group trips?',
    a: 'Yes. We regularly organise trips for Irish golf societies and groups. We handle courses, hotels, and logistics so you can focus on the golf and the craic.',
  },
];
