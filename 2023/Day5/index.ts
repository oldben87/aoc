import runAOC from "../../utils/runAOC"

const notEmptyString = (val?: string) => !!val && val !== ""

const customDataParser = (rawData: string) => {
  const result = rawData
    .split("\n\n")
    .reduce<{ seeds: Array<number>; mappings: Record<string, number[][]> }>(
      (acc, inputItem) => {
        const [key, value] = inputItem.split(":")
        const isSeeds = key === "seeds"
        if (isSeeds) {
          acc.seeds = value.split(" ").filter(notEmptyString).map(Number)
        } else {
          const res = value
            .split("\n")
            .filter(notEmptyString)
            .reduce<Array<number[]>>((mapTo, current) => {
              mapTo.push(
                current
                  .split(" ")
                  .filter((val) => val !== "")
                  .map(Number)
              )
              return mapTo
            }, [])

          acc.mappings[key] = res
        }

        return acc
      },
      { seeds: [], mappings: {} }
    )

  return result
}

type CustomData = ReturnType<typeof customDataParser>

const isBetween = (val: number, min: number, max: number) => {
  return val >= min && val <= max
}

const part1 = (data: CustomData) => {
  const results: Array<{ seed: number; mappedTo: number }> = []
  data.seeds.forEach((seed) => {
    let result = seed
    Object.values(data.mappings).forEach((mappings) => {
      let hasMapped = false
      mappings.forEach(([destinationStart, sourceStart, range]) => {
        if (hasMapped) {
          return
        }

        const inStartRange = isBetween(
          result,
          sourceStart,
          sourceStart + Math.max(range - 1, 0)
        )

        if (!inStartRange) {
          return
        }

        const sourceOffset = destinationStart - sourceStart

        result += sourceOffset
        hasMapped = true
      })
    })
    results.push({ seed, mappedTo: result })
  })

  return Math.min(...results.map(({ mappedTo }) => mappedTo))
}

runAOC({ part1, customDataParser })
