// lib/dataEnrichment.js - Real API Integration
const crypto = require('crypto');

// Authentication helper
function createAuthHeader() {
  const timestamp = Date.now().toString();
  const toHash = timestamp + process.env.AA_SECRET;
  const hash = crypto.createHash('md5').update(toHash).digest('hex');
  return `${process.env.AA_KEY_ID}${timestamp}${hash}`;
}

// Enrich a single customer record
export async function enrichCustomerRecord(customerData) {
  const { email, first_name, last_name, city, state } = customerData;
  
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
          return {
            ...customerData,
            ...extractRelevantData(data.identities[0]),
            enrichment_source: 'email'
          };
        }
      }
    }
    
    // Fallback to name + location if email fails
    if (first_name && last_name && (city || state)) {
      // Use byPii (Personally Identifiable Information) endpoint
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
          return {
            ...customerData,
            ...extractRelevantData(data.identities[0]),
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

// Extract relevant fields from api response
function extractRelevantData(identity) {
  const enriched = {};
  
  // Map fields to our expected format
  if (identity.data && identity.data.length > 0) {
    const data = identity.data[0]; // Take first data record
    
    // Demographics
    if (data.AGE) enriched.age = data.AGE;
    if (data.GENDER) enriched.gender = data.GENDER;
    if (data.MARITAL_STATUS) enriched.marital_status = data.MARITAL_STATUS;
    if (data.CHILDREN_HH) enriched.children_hh = data.CHILDREN_HH;
    
    // Economic
    if (data.INCOME_HH) enriched.income_hh = data.INCOME_HH;
    if (data.NET_WORTH_HH) enriched.net_worth_hh = data.NET_WORTH_HH;
    
    // Lifestyle
    if (data.EDUCATION) enriched.education = data.EDUCATION;
    if (data.OCCUPATION_TYPE) enriched.occupation_type = data.OCCUPATION_TYPE;
    if (data.URBANICITY) enriched.urbanicity = data.URBANICITY;
    
    // Interests/Affinities - convert to readable format
    if (data.GOURMET_AFFINITY) enriched.gourmet_affinity = data.GOURMET_AFFINITY;
    if (data.FITNESS_AFFINITY) enriched.fitness_affinity = data.FITNESS_AFFINITY;
    if (data.HIGH_TECH_AFFINITY) enriched.high_tech_affinity = data.HIGH_TECH_AFFINITY;
    if (data.READING_MAGAZINES) enriched.reading_magazines = data.READING_MAGAZINES;
  }
  
  return enriched;
}

// Batch enrich multiple customers
export async function enrichCustomerBatch(customers, selectedVariables = []) {
  console.log(`Starting enrichment for ${customers.length} customers...`);
  
  const results = [];
  let successCount = 0;
  
  for (const customer of customers) {
    try {
      const enriched = await enrichCustomerRecord(customer);
      results.push(enriched);
      
      if (enriched.enrichment_source !== 'no_match' && enriched.enrichment_source !== 'error') {
        successCount++;
      }
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('Error processing customer:', customer.customer_id, error);
      results.push({
        ...customer,
        enrichment_source: 'error'
      });
    }
  }
  
  console.log(`Enrichment complete: ${successCount}/${customers.length} records enhanced`);
  
  return {
    enrichedCustomers: results,
    stats: {
      total: customers.length,
      enhanced: successCount,
      matchRate: Math.round((successCount / customers.length) * 100)
    }
  };
}