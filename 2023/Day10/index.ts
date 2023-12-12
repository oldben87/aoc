import { Coords } from "../../types"
import { addCoords } from "../../utils/coordHelpers"
import runAOC from "../../utils/runAOC"

const pipePieces = ["|", "7", "J", "F", "L", "-"] as const
const directions = ["north", "south", "east", "west"] as const

type PipePiece = (typeof pipePieces)[number]
type Direction = (typeof directions)[number]

const getTargetMatch = (currentDirection: Direction): Direction => {
  switch (currentDirection) {
    case "east":
      return "west"
    case "west":
      return "east"
    case "north":
      return "south"
    case "south":
      return "north"
    default:
      throw new Error("Invalid Direction provided: " + currentDirection)
  }
}

const getCoordShift = (direction: Direction): Coords => {
  switch (direction) {
    case "east":
      return { x: 1, y: 0 }
    case "west":
      return { x: -1, y: 0 }
    case "north":
      return { x: 0, y: -1 }
    case "south":
      return { x: 0, y: 1 }
    default:
      throw new Error("Invalid Direction provided: " + direction)
  }
}

const assertPipePiece = (value: any): value is PipePiece =>
  pipePieces.includes(value)

const assertDirection = (value: any): value is Direction =>
  directions.includes(value)

const movements: Record<PipePiece, Array<Direction>> = {
  "|": ["north", "south"],
  "7": ["west", "south"],
  J: ["north", "west"],
  F: ["south", "east"],
  "-": ["east", "west"],
  L: ["north", "east"],
}
const canMove = (currentPiece: string, targetPiece: string) => {
  if (currentPiece === "." || targetPiece === ".") {
    return false
  }

  if (!assertPipePiece(currentPiece) || !assertPipePiece(targetPiece)) {
    throw new Error("not pipe piece")
  }

  const current = movements[currentPiece]
  const target = movements[targetPiece]

  let canMove: Direction | undefined
  for (let i = 0; i < current.length; i++) {
    for (let j = 0; j < target.length; j++) {
      const targetDirection = getTargetMatch(current[i])
      if (targetDirection === target[j]) {
        canMove = current[i]
      }
    }
  }

  if (canMove) {
    return true
  }

  return false
}

const findStart = (
  data: Array<string>
): { coords: Coords; directions: Array<Direction> } => {
  let coords: Coords | undefined
  for (let row = 0; row < data.length; row++) {
    for (let column = 0; column < data[0].length; column++) {
      if (data[row][column] === "S") {
        coords = { x: column, y: row }
      }
    }
  }

  if (coords === undefined) {
    throw new Error("No start found!")
  }

  const validDirections: Array<Direction> = []

  directions.forEach((dir) => {
    const shiftedCoords = getCoordShift(dir)

    if (!coords) throw new Error("No start found!")

    const newCoords = addCoords(coords, shiftedCoords)

    const valueToCheck = data[newCoords.y][newCoords.x]

    if (!valueToCheck || !assertPipePiece(valueToCheck)) {
      return
    }

    const toMatch = getTargetMatch(dir)

    const movementsToCheck = movements[valueToCheck]

    if (movementsToCheck.includes(toMatch)) {
      validDirections.push(dir)
    }
  })

  return { coords, directions: validDirections }
}

const findNextCoord = (
  data: Array<string>,
  { x, y }: Coords,
  exclude?: Direction
) => {
  const filteredDirections = exclude
    ? directions.filter((dir) => dir !== exclude)
    : directions

  const currentVal = data[y][x]

  let nextCoordinate: Coords | undefined

  filteredDirections.forEach((dir) => {
    const shiftedCoords = getCoordShift(dir)
    const newCoords = addCoords({ x, y }, shiftedCoords)
    const valueToCheck = data[newCoords.y][newCoords.x]

    if (!valueToCheck || !assertPipePiece(valueToCheck)) {
      return
    }

    if (!assertPipePiece(currentVal)) {
      throw new Error("Bad current value: " + currentVal)
    }

    const movementValid = canMove(currentVal, valueToCheck)

    if (movementValid) {
      nextCoordinate = shiftedCoords
    }
  })

  return nextCoordinate
}

const part1 = (data: Array<string>) => {
  const start = findStart(data)

  let previousDirection = start.directions[1]

  // breaking due to S not a valid pipe piece
  const next = findNextCoord(data, start.coords, previousDirection)
  console.log(next)

  // make recursive function to return number?

  return start as unknown as string
}

runAOC({ part1 })
