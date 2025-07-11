# 🚀 SocialBuzz Clone - Production Ready

A comprehensive, production-ready social platform for creators to receive donations and build communities. Built with modern technologies and best practices.

## ✨ Features

### 🎯 Core Features
- **Complete Authentication System** - JWT-based with secure password hashing
- **User & Admin Dashboards** - Role-based access control
- **Payment Integration** - Duitku payment gateway with secure callbacks
- **File Upload System** - Supabase Storage integration
- **Real-time Notifications** - In-app notification system
- **Mobile Responsive** - Works perfectly on all devices

### 👥 User Features
- User registration and login
- Profile management with avatar uploads
- Donation receiving and tracking
- Transaction history
- Payout requests
- Account settings

### 🛠 Admin Features
- User management
- Transaction monitoring
- Payout approval system
- Platform statistics
- Site configuration

### 🔧 Super Admin Features
- Complete system control
- Admin user management
- Revenue tracking
- System configuration

## 🧩 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4.x** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### Backend
- **Next.js API Routes** - Serverless functions
- **JWT Authentication** - Secure token-based auth
- **Supabase** - PostgreSQL database and storage
- **Duitku** - Payment gateway integration

### Development Tools
- **ESLint & Prettier** - Code quality and formatting
- **Husky** - Git hooks for pre-commit linting
- **TypeScript** - Static type checking

## 📂 Project Structure

```
my-socialbuzz-clone/
├── app/                          # Next.js App Router
│   ├── api/v1/                  # API routes (versioned)
│   │   ├── auth/                # Authentication endpoints
│   │   ├── payment/             # Payment processing
│   │   ├── users/               # User management
│   │   ├── admin/               # Admin endpoints
│   │   └── uploads/             # File upload
│   ├── dashboard/               # Dashboard pages
│   ├── auth/                    # Authentication pages
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # React components
│   ├── ui/                      # UI components
│   └── dashboard/               # Dashboard components
├── lib/                         # Core utilities
│   ├── supabase.ts              # Database client
│   ├── auth.ts                  # Authentication utils
│   ├── duitku.ts                # Payment integration
│   └── middleware.ts            # API middleware
├── services/                    # Business logic
│   ├── userService.ts           # User operations
│   └── paymentService.ts        # Payment operations
├── hooks/                       # Custom React hooks
│   ├── useAuth.ts               # Authentication hook
│   └── usePayment.ts            # Payment hook
├── types/                       # TypeScript definitions
│   ├── user.ts                  # User types
│   ├── payment.ts               # Payment types
│   └── common.ts                # Common types
├── utils/                       # Utility functions
│   ├── validator.ts             # Input validation
│   └── formatter.ts             # Data formatting
├── config/                      # Configuration
│   ├── constants.ts             # App constants
│   └── env.ts                   # Environment config
├── docs/                        # API documentation
│   └── v1/                      # API v1 docs
│       ├── auth.yaml            # Auth endpoints
│       ├── payment.yaml         # Payment endpoints
│       └── users.yaml           # User endpoints
├── styles/                      # Global styles
│   └── globals.css              # Tailwind CSS
├── public/                      # Static assets
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm, yarn, or pnpm
- Supabase account
- Duitku merchant account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/socialbuzz-clone.git
   cd socialbuzz-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:
   ```env
   # Application
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Database - Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   
   # JWT Authentication
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters
   
   # Payment Gateway - Duitku
   DUITKU_MERCHANT_CODE=your-merchant-code
   DUITKU_API_KEY=your-api-key
   ```

4. **Set up the database**
   
   Run the following SQL in your Supabase SQL editor:
   ```sql
   -- Create users table
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email TEXT UNIQUE NOT NULL,
     username TEXT UNIQUE NOT NULL,
     full_name TEXT NOT NULL,
     password_hash TEXT NOT NULL,
     avatar TEXT,
     role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
     is_verified BOOLEAN DEFAULT false,
     balance DECIMAL(15,2) DEFAULT 0,
     total_earnings DECIMAL(15,2) DEFAULT 0,
     total_donations DECIMAL(15,2) DEFAULT 0,
     last_login TIMESTAMP WITH TIME ZONE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
   );
   
   -- Create other tables (transactions, donations, etc.)
   -- See docs/database-schema.sql for complete schema
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   
   Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_APP_URL` | Application URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | ✅ |
| `DUITKU_MERCHANT_CODE` | Duitku merchant code | ✅ |
| `DUITKU_API_KEY` | Duitku API key | ✅ |
| `SMTP_HOST` | Email server host | ❌ |
| `SMTP_USER` | Email server username | ❌ |
| `SMTP_PASSWORD` | Email server password | ❌ |

### Payment Configuration

The application uses Duitku as the payment gateway. Configure your Duitku settings:

1. Sign up for a Duitku merchant account
2. Get your merchant code and API key
3. Set up your callback URL: `https://yourdomain.com/api/v1/payment/callback`
4. Configure your return URL: `https://yourdomain.com/payment/success`

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/v1/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "johndoe",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "username": "johndoe",
      "fullName": "John Doe",
      "role": "user"
    }
  }
}
```

#### POST `/api/v1/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Payment Endpoints

