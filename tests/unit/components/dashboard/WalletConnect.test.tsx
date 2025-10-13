/**
 * Unit Tests: WalletConnect Component
 * Tests wallet connection UI and interaction
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

// Mock will be implemented later
const WalletConnect = () => <div>WalletConnect Mock</div>;

describe('WalletConnect Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('T029: Renders button and shows wallet selection modal', () => {
    it('should render connect wallet button when not connected', () => {
      render(<WalletConnect />);

      const connectButton = screen.getByRole('button', { name: /connect wallet/i });
      expect(connectButton).toBeInTheDocument();
    });

    it('should show wallet selection modal when connect button is clicked', async () => {
      const user = userEvent.setup();
      render(<WalletConnect />);

      const connectButton = screen.getByRole('button', { name: /connect wallet/i });
      await user.click(connectButton);

      await waitFor(() => {
        expect(screen.getByText(/select wallet/i)).toBeInTheDocument();
      });
    });

    it('should display available wallet options in modal', async () => {
      const user = userEvent.setup();
      render(<WalletConnect />);

      const connectButton = screen.getByRole('button', { name: /connect wallet/i });
      await user.click(connectButton);

      await waitFor(() => {
        expect(screen.getByText(/phantom/i)).toBeInTheDocument();
        expect(screen.getByText(/solflare/i)).toBeInTheDocument();
        expect(screen.getByText(/backpack/i)).toBeInTheDocument();
      });
    });

    it('should close modal when cancel/close is clicked', async () => {
      const user = userEvent.setup();
      render(<WalletConnect />);

      const connectButton = screen.getByRole('button', { name: /connect wallet/i });
      await user.click(connectButton);

      const closeButton = await screen.findByRole('button', { name: /close/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText(/select wallet/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('T030: Displays wallet address after connection', () => {
    it('should display shortened wallet address when connected', () => {
      // Mock connected state
      const mockAddress = 'GkH3fT9vCW2PnLzPvqmHZWRuDVBBwGMZvDJTLMBpW';

      render(<WalletConnect />);

      // Should show shortened address (first 4 + last 4 characters)
      expect(screen.getByText(/GkH3...MBpW/i)).toBeInTheDocument();
    });

    it('should show disconnect button when wallet is connected', () => {
      render(<WalletConnect />);

      const disconnectButton = screen.getByRole('button', { name: /disconnect/i });
      expect(disconnectButton).toBeInTheDocument();
    });

    it('should disconnect wallet when disconnect button is clicked', async () => {
      const user = userEvent.setup();
      const mockDisconnect = vi.fn();

      render(<WalletConnect />);

      const disconnectButton = screen.getByRole('button', { name: /disconnect/i });
      await user.click(disconnectButton);

      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should display wallet adapter name (e.g., "Phantom")', () => {
      render(<WalletConnect />);

      expect(screen.getByText(/phantom/i)).toBeInTheDocument();
    });

    it('should copy address to clipboard when address is clicked', async () => {
      const user = userEvent.setup();
      const mockClipboard = vi.fn();
      Object.assign(navigator, {
        clipboard: { writeText: mockClipboard },
      });

      render(<WalletConnect />);

      const addressDisplay = screen.getByText(/GkH3...MBpW/i);
      await user.click(addressDisplay);

      expect(mockClipboard).toHaveBeenCalledWith(expect.stringContaining('GkH3'));
    });
  });

  describe('Error Handling', () => {
    it('should display error message when connection fails', async () => {
      const user = userEvent.setup();

      render(<WalletConnect />);

      const connectButton = screen.getByRole('button', { name: /connect wallet/i });
      await user.click(connectButton);

      // Simulate connection error
      await waitFor(() => {
        expect(screen.getByText(/failed to connect/i)).toBeInTheDocument();
      });
    });

    it('should allow retry after connection failure', async () => {
      const user = userEvent.setup();

      render(<WalletConnect />);

      const retryButton = screen.getByRole('button', { name: /retry/i });
      await user.click(retryButton);

      expect(retryButton).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button labels', () => {
      render(<WalletConnect />);

      const connectButton = screen.getByRole('button', { name: /connect wallet/i });
      expect(connectButton).toHaveAccessibleName();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<WalletConnect />);

      await user.tab();
      const connectButton = screen.getByRole('button', { name: /connect wallet/i });
      expect(connectButton).toHaveFocus();
    });

    it('should announce connection status to screen readers', () => {
      render(<WalletConnect />);

      const statusElement = screen.getByRole('status', { hidden: true });
      expect(statusElement).toHaveTextContent(/connected/i);
    });
  });
});
