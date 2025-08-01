import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/Header';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Menu: ({ className }) => <div data-testid="menu-icon" className={className} />,
  X: ({ className }) => <div data-testid="x-icon" className={className} />,
  User: ({ className }) => <div data-testid="user-icon" className={className} />,
  LogOut: ({ className }) => <div data-testid="logout-icon" className={className} />,
  Settings: ({ className }) => <div data-testid="settings-icon" className={className} />,
  Heart: ({ className }) => <div data-testid="heart-icon" className={className} />,
  Calendar: ({ className }) => <div data-testid="calendar-icon" className={className} />,
  LogIn: ({ className }) => <div data-testid="login-icon" className={className} />,
  Home: ({ className }) => <div data-testid="home-icon" className={className} />,
  Spa: ({ className }) => <div data-testid="spa-icon" className={className} />,
  Users: ({ className }) => <div data-testid="users-icon" className={className} />,
  BarChart3: ({ className }) => <div data-testid="chart-icon" className={className} />,
  Waves: ({ className }) => <div data-testid="waves-icon" className={className} />,
}));

const renderHeader = (props = {}) => {
  return render(
    <BrowserRouter>
      <Header {...props} />
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  const mockOnAuthClick = vi.fn();
  const mockOnProfileClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render navigation menu items for regular users', () => {
    renderHeader();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });

  it('should render admin menu item for admin users', () => {
    renderHeader({ isAdmin: true });
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('should show sign in button when user is not logged in', () => {
    renderHeader({ onAuthClick: mockOnAuthClick });
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('should show user profile button when user is logged in', () => {
    const user = { name: 'John Doe' };
    renderHeader({ user, onProfileClick: mockOnProfileClick });
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should toggle mobile menu when menu button is clicked', () => {
    renderHeader();
    fireEvent.click(screen.getByTestId('menu-icon').closest('button'));
    expect(screen.getByTestId('x-icon')).toBeInTheDocument(); // Menu is open
    fireEvent.click(screen.getByTestId('x-icon').closest('button'));
    expect(screen.getByTestId('menu-icon')).toBeInTheDocument(); // Menu is closed
  });

  it('should call onAuthClick when sign in button is clicked', () => {
    renderHeader({ onAuthClick: mockOnAuthClick });
    fireEvent.click(screen.getByText('Sign In'));
    expect(mockOnAuthClick).toHaveBeenCalled();
  });

  it('should call onProfileClick when user profile button is clicked', () => {
    const user = { name: 'John Doe' };
    renderHeader({ user, onProfileClick: mockOnProfileClick });
    fireEvent.click(screen.getByText('John Doe'));
    expect(mockOnProfileClick).toHaveBeenCalled();
  });
}); 