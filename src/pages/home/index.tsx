import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { getUserInfo, removeUserInfo , removeAuthToken } from '../../utils/auth' // Supondo que você tenha uma função para limpar os dados
import { useNavigation } from '@react-navigation/native'
import AuthMiddleware from '../AuthMiddleware'

export default function Home() {
  const [user, setUser] = useState(null)
  const navigation = useNavigation()

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getUserInfo()
      setUser(userData)
    }

    loadUser()
  }, [])

  const handleLogout = async () => {
    try {
      await removeAuthToken() 
      await removeUserInfo() 
      navigation.navigate('Login') // Navega para a tela de login
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return (
    <AuthMiddleware>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Dashboard</Text>

      {/* Botão de Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>

      {user ? (
        <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Bem-vindo,</Text>
            <Text style={styles.userName}>{user.fullName}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Id:</Text>
            <Text style={styles.value}>{user.id}</Text>
            <Text style={styles.value}>{user.email}</Text>

            <Text style={styles.label}>NIF:</Text>
            <Text style={styles.value}>{user.nif}</Text>

            <Text style={styles.label}>Tipo de usuário:</Text>
            <Text style={styles.value}>
              {user.userType === 'client' ? 'Cliente' : 'Prestador'}
            </Text>
          </View>

          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.navigate('Services')}
            >
              <Text style={styles.menuButtonText}>Serviços</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.navigate('Agendar')}
            >
              <Text style={styles.menuButtonText}>Agendar</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={styles.loading}>Carregando dados do usuário...</Text>
      )}
    </ScrollView>
    </AuthMiddleware>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F2F4F8',
    flexGrow: 1,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#F44336', // Cor de destaque para logout
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    color: '#555',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  menu: {
    marginTop: 10,
    flexDirection: 'column',
    gap: 12,
  },
  menuButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loading: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
  },
})
