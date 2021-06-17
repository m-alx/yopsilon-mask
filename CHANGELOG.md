# Change log


## [1.0.1] - 2019-09-07

### Changed

- Updated to Angular 7.

## [1.0.2] - 2019-09-09

### Fixed

- Dependencies fix.

## [1.0.3] - 2019-09-10

### Added

- CI & Coveralls.

## [1.0.4]

### Added

- Some tests.

## [1.0.5]

### Added

- Mask.maskWithPattern static method for quick creating mask with given pattern.

## [1.1.0]

### Added

- Signum before prefix: format "~${n1.2}" -> "-$1,234.25", "${n1.2}" -> "$-1,234.25".

## [1.1.1]

### Fixed

- Handling Backspace if delete a prefix.

## [1.1.2]

### Fixed

- Handling backspace if delete digit when string contains signum before prefix.

## [1.1.3]

### Fixed

- Vulnerabilities fix.

## [1.2.0]

### Changed

- Updated to Angular 11

### Fixed

- Parser bug: Two digit years were mapped to 1900-1999.

## [1.2.1]

### Fixed

- License, repository and homepage in package.json.

## [1.2.2]

### Changed

- Angular has been moved to peer dependencies.

## [1.2.3]

### Added

- Signum chars for numbers with `P` specifier are forbidden (only positive numbers).

## [1.2.5]

### Fixed

- Insert digit after signum before prefix for the `~${n1-4.2}` format.

## [1.2.6]

### Fixed

- setDisabledState implementation.

## [1.2.7]

### Fixed

- Numeric parser: JS floating point error fix.

## [1.2.8]

### Fixed

- Positive numbers format: thousand separators fix (specifiers N, R, P). Example: {R1.2} 1234 -> 1,234.00

## [1.2.9]

### Fixed

- P specifier - for positive numbers without separators.