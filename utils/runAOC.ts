import fs from "fs"
import path from "path"

const DATA_PATH_ARGUMENT = "-dp"
const BASE_PATH_ARGUMENT = "-bp"

type RunAOCOptionsGeneric<T> = {
  part1?: (data: T) => number | string
  part2?: (data: T) => number | string
  customDataParser?: (data: string) => T
}

const runAOC = <T = Array<string>>(options: RunAOCOptionsGeneric<T>) => {
  const part1 = options?.part1
  const part2 = options?.part2
  const customDataParser = options?.customDataParser

  const [_, nodeFilePath, ...cliArgs] = process.argv

  // List of cli arguements to check for.
  const isPart1 = cliArgs.includes("pt1")
  const isPart2 = cliArgs.includes("pt2")

  /**
   * By default we search for a ./input.txt file.
   * Most AoC challenges provide some test input to ensure your code runs
   * Adding the test flag will search for a ./test-input.txt file
   */
  const isTest = cliArgs.includes("test")

  /**
   * Some AoC challenges provide alternative inputs for part 2 of the challenge.
   * Adding the altData flag will append alt- to the front of the input file.
   * So either alt-test-input.txt or alt-input.txt can also be used allowing up to 4 input.txt variations
   */
  const useAltData = cliArgs.includes("altData")

  /**
   * If you want to have a seperate file for input with a different name you can pass in the -dp < path_to/file.txt >
   */
  const hasDataPath = cliArgs.includes(DATA_PATH_ARGUMENT)

  /**
   * If you are running the commands not from the root folder of your AoC folders, you can pass in base file path to find the input files if they cannot be found.
   */
  const hasBasePath = cliArgs.includes(BASE_PATH_ARGUMENT)

  let basePath = ""

  if (hasBasePath) {
    const index = cliArgs.findIndex((arg) => arg === BASE_PATH_ARGUMENT) + 1
    const maybePath = cliArgs[index]
    if (maybePath === undefined) {
      throw new Error(
        `Base path argument required after '${BASE_PATH_ARGUMENT}' command`
      )
    }
    basePath = maybePath
  }

  let file

  if (hasDataPath) {
    const index = cliArgs.findIndex((arg) => arg === DATA_PATH_ARGUMENT) + 1
    const maybePath = cliArgs[index]
    if (maybePath === undefined) {
      throw new Error(
        `Data file path argument required after '${DATA_PATH_ARGUMENT}' command`
      )
    }
    file = maybePath
  }

  const pathToCheck = nodeFilePath.split("/")
  if (file === undefined) {
    const day = pathToCheck.find((str) => {
      if (str.length !== 4 && str.length !== 5) {
        return false
      }

      if (str.startsWith("Day")) {
        return true
      } else return false
    })

    if (!day) {
      throw new Error("Day not found")
    }

    const year = pathToCheck.find((str) => {
      if (str.length !== 4) {
        return false
      }
      if (str.startsWith("20") && parseInt(str, 10) >= 2015) {
        return true
      } else return false
    })

    if (!year) {
      throw new Error("Year not found")
    }

    const inputFile = `${useAltData ? "alt-" : ""}${
      isTest ? "test-" : ""
    }input.txt`

    file = `${basePath}${year}/${day}/${inputFile}`
  }

  // parse data to array
  const rawInput = fs.readFileSync(path.resolve(file), "utf8")

  const data = !!customDataParser
    ? customDataParser(rawInput)
    : (rawInput.split("\n") as T)

  const runAll = !isPart1 && !isPart2

  const runPart1 = (isPart1 || runAll) && !!part1
  const runPart2 = (isPart2 || runAll) && !!part2

  if (runPart1) {
    console.time("Part 1:")
    console.log("Part 1:", part1(data))
    console.timeEnd("Part 1:")
  }

  if (runPart2) {
    console.time("Part 2:")
    console.log("Part 2:", part2(data))
    console.timeEnd("Part 2:")
  }
}
export default runAOC
