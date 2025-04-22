import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useLoginConfig } from '../ConfigContextProvider/ConfigContextProvider';
import ErrorBanner from '../ErrorBanner/ErrorBanner';
import { LoginCredentials, LoginResponse, OtpDeliveryMethod } from '../../types';

interface OtpLoginProps {
  onSubmit: (values: LoginCredentials) => Promise<LoginResponse>;
  onOtpRequest: (delivery: OtpDeliveryMethod, target: string) => Promise<boolean>;
  onSwitchToPassword?: () => void;
}

const OtpLogin: React.FC<OtpLoginProps> = ({ onSubmit, onOtpRequest, onSwitchToPassword }) => {
  const config = useLoginConfig();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [deliveryTarget, setDeliveryTarget] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<OtpDeliveryMethod>('email');

  const {
    strings = {},
  } = config.localization || {};
  
  const {
    primaryColor = '#0070ba', // PayPal blue
    fontFamily = 'PayPal Sans, Helvetica, Arial, sans-serif',
  } = config.branding || {};

  const {
    otpDelivery = ['email'],
  } = config.authMethods || { otpDelivery: ['email'] };

  // Get localized strings with fallbacks
  const loginTitle = strings.otpLoginTitle || 'Log in with a one-time code';
  const emailPlaceholder = strings.emailPlaceholder || 'Email address';
  const phonePlaceholder = strings.phonePlaceholder || 'Mobile number';
  const otpPlaceholder = strings.otpPlaceholder || 'Enter code';
  const requestOtpText = strings.requestOtpButton || 'Send code';
  const submitButtonText = strings.submitOtpButton || 'Log In';
  const backToLoginText = strings.backToLogin || 'Log in with your password';
  const needHelpText = strings.needHelpText || 'Having trouble logging in?';

  // Email validation schema
  const emailValidationSchema = Yup.object({
    target: Yup.string()
      .email(strings.invalidEmail || 'Invalid email address')
      .required(strings.requiredField || 'Required'),
  });

  // Phone validation schema
  const phoneValidationSchema = Yup.object({
    target: Yup.string()
      .matches(/^\+?[1-9]\d{1,14}$/, strings.invalidPhone || 'Invalid phone number')
      .required(strings.requiredField || 'Required'),
  });

  // OTP validation schema
  const otpValidationSchema = Yup.object({
    otp: Yup.string()
      .matches(/^\d{4,8}$/, strings.invalidOtp || 'Invalid code format')
      .required(strings.requiredField || 'Required'),
  });

  // Request OTP code
  const handleRequestOtp = async (values: { target: string }) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setDeliveryTarget(values.target);
    
    try {
      const success = await onOtpRequest(deliveryMethod, values.target);
      
      if (success) {
        setOtpSent(true);
      } else {
        setErrorMessage(strings.otpRequestFailed || 'Failed to send verification code');
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

  // Verify OTP code
  const handleVerifyOtp = async (values: { otp: string }) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      const response = await onSubmit({
        username: deliveryTarget,
        otp: values.otp,
      });
      
      if (!response.success) {
        setErrorMessage(response.message || config.errorHandling?.onFailureMessage || 'Verification failed');
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

      {!otpSent ? (
        <>
          {otpDelivery.length > 1 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div 
                style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  justifyContent: 'center',
                  borderBottom: '1px solid #cbd2d6',
                  marginBottom: '1rem',
                }}
              >
                {otpDelivery.includes('email') && (
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('email')}
                    style={{
                      flex: 1,
                      padding: '0.75rem 0',
                      background: 'none',
                      color: deliveryMethod === 'email' ? primaryColor : '#666',
                      border: 'none',
                      borderBottom: deliveryMethod === 'email' ? `3px solid ${primaryColor}` : 'none',
                      cursor: 'pointer',
                      fontWeight: deliveryMethod === 'email' ? 700 : 400,
                      fontSize: '0.9375rem',
                    }}
                  >
                    {strings.emailOption || 'Email'}
                  </button>
                )}
                {otpDelivery.includes('sms') && (
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('sms')}
                    style={{
                      flex: 1,
                      padding: '0.75rem 0',
                      background: 'none',
                      color: deliveryMethod === 'sms' ? primaryColor : '#666',
                      border: 'none',
                      borderBottom: deliveryMethod === 'sms' ? `3px solid ${primaryColor}` : 'none',
                      cursor: 'pointer',
                      fontWeight: deliveryMethod === 'sms' ? 700 : 400,
                      fontSize: '0.9375rem',
                    }}
                  >
                    {strings.smsOption || 'Text message'}
                  </button>
                )}
              </div>
            </div>
          )}

          <Formik
            initialValues={{ target: '' }}
            validationSchema={deliveryMethod === 'email' ? emailValidationSchema : phoneValidationSchema}
            onSubmit={handleRequestOtp}
          >
            {({ isSubmitting: formikSubmitting }) => (
              <Form style={{ width: '100%' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <Field
                    id="target"
                    name="target"
                    type={deliveryMethod === 'email' ? 'email' : 'tel'}
                    placeholder={deliveryMethod === 'email' ? emailPlaceholder : phonePlaceholder}
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
                  <ErrorMessage
                    name="target"
                    render={(msg) => (
                      <div style={{ color: '#c72e2e', fontSize: '0.8125rem', marginTop: '0.25rem', fontWeight: 400 }}>
                        {msg}
                      </div>
                    )}
                  />
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
                  {isSubmitting || formikSubmitting ? 'Sending...' : requestOtpText}
                </button>
              </Form>
            )}
          </Formik>
        </>
      ) : (
        <>
          <p style={{ 
            marginBottom: '1.5rem', 
            textAlign: 'center',
            fontSize: '0.9375rem',
            color: '#2c2e2f',
          }}>
            {strings.otpSentMessage || `We've sent a verification code to ${deliveryTarget}`}
          </p>

          <Formik
            initialValues={{ otp: '' }}
            validationSchema={otpValidationSchema}
            onSubmit={handleVerifyOtp}
          >
            {({ isSubmitting: formikSubmitting }) => (
              <Form style={{ width: '100%' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <Field
                    id="otp"
                    name="otp"
                    type="text"
                    placeholder={otpPlaceholder}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      fontSize: '1.125rem',
                      border: '1px solid #9da3a6',
                      borderRadius: '0.25rem',
                      boxSizing: 'border-box',
                      letterSpacing: '0.2em',
                      outline: 'none',
                    }}
                  />
                  <ErrorMessage
                    name="otp"
                    render={(msg) => (
                      <div style={{ color: '#c72e2e', fontSize: '0.8125rem', marginTop: '0.25rem', fontWeight: 400 }}>
                        {msg}
                      </div>
                    )}
                  />
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
                  {isSubmitting || formikSubmitting ? 'Verifying...' : submitButtonText}
                </button>

                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: primaryColor,
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      textDecoration: 'underline',
                      fontFamily: 'inherit',
                      padding: 0,
                    }}
                  >
                    {strings.resendOtp || 'Resend code'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </>
      )}

      {onSwitchToPassword && (
        <div style={{ 
          borderTop: '1px solid #cbd2d6',
          paddingTop: '1rem',
          marginTop: '1rem',
          textAlign: 'center'
        }}>
          <button
            onClick={onSwitchToPassword}
            style={{
              background: 'none',
              border: 'none',
              color: primaryColor,
              cursor: 'pointer',
              fontSize: '0.875rem',
              textDecoration: 'none',
              padding: 0,
              fontFamily: 'inherit',
            }}
          >
            {backToLoginText}
          </button>
        </div>
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

export default OtpLogin; 