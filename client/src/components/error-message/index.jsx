import { useAnalyzer } from '../../hooks/useAnalyzer'
import './styled.css'

export function ErrorMessage () {
  const { error } = useAnalyzer()
  if (!error) return null

  return (
    <div className='error-message'>
      <i className='bi bi-exclamation-triangle'></i> {error}
    </div>
  )
}
