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

const part1 = (data: Array<string>) => {
  const parsed = parseData(data)

  const numberOfWins: Array<number> = []

  for (let i = 0; i < parsed.Time.length; i++) {
    const time = parsed.Time[i]
    const distanceToBeat = parsed.Distance[i]
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

  return multiply(...numberOfWins)
}

runAOC({ part1 })
