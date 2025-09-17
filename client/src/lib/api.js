import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000'
})

export function attachToken (token) {
  api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : ''
}