import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  StyleSheet,
  Modal,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { fetchApi } from '../../utils/api'
import { getUserInfo } from '../../utils/auth'

interface Service {
  id: number
  name: string
  price: number
  description?: string
}

interface BookingItem {
  id: number
  bookingDate: string
  amount: number
  status: string
  service: {
    name: string
  }
  name: string
}

export default function Booking() {
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [bookingDate, setBookingDate] = useState<Date>(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [loadingCancelId, setLoadingCancelId] = useState<number | null>(null)
  const [user, setUser] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  const loadBookings = async () => {
    const data = await fetchApi<BookingItem[]>('/bookings', { method: 'GET' })
    setBookings(data)
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesData, bookingsData] = await Promise.all([
          fetchApi<Service[]>('/services', { method: 'GET' }),
          fetchApi<BookingItem[]>('/bookings', { method: 'GET' }),
        ])
        setServices(servicesData)
        setBookings(bookingsData)
      } catch (error: any) {
        console.error('Erro ao carregar dados:', error)
      }
    }

    const checkUser = async () => {
      const userInfo = await getUserInfo()
      setUser(userInfo)
      loadData()
    }

    checkUser()
  }, [])

  const handleBooking = async () => {
    if (!user || !selectedService) {
      return Alert.alert('Erro', 'Selecione um serviço e uma data')
    }

    try {
      await fetchApi('/bookings', {
        method: 'POST',
        body: {
          serviceId: selectedService,
          bookingDate: bookingDate.toISOString(),
          id: user.id,
        },
      })

      Alert.alert('Sucesso', 'Agendamento realizado com sucesso!')
      setSelectedService(null)
      setBookingDate(new Date())
      loadBookings()
    } catch (error: any) {
      const message = error?.message || error?.error || 'Erro ao agendar serviço'
      Alert.alert('Erro', message)
    }
  }

  const handleCancelBooking = async (id: number) => {
    try {
      setLoadingCancelId(id)
      await fetchApi(`/bookings/${id}`, { method: 'DELETE' })
      Alert.alert('Cancelado', 'Agendamento cancelado com sucesso')
      loadBookings()
    } catch (error: any) {
      const msg = error?.message || error?.error || 'Erro ao cancelar'
      Alert.alert('Erro', msg)
    } finally {
      setLoadingCancelId(null)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendar Serviço</Text>

      <Text style={styles.subtitle}>Escolha um serviço</Text>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              selectedService === item.id && styles.cardSelected,
            ]}
            onPress={() => {
              setSelectedService(item.id)
              setShowModal(true)
            }}
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            {item.description && (
              <Text style={styles.cardDescription}>{item.description}</Text>
            )}
            <Text style={styles.cardPrice}>Preço: AOA {item.price}</Text>
          </TouchableOpacity>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
      />

      {/* MODAL DE AGENDAMENTO */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolha a data</Text>

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>{bookingDate.toLocaleDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={bookingDate}
                mode="date"
                display="default"
                onChange={(_, date) => {
                  if (date) setBookingDate(date)
                  setShowDatePicker(false)
                }}
              />
            )}

            <TouchableOpacity style={styles.confirmButton} onPress={() => {
              handleBooking()
              setShowModal(false)
            }}>
              <Text style={styles.confirmButtonText}>Confirmar Agendamento</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={{ color: '#e53935', marginTop: 10 }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.subtitle}>Seus Agendamentos</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.bookingItem}>
            <Text style={styles.bookingService}>{item.name}</Text>
            <Text>Data: {new Date(item.bookingDate).toLocaleDateString()}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Valor: AOA {item.amount}</Text>

            {item.status === 'confirmed' && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelBooking(item.id)}
                disabled={loadingCancelId === item.id}
              >
                <Text style={styles.cancelButtonText}>
                  {loadingCancelId === item.id ? 'Cancelando...' : 'Cancelar'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        ListEmptyComponent={<Text>Nenhum agendamento encontrado.</Text>}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 10,
    color: '#444',
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    width: 220,
    justifyContent: 'center',
  },
  cardSelected: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  cardPrice: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  dateButton: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  dateText: {
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  bookingItem: {
    backgroundColor: '#fff',
    padding: 14,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  bookingService: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  cancelButton: {
    marginTop: 5,
    backgroundColor: '#e53935',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
})
