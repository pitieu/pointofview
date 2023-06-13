import { env } from "@/env.mjs"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = env.SUPABASE_URL
const supabaseKey = env.SUPABASE_API_KEY || ""
export const supabase = createClient(supabaseUrl, supabaseKey)