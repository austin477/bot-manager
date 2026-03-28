import type { ModelId } from '@/types'

export async function runLLM(prompt: string, model: ModelId): Promise<string> {
  if (model === 'claude-opus-4-6' || model === 'claude-sonnet-4-6' || model === 'claude-haiku-4-5-20251001') {
    return runAnthropic(prompt, model)
  }
  if (model === 'gpt-4o') {
    return runOpenAI(prompt)
  }
  if (model === 'gemini-pro') {
    return runGoogle(prompt)
  }
  throw new Error(`Unknown model: ${model}`)
}

async function runAnthropic(prompt: string, model: string): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return 'Error: ANTHROPIC_API_KEY is not configured'

  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const client = new Anthropic({ apiKey: key })

  const message = await client.messages.create({
    model,
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })

  const block = message.content[0]
  return block.type === 'text' ? block.text : JSON.stringify(block)
}

async function runOpenAI(prompt: string): Promise<string> {
  const key = process.env.OPENAI_API_KEY
  if (!key) return 'Error: OPENAI_API_KEY is not configured'

  const OpenAI = (await import('openai')).default
  const client = new OpenAI({ apiKey: key })

  const completion = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
  })

  return completion.choices[0].message.content ?? ''
}

async function runGoogle(prompt: string): Promise<string> {
  const key = process.env.GOOGLE_AI_API_KEY
  if (!key) return 'Error: GOOGLE_AI_API_KEY is not configured'

  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  const genAI = new GoogleGenerativeAI(key)
  const genModel = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const result = await genModel.generateContent(prompt)
  return result.response.text()
}
