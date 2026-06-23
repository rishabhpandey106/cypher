import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <title>Verify Your Account</title>

        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTcviYwY.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>Your verification code is {otp}</Preview>

      <Section
        style={{
          backgroundColor: '#f5f5f5',
          padding: '48px 24px',
        }}
      >
        <Section
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            border: '4px solid #000',
            padding: '40px',
          }}
        >
          <Text
            style={{
              margin: 0,
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            ACCOUNT VERIFICATION
          </Text>

          <Heading
            style={{
              fontSize: '40px',
              lineHeight: 1,
              fontWeight: 900,
              color: '#000',
              margin: '16px 0 24px',
            }}
          >
            Verify your account.
          </Heading>

          <Text
            style={{
              fontSize: '18px',
              color: '#111',
              marginBottom: '24px',
            }}
          >
            Hey <strong>{username}</strong>,
          </Text>

          <Text
            style={{
              fontSize: '16px',
              lineHeight: '28px',
              color: '#333',
            }}
          >
            Use the verification code below to complete your signup.
          </Text>

          {/* OTP BLOCK */}
          <Section
            style={{
              border: '4px solid #000',
              backgroundColor: '#fff200',
              margin: '32px 0',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <Text
              style={{
                margin: 0,
                fontSize: '42px',
                fontWeight: 900,
                letterSpacing: '10px',
                color: '#000',
              }}
            >
              {otp}
            </Text>
          </Section>

          <Button
            href={`https://yourdomain.com/verify/${username}`}
            style={{
              backgroundColor: '#000',
              color: '#fff',
              padding: '16px 32px',
              fontWeight: 700,
              border: '3px solid #000',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Verify Account →
          </Button>

          <Text
            style={{
              marginTop: '32px',
              fontSize: '14px',
              color: '#666',
              lineHeight: '24px',
            }}
          >
            This code expires in 10 minutes.
          </Text>

          <Text
            style={{
              fontSize: '14px',
              color: '#666',
              lineHeight: '24px',
            }}
          >
            If you didn't request this email, you can safely ignore it.
          </Text>

          <Section
            style={{
              marginTop: '40px',
              borderTop: '2px solid #000',
              paddingTop: '20px',
            }}
          >
            <Text
              style={{
                fontSize: '12px',
                color: '#666',
                margin: 0,
              }}
            >
              © 2026 Cypher. All rights reserved.
            </Text>
          </Section>
        </Section>
      </Section>
    </Html>
  );
}