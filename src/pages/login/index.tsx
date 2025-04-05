import React, { useState } from 'react'
import { Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import styles from './style'
import { fetchApi } from '../../utils/api'
import { setAuthToken } from '../../utils/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      const response = await fetchApi<{ token: string }>('/auth/login', {
        method: 'POST',
        body: {
          email,
          password,
        },
      })

      await setAuthToken(response.token)
      Alert.alert('Sucesso', 'Login realizado com sucesso!')
      // Aqui você pode navegar para a tela principal, se estiver usando React Navigation
    } catch (err: any) {
      console.error("Erro ao fazer login:", err.message)
      Alert.alert('Erro', err.message || 'Não foi possível fazer login.')
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.textTitle}>Login</Text>
        <Text style={styles.text}>Acesse sua conta</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.text}>Email</Text>
        <TextInput
          placeholder="Digite seu email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.text}>Senha</Text>
        <TextInput
          placeholder="Digite sua senha"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  )
}
