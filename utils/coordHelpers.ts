import { Coords } from "../types"

export const getCoordsAsKey = ({ x, y }: Coords) => {
  return `${x},${y}`
}

export const getCoordsFromKey = (key: string): Coords => {
  const [x, y] = key.split(",")
  if (x === undefined || y === undefined) {
    throw new Error("Invalid coord key passed in")
  }
  return { x: Number(x), y: Number(y) }
}

export const getDistanceFromCoords = (
  { x: xA, y: yA }: Coords,
  { x: xB, y: yB }: Coords
) => {
  return Math.abs(xA - xB) + Math.abs(yA - yB)
}

export const addCoords = (
  { x: xA, y: yA }: Coords,
  { x: xB, y: yB }: Coords
): Coords => {
  return { x: xA + xB, y: yA + yB }
}
