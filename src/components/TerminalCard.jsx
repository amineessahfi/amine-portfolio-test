import React, { useState, useEffect } from 'react'

function TerminalCard() {
  const [currentLine, setCurrentLine] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [cursorVisible, setCursorVisible] = useState(true)
  
  const terminalLines = [
    "> whoami",
    "Amine Essahfi - Platform Engineer",
    "",
    "> cat specialty.txt",
    "Platform Engineering + DataOps + Telco Infrastructure",
    "",
    "> ls projects/",
    "semtech-ota-platform/  data-insight-tools/  sim-tooling/",
    "cost-optimization/     kubernetes-platform/",
    "",
    "> cat experience.md | grep -E 'AWS|K8s|Terraform'",
    "✓ AWS Certified Solutions Architect",
    "✓ Kubernetes at scale (100+ nodes)",
    "✓ Terraform infrastructure as code",
    "✓ Cost optimization (30%+ savings)",
    "",
    "> connect --platform-engineering",
    "Ready to build your internal developer platform."
  ]

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
    <div className="terminal-window card-hover">
      <div className="terminal-header">
        <div className="terminal-button bg-red-500"></div>
        <div className="terminal-button bg-yellow-500"></div>
        <div className="terminal-button bg-green-500"></div>
        <div className="ml-4 text-sm text-gray-400">terminal — bash — 80×24</div>
      </div>
      
      <div className="terminal-content">
        <div className="space-y-1">
          {/* Show all completed lines */}
          {terminalLines.slice(0, currentLine).map((line, index) => (
            <div key={index} className="text-gray-300">
              {line.startsWith('> ') ? (
                <span className="text-green-400">{line}</span>
              ) : line.startsWith('✓ ') ? (
                <span className="text-green-300">{line}</span>
              ) : line === '' ? (
                <br />
              ) : (
                <span className="text-cyan-300">{line}</span>
              )}
            </div>
          ))}
          
          {/* Current typing line */}
          {currentLine < terminalLines.length && (
            <div className="text-gray-300">
              {terminalLines[currentLine].startsWith('> ') ? (
                <span className="text-green-400">
                  {terminalLines[currentLine].substring(0, 2)}
                  <span className="text-gray-300">
                    {displayText.substring(2)}
                    {cursorVisible && <span className="inline-block w-2 h-5 bg-green-400 ml-1 align-middle animate-terminal-blink"></span>}
                  </span>
                </span>
              ) : terminalLines[currentLine].startsWith('✓ ') ? (
                <span className="text-green-300">
                  {displayText}
                  {cursorVisible && <span className="inline-block w-2 h-5 bg-green-300 ml-1 align-middle animate-terminal-blink"></span>}
                </span>
              ) : terminalLines[currentLine] === '' ? (
                <br />
              ) : (
                <span className="text-cyan-300">
                  {displayText}
                  {cursorVisible && <span className="inline-block w-2 h-5 bg-cyan-300 ml-1 align-middle animate-terminal-blink"></span>}
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-dark-700">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Platform Engineering
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Data Infrastructure
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Cost Optimization
              </span>
            </div>
            <button 
              onClick={() => {
                setCurrentLine(0)
                setDisplayText('')
              }}
              className="px-3 py-1 text-xs border border-dark-600 rounded hover:bg-dark-700 transition-colors"
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