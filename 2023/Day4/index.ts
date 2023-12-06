import runAOC from "../../utils/runAOC"

const parseId = (rawId: string) => {
  const parsed = rawId.replace("Card ", "")

  const idNumber = parseInt(parsed, 10)

  if (isNaN(idNumber)) {
    throw new Error(`Invalid ID passeed in: ${rawId}`)
  }

  return idNumber
}

const parseGames = (rawGame: string) => {
  const [rawWinningNumbers, rawNumbers] = rawGame
    .replaceAll("  ", " ")
    .split(" | ")

  return {
    winningNumbers: rawWinningNumbers.split(" ").map(Number),
    numbers: rawNumbers.split(" ").map(Number),
  }
}

const parseArray = (data: Array<string>) => {
  const results = data.reduce<Record<string, ReturnType<typeof parseGames>>>(
    (acc, game) => {
      const [rawId, rawGames] = game.split(": ")

      acc[parseId(rawId)] = parseGames(rawGames)

      return acc
    },
    {}
  )

  return results
}

const part1 = (data: Array<string>) => {
  const bingoGames = parseArray(data)
  const pileWorth = Object.values(bingoGames).reduce((total, current) => {
    const matches = current.winningNumbers.reduce((tot, curr) => {
      return current.numbers.includes(curr) ? tot + 1 : tot
    }, 0)

    if (!matches) {
      return total
    }

    let sum = 0

    for (let i = 1; i <= matches; i++) {
      sum = !sum ? 1 : (sum *= 2)
    }

    return total + sum
  }, 0)

  return pileWorth
}

/**
 * Part 2 is a recursive function :sigh:
 */

runAOC({ part1 })
