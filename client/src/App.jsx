import { useState } from 'react'
import './App.css'
import { 
  addPoints, 
  saveAnalysis, 
  updateStats, 
  checkBadges, 
  getPoints, 
  getStats
} from './services/gamification'

function App() {
  const [code, setCode] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [points, setPoints] = useState(getPoints())
  const [stats, setStats] = useState(getStats())
  const [newBadges, setNewBadges] = useState([])

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Cole seu código para analisar')
      return
    }

    setLoading(true)
    setError(null)
    setAnalysis(null)
    setNewBadges([])

    try {
      const response = await fetch('http://localhost:3001/api/analyzer/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao analisar')
      }

      setAnalysis(data.analyze)

      const newPoints = addPoints(10)
      setPoints(newPoints)

      saveAnalysis(data.analyze)

      const updatedStats = updateStats(data.analyze)
      setStats(updatedStats)

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
    <div className="app">
      <div className="hero">
        <div className="logo">&lt;bot_analyzer/&gt;</div>
        
        <h1 className="hero-title">Transforme erros em aprendizado</h1>
        
        <div className="editor-wrapper">
          <textarea
            className="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Cole seu código JavaScript aqui..."
            spellCheck={false}
          />
          
          <button 
            onClick={handleAnalyze} 
            disabled={loading}
            className="btn-analyze"
          >
            {loading ? 'Analisando...' : 'Analisar Código'}
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>

      {analysis && (
        <div className="results">
          <h2>Análise Completa</h2>
          
          {analysis.has_issues !== undefined && (
            <div className={`status-badge ${analysis.has_issues ? 'has-issues' : 'clean'}`}>
              {analysis.has_issues ? 'Problemas Encontrados' : 'Código Limpo'}
            </div>
          )}

          {analysis.raw_response ? (
            <pre className="raw-response">{analysis.raw_response}</pre>
          ) : (
            <div className="analysis-grid">
              {analysis.error_type && (
                <div className="analysis-card">
                  <strong>Tipo do Erro</strong>
                  <p>{analysis.error_type}</p>
                </div>
              )}
              {analysis.location && (
                <div className="analysis-card">
                  <strong>Localização</strong>
                  <p>{analysis.location}</p>
                </div>
              )}
              <div className="analysis-card full">
                <strong>Explicação</strong>
                <p>{analysis.explanation}</p>
              </div>
              <div className="analysis-card full">
                <strong>Solução</strong>
                <p>{analysis.solution}</p>
              </div>
              {analysis.best_practices && (
                <div className="analysis-card full">
                  <strong>Boas Práticas</strong>
                  <p>{analysis.best_practices}</p>
                </div>
              )}
              {analysis.category && (
                <div className="analysis-card">
                  <strong>Categoria</strong>
                  <span className="badge">{analysis.category}</span>
                </div>
              )}
            </div>
          )}

          {newBadges.length > 0 && (
            <div className="badges-earned-inline">
              <h4>Conquistas Desbloqueadas</h4>
              <div className="badges-list">
                {newBadges.map(badge => (
                  <div key={badge.id} className="badge-earned">
                    <span className="badge-name">{badge.name}</span>
                    <span className="badge-points">+{badge.points}pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="stats-footer">
            <div className="stat-item">
              <span className="stat-value">{points}</span>
              <span className="stat-label">Pontos</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.total_analyses}</span>
              <span className="stat-label">Análises</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.errors_found}</span>
              <span className="stat-label">Erros</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.clean_codes}</span>
              <span className="stat-label">Limpos</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App