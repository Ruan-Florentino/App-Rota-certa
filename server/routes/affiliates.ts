import { Request, Response } from 'express';

export const getAffiliateFlights = (req: Request, res: Response) => {
  const { origin = 'SAO', destination = 'CDG', date = '', passengers = 1 } = req.query;
  
  // Format date to YYMMDD for Aviasales
  let formattedDate = '241201'; // Fallback
  if (typeof date === 'string' && date.includes('-')) {
    const parts = date.split('-');
    if (parts.length === 3) {
      formattedDate = `${parts[0].slice(-2)}${parts[1]}${parts[2]}`; // YYYY-MM-DD -> YYMMDD
    }
  }

  // Get Marker from env
  const marker = process.env.TRAVELPAYOUTS_MARKER || 'YOUR_MARKER_HERE';

  // Construct Travelpayouts / Aviasales URL
  const buildAviasalesLink = (orig: string, dest: string, d: string) => {
    // We assume orig and dest are standard 3-letter IATA codes when possible.
    // E.g., https://www.aviasales.com/search/SAO250815CDG1?marker={MARKER}
    const safeOrig = (orig as string).substring(0, 3).toUpperCase();
    const safeDest = (dest as string).substring(0, 3).toUpperCase();
    return `https://www.aviasales.com/search/${safeOrig}${d}${safeDest}1?marker=${marker}`;
  };

  const link = buildAviasalesLink(origin as string, destination as string, formattedDate);
  
  const flights = [
    { 
      airline: 'LATAM', 
      price: 1850 + Math.floor(Math.random() * 500), 
      duration: '11h 45m', 
      stops: 0, 
      departureTime: '20:30', 
      arrivalTime: '08:15', 
      link: link, 
      affiliateNote: true,
      platform: 'Aviasales'
    },
    { 
      airline: 'GOL', 
      price: 1680 + Math.floor(Math.random() * 500), 
      duration: '14h 10m', 
      stops: 1, 
      departureTime: '10:15', 
      arrivalTime: '14:25', 
      link: link, 
      affiliateNote: true,
      platform: 'Aviasales'
    },
    { 
      airline: 'AZUL', 
      price: 2100 + Math.floor(Math.random() * 500), 
      duration: '10h 50m', 
      stops: 0, 
      departureTime: '07:00', 
      arrivalTime: '10:50', 
      link: link, 
      affiliateNote: true,
      platform: 'Aviasales'
    },
    { 
      airline: 'AIR FRANCE', 
      price: 2450 + Math.floor(Math.random() * 500), 
      duration: '11h 20m', 
      stops: 0, 
      departureTime: '16:00', 
      arrivalTime: '08:20', 
      link: link, 
      affiliateNote: true,
      platform: 'Aviasales'
    }
  ];

  res.setHeader('X-Data-Type', 'affiliate');
  res.json(flights);
};

export const getAffiliateHotels = (req: Request, res: Response) => {
  const { city = 'Paris', checkIn = '', checkOut = '', guests = 2 } = req.query;
  
  const utm = "aid=RIGHTWAY_AFFILIATE&utm_source=rightway&utm_medium=affiliate";
  const cityEncoded = encodeURIComponent(city as string);
  
  const hotels = [
    { 
      name: `${city} Grand Plaza`, 
      price: 650 + Math.floor(Math.random() * 200), 
      rating: 4.8, 
      stars: 5, 
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', 
      location: 'Centro', 
      link: `https://www.booking.com/searchresults.html?ss=${cityEncoded}&checkin=${checkIn}&checkout=${checkOut}&group_adults=${guests}&${utm}`,
      affiliateNote: true,
      platform: 'Booking.com'
    },
    { 
      name: `Boutique Hotel ${city}`, 
      price: 480 + Math.floor(Math.random() * 150), 
      rating: 4.5, 
      stars: 4, 
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', 
      location: 'Bairro Histórico', 
      link: `https://www.hotels.com/search.do?destination-id=${cityEncoded}&q-check-in=${checkIn}&q-check-out=${checkOut}&q-rooms=1&q-room-0-adults=${guests}&${utm}`,
      affiliateNote: true,
      platform: 'Hotels.com'
    },
    { 
      name: 'Cozy Central Apartment', 
      price: 280 + Math.floor(Math.random() * 100), 
      rating: 4.9, 
      stars: 3, 
      image: 'https://images.unsplash.com/photo-1499955085172-a104c9463ece', 
      location: 'Centro', 
      link: `https://www.airbnb.com.br/s/${cityEncoded}/homes?checkin=${checkIn}&checkout=${checkOut}&adults=${guests}&${utm}`,
      affiliateNote: true,
      platform: 'Airbnb'
    },
    { 
      name: `Resort & Spa ${city}`, 
      price: 850 + Math.floor(Math.random() * 300), 
      rating: 4.7, 
      stars: 5, 
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39', 
      location: 'Zona Sul', 
      link: `https://www.booking.com/searchresults.html?ss=${cityEncoded}&checkin=${checkIn}&checkout=${checkOut}&group_adults=${guests}&${utm}`,
      affiliateNote: true,
      platform: 'Booking.com'
    }
  ];

  res.setHeader('X-Data-Type', 'affiliate');
  res.json(hotels);
};
