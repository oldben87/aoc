import { Coords } from "../../types"
import add from "../../utils/add"
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

const calculateMinimumDistances = (data: Array<string>) => {
  const galaxies: Array<Coords> = []
  for (let row = 0; row < data.length; row++) {
    for (let column = 0; column < data[0].length; column++) {
      if (isGalaxy(data[row][column])) {
        galaxies.push({ y: row, x: column })
      } else {
        continue
      }
    }
  }

  let distance = 0
  galaxies.forEach((coords, ind, array) => {
    array.forEach((subCoords, index) => {
      if (coords === subCoords || index < ind) {
        return
      }

      const newDistance = getDistanceFromCoords(coords, subCoords)
      distance = add(distance, newDistance)
    })
  })

  return distance
}

const part1 = (data: Array<string>) => {
  const expandedGalaxy = expandGalaxy(data)

  return calculateMinimumDistances(expandedGalaxy)
}

runAOC({ part1 })
