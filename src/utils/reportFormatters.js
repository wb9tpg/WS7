function formatValueDisplay(rawValue, formatType) {
  // Safe default mapping handling if omitted or set to 'none'
  const activeFormat = formatType ?? 'none'

  // 1. Core structural blocks handle overrides first
  if (activeFormat === 'dB' && rawValue === '-144') return '-∞ dB'
  if (activeFormat === 'dB') return `${parseFloat(rawValue).toFixed(1)} dB`
  if (activeFormat === 'percent') return `${parseFloat(rawValue).toFixed(0)}%`
  if (activeFormat === 'ms') return `${parseFloat(rawValue).toFixed(1)} ms`

  // 2. The Smart 'none' Default Catch-All
  if (activeFormat === 'none') {
    // Return early if it's a plain string/boolean flag (like 'false', 'true', or 'feet')
    if (rawValue === 'true' || rawValue === 'false') return rawValue

    const num = parseFloat(rawValue)
    if (isNaN(num)) return rawValue // Returns plain text words exactly as they are

    // Check if the number has decimal places
    if (Number.isInteger(num)) {
      return num.toString() // e.g., Gain values of '0' remain clean '0'
    }

    // Audio Rule: If it's a large frequency value, round it to a whole number or 1 decimal max
    if (num >= 20) {
      return num.toFixed(0) // e.g., 60.13883591 -> '60', 11999.27344 -> '11999'
    }

    // For smaller floats (like EQ Q-factors)
    return num.toFixed(2) // e.g., 1.995881796 -> '2.00'
  }

  return rawValue
}
