import AsyncStorage from "@react-native-async-storage/async-storage"
import { jwtDecode } from "jwt-decode"

export interface User {
  id: number
  fullName: string
  email: string
  nif: string
  userType: "client" | "provider"
}

interface DecodedToken {
  userId: number
  fullName: string
  email: string
  nif: string
  userType: "client" | "provider"
  iat: number
  exp: number
}

export const getAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem("token")
}

export const setAuthToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem("token", token)
  await setUserInfo()
}

export const removeAuthToken = async (): Promise<void> => {
  await AsyncStorage.removeItem("token")
  await removeUserInfo()
}

export const setUserInfo = async (): Promise<void> => {
  const token = await getAuthToken()
  if (!token) return

  try {
    const decoded = jwtDecode<DecodedToken>(token)
    const user: User = {
      id: decoded.userId,
      fullName: decoded.fullName,
      email: decoded.email,
      nif: decoded.nif,
      userType: decoded.userType,
    }
    await AsyncStorage.setItem("user", JSON.stringify(user))
  } catch (error) {
    console.error("Error saving user info:", error)
  }
}

export const getUserInfo = async (): Promise<User | null> => {
  const user = await AsyncStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

export const removeUserInfo = async (): Promise<void> => {
  await AsyncStorage.removeItem("user")
}

export const isTokenExpired = async (): Promise<boolean> => {
  const token = await getAuthToken()
  if (!token) return true

  try {
    const decoded = jwtDecode<DecodedToken>(token)
    const currentTime = Date.now() / 1000
    return decoded.exp < currentTime
  } catch (error) {
    console.error("Error checking token expiration:", error)
    return true
  }
}
