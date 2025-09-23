// /app/api/enrichment-proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';
const crypto = require('crypto');

// Copy your auth function from enrich-data route
function createAuthHeader() {
  const timestamp = Date.now().toString();
  const toHash = timestamp + process.env.AA_SECRET;
  const hash = crypto.createHash('md5').update(toHash).digest('hex');
  const authHeader = `${process.env.AA_KEY_ID}${timestamp}${hash}`;
  
  console.log('Proxy Auth Debug:', {
    keyId: process.env.AA_KEY_ID,
    timestamp,
    secretLength: process.env.AA_SECRET?.length,
    hash: hash.slice(0, 8) + '...',
    fullAuth: authHeader.slice(0, 20) + '...'
  });
  
  return authHeader;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    console.log('Proxy enrichment attempt:', { email, hasSecret: !!process.env.AA_SECRET });

    // Use the same URL structure as your original code
    const url = `${process.env.AA_ORIGIN}/v2/identities/byEmail?email=${email}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': createAuthHeader(),
        'Content-Type': 'application/json'
      }
    });

    console.log('Proxy API Response Status:', response.status);

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      const responseText = await response.text();
      console.log('Proxy Raw API response:', responseText.slice(0, 500));
      return NextResponse.json(
        { error: responseText }, 
        { status: response.status }
      );
    }

  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Proxy error',
        details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}