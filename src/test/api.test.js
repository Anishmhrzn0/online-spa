import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage, writable: true });

// Mock the API service
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}));

describe('API Service', () => {
  let api;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockLocalStorage.clear();
    
    // Import the mocked API
    const apiModule = await import('../services/api');
    api = apiModule.default;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should make GET requests correctly', async () => {
    const mockResponse = { success: true, data: { id: 1, name: 'Test' } };
    api.get.mockResolvedValueOnce(mockResponse);

    const result = await api.get('/test');

    expect(api.get).toHaveBeenCalledWith('/test');
    expect(result).toEqual(mockResponse);
  });

  it('should make POST requests correctly', async () => {
    const postData = { name: 'Test Service', price: 100 };
    const mockResponse = { success: true, data: { id: 1, ...postData } };
    api.post.mockResolvedValueOnce(mockResponse);

    await api.post('/services', postData);

    expect(api.post).toHaveBeenCalledWith('/services', postData);
  });

  it('should handle network errors', async () => {
    const error = new Error('Network error');
    api.get.mockRejectedValueOnce(error);

    await expect(api.get('/test')).rejects.toThrow('Network error');
  });

  it('should handle 401 unauthorized responses', async () => {
    const error = {
      response: { status: 401, data: { success: false, message: 'Unauthorized' } }
    };
    api.get.mockRejectedValueOnce(error);

    await expect(api.get('/test')).rejects.toThrow();
  });

  it('should handle successful responses', async () => {
    const mockResponse = { success: true, data: { message: 'Success' } };
    api.get.mockResolvedValueOnce(mockResponse);

    const result = await api.get('/test');
    expect(result).toEqual(mockResponse);
  });
}); 