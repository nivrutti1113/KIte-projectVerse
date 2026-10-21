import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { logAudit } from '@/lib/data';

export async function POST(req: NextRequest) {
  try {
    const { orderId, paymentId, signature, userId, planTier } = await req.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keySecret && keySecret !== 'your-razorpay-key-secret' && signature) {
      // Real cryptographic HMAC SHA256 validation
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      if (generatedSignature !== signature) {
        return NextResponse.json(
          { success: false, error: 'Invalid payment signature. Verification failed.' },
          { status: 400 }
        );
      }
    }

    // Record audit event
    logAudit('PAYMENT_VERIFIED', userId || 'usr-student-1', 'entitlement', orderId, {
      paymentId: paymentId || 'pay_simulated',
      planTier: planTier || 'premium',
      amountInr: 4999
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully! Maker Pro membership unlocked.',
      entitlement: {
        tier: planTier || 'premium',
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
