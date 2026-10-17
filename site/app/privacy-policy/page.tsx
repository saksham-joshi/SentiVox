import { VALUES } from '@/lib/values'
import { memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Shield,
  Database,
  Lock,
  Eye,
  FileText,
  Server,
  Globe,
  Cookie,
  UserCheck,
  AlertTriangle,
  ScrollText,
  Share2,
  Calendar,
  Contact,
  CheckCircle2,
  LucideIcon,
} from 'lucide-react'

function PrivacyPolicyPage() {
  const policy = VALUES.PRIVACY_POLICY

  const iconMap: Record<string, LucideIcon> = {
    Introduction: Shield,
    'Information We Collect': Database,
    'How We Use Your Information': Eye,
    'Data Storage and Security': Lock,
    'Data Sharing and Disclosure': Share2,
    'Your Rights and Choices': UserCheck,
    'Cookies and Tracking': Cookie,
    "Children's Privacy": AlertTriangle,
    'International Data Transfers': Globe,
    'Data Retention': Server,
    'Changes to This Privacy Policy': ScrollText,
    'Third-Party Services': FileText,
    'Your California Privacy Rights (CCPA)': FileText,
    'European Users (GDPR)': Globe,
    'Contact Us': Contact,
    Consent: CheckCircle2,
  }

  return (
    <div className="min-h-screen py-8 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-10">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-2">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            {policy.title}
          </h1>
          <div className="flex items-center justify-center gap-2 text-foreground-muted text-xs font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <p>Last Updated: {policy.lastUpdated}</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-6">
          {policy.content.map((section, idx) => {
            const Icon = iconMap[section.heading] || FileText

            return (
              <Card key={idx} className="glass border-border/60 shadow-xl">
                <CardHeader className="pb-3 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                      <Icon className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl text-foreground font-semibold">
                      {section.heading}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground-secondary leading-relaxed pt-4 text-sm">
                  {typeof section.content === 'string' ? (
                    <p>{section.content}</p>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {section.content.map((subsection, subIdx) => (
                        <div
                          key={subIdx}
                          className={`
                            rounded-xl p-4 bg-surface/50 border border-border/40
                            ${section.content.length === 1 ? 'sm:col-span-2' : ''}
                          `}
                        >
                          <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {subsection.subHeading}
                          </h3>

                          {subsection.subContent.description && (
                            <p className="mb-2.5 text-xs text-foreground-muted">
                              {subsection.subContent.description}
                            </p>
                          )}

                          {'list' in subsection.subContent && (
                            <ul className="space-y-2">
                              {subsection.subContent.list.map(
                                (item, itemIdx) => (
                                  <li
                                    key={itemIdx}
                                    className="text-xs flex items-start gap-2 bg-surface/60 p-2.5 rounded-lg border border-border/30"
                                  >
                                    <div className="mt-1 min-w-1 h-1 rounded-full bg-primary" />
                                    <div>
                                      <strong className="text-foreground font-medium block mb-0.5">
                                        {item.title}
                                      </strong>
                                      <span className="text-foreground-muted">
                                        {item.description}
                                      </span>
                                    </div>
                                  </li>
                                )
                              )}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Footer Note */}
        <div className="text-center text-xs text-foreground-muted pt-4">
          <p>
            If you have any questions about this policy, please contact us at{' '}
            <a
              href="mailto:social.sakshamjoshi@gmail.com"
              className="text-primary hover:underline font-medium"
            >
              social.sakshamjoshi@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default memo(PrivacyPolicyPage)

export const dynamic = 'error'
