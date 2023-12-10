import add from "../../utils/add"
import multiply from "../../utils/multiply"
import runAOC from "../../utils/runAOC"

const HAND_TYPES = {
  FIVE_OF_KIND: "FIVE_OF_KIND",
  FOUR_OF_KIND: "FOUR_OF_KIND",
  FULL_HOUSE: "FULL_HOUSE",
  THREE_OF_KIND: "THREE_OF_KIND",
  TWO_PAIR: "TWO_PAIR",
  ONE_PAIR: "ONE_PAIR",
  HIGH_CARD: "HIGH_CARD",
}

const handOrder = Object.values(HAND_TYPES)

const cardOrder = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
]

const newCardOrder = [
  "A",
  "K",
  "Q",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "J",
]

type Hand = {
  hand: Array<string>
  bid: number
  type: string
}

const validateCardType = (val: any) => cardOrder.includes(val)

const compareCards = (
  card1: string,
  card2: string,
  cardRanking = cardOrder
): number => {
  if (!validateCardType(card1) || !validateCardType(card2)) {
    throw new Error(`invalid card supplied. card1: ${card1} || card2: ${card2}`)
  }

  const card1Index = cardRanking.findIndex((card) => card1 === card)
  const card2Index = cardRanking.findIndex((card) => card2 === card)

  return card2Index - card1Index
}

const getMatches = (hand: Array<string>) => {
  const matches: Record<string, number> = {}

  hand.forEach((card) => {
    if (matches[card] === undefined) {
      matches[card] = 1
      return
    }
    matches[card]++
  })

  return matches
}

const getHandType = (matches: Record<string, number>) => {
  const numberOfMatches = Object.values(matches)

  if (numberOfMatches.length === 5) {
    return HAND_TYPES.HIGH_CARD
  }

  if (numberOfMatches.includes(5)) {
    return HAND_TYPES.FIVE_OF_KIND
  }

  if (numberOfMatches.includes(4)) {
    return HAND_TYPES.FOUR_OF_KIND
  }

  if (
    numberOfMatches.length === 2 &&
    numberOfMatches.includes(3) &&
    numberOfMatches.includes(2)
  ) {
    return HAND_TYPES.FULL_HOUSE
  }

  if (numberOfMatches.length === 3 && numberOfMatches.includes(3)) {
    return HAND_TYPES.THREE_OF_KIND
  }

  if (numberOfMatches.length === 3 && numberOfMatches.includes(2)) {
    return HAND_TYPES.TWO_PAIR
  }

  return HAND_TYPES.ONE_PAIR
}

const compareHands = (
  handA: Hand,
  handB: Hand,
  cardRanking = cardOrder
): number => {
  const handAIndex = handOrder.findIndex((type) => type === handA.type)
  const handBIndex = handOrder.findIndex((type) => type === handB.type)
  if (handAIndex === -1 || handBIndex === -1) {
    throw new Error("Invalid hand type found")
  }

  const shouldReturn = handBIndex - handAIndex

  if (shouldReturn !== 0) {
    return shouldReturn
  }
  let result = 0
  for (let i = 0; i < handA.hand.length; i++) {
    const cardA = handA.hand[i]
    const cardB = handB.hand[i]

    if (cardA === cardB) {
      continue
    }

    result = compareCards(cardA, cardB, cardRanking)
    break
  }
  return result
}

const parseData = (data: Array<string>): Array<Hand> => {
  return data.map((handNBid) => {
    const [rawHand, rawBid] = handNBid.split(" ")
    const hand = rawHand.split("")

    const matches = getMatches(hand)

    const type = getHandType(matches)

    return { hand, bid: Number(rawBid), type }
  })
}

const part1 = (data: Array<string>) => {
  const hands = parseData(data)

  const sortedHands = hands.sort(compareHands)

  const results = sortedHands.map(({ bid }, index) => {
    return multiply(bid, index + 1)
  })

  return add(...results)
}

const adjustForJoker = (matches: Record<string, number>) => {
  const jokers = matches?.J
  if (!jokers || jokers === 5) return matches

  const orderedMatches = Object.entries(matches)
    .filter((curr) => curr[0] !== "J")
    .sort((a, b) => b[1] - a[1])
    .reduce<Record<string, number>>((acc, [key, val], index) => {
      const newValue = index === 0 ? val + jokers : val

      acc[key] = newValue
      return acc
    }, {})

  return orderedMatches
}

const parseDataPt2 = (data: Array<string>): Array<Hand> => {
  return data.map((handNBid) => {
    const [rawHand, rawBid] = handNBid.split(" ")
    const hand = rawHand.split("")

    const matches = getMatches(hand)

    const adjustedMatches = adjustForJoker(matches)

    const type = getHandType(adjustedMatches)

    return { hand, bid: Number(rawBid), type }
  })
}

const part2 = (data: Array<string>) => {
  const hands = parseDataPt2(data)

  const sortedHands = hands.sort((a, b) => compareHands(a, b, newCardOrder))

  const results = sortedHands.map(({ bid }, index) => {
    return multiply(bid, index + 1)
  })

  return add(...results)
}

runAOC({ part1, part2 })
