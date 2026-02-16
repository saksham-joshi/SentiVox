export const VALUES = {
  APP_NAME: "Senti-Vox",
  APP_SHORT_DESCRIPTION:
    "Multilingual + Free + Fast + Accurate Sentiment Analysis Site and API",
  APP_DESCRIPTION:
    "Using Senti-Vox, you can accurately and precisely analyze the sentiment of multilingual text",
  APP_URL: "https://sentivox.vercel.app", // don't put slash at the end
  APP_VERSION: "1.0.0",
  APP_GITHUB: "https://github.com/saksham-joshi/SentiVox",
  APP_AUTHOR: {
    0: {
      name: "SAKSHAM JOSHI",
      img: "/assets/author01.png",
      email: "social.sakshamjoshi@gmail.com",
      linkedin: "https://www.linkedin.com/in/sakshamjoshi27",
      github: "https://github.com/saksham-joshi",
      portfolio: "https://sakshamjoshi.vercel.app",
    },
    1: {
      name: "SUBHAM TIWARI",
      img: "/assets/author02.png",
      email: "subhamt958@gmail.com",
      linkedin: "https://www.linkedin.com/in/subham-tiwari-ab38971b4/",
      github: "https://github.com/W0nder0fy0u",
    },
  },
  ANALYZER_API: "https://senti-vox-api.onrender.com",
  REDIS_INTERFACE_API: "https://senti-vox-redis-interface.onrender.com",
  ALLOWED_EMAIL_DOMAINS: ["@gmail.com", "@outlook.com"],
  GITHUB_REPO: "https://github.com/saksham-joshi/SentiVox",
  PRIVACY_POLICY: {
    title: "Privacy Policy",
    route: "/privacy-policy",
    lastUpdated: "February 12, 2026",
    author: "SAKSHAM JOSHI",
    content: [
      {
        heading: "Introduction",
        content: "Welcome to Senti-Vox ('we,' 'our,' or 'us'). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our sentiment analysis API service. By using Senti-Vox, you agree to the collection and use of information in accordance with this policy."
      },
      {
        heading: "Information We Collect",
        content: [
          {
            subHeading: "Personal Information",
            subContent: {
              description: "We collect the following personal information:",
              list: [
                {
                  title: "Email Address",
                  description: "Used for account creation, authentication, and communication"
                },
                {
                  title: "Usage Data",
                  description: "API request counts and token usage"
                }
              ]
            }
          },
          {
            subHeading: "Content Data",
            subContent: {
              description: "How we handle your content:",
              list: [
                {
                  title: "Text for Analysis",
                  description: "Content you submit for sentiment analysis is processed in real-time and never stored on our servers"
                },
                {
                  title: "Analysis Results",
                  description: "Sentiment scores and metadata are returned to you but not permanently stored"
                }
              ]
            }
          },
          {
            subHeading: "Technical Information",
            subContent: {
              description: "We collect technical data for service operations:",
              list: [
                {
                  title: "Cookies",
                  description: "Essential cookies for session management and authentication"
                }
              ]
            }
          }
        ]
      },
      {
        heading: "How We Use Your Information",
        content: [
          {
            subHeading: "Primary Uses",
            subContent: {
              description: "We use your email address exclusively for:",
              list: [
                {
                  title: "Authentication",
                  description: "Sending One-Time Passwords (OTP) for secure login"
                },
                {
                  title: "Service Updates",
                  description: "Delivering important notifications and updates"
                },
                {
                  title: "Account Information",
                  description: "Communicating account-related information"
                },
                {
                  title: "Customer Support",
                  description: "Providing assistance when you need help"
                }
              ]
            }
          },
          {
            subHeading: "Service Operations",
            subContent: {
              description: "We use your data for:",
              list: [
                {
                  title: "API Key Management",
                  description: "Generating and validating API keys for authentication"
                },
                {
                  title: "Rate Limiting",
                  description: "Enforcing usage limits based on your plan"
                }
              ]
            }
          },
          {
            subHeading: "What We Do NOT Do",
            subContent: {
              description: "We never engage in the following practices:",
              list: [
                {
                  title: "No Selling or Sharing",
                  description: "We never sell, rent, or share your email with third parties"
                },
                {
                  title: "No Content Storage",
                  description: "We never store the content you submit for sentiment analysis"
                },
                {
                  title: "No AI Training",
                  description: "We never use your data for training AI models"
                },
                {
                  title: "No Spam",
                  description: "We never send marketing emails without your explicit consent"
                }
              ]
            }
          }
        ]
      },
      {
        heading: "Data Storage and Security",
        content: [
          {
            subHeading: "Storage Duration",
            subContent: {
              description: "We retain data for the following periods:",
              list: [
                {
                  title: "Email and Account Data",
                  description: "Stored until account deletion"
                },
                {
                  title: "API Keys",
                  description: "Stored securely with encryption"
                },
                {
                  title: "Usage Statistics",
                  description: "Aggregated data retained for service improvement"
                },
                {
                  title: "Analysis Content",
                  description: "Not stored - processed in real-time only"
                }
              ]
            }
          },
          {
            subHeading: "Security Measures",
            subContent: {
              description: "We implement industry-standard security practices:",
              list: [
                {
                  title: "Encryption in Transit",
                  description: "All data transmitted using TLS/SSL encryption"
                },
                {
                  title: "Encryption at Rest",
                  description: "Sensitive data encrypted in our databases"
                },
                {
                  title: "Secure Authentication",
                  description: "Passwords hashed using industry-standard algorithms"
                },
                {
                  title: "Regular Audits",
                  description: "Continuous security monitoring and updates"
                },
                {
                  title: "Access Controls",
                  description: "Strict access controls and monitoring"
                }
              ]
            }
          }
        ]
      },
      {
        heading: "Data Sharing and Disclosure",
        content: [
          {
            subHeading: "No Third-Party Sharing",
            subContent: {
              description: "Your email address and personal information are never shared with any third-party entities, advertisers, or partners."
            }
          },
          {
            subHeading: "Limited Disclosure",
            subContent: {
              description: "We may disclose your information only in the following circumstances:",
              list: [
                {
                  title: "Legal Requirements",
                  description: "When required by law, court order, or government regulation"
                },
                {
                  title: "Service Providers",
                  description: "Trusted infrastructure providers (e.g., email delivery, database hosting) operating under strict confidentiality agreements"
                },
                {
                  title: "Business Transfer",
                  description: "In the event of a merger, acquisition, or sale of assets (users will be notified)"
                },
                {
                  title: "Safety and Security",
                  description: "To protect our rights, property, safety, or that of our users"
                }
              ]
            }
          }
        ]
      },
      {
        heading: "Your Rights and Choices",
        content: [
          {
            subHeading: "Access and Control",
            subContent: {
              description: "You have the right to:",
              list: [
                {
                  title: "Access",
                  description: "Request a copy of your personal data"
                },
                {
                  title: "Correction",
                  description: "Update or correct inaccurate information"
                },
                {
                  title: "Deletion",
                  description: "Request deletion of your account and associated data"
                },
                {
                  title: "Export",
                  description: "Download your data in a portable format"
                },
                {
                  title: "Opt-Out",
                  description: "Unsubscribe from non-essential communications"
                }
              ]
            }
          }
        ]
      },
      {
        heading: "Cookies and Tracking",
        content: [
          {
            subHeading: "Essential Cookies",
            subContent: {
              description: "We use strictly necessary cookies for:",
              list: [
                {
                  title: "Session Management",
                  description: "Maintaining your logged-in state"
                },
                {
                  title: "Security",
                  description: "Fraud prevention and security measures"
                },
                {
                  title: "Service Functionality",
                  description: "Essential features and operations"
                }
              ]
            }
          },
          {
            subHeading: "No Tracking",
            subContent: {
              description: "We do not use:",
              list: [
                {
                  title: "Analytics Cookies",
                  description: "No analytics cookies without consent"
                },
                {
                  title: "Advertising Pixels",
                  description: "No advertising or tracking pixels"
                },
                {
                  title: "Cross-Site Tracking",
                  description: "No cross-site tracking technologies"
                }
              ]
            }
          }
        ]
      },
      {
        heading: "Children's Privacy",
        content: "Senti-Vox is not intended for users under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately at social.sakshamjoshi@gmail.com."
      },
      {
        heading: "International Data Transfers",
        content: "Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy and applicable laws."
      },
      {
        heading: "Data Retention",
        content: [
          {
            subHeading: "Retention Periods",
            subContent: {
              description: "We retain data for the following periods:",
              list: [
                {
                  title: "Account Data",
                  description: "Retained until account deletion or 2 years of inactivity"
                },
                {
                  title: "Usage Logs",
                  description: "Retained for 90 days for security and debugging purposes"
                },
                {
                  title: "Analysis Content",
                  description: "Not retained - deleted immediately after processing"
                }
              ]
            }
          }
        ]
      },
      {
        heading: "Changes to This Privacy Policy",
        content: "We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the updated policy on our website, sending an email notification to your registered address, and displaying a prominent notice on our service. Continued use of Senti-Vox after changes constitutes acceptance of the updated policy."
      },
      {
        heading: "Third-Party Services",
        content: [
          {
            subHeading: "Service Providers",
            subContent: {
              description: "Senti-Vox uses the following third-party services:",
              list: [
                {
                  title: "Email Delivery",
                  description: "For sending OTPs and notifications (subject to their privacy policies)"
                },
                {
                  title: "Infrastructure Providers",
                  description: "For hosting and database services (operating under strict data processing agreements)"
                }
              ]
            }
          },
          {
            subHeading: "Vendor Compliance",
            subContent: {
              description: "We carefully vet all service providers to ensure they maintain high privacy and security standards."
            }
          }
        ]
      },
      {
        heading: "Your California Privacy Rights (CCPA)",
        content: [
          {
            subHeading: "CCPA Rights",
            subContent: {
              description: "If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):",
              list: [
                {
                  title: "Right to Know",
                  description: "What personal information is collected"
                },
                {
                  title: "Right to Delete",
                  description: "Request deletion of personal information"
                },
                {
                  title: "Right to Opt-Out",
                  description: "Opt-out of the sale of personal information (Note: We do not sell personal information)"
                },
                {
                  title: "Right to Non-Discrimination",
                  description: "Non-discrimination for exercising your rights"
                }
              ]
            }
          }
        ]
      },
      {
        heading: "European Users (GDPR)",
        content: [
          {
            subHeading: "GDPR Rights",
            subContent: {
              description: "If you are located in the European Economic Area (EEA), you have rights under the General Data Protection Regulation (GDPR):",
              list: [
                {
                  title: "Right to Access",
                  description: "Access your personal data"
                },
                {
                  title: "Right to Rectification",
                  description: "Correct inaccurate data"
                },
                {
                  title: "Right to Erasure",
                  description: "Right to be forgotten"
                },
                {
                  title: "Right to Restrict Processing",
                  description: "Limit how we process your data"
                },
                {
                  title: "Right to Data Portability",
                  description: "Receive your data in a portable format"
                },
                {
                  title: "Right to Object",
                  description: "Object to processing of your data"
                },
                {
                  title: "Right to Complain",
                  description: "Lodge a complaint with a supervisory authority"
                }
              ]
            }
          },
          {
            subHeading: "Legal Basis for Processing",
            subContent: {
              description: "We process your data based on:",
              list: [
                {
                  title: "Contract Performance",
                  description: "Providing our services"
                },
                {
                  title: "Legitimate Interests",
                  description: "Security and fraud prevention"
                },
                {
                  title: "Consent",
                  description: "Where applicable and obtained"
                }
              ]
            }
          }
        ]
      },
      {
        heading: "Contact Us",
        content: "If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us at social.sakshamjoshi@gmail.com. We aim to respond to all inquiries within 5 business days."
      },
      {
        heading: "Consent",
        content: "By using Senti-Vox, you acknowledge that you have read and understood this Privacy Policy and consent to the collection, use, and disclosure of your information as described herein."
      }
    ]
  }
} as const ;
