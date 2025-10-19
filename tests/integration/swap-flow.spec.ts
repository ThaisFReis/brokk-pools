// tests/integration/swap-flow.spec.ts
// Integration test for complete swap flow using Playwright

import { test, expect } from '@playwright/test';

/**
 * Complete Swap Flow Integration Tests
 *
 * These tests verify the end-to-end swap functionality including:
 * - Wallet connection
 * - Token selection
 * - Amount input
 * - Transaction execution
 * - Success feedback
 *
 * NOTE: These tests use devnet for actual transactions
 */

test.describe('Swap Flow Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to swap page
    await page.goto('/swap');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test.describe('Wallet Connection', () => {
    test('should display connect wallet prompt when not connected', async ({
      page,
    }) => {
      // Check for connect wallet button or message
      const connectButton = page.locator('button:has-text("Connect Wallet")');
      await expect(connectButton).toBeVisible();
    });

    test('should connect wallet successfully', async ({ page }) => {
      // Click connect wallet button
      await page.click('button:has-text("Connect Wallet")');

      // Wait for wallet selection modal
      await page.waitForSelector('[data-testid="wallet-adapter-modal"]', {
        timeout: 5000,
      });

      // Select Phantom wallet (or first available wallet in test env)
      const phantomButton = page.locator('button:has-text("Phantom")');
      if (await phantomButton.isVisible()) {
        await phantomButton.click();
      }

      // Wait for wallet to connect
      // In test environment, wallet should auto-approve
      await page.waitForSelector('[data-testid="wallet-connected"]', {
        timeout: 10000,
      });

      // Verify connected state
      const walletAddress = page.locator('[data-testid="wallet-address"]');
      await expect(walletAddress).toBeVisible();
    });
  });

  test.describe('Token Selection', () => {
    test('should open token selector modal', async ({ page }) => {
      // Assuming wallet is connected via test setup
      // Click input token selector button
      await page.click('[data-testid="input-token-select"]');

      // Wait for token list modal
      const tokenModal = page.locator('[data-testid="token-list-modal"]');
      await expect(tokenModal).toBeVisible({ timeout: 5000 });

      // Verify search input is visible
      const searchInput = page.locator('input[placeholder*="Search"]');
      await expect(searchInput).toBeVisible();
    });

    test('should search for tokens by name', async ({ page }) => {
      await page.click('[data-testid="input-token-select"]');

      // Type in search
      await page.fill('input[placeholder*="Search"]', 'SOL');

      // Wait for results to filter
      await page.waitForTimeout(500);

      // Verify SOL appears in results
      const solToken = page.locator('[data-testid^="token-item"]:has-text("SOL")');
      await expect(solToken.first()).toBeVisible();
    });

    test('should select token from list', async ({ page }) => {
      await page.click('[data-testid="input-token-select"]');

      // Click SOL token
      await page.click('[data-testid^="token-item"]:has-text("SOL")');

      // Modal should close
      const tokenModal = page.locator('[data-testid="token-list-modal"]');
      await expect(tokenModal).not.toBeVisible({ timeout: 2000 });

      // Selected token should appear in selector
      const selectedToken = page.locator(
        '[data-testid="input-token-select"]:has-text("SOL")'
      );
      await expect(selectedToken).toBeVisible();
    });

    test('should display token balances', async ({ page }) => {
      await page.click('[data-testid="input-token-select"]');

      // Find first token with balance
      const tokenWithBalance = page.locator('[data-testid^="token-item"]').first();
      await expect(tokenWithBalance).toBeVisible();

      // Balance should be displayed (could be "0" or actual amount)
      const balance = tokenWithBalance.locator('[data-testid="token-balance"]');
      await expect(balance).toBeVisible();
    });
  });

  test.describe('Amount Input', () => {
    test('should accept numeric input', async ({ page }) => {
      const amountInput = page.locator('[data-testid="amount-input"]');
      await amountInput.fill('1.5');

      await expect(amountInput).toHaveValue('1.5');
    });

    test('should display max button', async ({ page }) => {
      const maxButton = page.locator('[data-testid="max-button"]');
      await expect(maxButton).toBeVisible();
    });

    test('should fill max amount when clicked', async ({ page }) => {
      // Select a token first
      await page.click('[data-testid="input-token-select"]');
      await page.click('[data-testid^="token-item"]:has-text("SOL")');

      // Click max button
      await page.click('[data-testid="max-button"]');

      // Input should be filled with max amount
      const amountInput = page.locator('[data-testid="amount-input"]');
      const value = await amountInput.inputValue();
      expect(parseFloat(value)).toBeGreaterThan(0);
    });
  });

  test.describe('Transaction Details', () => {
    test('should display swap route', async ({ page }) => {
      // Setup: Select tokens and enter amount
      await page.click('[data-testid="input-token-select"]');
      await page.click('[data-testid^="token-item"]:has-text("SOL")');

      await page.click('[data-testid="output-token-select"]');
      await page.click('[data-testid^="token-item"]:has-text("USDC")');

      await page.fill('[data-testid="amount-input"]', '0.1');

      // Wait for quote to load
      await page.waitForTimeout(2000);

      // Verify route is displayed
      const swapRoute = page.locator('[data-testid="swap-route"]');
      await expect(swapRoute).toBeVisible();
    });

    test('should display price impact', async ({ page }) => {
      // Setup swap
      await page.click('[data-testid="input-token-select"]');
      await page.click('[data-testid^="token-item"]:has-text("SOL")');

      await page.click('[data-testid="output-token-select"]');
      await page.click('[data-testid^="token-item"]:has-text("USDC")');

      await page.fill('[data-testid="amount-input"]', '0.1');

      await page.waitForTimeout(2000);

      // Price impact should be displayed
      const priceImpact = page.locator('[data-testid="price-impact"]');
      await expect(priceImpact).toBeVisible();
    });

    test('should display estimated fees', async ({ page }) => {
      // Setup swap
      await page.click('[data-testid="input-token-select"]');
      await page.click('[data-testid^="token-item"]:has-text("SOL")');

      await page.click('[data-testid="output-token-select"]');
      await page.click('[data-testid^="token-item"]:has-text("USDC")');

      await page.fill('[data-testid="amount-input"]', '0.1');

      await page.waitForTimeout(2000);

      // Fees should be displayed
      const fees = page.locator('[data-testid="swap-fees"]');
      await expect(fees).toBeVisible();
    });
  });

  test.describe('Swap Execution', () => {
    test('should disable swap button when invalid', async ({ page }) => {
      const swapButton = page.locator('button:has-text("Swap")');

      // Should be disabled without amount
      await expect(swapButton).toBeDisabled();
    });

    test('should enable swap button when valid', async ({ page }) => {
      // Select tokens
      await page.click('[data-testid="input-token-select"]');
      await page.click('[data-testid^="token-item"]:has-text("SOL")');

      await page.click('[data-testid="output-token-select"]');
      await page.click('[data-testid^="token-item"]:has-text("USDC")');

      // Enter valid amount
      await page.fill('[data-testid="amount-input"]', '0.01');

      // Wait for quote
      await page.waitForTimeout(2000);

      const swapButton = page.locator('button:has-text("Swap")');
      await expect(swapButton).toBeEnabled();
    });

    test('should show insufficient balance error', async ({ page }) => {
      // Select tokens
      await page.click('[data-testid="input-token-select"]');
      await page.click('[data-testid^="token-item"]:has-text("SOL")');

      await page.click('[data-testid="output-token-select"]');
      await page.click('[data-testid^="token-item"]:has-text("USDC")');

      // Enter amount larger than balance
      await page.fill('[data-testid="amount-input"]', '999999');

      await page.waitForTimeout(1000);

      // Error message should appear
      const error = page.locator('[data-testid="error-message"]:has-text("Insufficient")');
      await expect(error).toBeVisible();

      // Swap button should be disabled
      const swapButton = page.locator('button:has-text("Swap")');
      await expect(swapButton).toBeDisabled();
    });

    test.skip('should execute swap and show success animation', async ({
      page,
    }) => {
      // SKIP: This test requires actual devnet transactions
      // Enable when running in devnet test environment with funded wallet

      // Select tokens
      await page.click('[data-testid="input-token-select"]');
      await page.click('[data-testid^="token-item"]:has-text("SOL")');

      await page.click('[data-testid="output-token-select"]');
      await page.click('[data-testid^="token-item"]:has-text("USDC")');

      // Enter small amount
      await page.fill('[data-testid="amount-input"]', '0.001');

      await page.waitForTimeout(2000);

      // Click swap
      await page.click('button:has-text("Swap")');

      // Approve in wallet (auto-approved in test env)
      await page.waitForTimeout(1000);

      // Wait for transaction to process
      await page.waitForSelector('[data-testid="success-message"]', {
        timeout: 60000,
      });

      // Verify success message
      const success = page.locator('[data-testid="success-message"]');
      await expect(success).toBeVisible();

      // Verify confetti canvas element exists
      const confetti = page.locator('canvas');
      await expect(confetti).toBeVisible();
    });

    test.skip('should show transaction link to explorer', async ({ page }) => {
      // SKIP: Requires actual transaction

      // After successful swap
      const explorerLink = page.locator('[data-testid="explorer-link"]');
      await expect(explorerLink).toBeVisible();

      const href = await explorerLink.getAttribute('href');
      expect(href).toContain('solscan.io');
    });
  });

  test.describe('Duplicate Token Prevention', () => {
    test('should not allow selecting same token twice', async ({ page }) => {
      // Select SOL as input
      await page.click('[data-testid="input-token-select"]');
      await page.click('[data-testid^="token-item"]:has-text("SOL")');

      // Open output token selector
      await page.click('[data-testid="output-token-select"]');

      // SOL should be disabled in output selector
      const solToken = page.locator('[data-testid^="token-item"]:has-text("SOL")');
      await expect(solToken).toHaveClass(/disabled|opacity-50/);
    });

    test('should swap tokens when flip button clicked', async ({ page }) => {
      // Select SOL → USDC
      await page.click('[data-testid="input-token-select"]');
      await page.click('[data-testid^="token-item"]:has-text("SOL")');

      await page.click('[data-testid="output-token-select"]');
      await page.click('[data-testid^="token-item"]:has-text("USDC")');

      // Click flip button
      await page.click('[data-testid="flip-button"]');

      // Verify tokens are swapped: USDC → SOL
      const inputToken = page.locator('[data-testid="input-token-select"]');
      await expect(inputToken).toContainText('USDC');

      const outputToken = page.locator('[data-testid="output-token-select"]');
      await expect(outputToken).toContainText('SOL');
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should be usable on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Navigate to swap page
      await page.goto('/swap');

      // Verify swap interface is visible and usable
      const swapContainer = page.locator('[data-testid="swap-container"]');
      await expect(swapContainer).toBeVisible();

      // Verify touch targets are adequate (≥44px)
      const swapButton = page.locator('button:has-text("Swap")');
      const box = await swapButton.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
    });
  });
});
