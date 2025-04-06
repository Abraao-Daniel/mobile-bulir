import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native'
import { fetchApi } from '../../utils/api'
import { getUserInfo, User } from '../../utils/auth'
import { useNavigation } from '@react-navigation/native'
import AuthMiddleware from '../AuthMiddleware'
interface Service {
  id: number
  name: string
  description: string
  price: number
}

export default function Services() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [services, setServices] = useState<Service[]>([])
  const [user, setUser] = useState<User | null>(null)

  const navigation = useNavigation()

  useEffect(() => {
    const init = async () => {
      const userData = await getUserInfo()
      setUser(userData)
      loadServices()
    }

    init()
  }, [])

  const loadServices = async () => {
    try {
      const data = await fetchApi<Service[]>('/services', { method: 'GET' })
      setServices(data)
    } catch (error: any) {
      console.error('Erro ao carregar serviços:', error.message)
    }
  }

  const handleCreateService = async () => {
    if (!name || !description || !price) {
      return Alert.alert('Erro', 'Preencha todos os campos')
    }

    try {
      if (!user || user.userType !== 'provider') {
        return Alert.alert('Erro', 'Apenas prestadores podem criar serviços')
      }

      await fetchApi('/services', {
        method: 'POST',
        body: {
          name,
          description,
          price: parseFloat(price),
          user: user.id,
        },
      })

      setName('')
      setDescription('')
      setPrice('')
      Alert.alert('Sucesso', 'Serviço criado com sucesso!')
      loadServices()
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao criar serviço')
    }
  }

  const handleServicePress = (serviceId: number) => {
    if (user?.userType === 'client') {
      navigation.navigate('Agendar', { serviceId })
    }
  }

  return (
    <AuthMiddleware>
    <View style={styles.container}>
      {user?.userType === 'provider' && (
        <>
          <Text style={styles.title}>Criar Serviço</Text>

          <TextInput
            placeholder="Nome do serviço"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            placeholder="Descrição"
            style={[styles.input, { height: 80 }]}
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <TextInput
            placeholder="Preço (AOA)"
            style={styles.input}
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          <TouchableOpacity style={styles.button} onPress={handleCreateService}>
            <Text style={styles.buttonText}>Adicionar Serviço</Text>
          </TouchableOpacity>
        </>
      )}

      <Text style={styles.subtitle}>
        {user?.userType === 'provider' ? 'Seus Serviços' : 'Serviços Disponíveis'}
      </Text>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            disabled={user?.userType === 'provider'}
            onPress={() => handleServicePress(item.id)}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
            <Text style={styles.cardPrice}>AOA {item.price.toFixed(2)}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
    </AuthMiddleware>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#4CAF50',
  },
})
