/**
 * Script to generate realistic historical data for mock positions
 */

const fs = require('fs');
const path = require('path');

// Generate 30 days of price history
function generatePriceHistory(basePrice, volatility = 0.05, days = 30) {
  const prices = [];
  const now = Date.now();
  let currentPrice = basePrice;

  for (let i = days; i >= 0; i--) {
    const timestamp = now - (i * 24 * 60 * 60 * 1000);
    // Random walk with volatility
    const change = (Math.random() - 0.5) * 2 * volatility * currentPrice;
    currentPrice = Math.max(currentPrice + change, basePrice * 0.5); // Don't go below 50% of base

    prices.push({
      timestamp,
      price: parseFloat(currentPrice.toFixed(2))
    });
  }

  return prices;
}

// Generate volume history
function generateVolumeHistory(baseVolume, days = 30) {
  const volumes = [];
  const now = Date.now();

  for (let i = days; i >= 0; i--) {
    const timestamp = now - (i * 24 * 60 * 60 * 1000);
    // Random volume between 50% and 150% of base
    const volume = baseVolume * (0.5 + Math.random());

    volumes.push({
      timestamp,
      volume: parseFloat(volume.toFixed(2))
    });
  }

  return volumes;
}

// Generate fee history
function generateFeeHistory(days = 30) {
  const fees = [];
  const now = Date.now();

  for (let i = days; i >= 0; i--) {
    const timestamp = now - (i * 24 * 60 * 60 * 1000);
    // Random fees between 0.5 and 5 USD per day
    const dailyFees = 0.5 + Math.random() * 4.5;

    fees.push({
      timestamp,
      fees: parseFloat(dailyFees.toFixed(2))
    });
  }

  return fees;
}

// Generate liquidity distribution (bell curve around current price)
function generateLiquidityDistribution(currentPrice, rangeMin, rangeMax) {
  const distribution = [];
  const steps = 20;
  const priceStep = (rangeMax - rangeMin) / steps;

  for (let i = 0; i <= steps; i++) {
    const price = rangeMin + (i * priceStep);
    // Bell curve centered on current price
    const distanceFromCurrent = Math.abs(price - currentPrice);
    const maxDistance = Math.abs(rangeMax - rangeMin) / 2;
    const normalizedDistance = distanceFromCurrent / maxDistance;

    // Higher liquidity near current price
    const liquidity = 100000 * Math.exp(-2 * normalizedDistance * normalizedDistance);

    distribution.push({
      price: parseFloat(price.toFixed(2)),
      liquidity: parseFloat(liquidity.toFixed(2))
    });
  }

  return distribution;
}

// Read mock positions
const mockDataPath = path.join(__dirname, '../src/data/mockPositions.json');
const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));

// Update each position with historical data
mockData.positions = mockData.positions.map(position => {
  const currentPrice = position.tokenPair.currentPrice;
  const rangeMin = position.priceRange.min;
  const rangeMax = position.priceRange.max;

  // Estimate base volume based on position value
  const baseVolume = position.pooledAssets.totalValueUSD * 10; // 10x daily volume

  return {
    ...position,
    historicalData: {
      prices: generatePriceHistory(currentPrice, 0.03),
      volume: generateVolumeHistory(baseVolume),
      fees: generateFeeHistory(),
      liquidityDistribution: generateLiquidityDistribution(currentPrice, rangeMin, rangeMax)
    }
  };
});

// Write updated data
fs.writeFileSync(mockDataPath, JSON.stringify(mockData, null, 2));

console.log('✅ Historical data generated successfully!');
console.log(`📊 Updated ${mockData.positions.length} positions`);
console.log('📈 Each position now has:');
console.log('  - 31 price data points (30 days)');
console.log('  - 31 volume data points');
console.log('  - 31 fee data points');
console.log('  - 21 liquidity distribution points');
