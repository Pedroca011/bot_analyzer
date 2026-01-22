import { useAnalyzer } from '../../hooks/useAnalyzer'
import './styled.css'

export function EditorWrapper () {
  const { code, setCode, handleAnalyze, loading } = useAnalyzer()
  
  return (
    <div className='editor-wrapper'>
      <textarea
        className='code-editor'
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder='Cole seu código JavaScript aqui...'
        spellCheck={true}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className='btn-analyze'
      >
        {loading ? (
          <>
            <i className='bi bi-arrow-repeat spinning'></i> Analisando...
          </>
        ) : (
          'Analisar Código'
        )}
      </button>
    </div>
  )
}
