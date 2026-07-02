export type Testimonial = {
  quote: string
  name: string
  role: string
  initials: string
  img?: string
  country?: string
}

// Client-style testimonials — replace names/quotes with real approved ones.
export const testimonials: Testimonial[] = [
  {
    quote: 'Eaglescroft built us a property platform buyers actually trust. Browsing is effortless and enquiries jumped almost immediately. They think like partners.',
    name: 'Adaeze O.', role: 'Founder, Star Homes', initials: 'AO',
    img: 'https://randomuser.me/api/portraits/women/68.jpg', country: '🇳🇬 Nigeria',
  },
  {
    quote: 'Sharp engineering with genuine design taste. Our site loads instantly and converts far better than the old one.',
    name: 'James W.', role: 'Director, Oval Sports', initials: 'JW',
    img: 'https://randomuser.me/api/portraits/men/51.jpg', country: '🇦🇺 Australia',
  },
  {
    quote: 'They understood healthcare trust signals immediately. The booking flow is seamless and patients actually use it.',
    name: 'Dr. Ibrahim K.', role: 'Admin, Heritage Hospitals', initials: 'IK',
    img: 'https://randomuser.me/api/portraits/men/85.jpg', country: '🇳🇬 Nigeria',
  },
  {
    quote: 'From brand identity to a fully booked fleet site — premium work, on time, no hand-holding.',
    name: 'Marcus D.', role: 'Owner, Dash Limo', initials: 'MD',
    img: 'https://randomuser.me/api/portraits/men/33.jpg', country: '🇺🇸 USA',
  },
  {
    quote: 'Our organic traffic climbed within weeks. The technical SEO work alone paid for the whole project.',
    name: 'Sophie L.', role: 'CMO, Distinct News', initials: 'SL',
    img: 'https://randomuser.me/api/portraits/women/32.jpg', country: '🇬🇧 UK',
  },
  {
    quote: 'The AI automation they set up quietly saves us hours every single week. Genuinely game-changing.',
    name: 'Tunde A.', role: 'Ops Lead, Datavox Media', initials: 'TA',
    img: 'https://randomuser.me/api/portraits/men/22.jpg', country: '🇳🇬 Nigeria',
  },
  {
    quote: 'Communication was flawless across time zones. Felt like they were in the room with us the whole build.',
    name: 'Emma R.', role: 'Founder, Primus Learning', initials: 'ER',
    img: 'https://randomuser.me/api/portraits/women/53.jpg', country: '🇨🇦 Canada',
  },
  {
    quote: 'A rare mix of taste and technical depth. Our brand finally looks as serious as the business behind it.',
    name: 'Daniel M.', role: 'CEO, P4 Studio', initials: 'DM',
    img: 'https://randomuser.me/api/portraits/men/61.jpg', country: '🇳🇬 Nigeria',
  },
  {
    quote: 'Fast, reliable and genuinely creative. We’ve moved every new project to Eaglescroft since.',
    name: 'Aisha B.', role: 'Director, Enyobuilt', initials: 'AB',
    img: 'https://randomuser.me/api/portraits/women/45.jpg', country: '🇳🇬 Nigeria',
  },
]
