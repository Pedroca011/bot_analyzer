const API_URL = import.meta.env.PROD 
  ? 'https://bot-analyzer-api.onrender.com'
  : 'https://bot-analyzer-api.onrender.com'

// const API_URL = import.meta.env.PROD 
//   ? 'http://localhost:3001'
//   : 'http://localhost:3001'

console.log('API_URL:', API_URL)

export { API_URL }