import { VALUES } from "@/lib/values";
import { memo } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
    CheckCircle2
} from "lucide-react";

function PrivacyPolicyPage() {
    const policy = VALUES.PRIVACY_POLICY;

    const iconMap: { [key: string]: any } = {
        "Introduction": Shield,
        "Information We Collect": Database,
        "How We Use Your Information": Eye,
        "Data Storage and Security": Lock,
        "Data Sharing and Disclosure": Share2,
        "Your Rights and Choices": UserCheck,
        "Cookies and Tracking": Cookie,
        "Children's Privacy": AlertTriangle,
        "International Data Transfers": Globe,
        "Data Retention": Server,
        "Changes to This Privacy Policy": ScrollText,
        "Third-Party Services": FileText,
        "Your California Privacy Rights (CCPA)": FileText,
        "European Users (GDPR)": Globe,
        "Contact Us": Contact,
        "Consent": CheckCircle2
    };

    return (
        <div className="min-h-screen py-12 lg:py-20 bg-background/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                {/* Header Section */}
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-4">
                        <Shield className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                        {policy.title}
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <p className="text-sm font-medium">
                            Last Updated: {policy.lastUpdated}
                        </p>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 gap-6">
                    {policy.content.map((section, idx) => {
                        const Icon = iconMap[section.heading] || FileText;

                        return (
                            <Card key={idx} className="border-muted/60 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/5 ring-1 ring-primary/10">
                                            <Icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <CardTitle className="text-xl sm:text-2xl text-foreground/90">
                                            {section.heading}
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                                    {typeof section.content === 'string' ? (
                                        <p className="text-base">{section.content}</p>
                                    ) : (
                                        <div className="grid gap-6 sm:grid-cols-2">
                                            {section.content.map((subsection, subIdx) => (
                                                <div
                                                    key={subIdx}
                                                    className={`
                            rounded-xl p-4 bg-muted/30 border border-muted/50
                            ${section.content.length === 1 ? 'sm:col-span-2' : ''}
                          `}
                                                >
                                                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                                                        {subsection.subHeading}
                                                    </h3>

                                                    {subsection.subContent.description && (
                                                        <p className="mb-3 text-sm">{subsection.subContent.description}</p>
                                                    )}

                                                    {"list" in subsection.subContent && (
                                                        <ul className="space-y-2.5">
                                                            {subsection.subContent.list.map((item, itemIdx) => (
                                                                <li key={itemIdx} className="text-sm flex items-start gap-2.5 bg-background/50 p-2.5 rounded-lg">
                                                                    <div className="mt-1 min-w-[4px] h-[4px] rounded-full bg-primary/40" />
                                                                    <span>
                                                                        <strong className="text-foreground/80 font-medium block mb-0.5">
                                                                            {item.title}
                                                                        </strong>
                                                                        <span className="opacity-90">{item.description}</span>
                                                                    </span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Footer Note */}
                <div className="mt-12 text-center text-sm text-muted-foreground">
                    <p>
                        If you have any questions about this policy, please context us at{" "}
                        <a href="mailto:social.sakshamjoshi@gmail.com" className="text-primary hover:underline font-medium">
                            social.sakshamjoshi@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default memo(PrivacyPolicyPage);