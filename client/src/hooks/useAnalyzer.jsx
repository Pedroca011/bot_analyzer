import { createContext, useState, useRef, useContext } from 'react'
import { API_URL } from '../config'
import {
  addPoints,
  saveAnalysis,
  updateStats,
  checkBadges,
  getPoints,
  getStats
} from '../services/gamification'
import { analyzeLearning } from '../services/learning_analytics'
import { getTheme, toggleTheme } from '../services/theme'

const AnalyzerContext = createContext()

export const AnalyzerProvider = ({ children }) => {
  const [code, setCode] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [points, setPoints] = useState(getPoints())
  const [stats, setStats] = useState(getStats())
  const [newBadges, setNewBadges] = useState([])
  const [learningData, setLearningData] = useState(analyzeLearning())
  const [theme, setThemeState] = useState(getTheme())
  const [language, setLanguage] = useState('javascript')
  const resultsRef = useRef(null)

  const handleThemeToggle = () => {
    const newTheme = toggleTheme()
    setThemeState(newTheme)
  }

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Cole seu código para analisar')
      return
    }

    setLoading(true)
    setError(null)
    setAnalysis(null)
    setNewBadges([])
    console.log(code, language, '[ANTES DE IR API]')
    try {
      const response = await fetch(`${API_URL}/api/analyzer/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: code,
          language: language
        })
      })

      const data = await response.json()
      console.log(data, '[Cheguei da api]')

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao analisar')
      }

      setAnalysis(data.analyze)
      setCode('')

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }, 100)

      const newPoints = addPoints(10)
      setPoints(newPoints)

      saveAnalysis(data.analyze)

      const updatedStats = updateStats(data.analyze)
      setStats(updatedStats)

      const learning = analyzeLearning()
      setLearningData(learning)

      const badges = checkBadges()
      if (badges.length > 0) {
        setNewBadges(badges)
        setPoints(getPoints())
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <AnalyzerContext.Provider
      value={{
        code,
        setCode,
        analysis,
        loading,
        error,
        points,
        stats,
        newBadges,
        learningData,
        handleAnalyze,
        resultsRef,
        theme,
        handleThemeToggle,
        language,
        setLanguage
      }}
    >
      {children}
    </AnalyzerContext.Provider>
  )
}

export const useAnalyzer = () => {
  const context = useContext(AnalyzerContext)
  if (!context) {
    throw new Error('useAnalyzer deve ser usado dentro de um AnalyzerProvider')
  }
  return context
}
