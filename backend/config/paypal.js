const paypal = require('@paypal/checkout-server-sdk');

// PayPal environment configuration
const environment = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID || 'AWs4gSxj2JfYeLM01u0MvhCRALxHAkr_FMQbj9iY5VkiXpBxaUyPQTwvOdPKhXY8BFFYXaYYlJ6EP2EQ';
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'ELOtl-jqNGIlCXK9EE7DA4-hLDzM9KedvGg2u4NLT3MohvmhMCIslh7Wgfcz7vmAwHNP96ovSOy8OLDV';
  
  // Use sandbox for development, live for production
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
  // For production: return new paypal.core.LiveEnvironment(clientId, clientSecret);
};

const client = () => {
  return new paypal.core.PayPalHttpClient(environment());
};

module.exports = { client };