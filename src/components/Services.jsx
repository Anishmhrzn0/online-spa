import React from 'react';
import { Droplets, Thermometer, Flower, Clock, Star } from 'lucide-react';

export const services = [
  {
    id: 1,
    icon: Droplets,
    title: 'Hydrotherapy Supreme',
    description: 'Advanced water therapy with mineral-rich solutions and targeted pressure points',
    features: ['Mineral infusion', 'Pressure therapy', 'Temperature control'],
    price: '$180',
    duration: '90 min',
    rating: 4.9
  },
  {
    id: 2,
    icon: Thermometer,
    title: 'Thermal Equilibrium',
    description: 'Precision temperature therapy alternating between hot and cold immersion',
    features: ['Hot/cold therapy', 'Circulation boost', 'Muscle recovery'],
    price: '$150',
    duration: '75 min',
    rating: 4.8
  },
  {
    id: 3,
    icon: Flower,
    title: 'Aromatherapy Luxe',
    description: 'Personalized essential oil blends with chromotherapy light systems',
    features: ['Custom aromatherapy', 'Light therapy', 'Mood enhancement'],
    price: '$200',
    duration: '105 min',
    rating: 5.0
  },
  {
    id: 4,
    icon: Clock,
    title: 'Wellness Intensive',
    description: 'Complete spa experience combining multiple therapies for ultimate relaxation',
    features: ['Multi-therapy', 'Personalized plan', 'Wellness coaching'],
    price: '$350',
    duration: '180 min',
    rating: 4.9
  }
];

const Services = () => {
  const handleBookNow = () => {
    const bookingElement = document.getElementById('booking');
    if (bookingElement) {
      const headerHeight = 64;
      const elementPosition = bookingElement.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Advanced Bath Treatments
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience our scientifically-designed treatments that combine ancient wellness 
            traditions with modern technology for optimal relaxation and rejuvenation.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <service.icon className="h-8 w-8 text-blue-600 group-hover:text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {service.title}
              </h3>
              
              <p className="text-gray-600 mb-4 text-sm">
                {service.description}
              </p>
              
              <div className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center text-sm text-gray-500">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    {feature}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-900">{service.rating}</span>
                </div>
                <span className="text-sm text-gray-500">{service.duration}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{service.price}</span>
                <button 
                  onClick={handleBookNow}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;