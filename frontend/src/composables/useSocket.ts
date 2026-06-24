import { io, Socket } from 'socket.io-client'
import { ref } from 'vue'

// TODO День 14: підключити після вивчення WebSocket

let socket: Socket | null = null

export function useSocket() {
  const notifications = ref<{ message: string; time: string }[]>([])

  function connect(userId: number) {
    socket = io('http://localhost:3000')

    socket.on('connect', () => {
      // Реєструємо юзера щоб сервер знав куди надсилати
      socket!.emit('register', userId)
    })

    // Отримуємо сповіщення про новий відгук
    socket.on('new_application', (data: { jobTitle: string; seekerName: string; time: string }) => {
      notifications.value.unshift({
        message: `${data.seekerName} відгукнувся на "${data.jobTitle}"`,
        time: data.time,
      })
    })
  }

  function disconnect() {
    socket?.disconnect()
    socket = null
  }

  return { notifications, connect, disconnect }
}
