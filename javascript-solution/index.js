const MAX_LINES = 100

const CHAR_FILLED = '#'
const CHAR_BLANK = '.'

const PATTERN_TYPE_OTHER = 'other'
const PATTERN_TYPE_GLIDING = 'gliding'
const PATTERN_TYPE_VANISHING = 'vanishing'
const PATTERN_TYPE_BLINKING = 'blinking'

const BLANK_AND_NEXT = 0b00
const FILL_AND_NEXT = 0b10
const BLANK_AND_JUMP = 0b01
const FILL_AND_JUMP = 0b11

const FILL_MASK = 0b10
const JUMP_MASK = 0b01

const commands = [
  /*  0 ..... */ BLANK_AND_JUMP,
  /*  1 ....# */ BLANK_AND_JUMP,
  /*  2 ...#. */ BLANK_AND_JUMP,
  /*  3 ...## */ FILL_AND_NEXT,
  /*  4 ..#.. */ BLANK_AND_JUMP,
  /*  5 ..#.# */ BLANK_AND_NEXT,
  /*  6 ..##. */ BLANK_AND_NEXT,
  /*  7 ..### */ FILL_AND_NEXT,
  /*  8 .#... */ BLANK_AND_JUMP,
  /*  9 .#..# */ FILL_AND_NEXT,
  /* 10 .#.#. */ FILL_AND_NEXT,
  /* 11 .#.## */ FILL_AND_NEXT,
  /* 12 .##.. */ BLANK_AND_NEXT,
  /* 13 .##.# */ FILL_AND_NEXT,
  /* 14 .###. */ FILL_AND_NEXT,
  /* 15 .#### */ BLANK_AND_NEXT,
  /* 16 #.... */ BLANK_AND_JUMP,
  /* 17 #...# */ FILL_AND_JUMP,
  /* 18 #..#. */ FILL_AND_JUMP,
  /* 19 #..## */ FILL_AND_NEXT,
  /* 20 #.#.. */ BLANK_AND_JUMP,
  /* 21 #.#.# */ FILL_AND_NEXT,
  /* 22 #.##. */ FILL_AND_NEXT,
  /* 23 #.### */ BLANK_AND_NEXT,
  /* 24 ##... */ FILL_AND_JUMP,
  /* 25 ##..# */ FILL_AND_NEXT,
  /* 26 ##.#. */ FILL_AND_NEXT,
  /* 27 ##.## */ BLANK_AND_NEXT,
  /* 28 ###.. */ FILL_AND_NEXT,
  /* 29 ###.# */ BLANK_AND_NEXT,
  /* 30 ####. */ BLANK_AND_NEXT,
  /* 31 ##### */ FILL_AND_NEXT,
]

const patterns = [
  '##.######',
  '#.###......................#.###......................####......................###.#......................###.#',
  '#######',
  '#.#..#...####..##..##..##',
  '###.#....#.###',
  '########',
  '##...#.###########',
  '#.#..#...####..##..##..##.....##',
  '#######.##.##.#.#....#.######',
  '#.######',
  '##....#.#....#.....#....#....#.....###.#',
  '#.###........................................................#######........................................................###.#',
  '#...###...#.#',
  '#...#.#..###...#',
  '#########',
  '#######.##.##.#.#',
  '#...#...#...#...#...#...#...#...#...#...#',
  '#..##.#..#',
  '#.###...................................................###.#',
  '######',
  '#...#...#...#...#...#...#...#...#...#...#....#######.##.##.#.#',
]

// ****************************************************************************
function unwind(line, index) {
  let bits = 0

  line.includes(index + 2) ? (bits |= 0b00001) : null
  line.includes(index + 1) ? (bits |= 0b00010) : null
  line.includes(index + 0) ? (bits |= 0b00100) : null
  line.includes(index - 1) ? (bits |= 0b01000) : null
  line.includes(index - 2) ? (bits |= 0b10000) : null

  return commands[bits]
}

// ****************************************************************************
function getPattern(asciiPattern) {
  const indexedPatern = []

  asciiPattern
    .split('')
    .forEach((item, index) =>
      item === CHAR_FILLED ? indexedPatern.push(index) : null
    )

  return indexedPatern
}

// ****************************************************************************
function getNextLine(line) {
  const newLine = []
  let zeroIndexOffset = Number.MIN_SAFE_INTEGER
  let squareNextLineIndex = Number.MIN_SAFE_INTEGER

  for (let i = 1; i < line.length; i++) {
    const filledIndex = line[i]
    let command

    if (squareNextLineIndex < filledIndex - 2) {
      squareNextLineIndex = filledIndex - 3
    } else {
      continue
    }

    do {
      ++squareNextLineIndex
      command = unwind(line, squareNextLineIndex)

      if (command & FILL_MASK) {
        if (zeroIndexOffset === Number.MIN_SAFE_INTEGER) {
          zeroIndexOffset = squareNextLineIndex
        }
        newLine.push(squareNextLineIndex)
      }
    } while (!(command & JUMP_MASK))
  }

  return [newLine, newLine.map((filledIndex) => filledIndex - zeroIndexOffset)]
}

// ****************************************************************************
function checkPatternType(lines, zeroIndexLines, newLine, newZeroIndexLine) {
  if (newLine.length < 2) {
    return PATTERN_TYPE_VANISHING
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const zeroIndexLine = zeroIndexLines[i]

    if (
      line.length === newLine.length &&
      JSON.stringify(line) === JSON.stringify(newLine)
    ) {
      return PATTERN_TYPE_BLINKING
    }

    if (
      zeroIndexLine.length === newZeroIndexLine.length &&
      JSON.stringify(zeroIndexLine) === JSON.stringify(newZeroIndexLine)
    ) {
      return PATTERN_TYPE_GLIDING
    }
  }

  return PATTERN_TYPE_OTHER
}

// ****************************************************************************
function main() {
  patterns.forEach((item) => {
    const lines = []
    const zeroIndexLines = []
    let lineIndex = 0
    let patternType = PATTERN_TYPE_OTHER
    const firstLine = getPattern(item)

    lines.push(firstLine)
    zeroIndexLines.push(firstLine)

    while (lineIndex < MAX_LINES) {
      const [newLine, newZeroIndexLine] = getNextLine(lines[lineIndex])

      patternType = checkPatternType(
        lines,
        zeroIndexLines,
        newLine,
        newZeroIndexLine
      )

      if (patternType !== PATTERN_TYPE_OTHER) {
        break
      }

      lines.push(newLine)
      zeroIndexLines.push(newZeroIndexLine)
      lineIndex++
    }

    console.log(patternType)
  })
}

main()
