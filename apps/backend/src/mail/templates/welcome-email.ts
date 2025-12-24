export default function WelcomeEmail(data: {
  email: string;
  password: string;
  ctaLink: string;
  ctaText: string;
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Welcome to TravelEase!</title>
    <style type="text/css">
        /* Reset styles */
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }
        
        /* Client-specific styles */
        .ReadMsgBody { width: 100%; }
        .ExternalClass { width: 100%; }
        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
            line-height: 100%;
        }
        
        /* Mobile styles */
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                max-width: 100% !important;
            }
            .mobile-padding {
                padding-left: 20px !important;
                padding-right: 20px !important;
            }
            .mobile-center {
                text-align: center !important;
            }
            .mobile-hide {
                display: none !important;
            }
            .cta-button {
                width: 100% !important;
                display: block !important;
            }
            .credentials-box {
                padding: 15px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <!-- Wrapper table -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <!-- Main container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="container" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    
                    <!-- Header with travel banner -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 0; position: relative;">
                            <!-- Travel-themed header background -->
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 0; text-align: center; position: relative; overflow: hidden;">
                                <!-- Mountain silhouettes -->
                                <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 80px; background: linear-gradient(to right, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 20%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.05) 60%, rgba(255,255,255,0.1) 80%, rgba(255,255,255,0.05) 100%); clip-path: polygon(0% 100%, 15% 60%, 30% 80%, 45% 40%, 60% 70%, 75% 30%, 90% 60%, 100% 50%, 100% 100%);"></div>
                                
                                <!-- Clouds -->
                                <div style="position: absolute; top: 20px; left: 100px; width: 60px; height: 20px; background: rgba(255,255,255,0.2); border-radius: 20px;"></div>
                                <div style="position: absolute; top: 15px; left: 120px; width: 40px; height: 15px; background: rgba(255,255,255,0.2); border-radius: 15px;"></div>
                                <div style="position: absolute; top: 25px; right: 150px; width: 50px; height: 18px; background: rgba(255,255,255,0.2); border-radius: 18px;"></div>
                                
                                <!-- Logo -->
                                <div style="position: relative; z-index: 10; margin-bottom: 20px;">
                                    <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.95); padding: 12px 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                                        <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #667eea; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                            ✈️ TravelEase
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Main content -->
                    <tr>
                        <td class="mobile-padding" style="padding: 40px 50px;">
                            <!-- Welcome heading -->
                            <h2 style="margin: 0 0 20px 0; font-size: 32px; font-weight: bold; color: #1a202c; text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                Welcome to TravelEase! 🎉
                            </h2>
                            
                            <!-- Welcome message -->
                            <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.6; color: #4a5568; text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                Thank you for booking your first trip with us and joining the TravelEase community! We're excited to help you create unforgettable travel experiences.
                            </p>
                            
                            <!-- Account creation notice -->
                            <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #4a5568; text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                Your TravelEase account has been automatically created to help you manage your bookings and discover new destinations.
                            </p>
                            
                            <!-- Login credentials box -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px 0;">
                                <tr>
                                    <td>
                                        <div class="credentials-box" style="background-color: #f7fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 25px; text-align: center;">
                                            <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: bold; color: #2d3748; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                                🔐 Your Login Credentials
                                            </h3>
                                            
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                <tr>
                                                    <td style="padding: 10px 0; text-align: left;">
                                                        <strong style="font-size: 16px; color: #2d3748; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Email:</strong>
                                                    </td>
                                                    <td style="padding: 10px 0; text-align: right;">
                                                        <span style="font-size: 16px; color: #667eea; font-weight: 600; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${data?.email}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 10px 0; text-align: left;">
                                                        <strong style="font-size: 16px; color: #2d3748; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Temporary Password:</strong>
                                                    </td>
                                                    <td style="padding: 10px 0; text-align: right;">
                                                        <span style="font-size: 16px; color: #667eea; font-weight: 600; font-family: 'Courier New', monospace; background-color: #edf2f7; padding: 4px 8px; border-radius: 4px;">${data?.password}</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Password change notice -->
                            <p style="margin: 0 0 30px 0; font-size: 14px; line-height: 1.5; color: #718096; text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                You can log in and change your password anytime from your dashboard for added security.
                            </p>
                            
                            <!-- CTA Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="${data.ctaLink}" class="cta-button" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 18px; font-weight: bold; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); transition: all 0.3s ease; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                            🚀 ${data.ctaText}
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Help section -->
                            <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.5; color: #718096; text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                Need help? Visit our <a href="https://TravelEase.com/help" style="color: #667eea; text-decoration: none; font-weight: 600;">Help Center</a> or contact us at <a href="mailto:support@TravelEase.com" style="color: #667eea; text-decoration: none; font-weight: 600;">support@TravelEase.com</a>.
                            </p>
                            
                            <!-- Sign off -->
                            <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a5568; text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                Happy travels,<br>
                                <strong style="color: #2d3748;">— The TravelEase Team</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f7fafc; padding: 30px 50px; border-top: 1px solid #e2e8f0;" class="mobile-padding">
                        
                            <!-- Copyright -->
                            <p style="margin: 0; font-size: 12px; color: #a0aec0; text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                © 2025 TravelEase. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
}
