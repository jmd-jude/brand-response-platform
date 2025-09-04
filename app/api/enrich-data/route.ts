// app/api/enrich-data/route.ts
import { NextRequest, NextResponse } from 'next/server';
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
function createAuthHeader() {
  const timestamp = Date.now().toString();
  const toHash = timestamp + process.env.AA_SECRET;
  const hash = crypto.createHash('md5').update(toHash).digest('hex');
  return `${process.env.AA_KEY_ID}${timestamp}${hash}`;
}

// Extract relevant fields from AA response
function extractRelevantData(identity: any, requestedFields: string[]): any {
  console.log('Available data keys:', Object.keys(identity.data?.[0] || {}));
  console.log('Sample data object:', identity.data?.[0]);
  
  const enriched: any = {};
  
  // Only extract fields that were actually requested
  requestedFields.forEach(fieldName => {
    if (identity[fieldName] !== undefined) {
      enriched[fieldName] = identity[fieldName];
    } else if (identity.data?.[0]?.[fieldName] !== undefined) {
      enriched[fieldName] = identity.data[0][fieldName];
    } else if (identity.properties?.[0]?.[fieldName] !== undefined) {
      enriched[fieldName] = identity.properties[0][fieldName];
    } else if (identity.finances?.[fieldName] !== undefined) {
      enriched[fieldName] = identity.finances[fieldName];
    }
  });
  
  return enriched;
}

// Enrich a single customer record
async function enrichCustomerRecord(customerData: CustomerRecord, selectedVariables: Variable[]): Promise<CustomerRecord> {
  const { email, first_name, last_name, city, state } = customerData;
  const requestedFields = selectedVariables.map(v => v.variable);
  
  try {
    // Try email lookup first (most reliable)
    if (email) {
      const url = `${process.env.AA_ORIGIN}/v2/identities/byEmail?email=${email}`;
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
            enrichment_source: 'email'
          };
        }
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
    
    // Process first 10 records to avoid long processing times
    const recordsToProcess = customerData.slice(0, 10);
    
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