# 1.0.0 (2025-12-28)


### Features

* addANA timezone support,, and locales ([fe20904](https://github.com/isubroto/datekit/commit/fe20904257ef7de9920a0c2f25fa50e870ff2a62))
* **format:** add formatZonedDate static and instance APIs ([bc20e52](https://github.com/isubroto/datekit/commit/bc20e5211510d2df8ed421cba2ebaa03d8459a3b))
* **project:** Configure semantic-release and enhance package metadata ([2a1228f](https://github.com/isubroto/datekit/commit/2a1228f5a0b9336c69e3452f0d5221e4371663a9))
* **tests:** add timezone test script and improve output ([5680f23](https://github.com/isubroto/datekit/commit/5680f23ede1d799df97892d7fd09a8bbbff2338a))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-12-29

### Added
- Initial release of DateKit
- DateKit class with 70+ methods for date manipulation
- Duration class for time span calculations
- IANA timezone support with `formatInTimezone`, `convertTimezone`, `fromTimezone`
- Timezone-preserving formatting with `formatFromTimezoneString` and `formatZonedDate`
- Business day calculations with holiday support
- Locale support (English, Spanish built-in)
- Chainable, immutable API
- Full TypeScript support
