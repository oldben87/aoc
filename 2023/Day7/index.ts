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
] as const

type CardType = (typeof cardOrder)[number]

type Hand = {
  hand: Array<string>
  bid: number
  type: string
}

const assertIsCardType = (val: any): val is CardType => cardOrder.includes(val)

const compareCards = (card1: string, card2: string): number => {
  if (!assertIsCardType(card1) || !assertIsCardType(card2)) {
    throw new Error(`invalid card supplied. card1: ${card1} || card2: ${card2}`)
  }

  const card1Index = cardOrder.findIndex((card) => card1 === card)
  const card2Index = cardOrder.findIndex((card) => card2 === card)

  return card2Index - card1Index
}

const getHandType = (hand: Array<string>) => {
  const matches: Record<string, number> = {}

  hand.forEach((card) => {
    if (matches[card] === undefined) {
      matches[card] = 1
      return
    }
    matches[card]++
  })

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

const compareHands = (handA: Hand, handB: Hand): number => {
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

    result = compareCards(cardA, cardB)
    break
  }
  return result
}

const parseData = (data: Array<string>): Array<Hand> => {
  return data.map((handNBid) => {
    const [rawHand, rawBid] = handNBid.split(" ")
    const hand = rawHand.split("")

    const type = getHandType(hand)

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

runAOC({ part1 })
