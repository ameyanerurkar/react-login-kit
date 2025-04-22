import React, { useState } from 'react';
import { useLoginConfig } from '../ConfigContextProvider/ConfigContextProvider';
import ErrorBanner from '../ErrorBanner/ErrorBanner';
import { LoginResponse } from '../../types';

// SVG icons for social providers (simplified versions)
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
    </g>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#1877F2" d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
  </svg>
);

interface SocialLoginProviderProps {
  provider: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  style?: React.CSSProperties;
}

const SocialLoginProvider: React.FC<SocialLoginProviderProps> = ({
  provider,
  label,
  icon,
  onClick,
  style,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Sign in with ${label}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        width: '100%',
        padding: '0.625rem 1.25rem',
        backgroundColor: '#fff',
        border: '1px solid #D1D5DB',
        borderRadius: '0.375rem',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        ...style,
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

interface SocialLoginProps {
  onSocialLogin: (provider: string) => Promise<LoginResponse>;
}

const SocialLogin: React.FC<SocialLoginProps> = ({ onSocialLogin }) => {
  const config = useLoginConfig();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    authMethods = ['username_password'],
  } = config.authMethods || {};
  
  const {
    strings = {},
  } = config.localization || {};

  const {
    primaryColor = '#0066cc',
  } = config.branding || {};

  // Get localized strings with fallbacks
  const googleText = strings.googleLogin || 'Sign in with Google';
  const facebookText = strings.facebookLogin || 'Sign in with Facebook';
  const orText = strings.orSeparator || 'OR';

  // Handle social login
  const handleSocialLogin = async (provider: string) => {
    setIsLoading(provider);
    setErrorMessage(null);
    
    try {
      const response = await onSocialLogin(provider);
      
      if (!response.success) {
        setErrorMessage(response.message || 'Authentication failed');
      } else if (response.redirectUrl) {
        window.location.href = response.redirectUrl;
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred'
      );
    } finally {
      setIsLoading(null);
    }
  };

  // If no social login methods are enabled, don't render anything
  if (!authMethods.some(method => method === 'google_oauth' || method === 'facebook_oauth')) {
    return null;
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {errorMessage && (
        <ErrorBanner 
          message={errorMessage} 
          onDismiss={() => setErrorMessage(null)} 
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {authMethods.includes('google_oauth') && (
          <SocialLoginProvider
            provider="google_oauth"
            label={googleText}
            icon={<GoogleIcon />}
            onClick={() => handleSocialLogin('google_oauth')}
            style={{ 
              opacity: isLoading && isLoading !== 'google_oauth' ? 0.7 : 1,
              cursor: isLoading && isLoading !== 'google_oauth' ? 'not-allowed' : 'pointer',
            }}
          />
        )}
        
        {authMethods.includes('facebook_oauth') && (
          <SocialLoginProvider
            provider="facebook_oauth"
            label={facebookText}
            icon={<FacebookIcon />}
            onClick={() => handleSocialLogin('facebook_oauth')}
            style={{ 
              opacity: isLoading && isLoading !== 'facebook_oauth' ? 0.7 : 1,
              cursor: isLoading && isLoading !== 'facebook_oauth' ? 'not-allowed' : 'pointer',
            }}
          />
        )}
      </div>

      {authMethods.includes('username_password') && (
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            margin: '1.5rem 0',
          }}
        >
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
          <span style={{ padding: '0 0.75rem', color: '#6B7280', fontSize: '0.875rem' }}>
            {orText}
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
        </div>
      )}
    </div>
  );
};

export default SocialLogin; 