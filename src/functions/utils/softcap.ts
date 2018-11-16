const softcap = (cap: number, value: number) => {
  if (value <= cap) {
    return value
  }
  return value + Math.sqrt(value - cap)
}

export default softcap
