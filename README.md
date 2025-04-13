# Loan Application Form

A modern, responsive loan application form built with Angular and JSON Forms. This application provides a user-friendly interface for submitting loan applications with real-time validation and feedback.

## Features

- 🎨 Modern UI with gradient backgrounds and smooth animations
- 📱 Fully responsive design that works on all devices
- ✨ Real-time form validation
- 🔄 Instant form submission with feedback
- 🏗️ Built with Angular Material and JSON Forms
- 🎯 Clean and intuitive user interface

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Angular CLI (`npm install -g @angular/cli`)

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd loan-application-form
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
ng serve
```

4. Open [http://localhost:4200](http://localhost:4200) in your browser

## JSON Structure

### Data Model
```typescript
interface LoanApplicationData {
  firstName: string;          // Min length: 2
  lastName: string;           // Min length: 2
  email: string;             // Must be valid email
  existingCustomer: boolean;  // True/False
  customerNumber?: string;    // Required if existingCustomer is true
  loanType: string;          // One of: personal, business, mortgage, auto
  loanAmount: number;        // Minimum: 1000
  address: {
    street: string;          // Min length: 5, Max length: 100
    city: string;            // Min length: 2, Letters only
    state: string;           // Min length: 2, Letters only
    postalCode: string;      // 5-6 digits
    country: string;         // Min length: 2, Letters only
  };
  agreeToTerms: boolean;     // Must be true
}
```

### Schema Validation Rules

- **Required Fields:**
  - First Name and Last Name (min 2 characters)
  - Email (valid email format)
  - Loan Type (must be one of the predefined types)
  - Address (all fields required)
  - Terms Agreement (must be accepted)

- **Conditional Fields:**
  - Customer Number (only if existingCustomer is true)
  - Business Address (only for business loans)

## Project Structure

```
src/
├── app/
│   ├── app.component.ts    # Main form component with schema
│   ├── app.module.ts       # Application module
│   └── custom/            # Custom form elements
├── assets/                 # Static assets
└── styles/                 # Global styles
```

## Key Files

- `app.component.ts`: Contains form schema, UI schema, and validation logic
- `app.module.ts`: Module configuration and dependency imports
- `styles.css`: Global styles including Tailwind CSS configuration

## Assumptions

1. **Form Submission:**
   - Form data is submitted via API (not implemented)
   - Shows success alert on submission
   - Resets form after successful submission

2. **Validation:**
   - Client-side validation only
   - No server-side validation implemented
   - Basic email format validation

3. **User Experience:**
   - Form is responsive on all devices
   - Real-time validation feedback
   - No session persistence

4. **Data Privacy:**
   - No sensitive data encryption
   - No GDPR compliance implemented
   - Data not stored locally

## Development

### Running Tests
```bash
ng test                 # Unit tests
ng e2e                  # End-to-end tests
```

### Building for Production
```bash
ng build --prod        # Creates production build
```

### Environment Setup
1. Install Node.js and npm
2. Install Angular CLI: `npm install -g @angular/cli`
3. Install dependencies: `npm install`
4. Configure environment variables (if needed)

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit pull request

## License

MIT License - see [LICENSE](LICENSE) file
