'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0066cc 0%, #004fa3 50%, #003d82 100%)',
        position: 'relative',
        padding: '20px',
      }}
    >
      {/* Agilix Branding */}
      <div
        style={{
          position: 'absolute',
          top: '40px',
          left: '40px',
          zIndex: 20,
        }}
      >
        <h1
          style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#0066cc',
            margin: '0',
            textShadow: '0 2px 8px rgba(255, 255, 255, 0.1)',
            letterSpacing: '-0.5px',
          }}
        >
          Agilix
        </h1>
      </div>

      {/* Clerk SignUp Component */}
      <SignUp />
    </div>
  );
}
