import React, { useState, useEffect } from 'react'

function TerminalCard() {
  const [currentLine, setCurrentLine] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [cursorVisible, setCursorVisible] = useState(true)

  const terminalLines = [
    '> whoami',
    'Amine Essahfi - Platform Engineer',
    '',
    '> focus --current',
    'Platform systems + cloud efficiency + data delivery',
    '',
    '> stack --core',
    'AWS · Kubernetes · Terraform · Python',
    '',
    '> outcome',
    'Cleaner delivery paths and stronger architecture decisions',
  ]

  const profileTags = ['Platform Engineering', 'Cloud Efficiency', 'Data Systems']

  // Typewriter effect
  useEffect(() => {
    const line = terminalLines[currentLine]
    let charIndex = 0
    
    const typeChar = () => {
      if (charIndex <= line.length) {
        setDisplayText(line.substring(0, charIndex))
        charIndex++
        setTimeout(typeChar, 30)
      } else {
        // Move to next line after delay
        setTimeout(() => {
          if (currentLine < terminalLines.length - 1) {
            setCurrentLine(prev => prev + 1)
            setDisplayText('')
          }
        }, 500)
      }
    }
    
    const timer = setTimeout(typeChar, 100)
    return () => clearTimeout(timer)
  }, [currentLine])

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Restart animation when reaching end
  useEffect(() => {
    if (currentLine === terminalLines.length - 1) {
      const timer = setTimeout(() => {
        setCurrentLine(0)
        setDisplayText('')
      }, 10000) // Restart after 10 seconds
      return () => clearTimeout(timer)
    }
  }, [currentLine])

  return (
    <div className="terminal-window card-hover h-auto self-start">
      <div className="terminal-header">
        <div className="terminal-button bg-red-500"></div>
        <div className="terminal-button bg-yellow-500"></div>
        <div className="terminal-button bg-green-500"></div>
        <div className="ml-4 text-sm text-gray-400">terminal - live profile</div>
      </div>

      <div className="terminal-content !gap-5">
        <div className="space-y-3">
          <span className="section-chip">Profile snapshot</span>
          <h3 className="text-2xl font-semibold text-white">A compact operator-style intro</h3>
          <p className="text-sm leading-7 text-gray-400">
            A denser terminal card keeps the homepage rhythm tighter while still showing the command-line identity of the site.
          </p>
        </div>

        <div className="terminal-readout rounded-[1.35rem] border border-white/10 bg-[#040916]/80 p-4 sm:p-5">
          <div className="min-h-[12.5rem] space-y-1 break-words text-[13px] sm:text-sm">
            {terminalLines.slice(0, currentLine).map((line, index) => (
              <div key={index} className="text-gray-300">
                {line.startsWith('> ') ? (
                  <span className="text-green-400">{line}</span>
                ) : line === '' ? (
                  <br />
                ) : (
                  <span className="text-cyan-300">{line}</span>
                )}
              </div>
            ))}

            {currentLine < terminalLines.length && (
              <div className="text-gray-300">
                {terminalLines[currentLine].startsWith('> ') ? (
                  <span className="text-green-400">
                    {terminalLines[currentLine].substring(0, 2)}
                    <span className="text-gray-300">
                      {displayText.substring(2)}
                      {cursorVisible ? <span className="ml-1 inline-block h-5 w-2 animate-terminal-blink bg-green-400 align-middle"></span> : null}
                    </span>
                  </span>
                ) : terminalLines[currentLine] === '' ? (
                  <br />
                ) : (
                  <span className="text-cyan-300">
                    {displayText}
                    {cursorVisible ? <span className="ml-1 inline-block h-5 w-2 animate-terminal-blink bg-cyan-300 align-middle"></span> : null}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2.5 text-xs text-gray-400">
              {profileTags.map((tag) => (
                <span key={tag} className="skill-badge !px-3 !py-1.5 !text-xs">
                  {tag}
                </span>
              ))}
            </div>
            <button
              onClick={() => {
                setCurrentLine(0)
                setDisplayText('')
              }}
              className="secondary-button w-fit !rounded-full !px-4 !py-2 !text-xs"
            >
              Restart Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TerminalCard
