import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import { nanoid } from 'nanoid'

const TTL_SECONDS = 30 * 24 * 60 * 60 // 30 days

function getRedis() {
  const url = process.env['UPSTASH_REDIS_REST_URL']
  const token = process.env['UPSTASH_REDIS_REST_TOKEN']
  if (!url || !token) throw new Error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN')
  return new Redis({ url, token })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(204).end()

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const diagram = req.body
  if (!diagram || typeof diagram !== 'object') {
    return res.status(400).json({ error: 'Invalid diagram' })
  }

  try {
    const redis = getRedis()
    const id = nanoid(10)
    await redis.set(`share:${id}`, diagram, { ex: TTL_SECONDS })
    return res.status(201).json({ id })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return res.status(500).json({ error: msg })
  }
}
