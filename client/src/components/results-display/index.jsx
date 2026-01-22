import { useAnalyzer } from '../../hooks/useAnalyzer'
import "./styled.css"

export function ResultsDisplay () {
  const { analysis, resultsRef, learningData, newBadges, points, stats } =
    useAnalyzer()
    
    if (!analysis) return null;

  const getLearningIcon = () => {
    switch (learningData.status) {
      case 'improving':
        return (
          <i
            className='bi bi-graph-up-arrow'
            style={{ color: 'var(--success-text)' }}
          ></i>
        )
      case 'regressing':
        return (
          <i
            className='bi bi-graph-down-arrow'
            style={{ color: 'var(--error-text)' }}
          ></i>
        )
      case 'repeated_errors':
        return (
          <i
            className='bi bi-arrow-repeat'
            style={{ color: 'var(--error-text)' }}
          ></i>
        )
      case 'stable':
        return (
          <i
            className='bi bi-dash-circle'
            style={{ color: 'var(--text-tertiary)' }}
          ></i>
        )
      default:
        return (
          <i
            className='bi bi-info-circle'
            style={{ color: 'var(--text-tertiary)' }}
          ></i>
        )
    }
  }

  return (
    <div className='results' ref={resultsRef}>
      <h2>Análise Completa</h2>

      {learningData && learningData.shouldShow && (
        <div className='learning-bar'>
          <div className='learning-bar-content'>
            <span className='learning-message'>{learningData.message}</span>
            <div className='learning-progress'>
              <div
                className={`learning-progress-fill ${learningData.status}`}
                style={{ width: `${learningData.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {analysis.has_issues !== undefined && (
        <div
          className={`status-badge ${
            analysis.has_issues ? 'has-issues' : 'clean'
          }`}
        >
          <i
            className={
              analysis.has_issues ? 'bi bi-x-circle' : 'bi bi-check-circle'
            }
          ></i>{' '}
          {analysis.has_issues ? 'Problemas Encontrados' : 'Código Limpo'}
        </div>
      )}

      {analysis.raw_response ? (
        <pre className='raw-response'>{analysis.raw_response}</pre>
      ) : (
        <div className='analysis-grid'>
          {analysis.error_type && (
            <div className='analysis-card'>
              <strong>
                <i className='bi bi-bug'></i> Tipo do Erro
              </strong>
              <p>{analysis.error_type}</p>
            </div>
          )}
          {analysis.location && (
            <div className='analysis-card'>
              <strong>
                <i className='bi bi-geo-alt'></i> Localização
              </strong>
              <p>{analysis.location}</p>
            </div>
          )}
          <div className='analysis-card full'>
            <strong>
              <i className='bi bi-lightbulb'></i> Explicação
            </strong>
            <p>{analysis.explanation}</p>
          </div>
          <div className='analysis-card full'>
            <strong>
              <i className='bi bi-wrench'></i> Solução
            </strong>
            <p>{analysis.solution}</p>
          </div>
          {analysis.best_practices && (
            <div className='analysis-card full'>
              <strong>
                <i className='bi bi-star'></i> Boas Práticas
              </strong>
              <p>{analysis.best_practices}</p>
            </div>
          )}
          {analysis.category && (
            <div className='analysis-card'>
              <strong>
                <i className='bi bi-tag'></i> Categoria
              </strong>
              <span className='badge'>{analysis.category}</span>
            </div>
          )}
        </div>
      )}

      {newBadges.length > 0 && (
        <div className='badges-earned-inline'>
          <h4>
            <i className='bi bi-trophy'></i> Conquistas Desbloqueadas
          </h4>
          <div className='badges-list'>
            {newBadges.map(badge => (
              <div key={badge.id} className='badge-earned'>
                <span className='badge-name'>{badge.name}</span>
                <span className='badge-points'>+{badge.points}pts</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='stats-footer'>
        <div className='stat-item'>
          <span className='stat-value'>{points}</span>
          <span className='stat-label'>Pontos</span>
        </div>
        <div className='stat-item'>
          <span className='stat-value'>{stats.total_analyses}</span>
          <span className='stat-label'>Análises</span>
        </div>
        <div className='stat-item'>
          <span className='stat-value'>{stats.errors_found}</span>
          <span className='stat-label'>Erros</span>
        </div>
        <div className='stat-item'>
          <span className='stat-value'>{stats.clean_codes}</span>
          <span className='stat-label'>Limpos</span>
        </div>
      </div>
    </div>
  )
}
