import React from 'react';
import { Award, Users, Zap, Heart, Shield, Sparkles } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Award,
      title: '15+ Years Experience',
      description: 'Leading the industry in advanced hydrotherapy and wellness treatments'
    },
    {
      icon: Users,
      title: 'Expert Therapists',
      description: 'Certified professionals trained in the latest spa technologies and techniques'
    },
    {
      icon: Zap,
      title: 'Advanced Technology',
      description: 'State-of-the-art equipment for precision temperature and pressure control'
    },
    {
      icon: Heart,
      title: 'Wellness Focus',
      description: 'Holistic approach combining physical relaxation with mental well-being'
    },
    {
      icon: Shield,
      title: 'Premium Safety',
      description: 'Highest standards of cleanliness and safety protocols'
    },
    {
      icon: Sparkles,
      title: 'Luxury Experience',
      description: 'Unmatched attention to detail in every aspect of your visit'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose AquaLux Spa?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We've revolutionized the spa experience by combining traditional wellness practices 
            with cutting-edge technology to create the most advanced bath treatments available.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center group hover:bg-blue-50 p-6 rounded-xl transition-all duration-300"
            >
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                <feature.icon className="h-8 w-8 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl p-8 md:p-12 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-4">
              Experience the Future of Spa Wellness
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Our proprietary hydrotherapy systems use advanced sensors and AI to personalize 
              every aspect of your treatment, ensuring optimal relaxation and therapeutic benefits.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">10,000+</div>
                <div className="text-blue-100">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">98%</div>
                <div className="text-blue-100">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-blue-100">Premium Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;