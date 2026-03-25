export interface Attraction {
  name: string;
  description: string;
  image: string;
}

export interface Destination {
  id: string;
  name: string;
  flag: string;
  cost: string;
  places: string;
  heroImage: string;
  description: string;
  bestTimeToVisit: string;
  topAttractions: Attraction[];
  budgetTips: string[];
}

export const destinations: Destination[] = [
  {
    id: "vietnam",
    name: "Vietnam",
    flag: "🇻🇳",
    cost: "~$22/day",
    places: "1,840 places",
    heroImage: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1920&q=80",
    description: "A country of staggering natural beauty and cultural complexities, of dynamic megacities and hill-tribe villages. Vietnam is both exotic and compelling.",
    bestTimeToVisit: "November to April (Dry Season)",
    topAttractions: [
      {
        name: "Ha Long Bay",
        description: "Emerald waters and thousands of towering limestone islands topped by rainforests.",
        image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Hoi An Ancient Town",
        description: "Exceptionally well-preserved example of a South-East Asian trading port.",
        image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Phong Nha Caves",
        description: "Some of the largest and most spectacular caves in the world.",
        image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80"
      }
    ],
    budgetTips: [
      "Eat street food like Pho and Banh Mi for under $2.",
      "Use sleeper buses for cheap and comfortable long-distance travel.",
      "Drink 'Bia Hoi' (fresh beer) which costs around $0.20 a glass."
    ]
  },
  {
    id: "thailand",
    name: "Thailand",
    flag: "🇹🇭",
    cost: "~$35/day",
    places: "2,100 places",
    heroImage: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1920&q=80",
    description: "Friendly and fun-loving, cultured and historic, Thailand radiates a golden hue from its glittering temples and tropical beaches.",
    bestTimeToVisit: "November to early April",
    topAttractions: [
      {
        name: "Bangkok Grand Palace",
        description: "The spectacular former residence of the Kings of Siam.",
        image: "https://images.unsplash.com/photo-1582468546235-9bf31e5bc4a1?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Chiang Mai Temples",
        description: "Ancient temples nestled in the mountainous north.",
        image: "https://images.unsplash.com/photo-1513568720593-cb0c24b815fa?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Phi Phi Islands",
        description: "Stunning limestone cliffs rising from turquoise waters.",
        image: "https://images.unsplash.com/photo-1537956965359-7573183d1f57?auto=format&fit=crop&w=800&q=80"
      }
    ],
    budgetTips: [
      "Shop at local night markets for cheap meals and souvenirs.",
      "Use Grab or Bolt instead of traditional taxis.",
      "Stay in local guesthouses rather than international hotel chains."
    ]
  },
  {
    id: "bali",
    name: "Bali",
    flag: "🇮🇩",
    cost: "~$28/day",
    places: "980 places",
    heroImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1920&q=80",
    description: "The mere mention of Bali evokes thoughts of a paradise. It's more than a place; it's a mood, an aspiration, a tropical state of mind.",
    bestTimeToVisit: "April to October (Dry Season)",
    topAttractions: [
      {
        name: "Ubud Rice Terraces",
        description: "Lush green terraced rice fields offering stunning landscapes.",
        image: "https://images.unsplash.com/photo-1559628233-eb1b1a45564b?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Uluwatu Temple",
        description: "A spectacular sea temple perched on a high cliff edge.",
        image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Nusa Penida",
        description: "Rugged island with dramatic cliffs and pristine beaches.",
        image: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=800&q=80"
      }
    ],
    budgetTips: [
      "Eat at local 'Warungs' for authentic and cheap Indonesian food.",
      "Rent a scooter for around $4-5 a day to get around.",
      "Avoid the peak tourist areas of Seminyak and Canggu for cheaper stays."
    ]
  },
  {
    id: "malaysia",
    name: "Malaysia",
    flag: "🇲🇾",
    cost: "~$30/day",
    places: "1,200 places",
    heroImage: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1920&q=80",
    description: "A dynamic melting pot of Malay, Chinese, Indian and indigenous cultures, offering incredible food and diverse landscapes.",
    bestTimeToVisit: "March to early October",
    topAttractions: [
      {
        name: "Petronas Twin Towers",
        description: "Iconic skyscrapers dominating the Kuala Lumpur skyline.",
        image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Penang Street Art",
        description: "Historic George Town famous for its vibrant street art and food.",
        image: "https://images.unsplash.com/photo-1558005530-cb61e2197112?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Langkawi",
        description: "An archipelago of 99 islands known for stunning beaches and nature.",
        image: "https://images.unsplash.com/photo-1584646098378-0874589d76b1?auto=format&fit=crop&w=800&q=80"
      }
    ],
    budgetTips: [
      "Take advantage of the excellent and cheap public transport in KL.",
      "Eat at Mamak stalls for delicious, budget-friendly meals.",
      "Domestic flights with AirAsia can be extremely cheap if booked early."
    ]
  },
  {
    id: "japan",
    name: "Japan",
    flag: "🇯🇵",
    cost: "~$65/day",
    places: "2,500 places",
    heroImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1920&q=80",
    description: "A truly timeless place where ancient traditions are fused with modern life as if it were the most natural thing in the world.",
    bestTimeToVisit: "March to May (Spring) or September to November (Autumn)",
    topAttractions: [
      {
        name: "Mount Fuji",
        description: "Japan's iconic, perfectly shaped volcano.",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Kyoto Temples",
        description: "The heart of traditional Japan with thousands of classical Buddhist temples.",
        image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Tokyo Shibuya Crossing",
        description: "The world's busiest pedestrian crossing in the neon-lit capital.",
        image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80"
      }
    ],
    budgetTips: [
      "Buy meals from convenience stores (Konbini) like 7-Eleven or Lawson.",
      "Look into regional rail passes instead of the national JR Pass if staying local.",
      "Stay in capsule hotels or business hotels for cheaper accommodation."
    ]
  },
  {
    id: "cambodia",
    name: "Cambodia",
    flag: "🇰🇭",
    cost: "~$25/day",
    places: "740 places",
    heroImage: "https://images.unsplash.com/photo-1600195077909-46e573870d99?auto=format&fit=crop&w=1920&q=80",
    description: "There's a magic about this charming yet confounding kingdom that casts a spell on visitors.",
    bestTimeToVisit: "November to May",
    topAttractions: [
      {
        name: "Angkor Wat",
        description: "The largest religious monument in the world.",
        image: "https://images.unsplash.com/photo-1600195077909-46e573870d99?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Koh Rong",
        description: "A paradise island with white sand beaches and bioluminescent plankton.",
        image: "https://images.unsplash.com/photo-1534008897995-27a23e859048?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Phnom Penh Royal Palace",
        description: "A complex of buildings which serves as the royal residence of the king.",
        image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80"
      }
    ],
    budgetTips: [
      "Negotiate tuk-tuk prices before getting in.",
      "Draft beer can be found for as little as $0.50 during happy hours.",
      "Eat at local markets for the best value food."
    ]
  },
  {
    id: "laos",
    name: "Laos",
    flag: "🇱🇦",
    cost: "~$20/day",
    places: "560 places",
    heroImage: "https://images.unsplash.com/photo-1540492649367-c8565a57cb08?auto=format&fit=crop&w=1920&q=80",
    description: "A laid-back, landlocked country known for its mountainous terrain, French colonial architecture, and Buddhist monasteries.",
    bestTimeToVisit: "October to April",
    topAttractions: [
      {
        name: "Luang Prabang",
        description: "A UNESCO World Heritage city known for its temples and night market.",
        image: "https://images.unsplash.com/photo-1540492649367-c8565a57cb08?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Kuang Si Falls",
        description: "Stunning multi-tiered waterfalls with turquoise blue pools.",
        image: "https://images.unsplash.com/photo-1523592121529-f6dde35f079e?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Vang Vieng",
        description: "Famous for its karst hill landscape and outdoor activities.",
        image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80"
      }
    ],
    budgetTips: [
      "Travel by local bus instead of VIP tourist buses.",
      "Eat at the night markets for cheap and varied local food.",
      "Rent a bicycle to explore towns instead of taking tuk-tuks."
    ]
  },
  {
    id: "india",
    name: "India",
    flag: "🇮🇳",
    cost: "~$25/day",
    places: "2,200 places",
    heroImage: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1920&q=80",
    description: "A country of dazzling contrasts, from the snow-capped Himalayas to the tropical beaches of Kerala.",
    bestTimeToVisit: "October to March",
    topAttractions: [
      {
        name: "Taj Mahal",
        description: "The iconic ivory-white marble mausoleum in Agra.",
        image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Jaipur (Pink City)",
        description: "Known for its historic palaces, forts, and vibrant markets.",
        image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Kerala Backwaters",
        description: "A network of brackish lagoons and lakes lying parallel to the Arabian Sea coast.",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80"
      }
    ],
    budgetTips: [
      "Travel by train in Sleeper Class for very cheap long-distance journeys.",
      "Eat at local 'Dhabas' for authentic and inexpensive meals.",
      "Drink filtered water or carry a purifying bottle to save on bottled water."
    ]
  },
  {
    id: "philippines",
    name: "Philippines",
    flag: "🇵🇭",
    cost: "~$30/day",
    places: "890 places",
    heroImage: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1920&q=80",
    description: "An archipelago of over 7,000 islands offering some of the world's best beaches and diving spots.",
    bestTimeToVisit: "December to May",
    topAttractions: [
      {
        name: "El Nido, Palawan",
        description: "Famous for its white-sand beaches, coral reefs, and limestone cliffs.",
        image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Boracay",
        description: "A small island known for its resorts and beautiful White Beach.",
        image: "https://images.unsplash.com/photo-1518481852452-9415b262eba4?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Chocolate Hills",
        description: "An unusual geological formation in Bohol province.",
        image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80"
      }
    ],
    budgetTips: [
      "Use local ferries for inter-island travel instead of flying.",
      "Eat at 'Eateries' or 'Carenderias' for cheap local food.",
      "Book domestic flights well in advance during promo sales."
    ]
  },
  {
    id: "myanmar",
    name: "Myanmar",
    flag: "🇲🇲",
    cost: "~$28/day",
    places: "620 places",
    heroImage: "https://images.unsplash.com/photo-1500215667123-5e921e05001d?auto=format&fit=crop&w=1920&q=80",
    description: "A land of breathtaking beauty and charm, featuring thousands of ancient Buddhist temples.",
    bestTimeToVisit: "November to February",
    topAttractions: [
      {
        name: "Bagan",
        description: "An ancient city featuring thousands of temples and pagodas.",
        image: "https://images.unsplash.com/photo-1500215667123-5e921e05001d?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Inle Lake",
        description: "Famous for its floating villages and gardens.",
        image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Shwedagon Pagoda",
        description: "A massive, gilded stupa in Yangon.",
        image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80"
      }
    ],
    budgetTips: [
      "Take overnight VIP buses to save on a night's accommodation.",
      "Eat at local teahouses for cheap meals and cultural immersion.",
      "Travel during the shoulder season for better hotel rates."
    ]
  },
  {
    id: "nepal",
    name: "Nepal",
    flag: "🇳🇵",
    cost: "~$30/day",
    places: "480 places",
    heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80",
    description: "A trekker's paradise, combining Himalayan views, golden temples, charming hill villages and jungle wildlife watching.",
    bestTimeToVisit: "October to December",
    topAttractions: [
      {
        name: "Kathmandu Valley",
        description: "The cultural heart of Nepal with numerous temples and stupas.",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Pokhara",
        description: "A beautiful lakeside city and gateway to the Annapurna Circuit.",
        image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Everest Base Camp",
        description: "The classic trek to the base of the world's highest mountain.",
        image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80"
      }
    ],
    budgetTips: [
      "Eat Dal Bhat; it's cheap, filling, and often comes with free refills.",
      "Trek independently instead of hiring a guide if you have experience.",
      "Stay in teahouses while trekking for very cheap accommodation."
    ]
  }
];
