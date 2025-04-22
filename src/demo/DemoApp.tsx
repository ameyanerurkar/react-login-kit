import React from 'react';
import { LoginPage, useLoginConfig, ConfigProvider } from '../index';
import { LoginConfig, LoginCredentials, LoginResponse, OtpDeliveryMethod } from '../types';

const DemoApp: React.FC = () => {
  // Custom configuration with logo and specific login methods
  const config: LoginConfig = {
    branding: {
      // Official PayPal logo URL
      logoUrl: 'https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg',
      primaryColor: '#0070ba', // PayPal blue
      fontFamily: 'Inter, sans-serif',
    },
    authMethods: {
      // Only password and OTP methods - No social login
      authMethods: ['username_password', 'otp'],
      otpDelivery: ['email', 'sms'],
    },
    uiBehavior: {
      enableRememberMe: true,
      defaultAuthMethod: 'username_password', // Set the default auth method
      showForgotPassword: true,
      showSignUpLink: true,
    },
    localization: {
      language: 'en-US',
      strings: {
        // Customize the text shown in the login form
        loginTitle: 'Welcome to PayPal',
        usernamePlaceholder: 'Enter your email',
        passwordPlaceholder: 'Enter your password',
        submitButton: 'Log In',
        nextButtonText: 'Next',
        backText: 'Change',
        // OTP related strings
        otpLoginTitle: 'Sign in with one-time code',
        otpSentMessage: 'We sent a verification code to your email/phone',
      },
    },
    errorHandling: {
      onSuccessRedirect: '/dashboard',
      onFailureMessage: 'Login failed. Please check your credentials and try again.',
      onSessionTimeoutRedirect: '/login',
    },
  };

  // Mock handlers for the different auth methods
  const handleLogin = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    console.log('Login with credentials:', credentials);
    // For demo purposes, always succeed after 1 second
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          token: 'demo-token-123',
          redirectUrl: '/dashboard'
        });
      }, 1000);
    });
  };

  const handleOtpRequest = async (delivery: OtpDeliveryMethod, target: string): Promise<boolean> => {
    console.log(`OTP request via ${delivery} to ${target}`);
    // For demo purposes, always succeed after 1 second
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  };

  return (
    <div style={{ 
      backgroundColor: '#F9FAFB',
      minHeight: '100vh',
      padding: '2rem 1rem',
    }}>
      <div style={{ 
        maxWidth: '960px',
        margin: '0 auto',
        textAlign: 'center',
        marginBottom: '2rem',
      }}>
        <h1 style={{ marginBottom: '1rem' }}>React Login Kit Demo</h1>
        <p style={{ marginBottom: '1.5rem' }}>A customizable login component for React applications</p>
      </div>

      <div 
        style={{
          backgroundColor: '#FFFFFF',
          padding: '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          maxWidth: '960px',
          margin: '0 auto',
        }}
      >
        <ConfigProvider config={config}>
          <LoginPage 
            onLogin={handleLogin}
            onOtpRequest={handleOtpRequest}
          />
        </ConfigProvider>
      </div>
      
      <div style={{ 
        maxWidth: '960px',
        margin: '2rem auto 0',
        padding: '1rem',
        backgroundColor: '#FFFFFF',
        borderRadius: '0.5rem',
      }}>
        <h3>Demo Credentials:</h3>
        <p>All login attempts will succeed automatically for demo purposes.</p>
        <p>Try switching between password and OTP authentication methods.</p>
      </div>
    </div>
  );
};

export default DemoApp; 