import { render, screen, fireEvent } from '@testing-library/react';
import PostCard from '@/components/PostCard';
import { useStore } from '@/store/useStore';

jest.mock('@/store/useStore');
jest.mock('@/lib/haptics', () => ({ haptic: jest.fn() }));

describe('PostCard', () => {
  beforeEach(() => {
    (useStore as jest.Mock).mockReturnValue({
      toggleLike: jest.fn(),
      addComment: jest.fn(),
      hapticsEnabled: true,
    });
  });

  it('renders post content', () => {
    const post = {
      id: 'p1',
      userId: 'u1',
      userName: 'John Doe',
      userAvatar: '👤',
      content: 'Hello World',
      timestamp: Date.now(),
      likes: 5,
      liked: false,
      comments: [],
    };

    render(<PostCard post={post} />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('toggles like on button click', () => {
    const toggleLike = jest.fn();
    (useStore as jest.Mock).mockReturnValue({ toggleLike, hapticsEnabled: true, addComment: jest.fn() });

    const post = {
      id: 'p1',
      userId: 'u1',
      userName: 'John',
      userAvatar: '👤',
      content: 'Test',
      timestamp: Date.now(),
      likes: 5,
      liked: false,
      comments: [],
    };

    render(<PostCard post={post} />);
    const likeButton = screen.getByRole('button', { name: /❤|like/i });
    fireEvent.click(likeButton);
    expect(toggleLike).toHaveBeenCalledWith('p1');
  });
});
