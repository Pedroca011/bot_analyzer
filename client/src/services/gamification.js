const STORAGE_KEYS = {
    POINTS: 'bot_analyzer_points',
    HISTORY: 'bot_analyzer_history',
    BADGES: 'bot_analyzer_badges',
    STATS: 'bot_analyzer_stats'
  }
  
  export const getPoints = () => {
    return parseInt(localStorage.getItem(STORAGE_KEYS.POINTS) || '0')
  }
  
  export const addPoints = (amount) => {
    const current = getPoints()
    const newTotal = current + amount
    localStorage.setItem(STORAGE_KEYS.POINTS, newTotal.toString())
    return newTotal
  }
  
  export const getHistory = () => {
    const history = localStorage.getItem(STORAGE_KEYS.HISTORY)
    return history ? JSON.parse(history) : []
  }
  
  export const saveAnalysis = (analysis) => {
    const history = getHistory()
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      category: analysis.category,
      error_type: analysis.error_type,
      has_issues: analysis.has_issues
    }
    
    history.unshift(newEntry)
    
    if (history.length > 50) {
      history.pop()
    }
    
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history))
    return newEntry
  }
  
  export const getStats = () => {
    const stats = localStorage.getItem(STORAGE_KEYS.STATS)
    return stats ? JSON.parse(stats) : {
      total_analyses: 0,
      errors_found: 0,
      clean_codes: 0,
      categories: {}
    }
  }
  
  export const updateStats = (analysis) => {
    const stats = getStats()
    
    stats.total_analyses++
    
    if (analysis.has_issues) {
      stats.errors_found++
    } else {
      stats.clean_codes++
    }
    
    if (analysis.category) {
      stats.categories[analysis.category] = (stats.categories[analysis.category] || 0) + 1
    }
    
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats))
    return stats
  }
  
  export const getTopErrors = () => {
    const stats = getStats()
    const categories = Object.entries(stats.categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }))
    
    return categories
  }
  
  const BADGES = [
    { id: 'first_analysis', name: 'Primeira Análise', points: 10, condition: (stats) => stats.total_analyses >= 1 },
    { id: 'analyzer_5', name: 'Analisador Iniciante', points: 50, condition: (stats) => stats.total_analyses >= 5 },
    { id: 'analyzer_10', name: 'Analisador Experiente', points: 100, condition: (stats) => stats.total_analyses >= 10 },
    { id: 'clean_code', name: 'Código Limpo', points: 25, condition: (stats) => stats.clean_codes >= 3 },
    { id: 'bug_hunter', name: 'Caçador de Bugs', points: 50, condition: (stats) => stats.errors_found >= 10 }
  ]
  
  export const checkBadges = () => {
    const stats = getStats()
    const earnedBadges = JSON.parse(localStorage.getItem(STORAGE_KEYS.BADGES) || '[]')
    const newBadges = []
    
    BADGES.forEach(badge => {
      if (!earnedBadges.includes(badge.id) && badge.condition(stats)) {
        earnedBadges.push(badge.id)
        newBadges.push(badge)
        addPoints(badge.points) // Bonus de pontos por badge
      }
    })
    
    if (newBadges.length > 0) {
      localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(earnedBadges))
    }
    
    return newBadges
  }
  
  export const getBadges = () => {
    const earnedIds = JSON.parse(localStorage.getItem(STORAGE_KEYS.BADGES) || '[]')
    return BADGES.filter(badge => earnedIds.includes(badge.id))
  }
  
  export const clearAll = () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
  }