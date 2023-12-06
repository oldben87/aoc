# aoc-template

A typescript project template for solving advent of code challenges.
[Advent of Code](https://adventofcode.com/)

Use the defined project structure for best results. Create a new folder for each year, and a sub folder for each day.
Happy Coding!!!

# How to run

1.  `npm install`
2.  `npx ts-node 2015/Day1`

# CLI Flags

- `test` use the test-input.txt file for this run
- `altData` - use either alt-test-input.txt or alt-input.txt file depending on use of the `test` flag
- `pt1` just run part 1
- `pt2` just run part 2
- `-dp` set an alternate data path if the input file cannot be found from your current directory. The new file path must follow this flag: `-dp path_to/new_file.txt`
- `-bp` set an alternative base path to run against if you are not in the root directory of the project. `-bp ./path_to/input_files/`
