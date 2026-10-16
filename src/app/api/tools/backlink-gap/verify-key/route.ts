import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ToolAccessKey from '@/models/ToolAccessKey';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawKey = (body.key || '').trim().toUpperCase();

    if (!rawKey || rawKey.length < 5) {
      return NextResponse.json(
        { valid: false, error: 'Please enter a valid access key.' },
        { status: 400 }
      );
    }

    await connectDB();
    const keyDoc = await ToolAccessKey.findOne({ key: rawKey });

    if (!keyDoc) {
      return NextResponse.json(
        { valid: false, error: 'Invalid access key. Please check the spelling or request a new key.' },
        { status: 404 }
      );
    }

    if (keyDoc.status === 'revoked') {
      return NextResponse.json(
        { valid: false, error: 'This access key has been revoked. Please contact support.' },
        { status: 403 }
      );
    }

    if (keyDoc.status === 'pending_payment') {
      return NextResponse.json(
        { valid: false, error: 'This access key is pending payment confirmation. Please complete payment to activate.' },
        { status: 403 }
      );
    }

    const now = new Date();

    // First-use activation: set 90-day expiry starting from now
    if (!keyDoc.activatedAt) {
      keyDoc.activatedAt = now;
      keyDoc.expiresAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
      keyDoc.status = 'active';
      await keyDoc.save();
    } else if (keyDoc.expiresAt && keyDoc.expiresAt < now) {
      keyDoc.status = 'expired';
      await keyDoc.save();
      return NextResponse.json(
        { valid: false, error: 'Your 3-month access pass has expired. Please renew your key.' },
        { status: 403 }
      );
    }

    // Calculate daily scans remaining
    const todayStr = now.toISOString().split('T')[0];
    const todayItem = keyDoc.dailyUsage.find((u) => u.date === todayStr);
    const todayUsage = todayItem ? todayItem.count : 0;
    const searchesRemaining = Math.max(0, keyDoc.dailyLimit - todayUsage);

    const daysRemaining = keyDoc.expiresAt
      ? Math.max(0, Math.ceil((new Date(keyDoc.expiresAt).getTime() - now.getTime()) / (24 * 60 * 60 * 1000)))
      : 90;

    return NextResponse.json({
      valid: true,
      key: keyDoc.key,
      name: keyDoc.name,
      email: keyDoc.email,
      daysRemaining,
      searchesRemaining,
      dailyLimit: keyDoc.dailyLimit,
    });
  } catch (error) {
    console.error('[VERIFY ACCESS KEY ERROR]', error);
    return NextResponse.json(
      { valid: false, error: 'Internal server error validating access key.' },
      { status: 500 }
    );
  }
}
