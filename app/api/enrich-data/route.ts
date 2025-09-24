// app/api/enrich-data/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { logEnrichmentData } from '../../../lib/logger';
const crypto = require('crypto');

interface CustomerRecord {
  customer_id?: string;
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  city?: string;
  state?: string;
  [key: string]: any;
}

interface Variable {
  variable: string;
  category: string;
  rationale: string;
}

// Authentication helper
// In your enrich-data API route
function createAuthHeader() {
  const timestamp = Date.now().toString();
  const toHash = timestamp + process.env.AA_SECRET;
  const hash = crypto.createHash('md5').update(toHash).digest('hex');
  const authHeader = `${process.env.AA_KEY_ID}${timestamp}${hash}`;
  
  console.log('Auth Debug:', {
    keyId: process.env.AA_KEY_ID,
    timestamp,
    secretLength: process.env.AA_SECRET?.length,
    hash: hash.slice(0, 8) + '...',
    fullAuth: authHeader.slice(0, 20) + '...'
  });
  
  return authHeader;
}

// Extract relevant fields from AA response based on selected variables
function extractRelevantData(identity: any, requestedFields: string[]): any {
  const enriched: any = {};
  
  // Function to recursively search for a field in an object
  function findFieldValue(obj: any, fieldName: string): any {
    if (!obj || typeof obj !== 'object') return undefined;
    
    // Direct match (case-sensitive)
    if (obj[fieldName] !== undefined) {
      return obj[fieldName];
    }
    
    // Case-insensitive match
    const keys = Object.keys(obj);
    const matchingKey = keys.find(key => key.toLowerCase() === fieldName.toLowerCase());
    if (matchingKey && obj[matchingKey] !== undefined) {
      return obj[matchingKey];
    }
    
    return undefined;
  }
  
  // Search locations in order of priority
  const searchLocations = [
    identity.data,           // Most fields are here
    identity,               // Some basic fields
    identity.finances,      // Financial data
    identity.properties?.[0], // Property data (first property)
    identity.vehicles?.[0]    // Vehicle data (first vehicle)
  ];
  
  requestedFields.forEach(fieldName => {
    let found = false;
    
    // Search each location until we find the field
    for (const location of searchLocations) {
      const value = findFieldValue(location, fieldName);
      if (value !== undefined) {
        enriched[fieldName] = value;
        found = true;
        break;
      }
    }
    
    // If not found, log for debugging (remove in production)
    if (!found) {
      console.log(`Field '${fieldName}' not found in API response`);
    }
  });
  
  return enriched;
}

// Enrich a single customer record
// Enrich a single customer record
async function enrichCustomerRecord(customerData: CustomerRecord, selectedVariables: Variable[]): Promise<CustomerRecord> {
  const { email, first_name, last_name, city, state } = customerData;
  const requestedFields = selectedVariables.map(v => v.variable);

  try {
    // Try email lookup first (most reliable)
    if (email) {
      console.log('Enrichment attempt:', { email, hasSecret: !!process.env.AA_SECRET });

      const url = `${process.env.AA_ORIGIN}/v2/identities/byEmail?email=${email}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': createAuthHeader(),
          'Content-Type': 'application/json'
        }
      });

      console.log('API Response Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        if (data.identities && data.identities.length > 0) {
          const enrichedFields = extractRelevantData(data.identities[0], requestedFields);
          return {
            ...customerData,
            ...enrichedFields,
            enrichment_source: 'email'
          };
        }
      } else {
        const responseText = await response.text();
        console.log('Raw API response:', responseText.slice(0, 500));
      }
    }
    
    // Fallback to name + location if email fails
    if (first_name && last_name && (city || state)) {
      const params = new URLSearchParams();
      if (first_name) params.append('firstName', first_name);
      if (last_name) params.append('lastName', last_name);
      if (city) params.append('city', city);
      if (state) params.append('state', state);
      
      const url = `${process.env.AA_ORIGIN}/v2/identities/byPii?${params}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': createAuthHeader(),
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.identities && data.identities.length > 0) {
          const enrichedFields = extractRelevantData(data.identities[0], requestedFields);
          return {
            ...customerData,
            ...enrichedFields,
            enrichment_source: 'pii'
          };
        }
      }
    }
    
    // No match found
    return {
      ...customerData,
      enrichment_source: 'no_match'
    };
    
  } catch (error) {
    console.error('Error enriching customer record:', error);
    return {
      ...customerData,
      enrichment_source: 'error'
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerData, selectedVariables } = body;

    if (!customerData || !Array.isArray(customerData)) {
      return NextResponse.json({ error: 'Invalid customer data' }, { status: 400 });
    }

    console.log(`Starting enrichment for ${customerData.length} customers...`);
    console.log('Selected variables:', selectedVariables.map((v: { variable: any; }) => v.variable));
    
    const results = [];
    let successCount = 0;
    
    // Process records
    const recordsToProcess = customerData.slice(0, Math.min(customerData.length, 500));
    
    for (const customer of recordsToProcess) {
      try {
        const enriched = await enrichCustomerRecord(customer, selectedVariables);
        results.push(enriched);
        
        if (enriched.enrichment_source !== 'no_match' && enriched.enrichment_source !== 'error') {
          successCount++;
        }
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error('Error processing customer:', customer.customer_id || customer.id, error);
        results.push({
          ...customer,
          enrichment_source: 'error'
        });
      }
    }
    
    console.log(`Enrichment complete: ${successCount}/${recordsToProcess.length} records enhanced`);

    return NextResponse.json({
      enrichedCustomers: results,
      stats: {
        total: recordsToProcess.length,
        enhanced: successCount,
        matchRate: Math.round((successCount / recordsToProcess.length) * 100)
      }
    });

  } catch (error) {
    console.error('Error in enrichment API:', error);
    return NextResponse.json({ 
      error: 'Failed to enrich customer data' 
    }, { status: 500 });
  }
}