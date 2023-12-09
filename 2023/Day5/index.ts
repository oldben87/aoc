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

type SeedRange = { start: number; range: number }

const getSeedsAsRanges = (seeds: Array<number>): Array<SeedRange> => {
  const parsedSeeds: Array<SeedRange> = []
  for (let i = 0; i < seeds.length; i += 2) {
    parsedSeeds.push({ start: seeds[i], range: seeds[i + 1] })
  }
  return parsedSeeds
}

const isAValidRangeValue = (value: number, seeds: Array<SeedRange>) => {
  return seeds.some(({ start, range }) =>
    isBetween(value, start, start + range - 1)
  )
}

const reverse = ({ seeds, mappings }: CustomData) => {
  // start at 0
  // work upwards until true!
  const seedRanges = getSeedsAsRanges(seeds)
  const arrayOfMappings = Object.values(mappings).reverse()

  let lowestLocation: number | undefined

  let location = -1

  while (lowestLocation === undefined) {
    location++

    let result = location

    arrayOfMappings.forEach((mappings) => {
      let hasMapped = false
      const mappingsCopy = mappings.map((item) => item).reverse()
      mappingsCopy.forEach(([destinationStart, sourceStart, range]) => {
        if (hasMapped) {
          return
        }

        const inDestinationRange = isBetween(
          result,
          destinationStart,
          destinationStart + Math.max(range - 1, 0)
        )

        if (!inDestinationRange) {
          return
        }

        const sourceOffset = sourceStart - destinationStart

        result += sourceOffset
        hasMapped = true
      })
    })

    if (isAValidRangeValue(result, seedRanges)) {
      lowestLocation = location
    }
  }

  return lowestLocation
}

runAOC({ part1, part2: reverse, customDataParser })
