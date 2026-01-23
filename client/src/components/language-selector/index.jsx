import React, { useState } from 'react'
import './styled.css'
import { useAnalyzer } from '../../hooks/useAnalyzer'

export const LanguageSelector = () => {
  const { language, setLanguage } = useAnalyzer()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    {
      id: 'javascript',
      label: 'JavaScript',
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg'
    },
    {
      id: 'typescript',
      label: 'TypeScript',
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg'
    },
    {
      id: 'python',
      label: 'Python',
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg'
    },
    {
      id: 'java',
      label: 'Java',
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg'
    },
    {
      id: 'csharp',
      label: 'C#',
      icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/csharp/csharp-original.svg'
    }
  ]

  const selectedLang = languages.find(l => l.id === language)

  return (
    <div className='custom-select-container'>

      <div className='select-trigger' onClick={() => setIsOpen(!isOpen)}>
        <img src={selectedLang?.icon} alt='' className='lang-icon' />
        <span>{selectedLang?.label}</span>
        <div>
          <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'} ms-auto`}></i>
        </div>
      </div>

      {isOpen && (
        <ul className='select-options'>
          {languages.map(lang => (
            <li
              key={lang.id}
              onClick={() => {
                setLanguage(lang.id)
                setIsOpen(false)
              }}
              className={language === lang.id ? 'active' : ''}
            >
              <img src={lang.icon} alt='' className='lang-icon' />
              {lang.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
