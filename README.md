# AquaLux Spa Frontend

A modern React application for the AquaLux Spa booking system with a beautiful, responsive UI built with Tailwind CSS.

## Features

- **User Authentication**: Register, login, and profile management
- **Service Browsing**: View available spa services with details
- **Booking System**: Schedule appointments with date/time selection
- **User Dashboard**: Manage bookings and profile information
- **Admin Panel**: Comprehensive booking management for administrators
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Beautiful design with smooth animations and transitions

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **State Management**: React Hooks (useState, useEffect)
- **Development**: ESLint, PostCSS

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see backend README)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will be running on `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # React components
│   ├── About.jsx       # About section component
│   ├── Admin.jsx       # Admin panel component
│   ├── Auth.jsx        # Authentication modal
│   ├── Booking.jsx     # Booking form component
│   ├── Header.jsx      # Navigation header
│   ├── Hero.jsx        # Hero section component
│   ├── Services.jsx    # Services display component
│   └── UserProfile.jsx # User profile component
├── services/           # API service layer
│   └── api.js         # Axios configuration and API calls
├── routes/            # Routing configuration
│   └── appRoute.jsx   # Route definitions
├── App.jsx            # Main application component
├── main.jsx          # Application entry point
└── index.css         # Global styles and Tailwind imports
```

## Components Overview

### Core Components

#### Header Component
- Navigation menu with responsive design
- User authentication status
- Admin panel access for authorized users
- Mobile-friendly hamburger menu

#### Auth Component
- Modal-based authentication
- User registration and login forms
- Form validation and error handling
- JWT token management

#### Booking Component
- Service selection dropdown
- Date and time picker
- Customer information form
- Special requests textarea
- Real-time form validation

#### Services Component
- Grid layout of available services
- Service details with pricing
- Feature tags and descriptions
- Responsive card design

#### UserProfile Component
- User information display
- Profile editing capabilities
- Booking history
- Account management

#### Admin Component
- Comprehensive booking management
- User management interface
- Service management
- Analytics dashboard

## API Integration

The frontend communicates with the backend API through the `services/api.js` file:

### Authentication
```javascript
import { authAPI } from '../services/api.js';

// Register user
const response = await authAPI.register(userData);

// Login user
const response = await authAPI.login(credentials);
```

### Services
```javascript
import { servicesAPI } from '../services/api.js';

// Get all services
const response = await servicesAPI.getAll();

// Get service by ID
const response = await servicesAPI.getById(id);
```

### Bookings
```javascript
import { bookingsAPI } from '../services/api.js';

// Create booking
const response = await bookingsAPI.create(bookingData);

// Get user bookings
const response = await bookingsAPI.getUserBookings();
```

## State Management

The application uses React hooks for state management:

### User State
```javascript
const [user, setUser] = useState(null);
const [isAuthOpen, setIsAuthOpen] = useState(false);
```

### Booking State
```javascript
const [allBookings, setAllBookings] = useState([]);
const [bookingData, setBookingData] = useState({
  date: '',
  time: '',
  name: '',
  email: '',
  phone: '',
  specialRequests: ''
});
```

## Authentication Flow

1. **Registration**: User fills out registration form
2. **Login**: User provides email and password
3. **Token Storage**: JWT token stored in localStorage
4. **API Calls**: Token automatically included in requests
5. **Logout**: Token removed from localStorage

## Styling

The application uses Tailwind CSS for styling:

### Custom Classes
- Responsive design with mobile-first approach
- Custom color scheme (blue and teal gradients)
- Smooth transitions and hover effects
- Modern card and button designs

### Color Palette
- Primary: Blue (#3B82F6)
- Secondary: Teal (#14B8A6)
- Background: Gray (#F9FAFB)
- Text: Gray (#1F2937)

## Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## Form Validation

All forms include client-side validation:

### Booking Form
- Required field validation
- Email format validation
- Date validation (future dates only)
- Phone number validation

### Authentication Forms
- Password strength requirements
- Email format validation
- Password confirmation matching
- Required field validation

## Error Handling

The application includes comprehensive error handling:

### API Errors
- Network error handling
- Server error responses
- Authentication error handling
- User-friendly error messages

### Form Errors
- Real-time validation feedback
- Error message display
- Field-specific error styling

## Local Storage

The application uses localStorage for:

- **User Data**: Stored user information
- **Auth Token**: JWT authentication token
- **Bookings**: Temporary booking data
- **Services**: Cached service information

## Development

### Hot Reload
The development server includes hot reload for instant feedback during development.

### ESLint Configuration
The project includes ESLint for code quality and consistency.

### PostCSS Configuration
PostCSS is configured for Tailwind CSS processing.

## Environment Configuration

### Development
- API Base URL: `http://localhost:5000/api`
- Development server: `http://localhost:5173`

### Production
- Update API base URL in `services/api.js`
- Build and deploy static files

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- **Code Splitting**: Automatic code splitting with Vite
- **Lazy Loading**: Components loaded on demand
- **Optimized Images**: WebP format support
- **Minified Build**: Production builds are minified

## Security

- **JWT Tokens**: Secure authentication
- **HTTPS**: Production deployment with SSL
- **Input Validation**: Client and server-side validation
- **XSS Protection**: React's built-in XSS protection

## Testing

### Manual Testing
- Test all user flows
- Verify responsive design
- Check form validation
- Test error scenarios

### Browser Testing
- Test in multiple browsers
- Verify mobile responsiveness
- Check accessibility features

## Deployment

### Build Process
```bash
npm run build
```

### Deployment Options
- **Netlify**: Drag and drop build folder
- **Vercel**: Connect GitHub repository
- **AWS S3**: Upload static files
- **Traditional Hosting**: Upload build folder

## Troubleshooting

### Common Issues

#### API Connection Issues
- Verify backend is running on port 5000
- Check CORS configuration
- Ensure API base URL is correct

#### Authentication Issues
- Clear browser localStorage
- Check JWT token expiration
- Verify user credentials

#### Build Issues
- Clear node_modules and reinstall
- Check for syntax errors
- Verify all dependencies are installed

### Development Tips

1. **Use Browser DevTools**: For debugging and testing
2. **Check Network Tab**: For API request monitoring
3. **Use React DevTools**: For component debugging
4. **Monitor Console**: For error messages

## Contributing

1. Follow the existing code structure
2. Use consistent naming conventions
3. Add proper error handling
4. Test all user flows
5. Ensure responsive design
6. Write clear commit messages

## License

MIT License - see LICENSE file for details.
