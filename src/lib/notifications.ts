// Notification service for merchant alerts

interface CartItem {
  name: string;
  quantity: number;
  price: number;
}

interface PaymentNotificationData {
  orderId: string;
  amount: number;
  status: string;
  customerEmail?: string;
  customerName?: string;
  cartItems?: CartItem[];
  transactionId?: string;
}

// Send email notification using a simple email service
export async function sendPaymentNotificationEmail(data: PaymentNotificationData): Promise<void> {
  const {
    orderId,
    amount,
    status,
    customerEmail,
    customerName,
    cartItems,
    transactionId
  } = data;

  // Get merchant email from environment
  const merchantEmail = process.env.MERCHANT_EMAIL;
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!merchantEmail) {
    console.log('No merchant email configured, skipping email notification');
    return;
  }

  const subject = `Nouveau paiement ${status === 'paid' ? 'réussi' : status} - Commande #${orderId}`;
  
  const htmlContent = `
    <h2>Nouveau paiement sur votre boutique</h2>
    <table border="1" cellpadding="10" style="border-collapse: collapse; font-family: Arial, sans-serif;">
      <tr>
        <td><strong>Numéro de commande</strong></td>
        <td>#${orderId}</td>
      </tr>
      <tr>
        <td><strong>Statut</strong></td>
        <td style="color: ${status === 'paid' ? 'green' : 'red'}; font-weight: bold;">
          ${status === 'paid' ? '✅ PAYÉ' : status.toUpperCase()}
        </td>
      </tr>
      <tr>
        <td><strong>Montant</strong></td>
        <td>${amount.toFixed(2)} €</td>
      </tr>
      <tr>
        <td><strong>Client</strong></td>
        <td>${customerName || 'Non spécifié'} (${customerEmail || 'Email non spécifié'})</td>
      </tr>
      ${transactionId ? `
      <tr>
        <td><strong>ID Transaction</strong></td>
        <td>${transactionId}</td>
      </tr>
      ` : ''}
      <tr>
        <td><strong>Date</strong></td>
        <td>${new Date().toLocaleString('fr-FR')}</td>
      </tr>
    </table>
    
    ${cartItems && cartItems.length > 0 ? `
    <h3>Articles commandés:</h3>
    <ul>
      ${cartItems.map((item: CartItem) => `
        <li>${item.name} - ${item.quantity}x - ${(item.price * item.quantity).toFixed(2)}€</li>
      `).join('')}
    </ul>
    ` : ''}
    
    <p>
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/orders" 
         style="background: #0066FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 20px;">
        Voir la commande dans l'admin
      </a>
    </p>
    
    <hr style="margin-top: 30px;">
    <p style="color: #666; font-size: 12px;">
      Cet email a été envoyé automatiquement par votre boutique en ligne.
    </p>
  `;

  // If SMTP is configured, send email
  if (smtpHost && smtpUser && smtpPass) {
    try {
      // For now, log the email content (in production, use nodemailer or similar)
      console.log('Sending email notification:', {
        to: merchantEmail,
        subject,
        htmlLength: htmlContent.length
      });
      
      // TODO: Implement actual SMTP sending with nodemailer
      // const nodemailer = require('nodemailer');
      // const transporter = nodemailer.createTransporter({...});
      // await transporter.sendMail({...});
      
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  } else {
    // Log to console for debugging
    console.log('Email notification (SMTP not configured):');
    console.log('To:', merchantEmail);
    console.log('Subject:', subject);
    console.log('---');
  }
}

// Send low stock alert
export async function sendLowStockAlert(productId: string, productName: string, quantity: number): Promise<void> {
  const merchantEmail = process.env.MERCHANT_EMAIL;
  
  if (!merchantEmail) {
    console.log('No merchant email configured, skipping low stock alert');
    return;
  }

  const subject = `Alerte stock bas - ${productName}`;
  const htmlContent = `
    <h2>Alerte de stock bas</h2>
    <p>Le produit suivant a un stock faible :</p>
    <table border="1" cellpadding="10" style="border-collapse: collapse;">
      <tr>
        <td><strong>Produit</strong></td>
        <td>${productName}</td>
      </tr>
      <tr>
        <td><strong>ID</strong></td>
        <td>${productId}</td>
      </tr>
      <tr>
        <td><strong>Quantité restante</strong></td>
        <td style="color: red; font-weight: bold;">${quantity}</td>
      </tr>
    </table>
  `;

  console.log('Low stock alert:', { to: merchantEmail, subject, productId, quantity });
}

// Send daily summary report
export async function sendDailySummaryReport(): Promise<void> {
  const merchantEmail = process.env.MERCHANT_EMAIL;
  
  if (!merchantEmail) {
    return;
  }

  const subject = 'Rapport quotidien - Diesel Injecteurs';
  const htmlContent = `
    <h2>Rapport quotidien de votre boutique</h2>
    <p>Rapport du ${new Date().toLocaleDateString('fr-FR')}</p>
    <!-- TODO: Add actual statistics -->
  `;

  console.log('Daily summary report sent to:', merchantEmail);
}
