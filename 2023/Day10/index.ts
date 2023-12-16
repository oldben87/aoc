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

const findPieceByDirections = (
  directionsToCheck: Array<Direction>
): PipePiece | undefined => {
  if (directionsToCheck.length !== 2) {
    throw new Error(
      "Invalid directionsToCheck Provided: " + directionsToCheck.join(", ")
    )
  }
  const result = Object.entries(movements).find(([_, compareAgainst]) => {
    return compareAgainst.every((val) => directionsToCheck.includes(val))
  })

  if (result) {
    return result[0] as PipePiece
  }

  return
}

const findStart = (
  data: Array<string>
): { coords: Coords; piece: PipePiece } => {
  let coords: Coords | undefined
  for (let row = 0; row < data.length; row++) {
    if (coords) break
    for (let column = 0; column < data[0].length; column++) {
      if (data[row][column] === "S") {
        coords = { x: column, y: row }
        break
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

  const piece = findPieceByDirections(validDirections)

  if (!piece) {
    throw new Error("Unble to find piece")
  }

  return { coords, piece }
}

const makeNextMove = (
  data: Array<string>,
  coords: Coords,
  nextDirection: Direction
) => {
  const nextCoords = addCoords(coords, getCoordShift(nextDirection))
  const nextPiece = data[nextCoords.y][nextCoords.x]

  if (nextPiece !== "S" && !assertPipePiece(nextPiece)) {
    throw new Error("Come off the rails with: " + nextPiece)
  }

  if (nextPiece === "S") {
    return { coords: nextCoords }
  }

  const newNextDirections = movements[nextPiece].filter((val, _, arr) => {
    return val !== getTargetMatch(nextDirection)
  })

  if (newNextDirections.length !== 1) {
    throw new Error("not filtered the previous direction from current piece")
  }

  return { coords: nextCoords, nextDirection: newNextDirections[0] }
}

const part1 = (data: Array<string>) => {
  const start = findStart(data)
  const nextDirection = movements[start.piece][1]

  const nextMove = makeNextMove(data, start.coords, nextDirection)

  let steps = 1
  let coords = nextMove.coords
  let directionOfTravel = nextDirection

  while (data[coords.y][coords.x] !== "S") {
    const move = makeNextMove(data, coords, directionOfTravel)

    coords = move.coords
    steps++

    if (!move.nextDirection) {
      console.log(steps)
      continue
    }

    directionOfTravel = move.nextDirection
  }

  return steps / 2
}

runAOC({ part1 })
