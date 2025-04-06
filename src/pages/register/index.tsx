import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import { fetchApi } from '../../utils/api'
import { useNavigation } from '@react-navigation/native'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [nif, setNif] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState<'client' | 'provider' | null>(null)

  const navigation = useNavigation()

  const handleRegister = async () => {
    if (!fullName || !nif || !email || !password || !userType) {
      return Alert.alert('Erro', 'Preencha todos os campos')
    }

    try {
      await fetchApi('/users', {
        method: 'POST',
        body: {
          fullName,
          nif,
          email,
          password,
          userType,
        },
      })

      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!')
      navigation.navigate('Login')
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao registrar')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <TextInput
        placeholder="Nome Completo"
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        placeholder="NIF"
        style={styles.input}
        keyboardType="numeric"
        value={nif}
        onChangeText={setNif}
      />

      <TextInput
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Senha"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <RNPickerSelect
        
        onValueChange={(value) => setUserType(value)}
        placeholder={{ label: 'Selecione o tipo de usuário', value: null }}
        items={[
          { label: 'Cliente', value: 'client' },
          { label: 'Prestador de Serviço', value: 'provider' },
        ]}
        style={pickerSelectStyles}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>Já tem conta? Entrar</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    marginTop: 20,
    textAlign: 'center',
    color: '#555',
    textDecorationLine: 'underline',
  },
})

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 12,
    color: '#000',
  
  },
  inputAndroid: {
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 12,
    color: '#000',
  },
}
