import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import styles from '../style'
import { fetchApi } from '../../utils/api'
import { setAuthToken } from '../../utils/auth'
import { useNavigation } from '@react-navigation/native'
import type { User } from '../../utils/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigation = useNavigation()

  const handleLogin = async () => {
    try {
      const response = await fetchApi<{ token: string; user: User }>('/login', {
        method: 'POST',
        body: { email, password },
      })
      await setAuthToken(response)
      Alert.alert('Sucesso', 'Login realizado com sucesso!')
      navigation.navigate('Home')
    } catch (err: any) {
      console.error("Erro ao fazer login:", err.message)
      Alert.alert('Erro', err.message || 'Não foi possível fazer login.')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>Login</Text>
      <Text style={styles.text}>Acesse sua conta</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Senha"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
       <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.loginLink}>Não tem conta? Cadastrar</Text>
      </TouchableOpacity>
    </View>
  )
}
