require('dotenv').config({ path: '.env' });
const DodoPayments = require('dodopayments').default || require('dodopayments');

async function check() {
  try {
    const client = new DodoPayments({
      bearerToken: process.env.DODO_PAYMENT_TEST_KEY,
      environment: 'test_mode',
    });
    
    // Fetch the checkout session the user mentioned
    const session = await client.checkoutSessions.retrieve('cks_0NhjrqPvn7gxm03MRDytA');
    console.log("SESSION METADATA:", session.metadata);
    
    // We can also try fetching payments
    const payments = await client.payments.list({ limit: 1 });
    console.log("LAST PAYMENT METADATA:", payments.items[0]?.metadata);
    
  } catch (err) {
    console.error(err);
  }
}

check();
