import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'

let MONGODB_URI = process.env.MONGODB_URI

function stripQuotes(s: string) {
  return s.replace(/^\s*["']?/, '').replace(/["']?\s*$/, '')
}

if (!MONGODB_URI) {
  // Try to load from .env.local as a fallback (useful in some dev setups)
  try {
    const envPath = path.join(process.cwd(), '.env.local')
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8')
      const match = content.split(/\r?\n/).find((l) => l.trim().startsWith('MONGODB_URI='))
      if (match) {
        const [, val] = match.split(/=/)
        if (val !== undefined) MONGODB_URI = stripQuotes(val)
      }
    }
  } catch (e) {
    // ignore and let the later check throw a helpful error
  }
}

console.log(MONGODB_URI ?? 'undefined', 'MONGODB_URI12')

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local')
}

let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } = (global as any)._mongoose || { conn: null, promise: null }

if (!cached) (global as any)._mongoose = cached

export async function connectToDatabase() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    const opts = {}
    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
      return mongoose
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}
