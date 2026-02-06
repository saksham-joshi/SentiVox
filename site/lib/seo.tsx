import {VALUES} from './values';

export const SEO = {
    robots : {
        index: true,
        follow: true
    },
    author : {
        url: VALUES.APP_AUTHOR[0].portfolio,
        name: VALUES.APP_AUTHOR[0].name,
    },
    keywords : "sentivox,senti vox,senti-vox,sentiment,sentiment analysis,free sentiment analysis api",
    creator : VALUES.APP_AUTHOR[0].name,
    publisher: VALUES.APP_AUTHOR[0].name,
    manifest: VALUES.APP_URL + "/manifest.json",
    openGraph: {
        type: "website",
        url: VALUES.APP_URL,
        title: VALUES.APP_NAME,
        description : VALUES.APP_DESCRIPTION,
        siteName : VALUES.APP_NAME,
        images : VALUES.APP_URL + "/og.png"
    },
    appleWebApp: {
        capable: true,
        title: VALUES.APP_NAME,
        statusBarStyle: "black-translucent"
    },
    formatDetection: {
        telephone: false
    },
    abstract : VALUES.APP_SHORT_DESCRIPTION,
    assets : "/",
    category: "Software as a Service",
    twitter: {
        card: "summary_large_image",
        site: VALUES.APP_URL,
        creator: VALUES.APP_AUTHOR[0].portfolio,
        images: "/og.png"
    }
} as const;