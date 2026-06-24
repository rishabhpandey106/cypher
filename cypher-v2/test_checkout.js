const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:3000/api/payments/checkout', {
      username: 'rishabh',
      content: 'Hello World',
      amount: 100
    });
    console.log("Success:", res.data.full_session.product_cart);
  } catch (err) {
    console.log("Error Status:", err.response?.status);
    console.log("Error Data:", err.response?.data);
  }
}
test();
