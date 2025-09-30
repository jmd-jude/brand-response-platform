// app/api/test-endpoint/route.ts
// Diagnostic route to compare email vs SHA-256 endpoint responses

import { NextRequest, NextResponse } from 'next/server';
const crypto = require('crypto');

function createAuthHeader() {
  const timestamp = Date.now().toString();
  const toHash = timestamp + process.env.AA_SECRET;
  const hash = crypto.createHash('md5').update(toHash).digest('hex');
  return `${process.env.AA_KEY_ID}${timestamp}${hash}`;
}

function generateSha256(email: string): string {
  return crypto
    .createHash('sha256')
    .update(email.toLowerCase().trim())
    .digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, testType } = body; // testType: 'email' | 'sha256' | 'both'

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const results: any = {
      email,
      testType,
      timestamp: new Date().toISOString()
    };

    // Test email endpoint
    if (testType === 'email' || testType === 'both') {
      try {
        const emailUrl = `${process.env.AA_ORIGIN}/v2/identities/byEmail?email=${encodeURIComponent(email)}`;
        
        console.log('Testing email endpoint:', emailUrl);
        
        const emailResponse = await fetch(emailUrl, {
          headers: {
            'Authorization': createAuthHeader(),
            'Content-Type': 'application/json'
          }
        });

        results.emailEndpoint = {
          status: emailResponse.status,
          statusText: emailResponse.statusText,
          ok: emailResponse.ok
        };

        if (emailResponse.ok) {
          const emailData = await emailResponse.json();
          results.emailEndpoint.data = emailData;
          results.emailEndpoint.dataStructure = analyzeStructure(emailData);
        } else {
          const errorText = await emailResponse.text();
          results.emailEndpoint.error = errorText;
        }
      } catch (error: any) {
        results.emailEndpoint = {
          error: error.message,
          stack: error.stack
        };
      }
    }

    // Test SHA-256 endpoint
    if (testType === 'sha256' || testType === 'both') {
      try {
        const sha256Hash = generateSha256(email);
        const sha256Url = `${process.env.AA_ORIGIN}/v2/identities/bySha256?sha256=${sha256Hash}`;
        
        console.log('Testing SHA-256 endpoint:', sha256Url);
        console.log('Hash generated:', sha256Hash);
        
        const sha256Response = await fetch(sha256Url, {
          headers: {
            'Authorization': createAuthHeader(),
            'Content-Type': 'application/json'
          }
        });

        results.sha256Endpoint = {
          status: sha256Response.status,
          statusText: sha256Response.statusText,
          ok: sha256Response.ok,
          hashUsed: sha256Hash
        };

        if (sha256Response.ok) {
          const sha256Data = await sha256Response.json();
          results.sha256Endpoint.data = sha256Data;
          results.sha256Endpoint.dataStructure = analyzeStructure(sha256Data);
        } else {
          const errorText = await sha256Response.text();
          results.sha256Endpoint.error = errorText;
        }
      } catch (error: any) {
        results.sha256Endpoint = {
          error: error.message,
          stack: error.stack
        };
      }
    }

    // Compare structures if both were tested
    if (testType === 'both' && results.emailEndpoint?.data && results.sha256Endpoint?.data) {
      results.comparison = compareStructures(
        results.emailEndpoint.dataStructure,
        results.sha256Endpoint.dataStructure
      );
    }

    return NextResponse.json(results);

  } catch (error: any) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({ 
      error: 'Test failed',
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

// Analyze the structure of the API response
function analyzeStructure(data: any): any {
  const structure: any = {
    hasIdentities: !!data.identities,
    identitiesCount: data.identities?.length || 0
  };

  if (data.identities && data.identities.length > 0) {
    const firstIdentity = data.identities[0];
    
    structure.identity = {
      hasData: !!firstIdentity.data,
      dataRecordCount: firstIdentity.data?.length || 0,
      hasProperties: !!firstIdentity.properties,
      propertiesCount: firstIdentity.properties?.length || 0,
      hasVehicles: !!firstIdentity.vehicles,
      vehiclesCount: firstIdentity.vehicles?.length || 0,
      hasFinances: !!firstIdentity.finances
    };

    // Get field names from data object
    if (firstIdentity.data && firstIdentity.data.length > 0) {
      structure.dataFields = Object.keys(firstIdentity.data[0]);
      structure.dataFieldCount = structure.dataFields.length;
    }

    // Get field names from properties
    if (firstIdentity.properties && firstIdentity.properties.length > 0) {
      structure.propertyFields = Object.keys(firstIdentity.properties[0]);
    }

    // Get field names from vehicles
    if (firstIdentity.vehicles && firstIdentity.vehicles.length > 0) {
      structure.vehicleFields = Object.keys(firstIdentity.vehicles[0]);
    }

    // Get field names from finances
    if (firstIdentity.finances) {
      structure.financeFields = Object.keys(firstIdentity.finances);
    }
  }

  return structure;
}

// Compare two structures
function compareStructures(emailStructure: any, sha256Structure: any): any {
  const comparison: any = {
    identicalTopLevel: JSON.stringify(emailStructure.identity) === JSON.stringify(sha256Structure.identity),
    differences: []
  };

  // Compare data fields
  if (emailStructure.dataFields && sha256Structure.dataFields) {
    const emailFields = new Set(emailStructure.dataFields);
    const sha256Fields = new Set(sha256Structure.dataFields);
    
    const missingInSha256 = [...emailFields].filter(f => !sha256Fields.has(f));
    const extraInSha256 = [...sha256Fields].filter(f => !emailFields.has(f));
    
    if (missingInSha256.length > 0 || extraInSha256.length > 0) {
      comparison.dataFieldsDifferent = true;
      comparison.dataFieldsAnalysis = {
        emailFieldCount: emailStructure.dataFields.length,
        sha256FieldCount: sha256Structure.dataFields.length,
        missingInSha256,
        extraInSha256,
        commonFields: [...emailFields].filter(f => sha256Fields.has(f))
      };
    } else {
      comparison.dataFieldsMatch = true;
      comparison.dataFieldsAnalysis = {
        allFieldsMatch: true,
        fieldCount: emailStructure.dataFields.length
      };
    }
  }

  // Determine if extraction function needs changes
  if (comparison.dataFieldsMatch) {
    comparison.recommendation = {
      status: 'READY_TO_IMPLEMENT',
      message: 'Data structures are identical. You can swap endpoints without changing extractRelevantData().',
      action: 'Replace the byEmail URL with bySha256 in your enrichCustomerRecord() function'
    };
  } else if (comparison.dataFieldsDifferent) {
    comparison.recommendation = {
      status: 'NEEDS_ADJUSTMENT',
      message: 'Data structures differ. You may need to update extractRelevantData().',
      action: 'Review the missing/extra fields and update your extraction logic accordingly',
      details: comparison.dataFieldsAnalysis
    };
  }

  return comparison;
}

// GET endpoint for simple health check
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'API test endpoint ready',
    usage: 'POST with { email: "test@example.com", testType: "both" }'
  });
}