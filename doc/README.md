# Mobile Documentation

This directory contains all documentation related to the mobile application development and implementation.

## 📚 Documentation Index

### Authentication & Security
- **[Mobile Authentication System](./mobile-authentication-system.md)** - Complete JWT-based authentication implementation
- **[Authentication Flow Documentation](./authentication-flow-documentation.md)** - Original authentication flow documentation

### Development
- **[Game Development](./game-development.md)** - Mobile game development guidelines and implementation

## 🔗 Quick Links

### Recent Updates
- **Latest:** Mobile Authentication System - JWT implementation with debugging interface
- **Status:** Production ready with comprehensive logging

### Architecture Overview
The mobile app uses:
- **React Native** with Expo
- **JWT Authentication** for secure API access
- **TypeScript** for type safety
- **Tailwind CSS** (NativeWind) for styling

### API Integration
- **Authentication:** `/api/mobile/auth/login`
- **Vocabulary:** `/api/mobile/vocab`
- **Protected Endpoints:** All mobile APIs require JWT tokens

### Development Server
- **Local:** `http://192.168.15.34:3000` (matches Next.js dev server)
- **Production:** `https://pejuangkorea.vercel.app`

## 📱 Mobile App Structure

```
mobile/
├── app/                 # Expo Router pages
├── components/          # Reusable components
├── lib/                # Core libraries
│   ├── auth.ts         # Authentication system
│   └── api/            # API integrations
├── assets/             # Images and static files
└── doc/                # Documentation (this folder)
```

## 🧪 Testing & Debugging

### Authentication Testing
1. Navigate to Profile page in mobile app
2. View JWT Debug Information section
3. Check decoded user info and token format
4. Verify API calls include Bearer tokens

### Development Workflow
1. Start Next.js dev server: `bun run dev`
2. Start mobile app: `npx expo start`
3. Test authentication flow
4. Monitor logs for debugging

## 📋 Maintenance

### Updating Documentation
- Keep documentation in sync with code changes
- Update network configurations when server IPs change
- Document new API endpoints and authentication changes

### File Organization
- All `.md` files should be placed in this `doc/` directory
- Use descriptive filenames with kebab-case
- Include version information and last updated dates

---

**Last Updated:** May 27, 2025  
**Mobile App Version:** Latest  
**Documentation Status:** Active