#### POST `/api/v1/payment/create`
Create a new donation payment.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "recipientId": "123e4567-e89b-12d3-a456-426614174000",
  "amount": 50000,
  "paymentMethod": "bank_transfer",
  "message": "Keep up the great work!",
  "isAnonymous": false
}
```

### User Endpoints

#### GET `/api/v1/users/me`
Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

For complete API documentation, see the OpenAPI specifications in the `docs/v1/` directory.

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs with salt rounds
- **Input Validation** - Zod schema validation
- **SQL Injection Protection** - Parameterized queries
- **XSS Protection** - Input sanitization
- **CSRF Protection** - SameSite cookies
- **Rate Limiting** - API rate limiting
- **File Upload Security** - Type and size validation

## 🧪 Testing

Run the test suite:
```bash
npm run test
# or
yarn test
# or
pnpm test
```

Run linting:
```bash
npm run lint
# or
yarn lint
# or
pnpm lint
```

Run type checking:
```bash
npm run type-check
# or
yarn type-check
# or
pnpm type-check
```

## 📦 Building for Production

1. **Build the application**
   ```bash
   npm run build
   # or
   yarn build
   # or
   pnpm build
   ```

2. **Start the production server**
   ```bash
   npm start
   # or
   yarn start
   # or
   pnpm start
   ```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy!

### Deploy API to Subdomain

To deploy the API to `api.yourdomain.com`:

1. **Set up subdomain routing**
   ```javascript
   // next.config.js
   module.exports = {
     async rewrites() {
       return [
         {
           source: '/api/:path*',
           destination: 'https://api.yourdomain.com/:path*',
         },
       ];
     },
   };
   ```

2. **Configure your DNS**
   - Add a CNAME record for `api.yourdomain.com`
   - Point it to your deployment platform

### Environment-specific Configurations

**Development:**
```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
DUITKU_BASE_URL=https://sandbox.duitku.com/webapi/api
```

**Production:**
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
DUITKU_BASE_URL=https://passport.duitku.com/webapi/api
```

## 📖 Updating API Documentation

The project uses OpenAPI (Swagger) specifications for API documentation. To update the documentation:

1. **Edit the YAML files** in the `docs/v1/` directory
2. **Add new endpoints** following the existing pattern
3. **Include example requests and responses**
4. **Update the curl examples** at the bottom of each file

### Documentation Structure

```
docs/
└── v1/
    ├── auth.yaml      # Authentication endpoints
    ├── payment.yaml   # Payment endpoints
    ├── users.yaml     # User management endpoints
    └── admin.yaml     # Admin endpoints
```

### Example Documentation Update

When adding a new endpoint:

```yaml
/users/profile:
  get:
    summary: Get user profile
    description: Retrieve detailed user profile information
    operationId: getUserProfile
    tags:
      - Users
    security:
      - BearerAuth: []
    responses:
      '200':
        description: Profile retrieved successfully
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserProfile'
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Duitku](https://duitku.com/) - Payment gateway
- [Lucide](https://lucide.dev/) - Icon library

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/socialbuzz-clone/issues) page
2. Create a new issue with detailed information
3. Join our [Discord community](https://discord.gg/your-server)
4. Email us at support@socialbuzz.com

## 🔄 Changelog

### v1.0.0
- Initial release
- Complete authentication system
- Payment integration with Duitku
- User and admin dashboards
- File upload system
- API documentation
- Production-ready deployment

---

Built with ❤️ by the SocialBuzz team