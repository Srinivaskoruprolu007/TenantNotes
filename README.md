# TenantNotes - Property Management System

A modern property management application built with Next.js, Firebase, and Razorpay integration for handling tenant subscriptions and payments.

## Features

- **Tenant Management**: Track and manage property tenants
- **Subscription Plans**: Multiple subscription tiers with Razorpay integration
- **Payment Processing**: Secure payment handling with webhook support
- **Responsive UI**: Built with modern React and Tailwind CSS
- **Real-time Updates**: Powered by Firebase Firestore

## Prerequisites

- Node.js 18+ and npm
- Firebase account and project
- Razorpay account

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/TenantNotes.git
   cd TenantNotes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   
   # Razorpay
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   
   # Optional: Webhook Secret
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## Razorpay Integration

### Setup
1. Create a Razorpay account at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Get your API keys from the Razorpay Dashboard
3. Set up webhooks in Razorpay Dashboard:
   - Go to Settings → Webhooks
   - Add your webhook URL (e.g., `https://yourdomain.com/api/razorpay/webhook`)
   - Subscribe to these events:
     - `payment.captured`
     - `subscription.charged`
     - `subscription.updated`

### Testing Payments
1. Use Razorpay's test mode for development
2. Test card details:
   - Card Number: `4111 1111 1111 1111`
   - Expiry: Any future date
   - CVV: Any 3 digits
   - Name: Any name

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Check TypeScript types

## Project Structure

```
src/
├── app/                    # App router
│   ├── api/                # API routes
│   │   └── razorpay/       # Razorpay webhook and payment endpoints
│   └── dashboard/          # Protected routes
├── components/             # Reusable UI components
├── lib/                    # Utility functions and configurations
│   ├── firestore.ts        # Firebase database operations
│   └── razorpay.ts         # Razorpay integration
└── styles/                 # Global styles
```

## Deployment

1. **Vercel** (Recommended):
   - Connect your GitHub repository to Vercel
   - Add all environment variables
   - Deploy!

2. **Firebase Hosting**:
   ```bash
   npm run build
   firebase login
   firebase init
   firebase deploy
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - your.email@example.com

Project Link: [https://github.com/yourusername/TenantNotes](https://github.com/yourusername/TenantNotes)
