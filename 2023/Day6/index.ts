import multiply from "../../utils/multiply"
import runAOC from "../../utils/runAOC"

const parseData = (data: Array<string>) => {
  const result: { Time: Array<number>; Distance: Array<number> } = {
    Time: [],
    Distance: [],
  }
  data.forEach((rawStat) => {
    const [key, values] = rawStat.split(":")
    if (key === "Time" || key === "Distance") {
      result[key] = values.split(" ").filter(Boolean).map(Number)
    }
  })

  return result
}

const solvePuzzle = (data: ReturnType<typeof parseData>) => {
  const numberOfWins: Array<number> = []

  for (let i = 0; i < data.Time.length; i++) {
    const time = data.Time[i]
    const distanceToBeat = data.Distance[i]
    let winners = 0
    for (let pressedFor = 1; pressedFor < time; pressedFor++) {
      const remainingTime = time - pressedFor
      const distanceTravelled = remainingTime * pressedFor
      if (distanceTravelled > distanceToBeat) {
        winners++
      }
    }

    numberOfWins.push(winners)
  }

  return numberOfWins
}

const part1 = (data: Array<string>) => {
  const parsed = parseData(data)

  const numberOfWins = solvePuzzle(parsed)

  return multiply(...numberOfWins)
}

const part2 = (data: Array<string>) => {
  const parsed = parseData(data)

  const adjusted = {
    Time: [Number(parsed.Time.join(""))],
    Distance: [Number(parsed.Distance.join(""))],
  }

  const numberOfWins = solvePuzzle(adjusted)

  return Math.max(...numberOfWins)
}

runAOC({ part1, part2 })
