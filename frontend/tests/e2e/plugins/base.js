// Tests should ONLY be run on the staging environment
const colorifixBaseUrl = 'http://localhost:3088';

// Test these screen sizes, when screen size matters
const screenSizes = [
  { width: 320, height: 568 }, // iPhone 5
  { width: 639, height: 568 }, // SM
  { width: 640, height: 568 }, // SM
  { width: 767, height: 1024 }, // SM
  { width: 768, height: 1024 }, // MD
  { width: 1023, height: 768 }, // MD
  { width: 1024, height: 768 }, // LG
  { width: 1279, height: 768 }, // LG
  { width: 1280, height: 900 }, // XL
  { width: 1535, height: 1400 }, // XL
  { width: 1536, height: 1400 }, // 2XL
  { width: 2100, height: 1400 }, // 2XL
];

export { colorifixBaseUrl, screenSizes }
