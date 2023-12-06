import add from "../../utils/add"
import runAOC from "../../utils/runAOC"
import multiply from "../../utils/multiply"

const MAX_RED = 12
const MAX_GREEN = 13
const MAX_BLUE = 14

const parseId = (rawId: string) => {
  const parsed = rawId.replace("Game ", "")

  const idNumber = parseInt(parsed, 10)

  if (isNaN(idNumber)) {
    throw new Error(`Invalid ID passeed in: ${rawId}`)
  }

  return idNumber
}

const parseGames = (rawGames: string) => {
  const games = rawGames.split("; ")
  return games.map((game) => {
    const rawCubes = game.split(", ")
    const cubes: Record<string, number> = {}
    rawCubes.forEach((cube) => {
      const [value, key] = cube.split(" ")
      cubes[key] = parseInt(value, 10)
      if (isNaN(cubes[key])) {
        throw new Error(`Error: Value not a number: ${cubes[key]} | ${cube}`)
      }
    })

    return cubes
  })
}

const parseInput = (data: Array<string>) => {
  return data.reduce<Record<string, ReturnType<typeof parseGames>>>(
    (result, current) => {
      const [rawId, rawGames] = current.split(": ")
      const id = parseId(rawId)

      result[id] = parseGames(rawGames)

      return result
    },
    {}
  )
}

interface GameCubes {
  red?: number
  blue?: number
  green?: number
}

const isGameValid = ({ red, green, blue }: GameCubes) => {
  if (red === undefined && green === undefined && blue === undefined) {
    return false
  }

  if (!!red) {
    if (red > MAX_RED) {
      return false
    }
  }

  if (!!green) {
    if (green > MAX_GREEN) {
      return false
    }
  }

  if (!!blue) {
    if (blue > MAX_BLUE) {
      return false
    }
  }

  return true
}

const part1 = (dataInput: Array<string>) => {
  const data = parseInput(dataInput)

  const dataEntries = Object.entries(data)

  const ids = dataEntries.map(([idAsString, games]) => {
    const isValid = games.every(isGameValid)
    return isValid ? parseInt(idAsString, 10) : 0
  })

  return add(...ids)
}

const getPowerFromCubes = (games: Array<GameCubes>) => {
  const maxes = {
    red: 0,
    green: 0,
    blue: 0,
  }

  games.forEach(({ red, green, blue }) => {
    if (!!red) {
      maxes.red = Math.max(red, maxes.red)
    }

    if (!!green) {
      maxes.green = Math.max(green, maxes.green)
    }

    if (!!blue) {
      maxes.blue = Math.max(blue, maxes.blue)
    }
  })

  return multiply(...Object.values(maxes))
}

const part2 = (dataInput: Array<string>) => {
  const data = parseInput(dataInput)

  const values = Object.values(data)

  const maxCubes = values.map(getPowerFromCubes)

  return add(...maxCubes)
}

runAOC({ part1, part2 })
