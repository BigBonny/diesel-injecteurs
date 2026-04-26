import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const PRESTASHOP_API_URL = process.env.PRESTASHOP_API_URL;
const PRESTASHOP_API_KEY = process.env.PRESTASHOP_API_KEY;

export async function POST() {
  try {
    console.log('Starting orders sync from PrestaShop...');
    
    // Fetch orders from PrestaShop with limit to avoid timeout
    const limit = 50; // Process 50 orders at a time
    const ordersUrl = `${PRESTASHOP_API_URL}/orders?ws_key=${PRESTASHOP_API_KEY}&display=full&limit=${limit}`;
    const response = await fetch(ordersUrl, { signal: AbortSignal.timeout(30000) });
    
    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'API key does not have access to orders. Please grant orders permission in PrestaShop back office (Advanced Parameters > Webservice > API Permissions)' },
          { status: 403 }
        );
      }
      throw new Error(`PrestaShop API error: ${response.status}`);
    }
    
    const xmlText = await response.text();
    console.log('XML response length:', xmlText.length);
    console.log('XML preview:', xmlText.substring(0, 500));
    
    // Parse XML to extract order data
    const orderMatches = xmlText.matchAll(/<order[^>]*>([\s\S]*?)<\/order>/g);
    const orderArray = Array.from(orderMatches);
    console.log('Found orders:', orderArray.length);
    
    let synced = 0;
    let errors = 0;
    
    for (const orderMatch of orderArray) {
      try {
        const orderXml = orderMatch[1];
        
        // Extract order fields
        const idMatch = orderXml.match(/<id>(?:<!\[CDATA\[)?(\d+)(?:\]\]>)?<\/id>/);
        const id = idMatch ? idMatch[1] : null;
        
        const totalPaidMatch = orderXml.match(/<total_paid[^>]*>(?:<!\[CDATA\[)?([\d.]+)(?:\]\]>)?<\/total_paid>/);
        const totalPaid = totalPaidMatch ? parseFloat(totalPaidMatch[1]) : 0;
        
        const currencyMatch = orderXml.match(/<currency[^>]*>(?:<!\[CDATA\[)?(\w+)(?:\]\]>)?<\/currency>/);
        const currency = currencyMatch ? currencyMatch[1] : 'EUR';
        
        const currentStateMatch = orderXml.match(/<current_state[^>]*>(?:<!\[CDATA\[)?(\d+)(?:\]\]>)?<\/current_state>/);
        const currentState = currentStateMatch ? currentStateMatch[1] : null;
        
        const customerMatch = orderXml.match(/<id_customer[^>]*>(?:<!\[CDATA\[)?(\d+)(?:\]\]>)?<\/id_customer>/);
        const customerId = customerMatch ? customerMatch[1] : null;
        
        const paymentMatch = orderXml.match(/<payment[^>]*>(?:<!\[CDATA\[)?([^<]+)(?:\]\]>)?<\/payment>/);
        const paymentMethod = paymentMatch ? paymentMatch[1] : 'unknown';
        
        const dateAddMatch = orderXml.match(/<date_add[^>]*>(?:<!\[CDATA\[)?([^<]+)(?:\]\]>)?<\/date_add>/);
        const dateAdd = dateAddMatch ? dateAddMatch[1] : null;
        
        if (!id) continue;
        
        // Parse PrestaShop date format (YYYY-MM-DD HH:MM:SS)
        let createdAt = new Date().toISOString();
        if (dateAdd) {
          try {
            // PrestaShop format: 2024-01-15 14:30:00
            const parsedDate = new Date(dateAdd.replace(' ', 'T'));
            if (!isNaN(parsedDate.getTime())) {
              createdAt = parsedDate.toISOString();
            }
          } catch {
            console.warn(`Invalid date format for order ${id}:`, dateAdd);
          }
        }
        
        // Map PrestaShop order states to our status
        let status = 'pending';
        if (currentState === '2' || currentState === '5') status = 'paid'; // Paid / Shipped
        else if (currentState === '6' || currentState === '7' || currentState === '8') status = 'cancelled'; // Canceled / Refunded
        else if (currentState === '9' || currentState === '10' || currentState === '11' || currentState === '12') status = 'error'; // Payment error
        
        // Fetch customer email if we have customer ID (skip if already synced)
        let customerEmail = '';
        let customerName = '';
        if (customerId) {
          try {
            const customerUrl = `${PRESTASHOP_API_URL}/customers/${customerId}?ws_key=${PRESTASHOP_API_KEY}&display=full`;
            const customerResponse = await fetch(customerUrl, { signal: AbortSignal.timeout(5000) });
            if (customerResponse.ok) {
              const customerXml = await customerResponse.text();
              const emailMatch = customerXml.match(/<email[^>]*>(?:<!\[CDATA\[)?([^<]+)(?:\]\]>)?<\/email>/);
              customerEmail = emailMatch ? emailMatch[1] : '';
              
              const firstNameMatch = customerXml.match(/<firstname[^>]*>(?:<!\[CDATA\[)?([^<]+)(?:\]\]>)?<\/firstname>/);
              const lastNameMatch = customerXml.match(/<lastname[^>]*>(?:<!\[CDATA\[)?([^<]+)(?:\]\]>)?<\/lastname>/);
              const firstName = firstNameMatch ? firstNameMatch[1] : '';
              const lastName = lastNameMatch ? lastNameMatch[1] : '';
              customerName = `${firstName} ${lastName}`.trim();
            }
          } catch (err) {
            console.error(`Error fetching customer ${customerId}:`, err);
          }
        }
        
        // Upsert order to Supabase
        const { error: upsertError } = await supabase
          .from('orders')
          .upsert({
            id: `PS-${id}`,
            amount: totalPaid,
            currency,
            customer_email: customerEmail,
            customer_name: customerName,
            status,
            payment_method: paymentMethod,
            prestashop_order_id: parseInt(id),
            created_at: createdAt,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id'
          });
        
        if (upsertError) {
          console.error(`Error upserting order ${id}:`, upsertError);
          errors++;
        } else {
          console.log(`Synced order ${id}`);
          synced++;
        }
      } catch (err) {
        console.error('Error processing order:', err);
        errors++;
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Synced ${synced} orders from PrestaShop (${errors} errors). Run again to sync more orders.`,
      synced,
      errors,
      limit
    });
    
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync orders', details: (error as Error).message },
      { status: 500 }
    );
  }
}
