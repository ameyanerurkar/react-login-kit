# React Login Kit

A customizable, configuration-driven login component for React applications. This component provides a flexible and extensible authentication interface that can be easily integrated into any React application.

## Features

- 🔐 Multiple authentication methods:
  - Username/password
  - One-time passwords (OTP) via email or SMS
  - Social login (Google, Facebook)
- 🎨 Fully customizable UI:
  - Branding (logo, colors, fonts)
  - Layout and behavior
  - Text and localization
- ⚙️ Configuration-driven:
  - All aspects controlled via a simple JSON configuration
  - No need to modify component code
- 📱 Responsive design:
  - Works on all device sizes
  - Mobile-friendly layout
- ♿ Accessibility:
  - WCAG 2.1 AA compliant
  - Keyboard navigable
- 🔄 Extensible:
  - Custom event handlers
  - Override default behaviors

## Installation

```bash
npm install react-login-kit
# or
yarn add react-login-kit
```

## Usage

Here's a basic example of how to use the login component:

```jsx
import React from 'react';
import { LoginPage } from 'react-login-kit';

function App() {
  // Define your configuration
  const config = {
    branding: {
      logoUrl: '/assets/logo.png',
      primaryColor: '#0066cc',
      fontFamily: 'Inter, sans-serif'
    },
    authMethods: {
      authMethods: ['username_password', 'google_oauth'],
      otpDelivery: ['email']
    },
    uiBehavior: {
      enableRememberMe: true,
      defaultAuthMethod: 'username_password',
      showForgotPassword: true
    },
    localization: {
      language: 'en-US',
      strings: {
        loginTitle: 'Sign in to your account',
        usernamePlaceholder: 'Email address',
        passwordPlaceholder: 'Password',
        submitButton: 'Sign In'
      }
    },
    errorHandling: {
      onSuccessRedirect: '/dashboard',
      onFailureMessage: 'Invalid credentials. Please try again.'
    }
  };

  // Event handlers
  const handleLogin = async (credentials) => {
    // Implement your login logic here
    try {
      const response = await yourAuthService.login(credentials);
      return {
        success: true,
        token: response.token,
        redirectUrl: '/dashboard'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  };

  return (
    <div className="app">
      <LoginPage 
        config={config} 
        onLogin={handleLogin}
        onSocialLogin={handleSocialLogin}
        onOtpRequest={handleOtpRequest}
      />
    </div>
  );
}

export default App;
```

## Configuration Options

The configuration object supports the following properties:

### Branding

```javascript
{
  branding: {
    logoUrl: "https://domain.com/logo.png",
    primaryColor: "#0066cc",
    fontFamily: "Inter, sans-serif"
  }
}
```

### Authentication Methods

```javascript
{
  authMethods: {
    authMethods: ["username_password", "otp", "google_oauth", "facebook_oauth"],
    otpDelivery: ["email", "sms"]
  }
}
```

### UI Behavior

```javascript
{
  uiBehavior: {
    enableRememberMe: true,
    defaultAuthMethod: "username_password",
    showForgotPassword: true,
    showSignUpLink: false
  }
}
```

### Localization

```javascript
{
  localization: {
    language: "en-US",
    strings: {
      loginTitle: "Sign in to your account",
      usernamePlaceholder: "Email address",
      passwordPlaceholder: "Password",
      submitButton: "Sign In"
    }
  }
}
```

### Error Handling & Redirects

```javascript
{
  errorHandling: {
    onSuccessRedirect: "/dashboard",
    onFailureMessage: "Invalid credentials. Please try again.",
    onSessionTimeoutRedirect: "/login"
  }
}
```

## Props

The `LoginPage` component accepts the following props:

| Prop | Type | Description |
|------|------|-------------|
| `config` | Object | Configuration object for customizing the login experience |
| `onLogin` | Function | Callback function that receives login credentials and returns a promise |
| `onSocialLogin` | Function | Callback function for social login providers |
| `onOtpRequest` | Function | Callback function for requesting OTP codes |

## License

MIT 