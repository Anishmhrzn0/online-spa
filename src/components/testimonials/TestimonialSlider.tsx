import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Emma Thompson',
    rating: 5,
    text: 'The aromatherapy massage was absolutely divine. I left feeling completely renewed and relaxed. The therapist was attentive and professional.',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
  },
  {
    id: 2,
    name: 'Michael Roberts',
    rating: 5,
    text: 'I booked the hot stone therapy after a recommendation from a friend, and it exceeded all my expectations. The ambiance was perfect and the treatment was exceptional.',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
  },
  {
    id: 3,
    name: 'Sarah Williams',
    rating: 4,
    text: 'The facial treatment left my skin glowing. The staff were knowledgeable and helped me understand the best products for my skin type.',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
  },
];

const TestimonialSlider = () => {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const length = testimonials.length;

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrent(current === length - 1 ? 0 : current + 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrent(current === 0 ? length - 1 : current - 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden rounded-lg">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.id} className="w-full flex-shrink-0">
              <div className="bg-white p-8 rounded-lg shadow-soft text-center">
                <div className="w-20 h-20 mx-auto mb-4 overflow-hidden rounded-full">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      fill={i < testimonial.rating ? "#FFD700" : "none"} 
                      stroke={i < testimonial.rating ? "#FFD700" : "#CBD5E0"} 
                      className="mx-0.5"
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>
                <h4 className="font-medium text-lg">{testimonial.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button 
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-300"
        onClick={prevSlide}
      >
        <ChevronLeft size={24} className="text-teal" />
      </button>
      
      <button 
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-300"
        onClick={nextSlide}
      >
        <ChevronRight size={24} className="text-teal" />
      </button>
      
      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === current ? 'bg-teal' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider;