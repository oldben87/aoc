import { Coords } from "../../types"
import add from "../../utils/add"
import { getCoordsAsKey } from "../../utils/coordHelpers"
import { getDistanceFromCoords } from "../../utils/coordHelpers"
import runAOC from "../../utils/runAOC"

const isGalaxy = (val: string) => val === "#"

const insertToString = (
  valToInsert: string,
  insertInto: string,
  index: number
) => {
  const result = insertInto.split("")

  result.splice(index, 0, valToInsert)

  return result.join("")
}

const expandGalaxy = (data: Array<string>) => {
  const extraRows: Array<string> = []
  data.forEach((row) => {
    const newRow = row.split("")
    if (newRow.every((toCheck) => !isGalaxy(toCheck))) {
      extraRows.push(newRow.join(""), newRow.join(""))
    } else {
      extraRows.push(newRow.join(""))
    }
  })

  let newColumns: Array<string> = extraRows.map((row) => row)
  let columnsAdded = 0
  for (let column = 0; column < extraRows[0].length; column++) {
    const checkColumn = []

    for (let row = 0; row < extraRows.length; row++) {
      checkColumn.push(extraRows[row][column])
    }

    if (checkColumn.every((toCheck) => !isGalaxy(toCheck))) {
      newColumns = newColumns.map((rowToAmend) =>
        insertToString(".", rowToAmend, column + columnsAdded)
      )

      columnsAdded++
    }
  }

  return newColumns
}

const getDistanceFromCoordinates = (distances: Array<Coords>): number => {
  let distance = 0
  distances.forEach((coords, ind, array) => {
    array.forEach((subCoords, index) => {
      if (getCoordsAsKey(coords) === getCoordsAsKey(subCoords) || index < ind) {
        return
      }

      const newDistance = getDistanceFromCoords(coords, subCoords)
      distance = add(distance, newDistance)
    })
  })

  return distance
}

const calculateMinimumDistances = (
  data: Array<string>,
  rows: Array<number> = [],
  columns: Array<number> = [],
  expansionFactor = 1
) => {
  const galaxies: Array<Coords> = []
  for (let row = 0; row < data.length; row++) {
    for (let column = 0; column < data[0].length; column++) {
      if (isGalaxy(data[row][column])) {
        galaxies.push({
          y: adjustForExpansion(row, rows, expansionFactor),
          x: adjustForExpansion(column, columns, expansionFactor),
        })
      } else {
        continue
      }
    }
  }

  return getDistanceFromCoordinates(galaxies)
}

const adjustForExpansion = (
  value: number,
  expandedSpaces: Array<number>,
  multiplier = 1
) => {
  const filtered = expandedSpaces.filter((space) => value > space)

  if (filtered.length) {
    const timesToMultiply = filtered.length

    return value - timesToMultiply + multiplier * timesToMultiply
  }

  return value
}

const expandGalaxyCoords = (data: Array<string>) => {
  const rowsExpanded: Array<number> = []
  const columnsExpanded: Array<number> = []

  data.forEach((row, index) => {
    const newRow = row.split("")
    if (newRow.every((toCheck) => !isGalaxy(toCheck))) {
      rowsExpanded.push(index)
    }
  })

  for (let column = 0; column < data[0].length; column++) {
    const checkColumn = []

    for (let row = 0; row < data.length; row++) {
      checkColumn.push(data[row][column])
    }

    if (checkColumn.every((toCheck) => !isGalaxy(toCheck))) {
      columnsExpanded.push(column)
    }
  }
  return calculateMinimumDistances(data, rowsExpanded, columnsExpanded, 1000000)
}

const part1 = (data: Array<string>) => {
  const expandedGalaxy = expandGalaxy(data)

  return calculateMinimumDistances(expandedGalaxy, [], [], 1)
}

const part2 = (data: Array<string>) => {
  return expandGalaxyCoords(data)
}

runAOC({ part1, part2 })
