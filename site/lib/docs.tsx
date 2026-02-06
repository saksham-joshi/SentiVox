import { VALUES } from "./values";
import { JSON_KEYS } from "./keys";

export const DOCS = {

    apiUrl : VALUES.ANALYZER_API,

    description: "SentiVox's API provide 10,000 free tokens daily providing simple, fast, mulitlingual and accurate package to perform sentiment analysis on the text along with a word cloud.",

    SUPPORTED_LANGS: [
        "English",
        "Hindi",
        "Marathi",
        // "Bengali",
        // "Kannada",
        // "Gujarati",
        // "Punjabi",
        "Tamil",
        // "Telugu",
        // "Urdu",
    ],

    GITHUB_REPO: VALUES.GITHUB_REPO,

    ENDPOINTS: {
        endpoints: {
            "/" : "GET - Returns the description of the API",
            "/cf/single": "POST - Context free analysis of a single comment",
            "/cf/batch": "POST - Context free analysis of multiple comments",
            "/health": "GET - Health check",
            "/docs": "GET - Documentations",
            "/langs": "GET - Supported languages",
            "/tokenize": "POST- Tokenizes the text",
            "/tokenCount": "POST - Returns the remaining tokens associated with your API Key"
        },

        utility: {
            "Tokenization": {
                endpoint: "/tokenize",
                method: "POST",
                description: "Divides/tokenizes the text into a list of tokens",
                format: {
                    [JSON_KEYS.apiKey]: "string - Your API key",
                    [JSON_KEYS.comment]: "text to tokenize",
                },
            },
            "Token Count" : {
                endpoint: "/tokenCount",
                method: "POST",
                description: "Returns the remaining tokens associated with your API Key",
                format: {
                    [JSON_KEYS.apiKey]: "string - Your API key",
                },
            },
            "Languages" : {
                endpoint: "/langs",
                method: "GET",
                description: "Returns the list of all supported languages",
            },
            "Documentation" : {
                endpoint: "/docs",
                method: "GET",
                description: "Returns the HTML of OpenAPI (swagger) documentation",
            },
            "Health" : {
                endpoint: "/health",
                method: "GET",
                description: "Returns the health of the API",
            }
        },

        "context-free-analysis": {
            description:
                "Context-free sentiment analysis ignores contextual variations and instead relies primarily on keyword-based or rule-based detection of sentiment. It typically uses predefined lexicons or bag-of-words models to classify text as positive, negative, or neutral, without considering grammar, irony, or surrounding context. Although simpler and faster, it can lead to misinterpretation when word meanings shift with context.",

            "single-comment-analysis": {
                endpoint: "/cf/single",
                method: "POST",
                format: {
                    [JSON_KEYS.apiKey]: "string - Your API key",
                    [JSON_KEYS.comment]: "text to analyze",
                },
            },

            "batch-comment-analysis": {
                endpoint: "/cf/batch",
                method: "POST",
                format: {
                    [JSON_KEYS.apiKey]: "string - Your API key",
                    [JSON_KEYS.commentList]: ["comment1", "comment2", "..."],
                },
            },
        },

        "context-based-analysis": {
            description:
                "Context-based sentiment analysis takes into account contextual variations and surrounding context to determine sentiment. It often uses machine learning models or rule-based systems to analyze text, taking into account grammar, irony, and surrounding context. This approach is more accurate but can be more complex and slower.",
            endpoints: `We are raising funds for providing support for context-based analysis because it requires powerful infrastructure. If you want to invest, please mail me at ${VALUES.APP_AUTHOR[0].email}`,
        }
    },
} as const;