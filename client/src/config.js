const API_URL = import.meta.env.PROD 
  ? 'https://bot-analyzer-api.onrender.com'
  : 'https://bot-analyzer-api.onrender.com'

console.log('API_URL:', API_URL)

export { API_URL }