const axios = require('axios');

async function testLocalWebhook() {
  const fakeEvent = {
    type: 'payment.succeeded',
    data: {
      total_amount: 10000,
      metadata: {
        username: 'testing',
        content: 'hello master shb kay hal h ',
        amount: '100'
      }
    }
  };

  try {
    const res = await axios.post('http://localhost:3000/api/webhooks/dodo', fakeEvent);
    console.log("Success:", res.data);
  } catch (err) {
    console.log("Error Status:", err.response?.status);
    console.log("Error Data:", err.response?.data);
  }
}

testLocalWebhook();


// Invoke-RestMethod -Uri "https://cypher-sa9zfygu6-rishabhpandey106s-projects.vercel.app/api/webhooks/dodo" -Method Post -ContentType "application/json" -Body '{"type": "payment.succeeded", "data": {"total_amount": 9286, "metadata": {"username": "testing", "content": "hello master shb kay hal h ", "amount": "100"}}}'