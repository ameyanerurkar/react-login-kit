import React, { useState } from 'react';
import LoginForm from '../LoginForm/LoginForm';
import OtpLogin from '../OtpLogin/OtpLogin';
import { useLoginConfig } from '../ConfigContextProvider/ConfigContextProvider';
import { 
  AuthMethod, 
  LoginCredentials, 
  LoginResponse, 
  OtpDeliveryMethod
} from '../../types';

interface LoginContainerProps {
  onLogin: (values: LoginCredentials) => Promise<LoginResponse>;
  onOtpRequest: (delivery: OtpDeliveryMethod, target: string) => Promise<boolean>;
}

const LoginContainer: React.FC<LoginContainerProps> = ({
  onLogin,
  onOtpRequest,
}) => {
  const config = useLoginConfig();
  // Correctly handle authMethods which could be an AuthMethodsConfig or undefined
  const authMethodsList = Array.isArray(config.authMethods) 
    ? config.authMethods 
    : config.authMethods?.authMethods || ['username_password'];
  
  const [currentMethod, setCurrentMethod] = useState<AuthMethod>(
    authMethodsList.length > 0 ? authMethodsList[0] : 'username_password'
  );

  const renderCurrentAuthMethod = () => {
    switch (currentMethod) {
      case 'username_password':
        return (
          <LoginForm 
            onSubmit={onLogin} 
            onSwitchToOtp={() => {
              if (authMethodsList.includes('otp')) {
                setCurrentMethod('otp');
              }
            }}
          />
        );
      case 'otp':
        return (
          <OtpLogin 
            onSubmit={onLogin} 
            onOtpRequest={onOtpRequest}
            onSwitchToPassword={() => {
              if (authMethodsList.includes('username_password')) {
                setCurrentMethod('username_password');
              }
            }}
          />
        );
      default:
        return <LoginForm onSubmit={onLogin} />;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      backgroundColor: '#f5f7fa',
      padding: '2rem 1rem',
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }}>
        {renderCurrentAuthMethod()}
        
        {/* Footer */}
        <div style={{ 
          marginTop: '2rem', 
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#666'
        }}>
          <p style={{ marginBottom: '0.5rem' }}>
            {config.localization?.strings?.footerText || 'By logging in, you agree to our terms and conditions.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <a 
              href="#privacy" 
              style={{ 
                color: '#666',
                textDecoration: 'none',
              }}
            >
              {config.localization?.strings?.privacyLink || 'Privacy'}
            </a>
            <a 
              href="#legal" 
              style={{ 
                color: '#666',
                textDecoration: 'none',
              }}
            >
              {config.localization?.strings?.legalLink || 'Legal'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginContainer; 