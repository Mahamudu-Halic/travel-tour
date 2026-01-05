import {
  BookOpen,
  Calendar,
  GraduationCap,
  Heart,
  Leaf,
  Lightbulb,
  Map,
  MapPin,
  Palette,
  Settings,
  Shield,
  Users,
  Crown,
} from "lucide-react";

export const navlinks: { name: string; href: string }[] = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Who we are",
    href: "/about",
  },
  {
    name: "What we do",
    href: "/services",
  },
  {
    name: "Tours",
    href: "/tours",
  },
  {
    name: "Our Team",
    href: "/team",
  },
  {
    name: "Blog",
    href: "/blog",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

export const experiences = [
  {
    title: "Bespoke Cultural Immersions",
    description:
      "Tailor-made journeys for individuals, families, diplomats, and diaspora visitors.",
    icon: Users,
    image: "/assets/images/culture.jpg",
  },
  {
    title: "Educational & Group Tours",
    description:
      "Structured experiential learning for schools, universities, and international students.",
    icon: BookOpen,
    image: "/assets/images/study.jpg",
  },
  {
    title: "Asanteman Heritage Trails",
    description:
      "Guided routes covering royal, ancestral, and sacred ecological sites.",
    icon: MapPin,
    image: "/assets/images/tour.jpg",
  },
  {
    title: "Festivals & Royal Events",
    description:
      "Curated access to Akwasidae, Adae Kɛseɛ, and culturally significant celebrations.",
    icon: Calendar,
    image: "/assets/images/festival.jpg",
  },
];

export const adinkraValues = [
  {
    symbol: "SANKOFA",
    meaning: "Heritage & Memory",
    description: "Return to retrieve what is valuable from the past",
    image: "/assets/images/sankofa.png",
  },
  {
    symbol: "AKOMA",
    meaning: "Human Connection",
    description: "The heart as center of understanding and unity",
    image: "/assets/images/akoma.png",
  },
  {
    symbol: "BI-NKA-BI",
    meaning: "Ethics & Accountability",
    description: "No one should bite the other",
    image: "/assets/images/binkabi.png",
  },
  {
    symbol: "NKYINKYIM",
    meaning: "Adaptability",
    description: "Versatility and resilience in life's journey",
    image: "/assets/images/nkyinkyim.png",
  },
];

export const values = [
  {
    title: "Authenticity & Cultural Integrity",
    description:
      "We honor the true essence of Asanteman heritage, working directly with traditional authorities and knowledge keepers to ensure every experience is genuine and respectful.",
    icon: Heart,
  },
  {
    title: "Respect for Traditional Authority",
    description:
      "Our programs are developed in consultation with royal courts, elders, and community leaders, maintaining the dignity and protocols of Asante tradition.",
    icon: Shield,
  },
  {
    title: "Ethical & Sustainable Tourism",
    description:
      "We prioritize community benefit, environmental conservation, and responsible visitor engagement that preserves resources for future generations.",
    icon: Leaf,
  },
  {
    title: "Education & Intergenerational Learning",
    description:
      "Every tour is designed as a learning journey, connecting past wisdom with present understanding for visitors of all ages and backgrounds.",
    icon: BookOpen,
  },
];

export const services = [
  {
    title: "Bespoke Cultural Immersion Tours",
    description:
      "Tailor-made journeys for individuals, families, diplomats, creatives, and diaspora visitors seeking deep cultural connection.",
    details: [
      "Private guided experiences",
      "Customized itineraries",
      "VIP access to cultural sites",
      "Meet with cultural custodians",
      "Exclusive festival participation",
    ],
    icon: Users,
  },
  {
    title: "Group & Educational Tours",
    description:
      "Structured experiential learning tours for SHS, universities, and international students exploring African heritage.",
    details: [
      "Curriculum-aligned programs",
      "Interactive learning sessions",
      "Field study opportunities",
      "Cultural exchange programs",
      "Group accommodation arrangements",
    ],
    icon: GraduationCap,
  },
  {
    title: "Asanteman Historical & Cultural Trails",
    description:
      "Guided heritage routes covering royal palaces, ancestral sites, sacred groves, and ecological landmarks.",
    details: [
      "Multi-day heritage expeditions",
      "Royal palace tours",
      "Sacred forest visits",
      "Historical battlefield sites",
      "Traditional craft villages",
    ],
    icon: Map,
  },
  {
    title: "Festivals & Royal Experiences",
    description:
      "Curated access to Akwasidae, Adae Kɛseɛ, and other culturally significant events with proper protocol guidance.",
    details: [
      "Festival calendar coordination",
      "Protocol training",
      "Reserved viewing areas",
      "Cultural interpretation",
      "Post-event discussions",
    ],
    icon: Calendar,
  },
  {
    title: "Workshops & Cultural Residencies",
    description:
      "Hands-on learning in Adinkra philosophy, traditional crafts, drumming, dance, and oral history preservation.",
    details: [
      "Adinkra symbol workshops",
      "Kente weaving sessions",
      "Traditional drumming classes",
      "Oral history documentation",
      "Extended cultural residencies",
    ],
    icon: Palette,
  },
];

export const teams = [
  {
    icon: Crown,
    title: "Leadership & Strategy",
    description:
      "Provides vision, partnerships, and strategic direction. Our leadership team brings together expertise in cultural heritage, tourism management, and community development.",
  },
  {
    icon: BookOpen,
    title: "Cultural & Historical Advisors",
    description:
      "Elders, historians, and scholars ensuring authenticity and ethical engagement. They guide our interpretations and validate cultural content across all experiences.",
  },
  {
    icon: Settings,
    title: "Operations & Tour Management",
    description:
      "Logistics, hospitality, safety, and guest experience. Our operations team ensures every journey runs smoothly from booking to farewell.",
  },
  {
    icon: GraduationCap,
    title: "Research & Education Team",
    description:
      "Learning materials, blog content, and academic collaborations. They create resources that deepen understanding and extend the impact of each experience.",
  },
  {
    icon: Users,
    title: "Community Guides & Facilitators",
    description:
      "Trained local guides, artisans, and youth leaders. These community members bring personal stories and authentic perspectives to every tour.",
  },
];
