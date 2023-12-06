import isNumber from "../../utils/isNumber"
import runAOC from "../../utils/runAOC"

const numbersAsStrings = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
}

const reverseString = (str: string) => {
  return str.split("").reverse().join("")
}

const findFirstNumber = (calibration: string) => {
  return calibration.split("").find(isNumber)
}

const findNumbers = (calibrations: Array<string>) => {
  return calibrations.reduce((total, calibration) => {
    const firstNumber = findFirstNumber(calibration)
    if (firstNumber === undefined) {
      throw new Error(`No first number found: ${calibration}`)
    }
    const lastNumber = findFirstNumber(reverseString(calibration))
    if (lastNumber === undefined) {
      throw new Error(`No last number found: ${calibration}`)
    }
    return total + parseInt(firstNumber + lastNumber, 10)
  }, 0)
}

/**
 *
 * @param {string} calibration
 * @param {boolean=} reverse
 * @returns
 */
const findFirstWordOrNumber = (calibration: string, reverse?: boolean) => {
  return Object.entries(numbersAsStrings).reduce<{
    position: number
    value?: string
  }>(
    (current, [key, value]) => {
      const keyIndex = reverse
        ? reverseString(calibration).search(reverseString(key))
        : calibration.search(key)

      const valueIndex = reverse
        ? reverseString(calibration).search(value)
        : calibration.search(value)

      const indexs = []
      if (keyIndex !== -1) {
        indexs.push(keyIndex)
      }

      if (valueIndex !== -1) {
        indexs.push(valueIndex)
      }

      if (indexs.length) {
        const position = Math.min(...indexs)
        if (position <= current.position) {
          return { position, value }
        }
      }
      return current
    },
    { position: calibration.length + 1 }
  )
}

/**
 *
 * @param {string} calibration
 * @returns
 */
const getNumbersPt2 = (calibration: string) => {
  const firstNumber = findFirstWordOrNumber(calibration)?.value
  if (firstNumber === undefined) {
    throw new Error(`No first number found: ${calibration}`)
  }
  const lastNumber = findFirstWordOrNumber(calibration, true)?.value

  if (lastNumber === undefined) {
    throw new Error(`No last number found: ${calibration}`)
  }

  return firstNumber + lastNumber
}

const findWordsAndNumbers = (calibrations: Array<string>) => {
  const result = calibrations.map(getNumbersPt2)
  return result.reduce((total, current) => total + parseInt(current, 10), 0)
}

const part1 = (dataInput: Array<string>) => {
  return findNumbers(dataInput)
}

const part2 = (dataInput: Array<string>) => {
  return findWordsAndNumbers(dataInput)
}

runAOC({ part1, part2 })
