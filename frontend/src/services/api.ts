import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

export const apiService = {
  async getStatus() {
    try {
      const response = await api.get('/')
      return response.data
    } catch (error) {
      console.error('Error fetching status:', error)
      throw error
    }
  },

  async getData() {
    try {
      const response = await api.get('/api/data')
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  },

  async listItems() {
    try {
      const response = await api.get('/api/items')
      return response.data
    } catch (error) {
      console.error('Error fetching items:', error)
      throw error
    }
  },

  async createItem(payload: { name: string; status: string }) {
    try {
      const response = await api.post('/api/items', payload)
      return response.data
    } catch (error) {
      console.error('Error creating item:', error)
      throw error
    }
  },

  async updateItem(itemId: number, payload: { name?: string; status?: string }) {
    try {
      const response = await api.put(`/api/items/${itemId}`, payload)
      return response.data
    } catch (error) {
      console.error('Error updating item:', error)
      throw error
    }
  },

  async deleteItem(itemId: number) {
    try {
      await api.delete(`/api/items/${itemId}`)
      return true
    } catch (error) {
      console.error('Error deleting item:', error)
      throw error
    }
  },
}

export default api
