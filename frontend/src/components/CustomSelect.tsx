import { useState, useRef, useEffect, useCallback } from 'react'

interface SelectOption {
  label: string
  value: string
}

interface CustomSelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function CustomSelect({ options, value, onChange, placeholder = '请选择...', className = '' }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const handleSelect = useCallback(
    (optionValue: string) => {
      onChange(optionValue)
      setIsOpen(false)
    },
    [onChange]
  )

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      const index = options.findIndex((opt) => opt.value === value)
      setHighlightedIndex(index >= 0 ? index : 0)
    }
  }, [isOpen, value, options])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setHighlightedIndex((prev) => (prev + 1) % options.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length)
          break
        case 'Enter':
          e.preventDefault()
          if (options[highlightedIndex]) {
            handleSelect(options[highlightedIndex].value)
          }
          break
        case 'Escape':
          setIsOpen(false)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, highlightedIndex, options, handleSelect])

  // Position dropdown
  useEffect(() => {
    if (!isOpen || !containerRef.current || !dropdownRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const dropdown = dropdownRef.current

    dropdown.style.top = `${rect.bottom + 4}px`
    dropdown.style.left = `${rect.left}px`
    dropdown.style.width = `${rect.width}px`

    // Check if dropdown goes below viewport
    const dropdownHeight = Math.min(280, options.length * 36)
    if (rect.bottom + dropdownHeight + 8 > window.innerHeight) {
      dropdown.style.top = `${rect.top - dropdownHeight - 4}px`
    }
  }, [isOpen, options.length])

  return (
    <>
      <div ref={containerRef} className={`relative ${className}`} data-cursor-hover>
        <button
          type="button"
          onClick={handleToggle}
          className="w-full flex items-center justify-between bg-transparent border border-white/10 px-3 py-2 text-sm text-[#f0f0f0] outline-none transition-colors hover:border-white/20"
          style={{
            borderColor: isOpen ? '#d4a373' : undefined,
          }}
          data-cursor-hover
        >
          <span className={selectedOption ? 'text-[#f0f0f0]' : 'text-[#666666]'}>
            {selectedOption?.label || placeholder}
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-[#888888] transition-transform duration-200 flex-shrink-0 ml-2"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <>
          <div className="custom-select-overlay" onClick={() => setIsOpen(false)} />
          <div
            ref={dropdownRef}
            className="custom-select-dropdown fixed"
            style={{ minWidth: '120px' }}
          >
            {options.map((option, index) => (
              <div
                key={option.value}
                className="custom-select-option"
                data-selected={option.value === value ? 'true' : 'false'}
                data-highlighted={index === highlightedIndex ? 'true' : 'false'}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
                style={{
                  background:
                    index === highlightedIndex
                      ? 'rgba(212, 163, 115, 0.1)'
                      : option.value === value
                        ? 'rgba(212, 163, 115, 0.05)'
                        : undefined,
                  color:
                    index === highlightedIndex || option.value === value
                      ? '#d4a373'
                      : '#888888',
                }}
                data-cursor-hover
              >
                {option.label}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}
