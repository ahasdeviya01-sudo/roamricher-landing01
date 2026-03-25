import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, DollarSign, CheckCircle2 } from 'lucide-react';
import { destinations } from '../data/destinations';
import { useEffect } from 'react';

export default function Destination() {
  const { id } = useParams<{ id: string }>();
  const destination = destinations.find(d => d.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!destination) {
    return (
      <div className="min-h-screen bg-ink text-cream flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-bold mb-4">Destination Not Found</h1>
        <p className="text-cream/60 mb-8">We couldn't find the destination you're looking for.</p>
        <Link to="/" className="bg-gold text-ink px-6 py-3 rounded-sm font-bold uppercase tracking-widest text-sm hover:bg-gold-light transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink text-cream pb-20">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] w-full">
        <div className="absolute inset-0">
          <img 
            src={destination.heroImage} 
            alt={destination.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
        </div>
        
        <div className="absolute top-6 left-6 z-10">
          <Link to="/" className="flex items-center gap-2 text-cream hover:text-gold transition-colors bg-ink/50 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Destinations
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:px-24">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl md:text-6xl">{destination.flag}</span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">{destination.name}</h1>
          </div>
          <p className="text-lg md:text-xl text-cream/80 max-w-2xl leading-relaxed">
            {destination.description}
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <MapPin className="text-gold w-8 h-8" />
              Top Attractions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {destination.topAttractions.map((attraction, idx) => (
                <div key={idx} className="bg-cream/5 border border-cream/10 rounded-sm overflow-hidden group hover:border-gold/50 transition-colors">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={attraction.image} 
                      alt={attraction.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2">{attraction.name}</h3>
                    <p className="text-cream/60 text-sm leading-relaxed">{attraction.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-cream/5 border border-cream/10 rounded-sm p-6">
            <h3 className="text-xl font-bold mb-6 uppercase tracking-widest text-gold text-sm">Quick Facts</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-ink p-3 rounded-full border border-cream/10">
                  <DollarSign className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-cream/40 mb-1">Daily Budget</p>
                  <p className="font-bold text-lg">{destination.cost}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-ink p-3 rounded-full border border-cream/10">
                  <Calendar className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-cream/40 mb-1">Best Time to Visit</p>
                  <p className="font-bold text-lg">{destination.bestTimeToVisit}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-cream/5 border border-cream/10 rounded-sm p-6">
            <h3 className="text-xl font-bold mb-6 uppercase tracking-widest text-gold text-sm">Budget Tips</h3>
            <ul className="space-y-4">
              {destination.budgetTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <span className="text-cream/80 text-sm leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gold text-ink rounded-sm p-6 text-center">
            <h3 className="text-xl font-bold mb-3">Ready to go?</h3>
            <p className="text-sm opacity-80 mb-6">Generate a custom AI itinerary for {destination.name} in seconds.</p>
            <Link 
              to={`/?destination=${destination.name}`}
              className="inline-block w-full bg-ink text-cream py-3 font-bold text-sm uppercase tracking-widest rounded-sm hover:bg-ink/90 transition-colors"
            >
              Build Itinerary
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
