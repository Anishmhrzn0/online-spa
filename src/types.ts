export interface User {
  id: string;
  name: string;
  email: string;
  isStaff: boolean;
  preferences: Record<string, any>;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  image: string;
  category: string;
  featured?: boolean;
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  timeSlotId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
  notes?: string;
}

export interface FeaturedPromotion {
  id: string;
  title: string;
  description: string;
  image: string;
  discount?: number;
  validUntil?: string;
}