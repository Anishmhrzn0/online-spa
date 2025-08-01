import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

// Mock the components to avoid Router conflicts
vi.mock('../components/Header', () => ({
  default: ({ user, onAuthClick, onProfileClick, isAdmin }) => (
    <div data-testid="header">
      {!user ? (
        <button data-testid="auth-button" onClick={onAuthClick}>Sign In</button>
      ) : (
        <button data-testid="profile-button" onClick={onProfileClick}>{user.name}</button>
      )}
      {isAdmin && <div data-testid="admin-menu">Admin Menu</div>}
    </div>
  )
}));

vi.mock('../components/Auth', () => ({
  default: ({ onLogin, onClose }) => (
    <div data-testid="auth-modal">
      <button data-testid="login-button" onClick={() => onLogin({ 
        firstName: 'John', 
        lastName: 'Doe', 
        email: 'john@example.com',
        isAdmin: false 
      })}>Login</button>
      <button data-testid="close-button" onClick={onClose}>Close</button>
    </div>
  )
}));

vi.mock('../components/UserProfile', () => ({
  default: ({ user, onLogout }) => (
    <div data-testid="user-profile">
      <div data-testid="user-name">{user?.name || 'Unknown User'}</div>
      <button data-testid="logout-button" onClick={onLogout}>Logout</button>
    </div>
  )
}));

vi.mock('../routes/appRoute', () => ({
  default: ({ user }) => (
    <div data-testid="app-routes">
      <div data-testid="user-bookings-count">{user?.bookings?.length || 0}</div>
      <button data-testid="create-booking-button">Create Booking</button>
    </div>
  )
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage, writable: true });

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should handle user login successfully', async () => {
    render(<App />);
    
    // Initially should show sign in button
    expect(screen.getByTestId('auth-button')).toBeInTheDocument();
    
    // Click sign in to open auth modal
    fireEvent.click(screen.getByTestId('auth-button'));
    expect(screen.getByTestId('auth-modal')).toBeInTheDocument();
    
    // Click login button
    fireEvent.click(screen.getByTestId('login-button'));
    
    // Should now show user profile button instead of auth button
    await waitFor(() => {
      expect(screen.queryByTestId('auth-button')).not.toBeInTheDocument();
      expect(screen.getByTestId('profile-button')).toHaveTextContent('John Doe');
    });
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('user', expect.any(String));
  });

  it('should handle user logout', async () => {
    render(<App />);
    
    // Login first
    fireEvent.click(screen.getByTestId('auth-button'));
    fireEvent.click(screen.getByTestId('login-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('profile-button')).toHaveTextContent('John Doe');
    });
    
    // Click profile button to open user profile
    fireEvent.click(screen.getByTestId('profile-button'));
    expect(screen.getByTestId('user-profile')).toBeInTheDocument();
    
    // Click logout button
    fireEvent.click(screen.getByTestId('logout-button'));
    
    // Should show auth button again
    await waitFor(() => {
      expect(screen.getByTestId('auth-button')).toBeInTheDocument();
      expect(screen.queryByTestId('profile-button')).not.toBeInTheDocument();
    });
    
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user');
  });

  it('should show user bookings when logged in', async () => {
    render(<App />);
    
    // Login first
    fireEvent.click(screen.getByTestId('auth-button'));
    fireEvent.click(screen.getByTestId('login-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('user-bookings-count')).toBeInTheDocument();
    });
  });
}); 