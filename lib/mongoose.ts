import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'

let MONGODB_URI = process.env.MONGODB_URI

function stripQuotes(s: string) {
  return s.replace(/^\s*["']?/, '').replace(/["']?\s*$/, '')
}
// If MONGODB_URI is not set in env, try to load from .env.local (dev helper)
if (!MONGODB_URI) {
  try {
    const envFiles = ['.env.local', '.local.env']
    for (const fname of envFiles) {
      const envPath = path.join(process.cwd(), fname)
      if (!fs.existsSync(envPath)) continue
      const content = fs.readFileSync(envPath, 'utf8')
      const match = content.split(/\r?\n/).find((l) => l.trim().startsWith('MONGODB_URI='))
      if (match) {
        const [, val] = match.split(/=/)
        if (val !== undefined) {
          MONGODB_URI = stripQuotes(val)
          break
        }
      }
    }
  } catch (e) {
    // ignore; we'll surface an error when trying to connect
  }
}

let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } = (global as any)._mongoose || { conn: null, promise: null }
if (!cached) (global as any)._mongoose = cached

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined. Please set MONGODB_URI in .env.local or process.env')
    throw new Error('Please define the MONGODB_URI environment variable in .env.local')
  }

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
