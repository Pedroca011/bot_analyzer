import { useEffect } from 'react'
import './App.css'
import { initTheme } from './services/theme'
import { NavBar } from './components/navbar'
import { EditorWrapper } from './components/editor-wrapper'
import { AnalyzerProvider } from './hooks/useAnalyzer'
import { ErrorMessage } from './components/error-message'
import { ResultsDisplay } from './components/results-display'

function App () {

  useEffect(() => {
    initTheme()
  }, [])

  return (
    <AnalyzerProvider>
      <div className='app'>
        <NavBar />
        <div className='hero'>
          <h1 className='hero-title'>Transforme erros em aprendizado</h1>

          <EditorWrapper />
          <ErrorMessage />
        </div>

        <ResultsDisplay />
      </div>
    </AnalyzerProvider>
  )
}

export default App
