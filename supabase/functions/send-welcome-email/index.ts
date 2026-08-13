import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, name } = await req.json()

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set')
    }

    const emailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to TintPicks!</title>
          <style>
            body { 
              font-family: 'Inter', Arial, sans-serif; 
              line-height: 1.6; 
              color: #3F6C51; 
              background: linear-gradient(to bottom, #E7F2FA, #FDF8E3);
              margin: 0;
              padding: 20px;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: white; 
              border-radius: 16px; 
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }
            .header { 
              background: linear-gradient(135deg, #7AA0C4, #89B493); 
              padding: 40px 30px; 
              text-align: center; 
              color: white;
            }
            .header h1 { 
              margin: 0; 
              font-size: 28px; 
              font-weight: bold;
            }
            .content { 
              padding: 40px 30px; 
            }
            .feature {
              display: flex;
              align-items: center;
              margin: 20px 0;
              padding: 15px;
              background: #FDF8E3;
              border-radius: 8px;
            }
            .feature-icon {
              width: 40px;
              height: 40px;
              background: #E8A87C;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 15px;
              font-size: 20px;
            }
            .cta-button {
              display: inline-block;
              background: #89B493;
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 25px;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer { 
              padding: 30px; 
              text-align: center; 
              background: #F8FAFC; 
              color: #64748B;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to TintPicks, ${name}! 🎨</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your color journey starts here</p>
            </div>
            
            <div class="content">
              <h2 style="color: #3F6C51; margin-bottom: 20px;">Thank you for joining us!</h2>
              
              <p>Hi ${name},</p>
              
              <p>Welcome to TintPicks! I'm Tinti, your AI color companion, and I'm excited to help you discover the perfect colors for your wardrobe and lifestyle.</p>
              
              <p>Based on your onboarding preferences, here's what you can do right away:</p>
              
              <div class="feature">
                <div class="feature-icon">📸</div>
                <div>
                  <strong>Capture Colors:</strong> Use your camera to capture colors from anything that inspires you
                </div>
              </div>
              
              <div class="feature">
                <div class="feature-icon">🎨</div>
                <div>
                  <strong>Get Recommendations:</strong> Receive personalized color combinations based on your style
                </div>
              </div>
              
              <div class="feature">
                <div class="feature-icon">🛍️</div>
                <div>
                  <strong>Shop Your Colors:</strong> Find clothing and accessories that match your perfect palette
                </div>
              </div>
              
              <p>Ready to start exploring? Your personalized dashboard is waiting for you!</p>
              
              <div style="text-align: center;">
                <a href="${Deno.env.get('SITE_URL') || 'https://tintpicks.lovable.app'}" class="cta-button">
                  Start Exploring Colors →
                </a>
              </div>
              
              <p style="margin-top: 30px; font-style: italic; color: #64748B;">
                "Color is a power which directly influences the soul." - Wassily Kandinsky
              </p>
            </div>
            
            <div class="footer">
              <p>Happy color hunting!</p>
              <p>The TintPicks Team</p>
              <p style="margin-top: 20px; font-size: 12px;">
                If you have any questions, feel free to reach out to us. We're here to help!
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'TintPicks <welcome@tintpicks.app>',
        to: [email],
        subject: `Welcome to TintPicks, ${name}! Your color journey begins now 🎨`,
        html: emailContent,
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(`Failed to send email: ${error}`)
    }

    const data = await res.json()
    
    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error sending welcome email:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})