import { getHistory } from './gamification'

const LEARNING_WINDOW = 10

export const analyzeLearning = () => {
  const history = getHistory()
  
  if (history.length < 5) {
    return {
      status: 'insufficient_data',
      message: 'Continue analisando para ver seu progresso',
      progress: 0
    }
  }

  const recent = history.slice(0, LEARNING_WINDOW)
  const older = history.slice(LEARNING_WINDOW, LEARNING_WINDOW * 2)

  const recentErrorRate = recent.filter(h => h.has_issues).length / recent.length
  const olderErrorRate = older.length > 0 
    ? older.filter(h => h.has_issues).length / older.length 
    : recentErrorRate

  const improvement = olderErrorRate - recentErrorRate

  const repeatedErrors = findRepeatedErrors(recent)
  
  let status = 'stable'
  let message = 'Você está mantendo um bom ritmo'
  
  if (improvement > 0.2) {
    status = 'improving'
    message = 'Excelente! Você está cometendo menos erros'
  } else if (improvement < -0.2) {
    status = 'regressing'
    message = 'Atenção! Taxa de erros aumentou recentemente'
  }

  if (repeatedErrors.length > 0) {
    status = 'repeated_errors'
    message = `Você está repetindo erros de: ${repeatedErrors.join(', ')}`
  }

  const progress = Math.max(0, Math.min(100, 50 + (improvement * 100)))

  return {
    status,
    message,
    progress: Math.round(progress),
    recentErrorRate: Math.round(recentErrorRate * 100),
    improvement: Math.round(improvement * 100),
    repeatedErrors
  }
}

const findRepeatedErrors = (history) => {
  const categoryCount = {}
  
  history.forEach(item => {
    if (item.has_issues && item.category) {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1
    }
  })

  return Object.entries(categoryCount)
    .filter(([_, count]) => count >= 3)
    .map(([category]) => category)
}

export const getLearningTrend = () => {
  const history = getHistory()
  
  if (history.length < 10) return []

  const chunks = []
  const chunkSize = 5

  for (let i = 0; i < Math.min(history.length, 30); i += chunkSize) {
    const chunk = history.slice(i, i + chunkSize)
    const errorRate = chunk.filter(h => h.has_issues).length / chunk.length
    chunks.push({
      index: chunks.length,
      errorRate: Math.round(errorRate * 100)
    })
  }

  return chunks.reverse()
}