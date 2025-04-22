import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useLoginConfig } from '../ConfigContextProvider/ConfigContextProvider';
import ErrorBanner from '../ErrorBanner/ErrorBanner';
import { LoginCredentials, LoginResponse } from '../../types';

interface LoginFormProps {
  onSubmit: (values: LoginCredentials) => Promise<LoginResponse>;
  onSwitchToOtp?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onSwitchToOtp }) => {
  const config = useLoginConfig();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginWithEmail, setLoginWithEmail] = useState(true);
  // New state to track the login page step
  const [currentStep, setCurrentStep] = useState<'email' | 'password'>('email');
  // State to store email when going to password step
  const [enteredEmail, setEnteredEmail] = useState('');

  const {
    strings = {},
  } = config.localization || {};

  const {
    enableRememberMe,
    showForgotPassword,
    showSignUpLink,
  } = config.uiBehavior || {};

  const {
    primaryColor = '#0070ba', // PayPal blue
    fontFamily = 'PayPal Sans, Helvetica, Arial, sans-serif',
  } = config.branding || {};

  // Get localized strings with fallbacks
  const loginTitle = strings.loginTitle || 'Log in to your account';
  const emailPlaceholder = strings.usernamePlaceholder || 'Email or mobile number';
  const phonePlaceholder = strings.phonePlaceholder || 'Mobile number';
  const passwordPlaceholder = strings.passwordPlaceholder || 'Password';
  const switchToEmailText = strings.switchToEmailText || 'Log in with email instead';
  const switchToPhoneText = strings.switchToPhoneText || 'Log in with phone instead';
  const submitButtonText = strings.submitButton || 'Log In';
  const nextButtonText = strings.nextButtonText || 'Next';
  const rememberMeText = strings.rememberMe || 'Stay logged in for faster checkout';
  const forgotPasswordText = strings.forgotPassword || 'Forgot password?';
  const signUpText = strings.signUp || 'Sign Up';
  const otpLoginText = strings.otpLoginText || 'Log in with a one-time code';
  const needHelpText = strings.needHelpText || 'Having trouble logging in?';
  const backText = strings.backText || 'Back';

  // Email validation schema
  const emailValidationSchema = Yup.object({
    username: Yup.string()
      .required(strings.requiredField || 'Required'),
  });

  // Password validation schema
  const passwordValidationSchema = Yup.object({
    password: Yup.string()
      .required(strings.requiredField || 'Required'),
  });

  // Handle email step submission
  const handleEmailSubmit = (values: { username: string }) => {
    setEnteredEmail(values.username);
    setCurrentStep('password');
  };

  // Handle full login submission
  const handleSubmit = async (values: { password: string }) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      const credentials: LoginCredentials = {
        username: enteredEmail,
        password: values.password,
      };

      const response = await onSubmit(credentials);
      
      if (!response.success) {
        setErrorMessage(response.message || config.errorHandling?.onFailureMessage || 'Login failed');
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
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        fontFamily,
        maxWidth: '460px',
        margin: '0 auto',
        padding: '1.5rem',
        backgroundColor: '#fff',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 5px rgba(0, 0, 0, 0.05)',
      }}
    >
      {config.branding?.logoUrl && (
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img 
            src={config.branding.logoUrl} 
            alt="Logo" 
            style={{ 
              height: '40px',
              maxWidth: '200px',
              objectFit: 'contain'
            }} 
          />
        </div>
      )}

      <h1
        style={{
          color: '#2c2e2f',
          textAlign: 'center',
          marginBottom: '1.5rem',
          fontSize: '1.5rem',
          fontWeight: 400,
        }}
      >
        {loginTitle}
      </h1>

      {errorMessage && (
        <ErrorBanner 
          message={errorMessage} 
          onDismiss={() => setErrorMessage(null)} 
        />
      )}

      {currentStep === 'email' ? (
        // Email step
        <Formik
          initialValues={{ username: '' }}
          validationSchema={emailValidationSchema}
          onSubmit={handleEmailSubmit}
        >
          {({ isSubmitting: formikSubmitting }) => (
            <Form style={{ width: '100%' }}>
              <div style={{ marginBottom: '1.25rem', position: 'relative' }}>
                <Field
                  id="username"
                  name="username"
                  type={loginWithEmail ? "text" : "tel"}
                  placeholder={loginWithEmail ? emailPlaceholder : phonePlaceholder}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    fontSize: '1.125rem',
                    border: '1px solid #9da3a6',
                    borderRadius: '0.25rem',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'border-color 0.15s ease-in-out',
                    ':focus': {
                      borderColor: primaryColor,
                    }
                  }}
                />
                <ErrorMessage
                  name="username"
                  render={(msg) => (
                    <div style={{ color: '#c72e2e', fontSize: '0.8125rem', marginTop: '0.25rem', fontWeight: 400 }}>
                      {msg}
                    </div>
                  )}
                />
                <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginWithEmail(!loginWithEmail);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: primaryColor,
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      padding: 0,
                      fontFamily: 'inherit',
                    }}
                  >
                    {loginWithEmail ? switchToPhoneText : switchToEmailText}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || formikSubmitting}
                style={{
                  width: '100%',
                  backgroundColor: primaryColor,
                  color: '#fff',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '1.5rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  marginBottom: '1rem',
                  opacity: (isSubmitting || formikSubmitting) ? 0.7 : 1,
                }}
              >
                {nextButtonText}
              </button>

              {onSwitchToOtp && (
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <button
                    type="button"
                    onClick={onSwitchToOtp}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: primaryColor,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      padding: 0,
                      fontFamily: 'inherit',
                    }}
                  >
                    {otpLoginText}
                  </button>
                </div>
              )}

              {showSignUpLink && (
                <div style={{ 
                  marginTop: '1.5rem', 
                  textAlign: 'center',
                  padding: '1rem 0 0',
                  borderTop: '1px solid #cbd2d6'
                }}>
                  <div style={{ fontSize: '0.9375rem', marginBottom: '0.5rem' }}>
                    or
                  </div>
                  <a
                    href="#sign-up"
                    style={{
                      color: primaryColor,
                      textDecoration: 'none',
                      fontSize: '0.9375rem',
                      fontWeight: 700,
                      display: 'inline-block',
                      border: `1px solid ${primaryColor}`,
                      borderRadius: '1.5rem',
                      padding: '0.75rem 2rem',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    {signUpText}
                  </a>
                </div>
              )}
            </Form>
          )}
        </Formik>
      ) : (
        // Password step
        <Formik
          initialValues={{ password: '' }}
          validationSchema={passwordValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting: formikSubmitting }) => (
            <Form style={{ width: '100%' }}>
              <div style={{ 
                marginBottom: '1.25rem',
                textAlign: 'center',
                fontSize: '0.9375rem',
                color: '#666'
              }}>
                {enteredEmail}
                <button
                  type="button"
                  onClick={() => setCurrentStep('email')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: primaryColor,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    marginLeft: '0.5rem',
                    padding: 0,
                    fontFamily: 'inherit',
                  }}
                >
                  {backText}
                </button>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ 
                  position: 'relative',
                  marginBottom: '0.25rem',
                }}>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    placeholder={passwordPlaceholder}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      fontSize: '1.125rem',
                      border: '1px solid #9da3a6',
                      borderRadius: '0.25rem',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>
                <ErrorMessage
                  name="password"
                  render={(msg) => (
                    <div style={{ color: '#c72e2e', fontSize: '0.8125rem', marginTop: '0.25rem', fontWeight: 400 }}>
                      {msg}
                    </div>
                  )}
                />
                
                {showForgotPassword && (
                  <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                    <a
                      href="#forgot-password"
                      style={{
                        color: primaryColor,
                        textDecoration: 'none',
                        fontSize: '0.8125rem',
                      }}
                    >
                      {forgotPasswordText}
                    </a>
                  </div>
                )}
              </div>

              {enableRememberMe && (
                <div style={{ 
                  marginBottom: '1.5rem', 
                  display: 'flex', 
                  alignItems: 'flex-start',
                  gap: '0.625rem',
                }}>
                  <Field
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    style={{ 
                      margin: '0.25rem 0 0 0',
                      accentColor: primaryColor,
                      width: '18px',
                      height: '18px',
                    }}
                  />
                  <label 
                    htmlFor="rememberMe"
                    style={{
                      fontSize: '0.875rem',
                      color: '#2c2e2f',
                      lineHeight: '1.4',
                    }}
                  >
                    {rememberMeText}
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || formikSubmitting}
                style={{
                  width: '100%',
                  backgroundColor: primaryColor,
                  color: '#fff',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '1.5rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  marginBottom: '1rem',
                  opacity: (isSubmitting || formikSubmitting) ? 0.7 : 1,
                }}
              >
                {isSubmitting || formikSubmitting ? 'Logging in...' : submitButtonText}
              </button>
            </Form>
          )}
        </Formik>
      )}

      <div style={{ 
        marginTop: '1.5rem', 
        textAlign: 'center' 
      }}>
        <a
          href="#help"
          style={{
            color: primaryColor,
            textDecoration: 'none',
            fontSize: '0.8125rem',
          }}
        >
          {needHelpText}
        </a>
      </div>
    </div>
  );
};

export default LoginForm; 