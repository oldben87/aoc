const isNumber = (char: any): char is number => !isNaN(Number(char))

export default isNumber
