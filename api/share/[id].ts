import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

const TTL_SECONDS = 30 * 24 * 60 * 60 // 30 days
const redis = Redis.fromEnv()

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(204).end()

  const { id } = req.query
  if (typeof id !== 'string' || !id) {
    return res.status(400).json({ error: 'Invalid id' })
  }

  try {
    if (req.method === 'GET') {
      const diagram = await redis.get(`share:${id}`)
      if (!diagram) {
        return res.status(404).json({ error: 'Not found or expired' })
      }
      return res.status(200).json(diagram)
    }

    if (req.method === 'PUT') {
      const diagram = req.body
      if (!diagram || typeof diagram !== 'object') {
        return res.status(400).json({ error: 'Invalid diagram' })
      }
      await redis.set(`share:${id}`, diagram, { ex: TTL_SECONDS })
      return res.status(200).json({ ok: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return res.status(500).json({ error: msg })
  }
}
