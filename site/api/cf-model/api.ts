'use server'

import { DOCS } from '@/lib/docs'
import { VALUES } from '@/lib/values'
import { JSON_KEYS } from '@/lib/keys'
import { getSession } from '@/lib/session'
import { getApiKey } from '@/db/pg'

const API_URL = VALUES.ANALYZER_API
const ENDPOINTS = {
  SINGLE_COMMENT_ANALYSIS:
    DOCS.ENDPOINTS['context-free-analysis']['single-comment-analysis'].endpoint,
  HEALTH_CHECK: DOCS.ENDPOINTS.utility.Health.endpoint,
}

export interface AnalysisResult {
  sentiment: 'Positive' | 'Negative' | 'Neutral'
  polarity_score: number
  positive_score: number
  negative_score: number
  keywords: { [key: string]: number }
  positive_words: string[]
  negative_words: string[]
  unidentified_words: string[]
  word_cloud?: string
  originalText: string
}

function createSingleCommentAnalysisRequestBody(
  __comment: string,
  __apiKey: string
) {
  return {
    [JSON_KEYS.apiKey]: __apiKey,
    [JSON_KEYS.comment]: __comment,
  }
}

function convertToAnalysisResult(__data: {
  [key: string]: any
}): AnalysisResult {
  return {
    sentiment: __data[JSON_KEYS.sentiment] || 'Neutral',
    polarity_score: __data[JSON_KEYS.polarityScore] || 0,
    positive_score: __data[JSON_KEYS.positiveScore] || 0,
    negative_score: __data[JSON_KEYS.negativeScore] || 0,
    keywords: __data[JSON_KEYS.keywords] || {},
    positive_words: __data[JSON_KEYS.positiveWords] || [],
    negative_words: __data[JSON_KEYS.negativeWords] || [],
    unidentified_words: __data[JSON_KEYS.unidentifiedWords] || [],
    word_cloud: __data[JSON_KEYS.wordCloud] || '',
    originalText: '',
  }
}

export async function analyzeSingleComment(
  __comment: string,
  __apiKey?: string
) {
  let activeApiKey = __apiKey

  if (!activeApiKey) {
    const session = await getSession()
    if (!session) {
      throw new Error('Authentication required to analyze text.')
    }
    activeApiKey = await getApiKey(session.email)
  }

  if (!activeApiKey) {
    throw new Error('API key not found. Please log in again.')
  }

  const __body = createSingleCommentAnalysisRequestBody(__comment, activeApiKey)
  const __response = await fetch(
    `${API_URL}${ENDPOINTS.SINGLE_COMMENT_ANALYSIS}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(__body),
    }
  )
  const __data = await __response.json()

  if (!__response.ok) {
    console.error(JSON.stringify(__data))
    throw new Error(__data.error || 'Failed to analyze text.')
  }

  if (__data[JSON_KEYS.error]) {
    throw new Error(__data[JSON_KEYS.error])
  }

  const result = convertToAnalysisResult(__data)
  result.originalText = __comment

  return result
}
