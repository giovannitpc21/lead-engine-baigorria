// src/components/HCaptchaWrapper.tsx

import { useRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

interface HCaptchaWrapperProps {
  onVerify: (token: string) => void;
  onError?: () => void;
}

export const HCaptchaWrapper = ({ onVerify, onError }: HCaptchaWrapperProps) => {
  const captchaRef = useRef<HCaptcha>(null);
  const siteKey = import.meta.env.VITE_HCAPTCHA_SITE_KEY;

  if (!siteKey) {
    console.error('VITE_HCAPTCHA_SITE_KEY no está configurado');
    return null;
  }

  return (
    <div className="flex justify-center my-4">
      <HCaptcha
        ref={captchaRef}
        sitekey={siteKey}
        onVerify={onVerify}
        onError={onError}
        onExpire={() => {
          captchaRef.current?.resetCaptcha();
          if (onError) onError();
        }}
      />
    </div>
  );
};