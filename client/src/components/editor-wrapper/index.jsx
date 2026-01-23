import { useAnalyzer } from '../../hooks/useAnalyzer'
import { LanguageSelector } from '../language-selector'
import './styled.css'

export function EditorWrapper () {
  const { code, setCode, handleAnalyze, loading } = useAnalyzer()

  return (
    <div className='editor-wrapper'>
      <textarea
        className='code-editor'
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder='Cole seu código aqui...'
        spellCheck={true}
      />
      <div className='container-language-buttonAnalyzer'>
        <LanguageSelector />
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
    </div>
  )
}
