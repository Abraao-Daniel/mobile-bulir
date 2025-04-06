// components/AuthMiddleware.tsx
import React, { useEffect } from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { getUserInfo } from '../utils/auth'

export default function AuthMiddleware({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation()

  useEffect(() => {
    // const checkAuth = async () => {
    //   const user = await getUserInfo()
    //   if (!user.email) {
    //     navigation.navigate('Login')
    //   }
    // }

    // checkAuth()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      {children}
    </View>
  )
}
