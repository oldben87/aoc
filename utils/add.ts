const add = (...numbers: Array<number>) => {
  return numbers.reduce((total, current) => total + current, 0)
}

export default add
