import add from "../../utils/add"
import runAOC from "../../utils/runAOC"

const parseId = (rawId: string) => {
  const parsed = rawId.replace("Card ", "")

  const idNumber = parseInt(parsed, 10)

  if (isNaN(idNumber)) {
    throw new Error(`Invalid ID passeed in: ${rawId}`)
  }

  return idNumber
}

const parseGames = (rawGame: string): Game => {
  const [rawWinningNumbers, rawNumbers] = rawGame
    .replaceAll("  ", " ")
    .split(" | ")

  return {
    winningNumbers: rawWinningNumbers.split(" ").map(Number),
    numbers: rawNumbers.split(" ").map(Number),
  }
}

type Game = { winningNumbers: Array<number>; numbers: Array<number> }

const parseArray = (data: Array<string>) => {
  const results = data.reduce<Record<number, Game>>((acc, game) => {
    const [rawId, rawGames] = game.split(": ")

    acc[parseId(rawId)] = parseGames(rawGames)

    return acc
  }, {})

  return results
}

const getMatches = ({ winningNumbers, numbers }: Game) => {
  return winningNumbers.reduce((tot, curr) => {
    return numbers.includes(curr) ? tot + 1 : tot
  }, 0)
}

const part1 = (data: Array<string>) => {
  const bingoGames = parseArray(data)
  const pileWorth = Object.values(bingoGames).reduce((total, game) => {
    const matches = getMatches(game)

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

const getItem = (id: number, memo: CardMemo, matches?: number) => {
  const result = memo[id]
  if (!result) {
    return {
      matches,
      copies: 1,
    }
  }

  return result
}

type CardMemo = Record<number, { matches?: number; copies: number }>
const part2 = (data: Array<string>) => {
  const bingoGames = parseArray(data)
  const maxID = data.length

  const cardsMemo: CardMemo = {}

  Object.entries(bingoGames).forEach(([cardId, game]) => {
    const matches = getMatches(game)

    const id = Number(cardId)

    const item = getItem(id, cardsMemo, matches)

    if (item?.matches === undefined) {
      item.matches = matches
    }

    cardsMemo[id] = item

    for (let copies = 1; copies <= item.copies; copies++) {
      for (let i = 1; i <= matches; i++) {
        const newId = id + i
        if (newId > maxID) {
          break
        }

        const newItem = getItem(newId, cardsMemo)
        newItem.copies++

        cardsMemo[newId] = newItem
      }
    }
  })

  return add(...Object.values(cardsMemo).map(({ copies }) => copies))
}

runAOC({ part1, part2 })
