/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView, AnimatePresence } from 'motion/react';
import { 
  Instagram, 
  Facebook, 
  Mail, 
  MapPin, 
  Zap, 
  Map as MapIcon, 
  Check, 
  X,
  ChevronDown,
  Sparkles,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon issue
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const exchangeRates: Record<string, number> = {
  LKR: 0.0033,
  IDR: 0.000063,
  THB: 0.028,
  VND: 0.00004,
  EUR: 1.08,
  GBP: 1.26,
  AUD: 0.65,
  JPY: 0.0066,
  INR: 0.012,
  MXN: 0.059,
  PHP: 0.018,
  MYR: 0.21,
  SGD: 0.74,
  AED: 0.27,
  KRW: 0.00075,
  BRL: 0.20,
  ZAR: 0.053,
  TRY: 0.031,
  CAD: 0.74,
  CHF: 1.13,
  CNY: 0.14,
  HKD: 0.13,
  NZD: 0.60,
};

function convertCostToUSD(costStr: string): string | null {
  if (!costStr || costStr.toLowerCase() === 'free' || costStr.includes('$') || costStr.includes('USD')) {
    return null;
  }

  let currencyCode = null;
  for (const code of Object.keys(exchangeRates)) {
    if (costStr.includes(code)) {
      currencyCode = code;
      break;
    }
  }

  if (!currencyCode) return null;

  const rate = exchangeRates[currencyCode];
  const numRegex = /[\d,]+(\.\d+)?/g;
  const matches = costStr.match(numRegex);

  if (!matches) return null;

  const convertedNums = matches.map(m => {
    const val = parseFloat(m.replace(/,/g, ''));
    if (isNaN(val)) return null;
    const converted = val * rate;
    if (converted < 1) return converted.toFixed(2);
    if (converted > 100) return Math.round(converted).toString();
    return converted.toFixed(0);
  }).filter(Boolean);

  if (convertedNums.length === 0) return null;
  if (convertedNums.length === 1) return `≈ $${convertedNums[0]}`;
  if (convertedNums.length === 2) return `≈ $${convertedNums[0]} - $${convertedNums[1]}`;
  
  return `≈ $${convertedNums.join('-')}`;
}

const Logo = ({ size = "md", className = "" }: { size?: "sm" | "md" | "lg", className?: string }) => {
  const sizes = {
    sm: { icon: "w-5 h-5 mb-0.5", roam: "text-2xl", richer: "text-[8px] tracking-[0.35em] mt-0.5 ml-0.5" },
    md: { icon: "w-6 h-6 mb-1", roam: "text-3xl", richer: "text-[10px] tracking-[0.4em] mt-1 ml-1" },
    lg: { icon: "w-8 h-8 mb-1.5", roam: "text-5xl", richer: "text-[14px] tracking-[0.4em] mt-1.5 ml-1.5" },
  };
  const s = sizes[size];
  return (
    <div className={`flex flex-col items-center justify-center ${className}`} aria-label="Roam Richer Logo">
      <svg viewBox="0 0 24 24" fill="currentColor" className={`${s.icon} text-cream`} aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
      <div className={`font-sans ${s.roam} font-bold leading-none tracking-tight text-cream`} aria-hidden="true">Roam</div>
      <div className={`font-sans ${s.richer} font-semibold uppercase text-cream`} aria-hidden="true">RICHER</div>
    </div>
  );
};

const Reveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate={controls}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-cream/10">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-medium group-hover:text-gold transition-colors">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-cream/60 leading-relaxed max-w-2xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface Activity {
  time: string;
  title: string;
  description: string;
  cost: string;
}

interface DayPlan {
  day: number;
  theme: string;
  activities: Activity[];
  dailyTotal: string;
}

interface ItineraryData {
  days: DayPlan[];
}

const MAX_FREE_ROUTES = 3;

import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Destination from './pages/Destination';

function Home() {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  // Route Previewer State
  const [destination, setDestination] = useState('');
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const destParam = params.get('destination');
    if (destParam) {
      setDestination(destParam);
      // Scroll to the generator section
      setTimeout(() => {
        const element = document.getElementById('generator');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  const [budget, setBudget] = useState('budget');
  const [itineraryData, setItineraryData] = useState<ItineraryData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [routesGenerated, setRoutesGenerated] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('roam_richer_routes_generated');
    if (stored) {
      setRoutesGenerated(parseInt(stored, 10));
    }
  }, []);

  useEffect(() => {
    // Fetch rough location based on IP (no permission prompt)
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.latitude && data.longitude) {
          setCoordinates([data.latitude, data.longitude]);
        }
      })
      .catch(() => {
        // Fallback to a default location (e.g., London) if it fails
        setCoordinates([51.505, -0.09]);
      });
  }, []);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  const generateRoute = async () => {
    if (!destination) return;
    if (routesGenerated >= MAX_FREE_ROUTES) {
      setErrorMsg("You've reached your limit of free sample routes. Join the waitlist for unlimited access!");
      return;
    }
    
    setIsLoading(true);
    setItineraryData(null);
    setErrorMsg(null);
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, budget }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any).error ?? 'Server error');
      }

      const data = await res.json();
      setItineraryData({ days: data.days });
      setCoordinates([data.coordinates.lat, data.coordinates.lng]);

      const newCount = routesGenerated + 1;
      setRoutesGenerated(newCount);
      localStorage.setItem('roam_richer_routes_generated', newCount.toString());
    } catch (error: any) {
      console.error('API Error:', error);
      setErrorMsg(error?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const destinations = [
    { id: "vietnam", flag: "🇻🇳", name: "Vietnam", cost: "~$22/day", places: "1,840 places" },
    { id: "thailand", flag: "🇹🇭", name: "Thailand", cost: "~$35/day", places: "2,100 places" },
    { id: "bali", flag: "🇮🇩", name: "Bali", cost: "~$28/day", places: "980 places" },
    { id: "malaysia", flag: "🇲🇾", name: "Malaysia", cost: "~$30/day", places: "1,200 places" },
    { id: "japan", flag: "🇯🇵", name: "Japan", cost: "~$65/day", places: "2,500 places" },
    { id: "cambodia", flag: "🇰🇭", name: "Cambodia", cost: "~$25/day", places: "740 places" },
    { id: "laos", flag: "🇱🇦", name: "Laos", cost: "~$20/day", places: "560 places" },
    { id: "india", flag: "🇮🇳", name: "India", cost: "~$25/day", places: "2,200 places" },
    { id: "philippines", flag: "🇵🇭", name: "Philippines", cost: "~$30/day", places: "890 places" },
    { id: "myanmar", flag: "🇲🇲", name: "Myanmar", cost: "~$28/day", places: "620 places" },
    { id: "nepal", flag: "🇳🇵", name: "Nepal", cost: "~$30/day", places: "480 places" },
    { id: "more", flag: "🌏", name: "+16 more", cost: "Coming soon", places: "Growing daily" },
  ];

  const myths = [
    {
      bad: 'You need a travel agency',
      good: 'Our routes cost $0 to access. Agencies charge $200+ for the same trip.'
    },
    {
      bad: 'SE Asia is getting too expensive',
      good: 'Vietnam stays from $7/night. Meals from $1.50. $3,000 = 10 weeks.'
    },
    {
      bad: "You can't travel without a guide",
      good: 'Our routes give you local knowledge without the $200/day guide fee.'
    },
    {
      bad: "TripAdvisor's top 10 is all there is",
      good: 'We have 20,000+ places most travellers never find online.'
    }
  ];

  const faqs = [
    {
      question: "How are these routes actually built?",
      answer: "We don't scrape TripAdvisor. We work with local fixers and long-term residents in each country to map out actual paths they take. Every spot is verified for price, quality, and 'tourist-trap' status."
    },
    {
      question: "Is it safe to travel this cheaply?",
      answer: "Cheap doesn't mean dangerous. In many of our covered countries, $20/day gets you a clean, safe boutique hostel and incredible fresh food. We prioritize safety in our route selection, focusing on well-traveled but authentic paths."
    },
    {
      question: "Do I need to book everything in advance?",
      answer: "Our routes are designed for flexibility. While we recommend booking your first 2 nights, most of our 'Roamers' book as they go using the apps and local tips we provide in the full guide."
    },
    {
      question: "What happens if a place is closed?",
      answer: "Our database is updated weekly. When you access a route, you're getting the most current version. We also provide 'Alternative Roams' for every major stop just in case."
    }
  ];

  return (
    <div className="min-h-screen bg-ink text-cream selection:bg-gold selection:text-ink">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-ink/85 backdrop-blur-xl border-b border-gold/15">
        <a href="#" aria-label="Roam Richer Home">
          <Logo size="sm" />
        </a>
        <a 
          href="#waitlist" 
          className="bg-gold text-ink px-6 py-2.5 rounded-sm font-semibold text-xs tracking-widest uppercase transition-colors hover:bg-gold-light"
        >
          Get Early Access
        </a>
      </header>

      <main>
        {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 hero-bg" />
        <div className="absolute inset-0 hero-grid opacity-10" />
        
        <div className="relative z-10 max-w-5xl">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gold font-semibold text-xs tracking-[0.2em] uppercase mb-6"
          >
            27 Countries · 20,000+ Local Places
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-playfair text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8"
          >
            Stop googling.<br />
            <em className="italic text-gold not-italic">Start roaming.</em>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl font-light text-cream/70 max-w-lg leading-relaxed mb-10"
          >
            Ready-made routes built from local knowledge — matched to your budget, days and interests. No planning. No agencies. No tourist traps.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-4 mb-16"
          >
            <a href="#generator" className="bg-gold text-ink px-8 py-4 font-semibold text-sm tracking-wide rounded-sm transition-all hover:bg-gold-light hover:-translate-y-0.5">
              Preview A Route
            </a>
            <a href="#how" className="bg-transparent text-cream border border-cream/25 px-8 py-4 font-medium text-sm rounded-sm transition-all hover:border-gold hover:text-gold">
              How it works
            </a>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap gap-8 md:gap-12"
          >
            {[
              { val: "27", lbl: "Countries covered" },
              { val: "20k+", lbl: "Local places" },
              { val: "$0", lbl: "Agency fees" },
              { val: "30s", lbl: "To your route" },
            ].map((item, i) => (
              <div key={i} className="border-l-2 border-gold pl-4">
                <div className="font-playfair text-3xl font-bold text-gold leading-none mb-1">{item.val}</div>
                <div className="text-[10px] text-cream/50 uppercase tracking-widest">{item.lbl}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="px-6 py-12 border-b border-cream/5 bg-ink">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-cream/50">As seen in</span>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {['Condé Nast', 'Traveler', 'Lonely Planet', 'Forbes', 'Vogue'].map((brand) => (
              <span key={brand} className="font-playfair text-xl md:text-2xl font-bold tracking-tighter">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ROUTE PREVIEWER (AI) */}
      <section id="generator" className="px-6 md:px-12 py-24 bg-cream/5 border-y border-cream/10">
        <div className="max-w-7xl mx-auto transition-all duration-700">
          <div className={`grid gap-12 items-stretch transition-all duration-700 h-full ${itineraryData ? 'lg:grid-cols-[350px_1fr]' : 'lg:grid-cols-2'}`}>
            <div className="flex flex-col gap-8 h-full">
              <Reveal>
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-widest">
                    <MapPin className="w-3 h-3" />
                    Sample a Route
                  </div>
                  <h2 className="font-playfair text-4xl md:text-5xl font-black leading-tight tracking-tight">
                    Get a taste of<br />the real route.
                  </h2>
                  <p className="text-cream/60 leading-relaxed max-w-md">
                    The full Roam Richer app is launching soon. For now, drop a destination below to generate a sample 3-day itinerary built from our local knowledge base.
                  </p>
                  
                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-cream/40 mb-2">Destination</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Hanoi, Bali, Tokyo..."
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full bg-ink border border-cream/15 px-4 py-3 text-sm outline-none focus:border-gold transition-colors rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-cream/40 mb-2">Budget Style</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['budget', 'mid-range', 'luxury'].map((b) => (
                          <button
                            key={b}
                            onClick={() => setBudget(b)}
                            className={`py-2 text-[10px] uppercase tracking-widest font-bold border rounded-sm transition-all ${
                              budget === b ? 'bg-gold text-ink border-gold' : 'bg-transparent border-cream/15 text-cream/50 hover:border-cream/30'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 pt-2">
                      <button 
                        onClick={generateRoute}
                        disabled={isLoading || !destination || routesGenerated >= MAX_FREE_ROUTES}
                        className="w-full bg-gold text-ink py-4 font-bold text-sm uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold-light transition-colors"
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                        {routesGenerated >= MAX_FREE_ROUTES ? 'Limit Reached' : 'Generate Preview'}
                      </button>
                      
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-cream/40 px-1">
                          <span>Free samples used</span>
                          <span className={routesGenerated >= MAX_FREE_ROUTES ? 'text-rust font-bold' : 'text-gold'}>
                            {routesGenerated} / {MAX_FREE_ROUTES}
                          </span>
                        </div>
                        <div className="w-full h-1 bg-cream/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${routesGenerated >= MAX_FREE_ROUTES ? 'bg-rust' : 'bg-gold'}`}
                            style={{ width: `${(routesGenerated / MAX_FREE_ROUTES) * 100}%` }}
                          />
                        </div>
                        {routesGenerated >= MAX_FREE_ROUTES && (
                          <p className="text-xs text-rust mt-1 text-center">
                            You've used all your free samples. Join the waitlist below!
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal className="flex-1 min-h-[300px] lg:min-h-[400px] w-full flex flex-col">
                <div className="flex-1 w-full rounded-sm overflow-hidden border border-cream/10 z-0 relative">
                  {coordinates ? (
                    <MapContainer key={coordinates.join(',')} center={coordinates} zoom={itineraryData ? 12 : 5} style={{ height: '100%', width: '100%' }}>
                      <TileLayer 
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                      />
                      <Marker position={coordinates}>
                        <Popup className="text-ink font-bold">{destination || "You are here"}</Popup>
                      </Marker>
                    </MapContainer>
                  ) : (
                    <div className="w-full h-full bg-cream/5 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-gold" />
                    </div>
                  )}
                </div>
              </Reveal>
            </div>

            <div className="relative h-full min-h-[650px] lg:min-h-[850px] w-full">
              <div className="absolute inset-0 bg-ink border border-cream/10 rounded-sm p-6 md:p-8 overflow-hidden flex flex-col">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
                    >
                      <Loader2 className="w-8 h-8 text-gold animate-spin mb-4" />
                      <p className="text-gold font-playfair italic text-lg">Consulting our local fixers...</p>
                      <p className="text-cream/30 text-xs mt-2">Mapping routes, checking prices, avoiding traps.</p>
                    </motion.div>
                  ) : itineraryData ? (
                    <motion.div 
                      key="result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex-1 w-full flex flex-col overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-cream/10 shrink-0">
                        <div>
                          <span className="bg-gold/20 text-gold text-[10px] uppercase tracking-widest px-2 py-1 rounded-sm font-bold mr-3">Sample Route</span>
                          <span className="text-xs text-cream/50">Generated from local data</span>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                          {itineraryData.days.map((day, dIdx) => (
                            <div key={dIdx} className="mb-10 last:mb-2">
                              <div className="sticky top-0 bg-ink/95 backdrop-blur-sm z-10 py-2 mb-4 border-b border-cream/10">
                                <h3 className="font-playfair text-xl font-bold text-gold">Day {day.day}: {day.theme}</h3>
                                <p className="text-xs text-cream/50 uppercase tracking-widest mt-1">
                                  Daily Est: {day.dailyTotal}
                                  {(() => {
                                    const usdCost = convertCostToUSD(day.dailyTotal);
                                    return usdCost ? <span className="text-gold/70 ml-1 normal-case">({usdCost})</span> : null;
                                  })()}
                                </p>
                              </div>
                              <div className="relative border-l border-cream/20 ml-3 md:ml-4 space-y-8 pb-4">
                                {day.activities.map((act, aIdx) => (
                                  <div key={aIdx} className="relative pl-6 md:pl-8">
                                    {/* Timeline Dot */}
                                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gold border-2 border-ink" />
                                    
                                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-1">
                                      <span className="text-xs font-mono text-gold/80">{act.time}</span>
                                      <h4 className="text-base font-semibold text-cream">{act.title}</h4>
                                    </div>
                                    <p className="text-sm text-cream/70 leading-relaxed mb-2">{act.description}</p>
                                    <div className="inline-block px-2 py-1 bg-cream/5 rounded-sm text-xs font-mono text-cream/60">
                                      {act.cost}
                                      {(() => {
                                        const usdCost = convertCostToUSD(act.cost);
                                        return usdCost ? <span className="text-gold/70 ml-1">({usdCost})</span> : null;
                                      })()}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-cream/10 text-center shrink-0">
                        <p className="text-xs text-cream/40 mb-4 uppercase tracking-widest">Like this route? Get the full experience when we launch.</p>
                        <a href="#waitlist" className="text-gold font-bold text-xs uppercase tracking-widest hover:underline">Join the waitlist</a>
                      </div>
                    </motion.div>
                  ) : errorMsg ? (
                    <motion.div 
                      key="error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 opacity-50"
                    >
                      <X className="w-12 h-12 mb-4 text-rust" />
                      <p className="font-playfair text-xl text-rust">{errorMsg}</p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 opacity-20"
                    >
                      <MapIcon className="w-12 h-12 mb-4" />
                      <p className="font-playfair text-xl">Your itinerary will appear here.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICE SHOCK */}
      <section className="px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="space-y-4">
              <p className="text-teal font-semibold text-[10px] tracking-[0.2em] uppercase">The Price Reality</p>
              <h2 className="font-playfair text-5xl md:text-6xl font-black leading-tight tracking-tight">
                One night in Sydney<br />
                = <em className="italic text-gold not-italic">9 nights in Hanoi.</em>
              </h2>
              <p className="text-cream/60 leading-relaxed max-w-sm">
                Same budget. Completely different life. Most travellers don't know this because nobody shows them the real numbers. We do.
              </p>
            </div>
          </Reveal>
          
          <div className="space-y-4">
            <Reveal delay={0.1}>
              <div className="bg-cream/5 border border-cream/10 rounded-sm p-6 flex justify-between items-center transition-colors hover:border-gold/30">
                <div>
                  <div className="font-semibold text-lg">Sydney, Australia</div>
                  <div className="text-xs text-cream/45">Average hotel/night</div>
                </div>
                <div className="font-playfair text-3xl font-bold">$280</div>
              </div>
            </Reveal>
            
            <div className="text-center text-[10px] tracking-[0.2em] uppercase text-cream/30">vs</div>
            
            <Reveal delay={0.2}>
              <div className="bg-gold/10 border border-gold/25 rounded-sm p-6 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-lg">Hanoi, Vietnam</div>
                  <div className="text-xs text-cream/45">Boutique hotel/night · 4.9★</div>
                </div>
                <div className="font-playfair text-3xl font-bold text-gold">$22</div>
              </div>
            </Reveal>
            
            <Reveal delay={0.3}>
              <div className="bg-gold/10 border border-gold/25 rounded-sm p-6 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-lg">Bali, Indonesia</div>
                  <div className="text-xs text-cream/45">Full day including meals</div>
                </div>
                <div className="font-playfair text-3xl font-bold text-gold">$28</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <div className="px-6 md:px-12 py-12 border-y border-cream/10 flex flex-wrap items-center justify-center gap-12 md:gap-24">
        {[
          { val: "27", lbl: "Countries" },
          { val: "20,000+", lbl: "Real Local Places" },
          { val: "74+", lbl: "Curated Routes" },
          { val: "$0", lbl: "Agency Markup" },
        ].map((item, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div className="text-center">
              <div className="font-playfair text-4xl font-bold text-gold">{item.val}</div>
              <div className="text-[10px] text-cream/45 uppercase tracking-widest mt-1">{item.lbl}</div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <section id="how" className="px-6 md:px-12 py-24 border-b border-cream/10">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-16">
              <p className="text-gold font-semibold text-[10px] tracking-[0.2em] uppercase mb-3">How it works</p>
              <h2 className="font-playfair text-4xl md:text-5xl font-black leading-tight tracking-tight">
                Your whole trip,<br />ready in 30 seconds.
              </h2>
            </div>
          </Reveal>
          
          <div className="grid md:grid-cols-3 gap-0.5 bg-cream/10 border border-cream/10">
            {[
              { num: "01", icon: <MapPin className="w-6 h-6 text-gold mb-4" />, title: "Tell us where you're going", desc: "Country, dates, budget, and what you're actually into. Food, beaches, culture, adventure — or all of it." },
              { num: "02", icon: <Zap className="w-6 h-6 text-gold mb-4" />, title: "We match your perfect route", desc: "Our system finds the best local route from 20,000+ real places — matched to your exact budget and interests." },
              { num: "03", icon: <MapIcon className="w-6 h-6 text-gold mb-4" />, title: "Just show up and follow it", desc: "Day-by-day itinerary with real local spots, real prices, and real timing. No planning required." },
            ].map((step, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-ink p-10 h-full transition-colors hover:bg-gold/5 group">
                  <div className="font-playfair text-6xl font-black text-gold/15 leading-none mb-6 group-hover:text-gold/25 transition-colors">{step.num}</div>
                  {step.icon}
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-sm text-cream/50 leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="px-6 md:px-12 py-24 border-b border-cream/10">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <p className="text-gold font-semibold text-[10px] tracking-[0.2em] uppercase mb-3">Where we roam</p>
              <h2 className="font-playfair text-4xl md:text-5xl font-black leading-tight tracking-tight">
                27 countries.<br />Zero tourist traps.
              </h2>
            </div>
          </Reveal>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 border border-cream/10">
            {destinations.map((dest, i) => (
              <Reveal key={i} delay={i * 0.05}>
                {dest.id === 'more' ? (
                  <div className="p-6 bg-cream/5 border-r border-b border-cream/10 transition-all hover:bg-gold/10 relative overflow-hidden group h-full">
                    <div className="text-3xl mb-3">{dest.flag}</div>
                    <div className="font-semibold text-sm">{dest.name}</div>
                    <div className="text-[10px] text-gold font-medium mt-1">{dest.cost}</div>
                    <div className="text-[10px] text-cream/35 mt-1">{dest.places}</div>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </div>
                ) : (
                  <Link to={`/destination/${dest.id}`} className="block p-6 bg-cream/5 border-r border-b border-cream/10 cursor-pointer transition-all hover:bg-gold/10 relative overflow-hidden group h-full">
                    <div className="text-3xl mb-3">{dest.flag}</div>
                    <div className="font-semibold text-sm">{dest.name}</div>
                    <div className="text-[10px] text-gold font-medium mt-1">{dest.cost}</div>
                    <div className="text-[10px] text-cream/35 mt-1">{dest.places}</div>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </Link>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MYTHS */}
      <section className="px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <Reveal>
            <div className="space-y-4">
              <p className="text-rust font-semibold text-[10px] tracking-[0.2em] uppercase">Myth busting</p>
              <h2 className="font-playfair text-4xl md:text-5xl font-black leading-tight tracking-tight">
                What people<br />get <em className="italic text-rust not-italic">wrong</em><br />about travel.
              </h2>
              <p className="text-cream/55 leading-relaxed">
                The internet is full of outdated, overpriced, tourist-trap advice. We built Roam Richer because local knowledge is locked away — until now.
              </p>
            </div>
          </Reveal>
          
          <div className="space-y-px bg-cream/10 border border-cream/10">
            {myths.map((myth, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-ink p-6 flex gap-4 items-start transition-colors hover:bg-cream/5">
                  <div className="mt-1">
                    <X className="w-4 h-4 text-rust/60" />
                  </div>
                  <div>
                    <div className="text-xs text-cream/35 line-through mb-1">{myth.bad}</div>
                    <div className="text-sm font-medium text-cream flex gap-2 items-start">
                      <Check className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                      {myth.good}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BUDGET COMPARISON */}
      <section className="px-6 md:px-12 py-24 bg-gold/5 border-y border-gold/10">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-gold font-semibold text-[10px] tracking-[0.2em] uppercase mb-3">The $3,000 Challenge</p>
              <h2 className="font-playfair text-4xl md:text-6xl font-black leading-tight tracking-tight">
                Same budget.<br />Completely different world.
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            <Reveal delay={0.1}>
              <div className="bg-ink border border-cream/10 p-8 md:p-12 h-full">
                <div className="text-cream/30 text-xs uppercase tracking-widest mb-4">Option A</div>
                <h3 className="font-playfair text-3xl font-bold mb-8">2 Weeks in Europe</h3>
                <ul className="space-y-4">
                  {[
                    '7 nights, 1–2 cities max',
                    '€5 coffee every morning',
                    'Trains: €60–100 each leg',
                    'Meals from €20/day',
                    '1 country, always rushed',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 items-start text-cream/50 text-sm">
                      <X className="w-4 h-4 text-rust shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="bg-ink border border-gold/30 p-8 md:p-12 h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gold text-ink text-[10px] font-bold px-4 py-1 uppercase tracking-widest">Recommended</div>
                <div className="text-gold/50 text-xs uppercase tracking-widest mb-4">Option B</div>
                <h3 className="font-playfair text-3xl font-bold text-gold mb-8">10 Weeks in Vietnam</h3>
                <ul className="space-y-4">
                  {[
                    '70 nights, Hanoi to Saigon',
                    '$0.35 Bia Hoi on plastic stools',
                    'Sleeper train Hanoi→Hoi An: $18',
                    'Meals from $1.50/day',
                    'Halong Bay · Hoi An · Mekong',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 items-start text-cream text-sm">
                      <Check className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
          
          <Reveal delay={0.3}>
            <div className="text-center mt-12">
              <p className="font-playfair text-xl italic text-gold">Which would you choose?</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-12 py-24 border-t border-cream/10">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-gold font-semibold text-[10px] tracking-[0.2em] uppercase mb-3">Common Questions</p>
              <h2 className="font-playfair text-4xl md:text-5xl font-black leading-tight tracking-tight">
                Everything you need<br />to know.
              </h2>
            </div>
          </Reveal>
          
          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <FAQItem question={faq.question} answer={faq.answer} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="waitlist" className="relative px-6 md:px-12 py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(201,168,76,0.1)_0%,transparent_70%)]" />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <Reveal>
            <p className="text-gold font-semibold text-[10px] tracking-[0.2em] uppercase mb-6">Early Access</p>
            <h2 className="font-playfair text-5xl md:text-7xl font-black leading-[1.05] tracking-tighter mb-6">
              Travel like you know<br />someone <em className="italic text-gold not-italic">local.</em>
            </h2>
            <p className="text-cream/55 max-w-md mx-auto leading-relaxed mb-10">
              Join the waitlist. Be first to access routes for 27 countries when we launch.
            </p>
            
            {!isSubscribed ? (
              <form onSubmit={handleSignup} className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="your@email.com" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-cream/5 border border-cream/15 border-r-0 sm:border-r-0 px-5 py-4 text-sm outline-none focus:border-gold transition-colors rounded-sm sm:rounded-r-none"
                />
                <button 
                  type="submit"
                  className="bg-gold text-ink px-8 py-4 font-semibold text-sm tracking-wide transition-colors hover:bg-gold-light rounded-sm sm:rounded-l-none"
                >
                  Join Waitlist
                </button>
              </form>
            ) : (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-teal text-ink px-8 py-4 font-semibold text-sm inline-flex items-center gap-2 rounded-sm"
              >
                <Check className="w-5 h-5" />
                You're on the list!
              </motion.div>
            )}
            
            <p className="mt-4 text-[10px] text-cream/25 uppercase tracking-widest">No spam. Just your route, when it's ready.</p>
          </Reveal>
        </div>
      </section>
      </main>

      {/* FOOTER */}
      <footer className="px-6 md:px-12 py-12 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 text-center md:text-left">
          <a href="#" aria-label="Roam Richer Home" className="inline-block">
            <Logo size="md" />
          </a>
          <div className="text-xs text-cream/30">Travel like you know someone local.</div>
        </div>
        
        <div className="flex gap-8">
          <a href="#" aria-label="Instagram" className="text-cream/35 hover:text-gold transition-colors"><Instagram className="w-5 h-5" /></a>
          <a href="https://www.facebook.com/roam.richer" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="text-cream/35 hover:text-gold transition-colors"><Facebook className="w-5 h-5" /></a>
          <a href="#" aria-label="Email" className="text-cream/35 hover:text-gold transition-colors"><Mail className="w-5 h-5" /></a>
        </div>
        
        <div className="flex gap-8 text-[10px] uppercase tracking-widest text-cream/30">
          <a href="#" className="hover:text-gold transition-colors">Privacy</a>
          <a href="#" className="hover:text-gold transition-colors">Terms</a>
          <a href="#" className="hover:text-gold transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destination/:id" element={<Destination />} />
      </Routes>
    </BrowserRouter>
  );
}
