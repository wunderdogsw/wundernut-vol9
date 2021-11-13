# JavaScript solution

- node `node index.js`
- script `index.html`
- script, presentation of algorithm `presentation.html`

  <br />
  <br />

## Algorithm step by step

  <br />

### 1. Convert given ascii pattern to array of numbers (`firstLine`)

```javascript
function getPattern(asciiPattern) {
  const indexedPatern = []

  asciiPattern
    .split('')
    .forEach((item, index) =>
      item === CHAR_FILLED ? indexedPatern.push(index) : null
    )

  return indexedPatern
}
```

  <br />

### 2. Generate next lines according the rules

Function `getNextLine()` iterate trough preceding (above) line - represented by an array of numbers (`newLine`) - and call function `unwind()`.

<br />

### 2.1. _unwind_ function

Function `unwind` convert array of number to pattern of bits and return one of four predefined commands:

- `BLANK_AND_NEXT` - _blank square and jump to the next square_
- `FILL_AND_NEXT` - _fill square and jump to the next square_
- `BLANK_AND_JUMP` - _blank square and test the next square on the right_
- `FILL_AND_JUMP` - _fill square and test the next square on the right_

```javascript
function unwind(line, index) {
  let bits = 0

  line.includes(index + 2) ? (bits |= 0b00001) : null
  line.includes(index + 1) ? (bits |= 0b00010) : null
  line.includes(index + 0) ? (bits |= 0b00100) : null
  line.includes(index - 1) ? (bits |= 0b01000) : null
  line.includes(index - 2) ? (bits |= 0b10000) : null

  return commands[bits]
}
```

  <br />

### 2.2 Zero indexed array

Beside `newLine` represented by an array of numbers, function `getNextLine()` generate `zeroIndexLine` for later pattern type checking, precisely for **gliding** pattern type checking.
<br />
I.e.

```
newLine=[-1,3,8] => zeroIndexLine=[0,4,9]
newLine=[1,3,8] => zeroIndexLine=[0,2,7]
```

  <br />

### 3. Detect pattern type

Function `checkPatternType()` detects pattern type:

1.  If the line length is less than 2 - **vanishing** pattern type
2.  If the line is the same as one of the preceding lines - **blinking** pattern type
3.  If the zero indexed line is the same as one of the preceding zero indexed lines - **gliding** pattern type
4.  Else - **other** pattern type

```javascript
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
```
