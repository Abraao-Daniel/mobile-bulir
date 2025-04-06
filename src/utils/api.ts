import { getAuthToken } from "./auth"

const API_BASE_URL = "http://localhost:3004/api" // ou usar .env se quiser

interface ApiOptions {
  method?: string
  body?: any
  headers?: Record<string, string>
}

export async function fetchApi<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const token = await getAuthToken()

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer jdhfjasjhsakjhdjsa`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || "An error occurred")
  }

  return response.json()
}
