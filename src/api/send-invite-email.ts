import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create email transporter
const transporter = nodemailer.createTransport({
  host: 'mail.newsflix.fr',
  port: 465,
  secure: true,
  auth: {
    user: 'contact@easyrent.newsflix.fr',
    pass: 'enzo789luigiNE&.',
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, firstName, propertyAddress, inviteLink } = req.body;

    // Input validation
    if (!email || !firstName || !propertyAddress || !inviteLink) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify temp tenant exists and invite is valid
    const { data: tempTenant, error: tempTenantError } = await supabase
      .from('temp_tenants')
      .select('*')
      .eq('email', email)
      .eq('status', 'pending')
      .single();

    if (tempTenantError || !tempTenant) {
      return res.status(404).json({ error: 'Invalid invite' });
    }

    // Send email using SMTP
    await transporter.sendMail({
      from: '"EasyRent" <contact@easyrent.newsflix.fr>',
      to: email,
      subject: `Welcome to EasyRent - Complete Your Tenant Profile`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to EasyRent, ${firstName}!</h2>
          
          <p>You've been invited to become a tenant at:</p>
          <p style="font-weight: bold; margin: 20px 0;">${propertyAddress}</p>
          
          <p>To complete your tenant profile and review your lease details, please click the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" style="
              background-color: #0070f3;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 5px;
              display: inline-block;
            ">
              Complete Your Profile
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            This invite link will expire in 7 days. If you believe this was sent in error,
            please ignore this email.
          </p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
          
          <p style="color: #666; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} EasyRent. All rights reserved.
          </p>
        </div>
      `,
    });

    return res.status(200).json({ message: 'Invite sent successfully' });
  } catch (error: any) {
    console.error('Error sending invite:', error);
    return res.status(500).json({ error: 'Failed to send invite' });
  }
}
