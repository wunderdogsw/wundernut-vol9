class Pattern
  include Enumerable

  def self.from_ascii(str)
    # For better performance and cleaner code, we're going to represent a line
    # as an array of filled squares' offsets.
    new(str.chars.each_with_index.map { |c, i| c == '#' ? i : nil }.compact)
  end

  def initialize(seed_line)
    @seed_line = seed_line
  end

  def each
    cur_line = @seed_line
    loop { yield cur_line = generate_next_line(cur_line) }
  end

  private

  # Generate a successor for a line
  #
  # To see if the cells of the next line are filled in or not,
  # the naive approach would be to iterate through the cells of the next line
  # and see one-by-one if there is a certain number of filled-in cells above.
  # However, this algorithm would cause a lot of pointless lookups. Instead,
  # we will look at each filled-in cell in the current row, see which cells
  # of the next row it affects, increment the affectee's "filled-in-neighbors"
  # counter and then see if they should to be filled or not.
  def generate_next_line(line)
    line
      .flat_map { |pos| [pos - 2, pos - 1, pos + 1, pos + 2] }
      .each_with_object(Hash.new(0)) { |o, l| l[o] += 1 }
      .select { |pos, filled_n| filled_n == 2 || filled_n == (line.include?(pos) ? 4 : 3) }
      .keys
  end
end

def detect_pattern_type(pattern, max_iter)
  lines = []
  zero_offset_lines = []

  pattern.lazy.take(max_iter).each do |line|
    return 'vanishing' if line.length <= 1 # Cannot recover with just 1 square

    min_pos = line.min
    zero_offset_line = line.map { |pos| pos - min_pos }

    # Have we seen this line before, no matter the offset?
    if zero_offset_lines.include?(zero_offset_line)
      # Was it offset the same as well?
      if lines.include?(line)
        return 'blinking'
      else
        return 'gliding'
      end
    end

    zero_offset_lines << zero_offset_line
    lines << line
  end

  'other'
end

patterns = File.readlines('patterns.txt').map { |l| Pattern.from_ascii(l) }

patterns.each do |pattern|
  puts detect_pattern_type(pattern, 100)
end
