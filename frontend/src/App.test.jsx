import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Home from './pages/Home';
import Room from './pages/Room';

// Mock socket.io-client
vi.mock('socket.io-client', () => ({
  io: () => ({
    on: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
  }),
}));

// Mock CodeEditor component to avoid Monaco loading issues in JSDOM
vi.mock('./components/CodeEditor', () => ({
  default: () => <div data-testid="code-editor">CodeEditor Mock</div>,
}));

// Mock Terminal component
vi.mock('./components/Terminal', () => ({
  default: () => <div data-testid="terminal">Terminal Mock</div>,
}));

describe('Frontend Tests', () => {
  describe('Landing Page (Home)', () => {
    it('renders the "Create New Interview Room" button', () => {
      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );
      
      expect(screen.getByText(/Coding Interview Platform/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Create New Interview Room/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Enter Room ID/i)).toBeInTheDocument();
    });
  });

  describe('Room Page', () => {
    it('renders the editor component', () => {
      render(
        <MemoryRouter initialEntries={['/room/test-room-id']}>
          <Routes>
            <Route path="/room/:roomId" element={<Room />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText(/Coding Interview Room/i)).toBeInTheDocument();
      expect(screen.getByTestId('code-editor')).toBeInTheDocument();
      expect(screen.getByTestId('terminal')).toBeInTheDocument();
    });
  });
});
