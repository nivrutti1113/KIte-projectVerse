import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { planId, amountInr } = await req.json();

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If Razorpay credentials exist, make real server-side call
    if (keyId && keySecret && keyId !== 'your-razorpay-key-id') {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const res = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
          },
          body: JSON.stringify({
            amount: (amountInr || 4999) * 100, // paise
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`,
            notes: {
              planId: planId || 'MAKER_PRO',
              platform: 'KITE_ProjectVerse'
            }
          })
        });

        if (res.ok) {
          const order = await res.json();
          return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId,
            simulated: false
          });
        }
      } catch (e) {
        console.warn('Razorpay live order creation failed, falling back to safe simulation:', e);
      }
    }

    // Safe simulated sandbox order for testing when keys are not configured
    return NextResponse.json({
      orderId: `order_sim_${Date.now()}`,
      amount: (amountInr || 4999) * 100,
      currency: 'INR',
      keyId: 'rzp_test_simulation',
      simulated: true,
      message: 'Razorpay Sandbox Simulation Mode Active (No live payment charged).'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to initialize payment order' },
      { status: 500 }
    );
  }
}
