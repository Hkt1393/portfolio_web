import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import type { SelectProps } from './Select.types'
import './Select.css'

interface MenuPosition {
  top: number
  left: number
  width: number
  height: number
  maxHeight: number
}

const VIEWPORT_GUTTER = 8
const MENU_GAP = 6
const PREFERRED_MENU_HEIGHT = 240

export function Select({
  id,
  value,
  options,
  placeholder,
  labelledBy,
  describedBy,
  invalid = false,
  required = false,
  disabled = false,
  onValueChange,
  onBlur,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, options.findIndex(option => option.value === value)))
  const [position, setPosition] = useState<MenuPosition | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const typeaheadRef = useRef('')
  const typeaheadTimerRef = useRef<number | undefined>(undefined)
  const selectedIndex = options.findIndex(option => option.value === value)
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined

  const close = useCallback((restoreFocus = false) => {
    setIsOpen(false)
    setPosition(null)
    if (restoreFocus) triggerRef.current?.focus()
  }, [])

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return

    const rect = trigger.getBoundingClientRect()
    const width = Math.min(rect.width, window.innerWidth - VIEWPORT_GUTTER * 2)
    const left = Math.min(
      Math.max(VIEWPORT_GUTTER, rect.left),
      window.innerWidth - width - VIEWPORT_GUTTER,
    )
    const spaceBelow = window.innerHeight - rect.bottom - MENU_GAP - VIEWPORT_GUTTER
    const spaceAbove = rect.top - MENU_GAP - VIEWPORT_GUTTER
    const openAbove = spaceBelow < Math.min(180, PREFERRED_MENU_HEIGHT) && spaceAbove > spaceBelow
    const availableHeight = openAbove ? spaceAbove : spaceBelow
    const maxHeight = Math.max(0, Math.min(PREFERRED_MENU_HEIGHT, availableHeight))
    const height = Math.min(options.length * 42 + 12, maxHeight)
    const top = openAbove
      ? Math.max(VIEWPORT_GUTTER, rect.top - height - MENU_GAP)
      : Math.min(window.innerHeight - maxHeight - VIEWPORT_GUTTER, rect.bottom + MENU_GAP)

    setPosition({ top, left, width, height, maxHeight })
  }, [options.length])

  useLayoutEffect(() => {
    if (!isOpen) return

    updatePosition()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updatePosition)
    if (triggerRef.current) observer?.observe(triggerRef.current)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isOpen, updatePosition])

  useEffect(() => {
    if (!isOpen) return
    const activeOption = document.getElementById(`${id}-option-${activeIndex}`)
    if (activeOption && typeof activeOption.scrollIntoView === 'function') {
      activeOption.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex, id, isOpen])

  useEffect(() => () => {
    if (typeaheadTimerRef.current !== undefined) window.clearTimeout(typeaheadTimerRef.current)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return
      close()
      onBlur()
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [close, isOpen, onBlur])

  const open = (index = selectedIndex >= 0 ? selectedIndex : 0) => {
    setActiveIndex(index)
    setIsOpen(true)
  }

  const choose = (index: number) => {
    const option = options[index]
    if (!option) return
    onValueChange(option.value)
    close(true)
  }

  const moveActive = (direction: -1 | 1) => {
    const start = activeIndex < 0 ? (direction > 0 ? -1 : 0) : activeIndex
    setActiveIndex((start + direction + options.length) % options.length)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!isOpen) open(event.key === 'ArrowDown'
        ? (selectedIndex >= 0 ? selectedIndex : 0)
        : (selectedIndex >= 0 ? selectedIndex : options.length - 1))
      else moveActive(event.key === 'ArrowDown' ? 1 : -1)
      return
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      if (!isOpen) setIsOpen(true)
      setActiveIndex(event.key === 'Home' ? 0 : options.length - 1)
      return
    }

    if (event.key === 'Escape' && isOpen) {
      event.preventDefault()
      close(true)
      return
    }

    if ((event.key === 'Enter' || event.key === ' ') && isOpen) {
      event.preventDefault()
      choose(activeIndex)
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      open()
      return
    }

    if (event.key === 'Tab' && isOpen) {
      close()
      onBlur()
      return
    }

    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault()
      typeaheadRef.current += event.key.toLocaleLowerCase()
      if (typeaheadTimerRef.current !== undefined) window.clearTimeout(typeaheadTimerRef.current)
      typeaheadTimerRef.current = window.setTimeout(() => { typeaheadRef.current = '' }, 600)
      const start = Math.max(0, activeIndex + 1)
      const ordered = [...options.slice(start), ...options.slice(0, start)]
      const match = ordered.find(option => option.label.toLocaleLowerCase().startsWith(typeaheadRef.current))
      if (match) setActiveIndex(options.indexOf(match))
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        id={id}
        className={`form-field__control custom-select__trigger${invalid ? ' is-invalid' : ''}`}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-readonly="true"
        aria-required={required}
        aria-expanded={isOpen}
        aria-controls={isOpen ? `${id}-listbox` : undefined}
        aria-activedescendant={isOpen ? `${id}-option-${activeIndex}` : undefined}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-invalid={invalid}
        disabled={disabled}
        onClick={() => isOpen ? close() : open()}
        onKeyDown={handleKeyDown}
        onBlur={event => {
          if (isOpen && !menuRef.current?.contains(event.relatedTarget as Node | null)) close()
          onBlur()
        }}
      >
        <span className={!selectedOption ? 'custom-select__placeholder' : undefined}>
          {selectedOption?.label ?? placeholder}
        </span>
        <span className="custom-select__chevron" aria-hidden="true" />
      </button>

      {isOpen && position && createPortal(
        <div
          ref={menuRef}
          className="custom-select__menu"
          id={`${id}-listbox`}
          role="listbox"
          aria-labelledby={labelledBy}
          style={{ top: position.top, left: position.left, width: position.width, height: position.height, maxHeight: position.maxHeight }}
        >
          {options.map((option, index) => {
            const selected = option.value === value
            const active = index === activeIndex
            return (
              <div
                key={option.value}
                id={`${id}-option-${index}`}
                className="custom-select__option"
                role="option"
                aria-selected={selected}
                data-active={active}
                onMouseEnter={() => setActiveIndex(index)}
                onPointerDown={event => event.preventDefault()}
                onClick={() => choose(index)}
              >
                <span>{option.label}</span>
                {selected && <span className="custom-select__check" aria-hidden="true">✓</span>}
              </div>
            )
          })}
        </div>,
        document.body,
      )}
    </>
  )
}
