import html2pdf from 'html2pdf.js';

interface Product {
  name: string;
  quantity: number;
  priceAtPurchase: number;
  selectedSizeVariant?: {
    size: string;
  };
  customSize?: {
    isCustom: boolean;
    width?: number;
    height?: number;
    unit?: string;
  };
}

interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  phoneNumber: string;
}

interface Order {
  orderId: string;
  createdAt: string;
  products: Product[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMode: string;
  paymentStatus: string;
  orderStatus: string;
  transactionId?: string;
}

interface UserInfo {
  email: string;
  username: string;
}

const generateInvoiceHTML = (order: Order, userInfo: UserInfo): string => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const productsHTML = order.products.map((product, index) => {
    let sizeInfo = '';
    if (product.customSize?.isCustom) {
      sizeInfo = `<br><span style="font-size: 11px; color: #666; font-style: italic;">Custom: ${product.customSize.width}×${product.customSize.height} ${product.customSize.unit || 'cm'}</span>`;
    } else if (product.selectedSizeVariant) {
      sizeInfo = `<br><span style="font-size: 11px; color: #666; font-style: italic;">${product.selectedSizeVariant.size}</span>`;
    }
    
    return `
      <tr>
        <td style="text-align: center; padding: 12px 8px; border-bottom: 1px solid #e5e7eb;">${index + 1}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb;">
          <strong>${product.name}</strong>${sizeInfo}
        </td>
        <td style="text-align: center; padding: 12px 8px; border-bottom: 1px solid #e5e7eb;">${product.quantity}</td>
        <td style="text-align: right; padding: 12px 8px; border-bottom: 1px solid #e5e7eb;">₹${product.priceAtPurchase.toLocaleString('en-IN')}</td>
        <td style="text-align: right; padding: 12px 8px; border-bottom: 1px solid #e5e7eb;"><strong>₹${(product.priceAtPurchase * product.quantity).toLocaleString('en-IN')}</strong></td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Helvetica', 'Arial', sans-serif;
          color: #1f2937;
          line-height: 1.6;
        }
        
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 30px;
          background: white;
        }
        
        .header {
          background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%);
          padding: 30px;
          border-radius: 8px;
          margin-bottom: 30px;
          color: white;
          position: relative;
          overflow: hidden;
        }
        
        .header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 300px;
          height: 300px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          position: relative;
          z-index: 1;
        }
        
        .company-info h1 {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 5px;
          color: white;
        }
        
        .company-info .tagline {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 15px;
        }
        
        .company-info .contact-item {
          font-size: 11px;
          margin: 4px 0;
          opacity: 0.95;
        }
        
        .invoice-title {
          text-align: right;
        }
        
        .invoice-title h2 {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 5px;
          letter-spacing: 2px;
        }
        
        .invoice-title .invoice-meta {
          font-size: 12px;
          margin: 3px 0;
        }
        
        .invoice-title .gst {
          font-size: 11px;
          font-weight: bold;
          margin-top: 8px;
          padding: 4px 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          display: inline-block;
        }
        
        .business-hours {
          font-size: 10px;
          text-align: right;
          margin-top: 8px;
          opacity: 0.9;
        }
        
        .addresses {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .address-box {
          flex: 1;
          padding: 20px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: #f9fafb;
        }
        
        .address-box h3 {
          color: #0f766e;
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .address-box .name {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 8px;
          color: #1f2937;
        }
        
        .address-box .detail {
          font-size: 13px;
          color: #4b5563;
          margin: 4px 0;
        }
        
        .order-id {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 12px 16px;
          margin-bottom: 25px;
          border-radius: 4px;
        }
        
        .order-id strong {
          color: #92400e;
          font-size: 14px;
        }
        
        .products-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .products-table thead {
          background: #0f766e;
          color: white;
        }
        
        .products-table th {
          padding: 14px 8px;
          text-align: left;
          font-size: 13px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .products-table th:first-child,
        .products-table th:nth-child(3) {
          text-align: center;
        }
        
        .products-table th:nth-child(4),
        .products-table th:nth-child(5) {
          text-align: right;
        }
        
        .products-table tbody tr:nth-child(even) {
          background: #f9fafb;
        }
        
        .products-table tbody tr:hover {
          background: #f0fdfa;
        }
        
        .products-table td {
          font-size: 13px;
          color: #374151;
        }
        
        .summary {
          display: flex;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 30px;
        }
        
        .payment-info {
          flex: 1;
        }
        
        .payment-badge {
          display: inline-block;
          padding: 8px 16px;
          background: #d1fae5;
          color: #065f46;
          border-radius: 6px;
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 12px;
          border: 2px solid #10b981;
        }
        
        .payment-detail {
          font-size: 12px;
          color: #6b7280;
          margin: 6px 0;
        }
        
        .totals-box {
          flex: 1;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          background: white;
        }
        
        .totals-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
          color: #4b5563;
        }
        
        .totals-row.divider {
          border-top: 2px solid #0f766e;
          margin-top: 8px;
          padding-top: 12px;
        }
        
        .totals-row.grand-total {
          background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
          margin: 0 -20px;
          padding: 12px 20px;
          border-radius: 6px;
          margin-top: 8px;
        }
        
        .totals-row.grand-total .label {
          font-size: 16px;
          font-weight: bold;
          color: #0f766e;
        }
        
        .totals-row.grand-total .value {
          font-size: 18px;
          font-weight: bold;
          color: #0f766e;
        }
        
        .terms {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
        }
        
        .terms h3 {
          color: #0f766e;
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 12px;
          text-transform: uppercase;
        }
        
        .terms ul {
          list-style: none;
          padding: 0;
        }
        
        .terms li {
          font-size: 11px;
          color: #4b5563;
          margin: 8px 0;
          padding-left: 20px;
          position: relative;
        }
        
        .terms li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: #0f766e;
          font-weight: bold;
          font-size: 16px;
        }
        
        .footer {
          background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%);
          color: white;
          text-align: center;
          padding: 20px;
          border-radius: 8px;
        }
        
        .footer h3 {
          font-size: 18px;
          margin-bottom: 8px;
        }
        
        .footer p {
          font-size: 11px;
          opacity: 0.9;
        }
        
        @media print {
          .invoice-container {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <!-- Header -->
        <div class="header">
          <div class="header-content">
            <div class="company-info">
              <h1>Shree Siddhi Decor</h1>
              <div class="tagline">Premium Drapes & Home Decor</div>
              <div class="contact-item">📍 C-831/1, Opposite 2nd Railway Gate, Besides MedPlus</div>
              <div class="contact-item">Congress Road, Tilakwadi, Belgaum, Karnataka 590006</div>
              <div class="contact-item">✉ signaturedraps31@gmail.com</div>
              <div class="contact-item">📞 +91 9036587169 | +91 8310100837</div>
            </div>
            <div class="invoice-title">
              <h2>TAX<br>INVOICE</h2>
              <div class="invoice-meta">Date: ${formatDate(order.createdAt)}</div>
              <div class="invoice-meta">Payment: ${order.paymentMode}</div>
              <div class="gst">GST: 29ACKFS9402L1ZH</div>
              <div class="business-hours">Mon-Sat: 9AM-7PM | Sun: 10AM-6PM</div>
            </div>
          </div>
        </div>

        <!-- Addresses -->
        <div class="addresses">
          <div class="address-box">
            <h3>Bill To</h3>
            <div class="name">${order.shippingAddress.fullName}</div>
            <div class="detail">${userInfo.email}</div>
            <div class="detail">${order.shippingAddress.phoneNumber}</div>
          </div>
          <div class="address-box">
            <h3>Ship To</h3>
            <div class="name">${order.shippingAddress.fullName}</div>
            <div class="detail">${order.shippingAddress.addressLine1}</div>
            ${order.shippingAddress.addressLine2 ? `<div class="detail">${order.shippingAddress.addressLine2}</div>` : ''}
            <div class="detail">${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</div>
          </div>
        </div>

        <!-- Order ID -->
        <div class="order-id">
          <strong>Order ID: #${order.orderId}</strong>
        </div>

        <!-- Products Table -->
        <table class="products-table">
          <thead>
            <tr>
              <th style="width: 5%;">#</th>
              <th style="width: 45%;">Product Description</th>
              <th style="width: 10%;">Qty</th>
              <th style="width: 20%;">Unit Price</th>
              <th style="width: 20%;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${productsHTML}
          </tbody>
        </table>

        <!-- Summary -->
        <div class="summary">
          <div class="payment-info">
            ${order.paymentStatus === 'PAID' ? '<div class="payment-badge">✓ PAID</div>' : ''}
            ${order.transactionId ? `<div class="payment-detail"><strong>Transaction ID:</strong> ${order.transactionId}</div>` : ''}
            <div class="payment-detail"><strong>Payment Mode:</strong> ${order.paymentMode}</div>
          </div>
          <div class="totals-box">
            <div class="totals-row">
              <span class="label">Subtotal:</span>
              <span class="value">₹${order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div class="totals-row">
              <span class="label">GST (Included):</span>
              <span class="value">10.00</span>
            </div>
            <div class="totals-row">
              <span class="label">Discount:</span>
              <span class="value">0.00</span>
            </div>
            <div class="totals-row grand-total">
              <span class="label">Grand Total:</span>
              <span class="value">₹${order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <!-- Terms -->
        <div class="terms">
          <h3>Terms & Conditions</h3>
          <ul>
            <li>This is a computer-generated invoice and does not require a signature.</li>
            <li>Goods once sold will not be taken back or exchanged.</li>
            <li>All disputes are subject to Belgaum jurisdiction only.</li>
            <li>For queries, contact us during business hours (Mon-Sat: 9AM-7PM, Sun: 10AM-6PM).</li>
          </ul>
        </div>

        <!-- Footer -->
        <div class="footer">
          <h3>Thank you for shopping with us!</h3>
          <p>Shree Siddhi Decor | signaturedraps31@gmail.com | +91 9036587169</p>
        </div>
      </div>
    </body>
    </html>
  `;
};


export const downloadInvoice = (order: Order, userInfo: UserInfo) => {
  try {
    console.log('downloadInvoice called with order:', order.orderId);
    console.log('User info:', userInfo);
    
    if (!order || !order.orderId) {
      throw new Error('Invalid order data');
    }
    
    if (!order.products || order.products.length === 0) {
      throw new Error('Order has no products');
    }
    
    if (!order.shippingAddress) {
      throw new Error('Order has no shipping address');
    }
    
    // Generate HTML content
    const htmlContent = generateInvoiceHTML(order, userInfo);
    
    // Create a temporary element
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    document.body.appendChild(element);
    
    // PDF options
    const opt = {
      margin: 0,
      filename: `Invoice_${order.orderId}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false
      },
      jsPDF: { 
        unit: 'mm' as const, 
        format: 'a4' as const, 
        orientation: 'portrait' as const
      }
    };
    
    // Generate PDF
    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        console.log('PDF download initiated');
        // Clean up
        document.body.removeChild(element);
      })
      .catch((error: any) => {
        console.error('PDF generation error:', error);
        document.body.removeChild(element);
        throw new Error(`Failed to generate PDF: ${error.message}`);
      });
    
  } catch (error: any) {
    console.error('Error in downloadInvoice:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      order: order,
      userInfo: userInfo
    });
    throw new Error(`Download failed: ${error.message}`);
  }
};
