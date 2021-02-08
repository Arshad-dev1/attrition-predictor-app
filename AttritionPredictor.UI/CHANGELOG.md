## [1.5.0] 2018-09-21
### Nice stuff
- Added `install:clean` command (deletes `node_modules` and `package-lock.json` and runs `npm install`)
### Major style changes
- `src/core/resources/reactcss/components/tasksStyle.jsx`
- `src/core/resources/reactcss/checkboxAdnRadioStyle.jsx`
- `src/core/resources/reactcss/components/customTabsStyle.jsx`
- `src/core/resources/reactcss/components/snackbarContentStyle.jsx`
### Deleted dependencies
- `@babel/runtime v7.0.0-beta.55`
### Added dependencies
### Updated dependencies
- `@material-ui/core`          *1.4.3*   →     **3.1.0**
- `@material-ui/icons`         *2.0.1*   →     **3.0.1**
- `@types/googlemaps`        *3.30.11*   →   **3.30.13**
- `ajv`                        *6.5.2*   →     **5.0.0** (to stop some warnings)
- `react`                     *16.4.1*   →    **16.5.2**
- `react-dom`                 *16.4.1*   →    **16.5.2**
- `react-scripts`              *1.1.4*   →     **1.1.5**
- `react-swipeable-views`    *0.12.15*   →   **0.12.17**
- `eslint-config-prettier`    *^2.9.0*   →    **3.0.1**
- `eslint-plugin-react`      *^7.10.0*   →   **7.11.1**
- `prettier`                 *^1.13.7*   →   **1.14.3**


## [1.3.0] 2018-06-15
### Bug Fixing
- Changed import from `material-ui` to `@material-ui/core`
- Droped `src/components/index.js`, and changed all the imports to separate ones
- Renamed `ItemGrid` to `GridItem`
### Major style changes
- Moved the styles of `src/components/` inside `src/core/resources/reactcss/components/`
- Moved the styles of `src/layouts/` inside `src/core/resources/reactcss/layouts/`
- Moved the styles of `src/views/` inside `src/core/resources/reactcss/views/`
- Almost all styles have been changed more or less
### Dropped components
- `src/components/CustomButtons/IconButton.jsx` (instead use `src/components/CustomButtons/Button.jsx` with `justIcon` prop)
- Some components from `src/components/Typography` (instead of these we've added some css to style the normal HTML tags)
  - `src/components/Typography/A.jsx`
  - `src/components/Typography/P.jsx`
  - `src/components/Typography/Small.jsx`
- All the cards from `src/components/Cards`
  - `src/components/Cards/ChartCard.jsx`
  - `src/components/Cards/ProfileCard.jsx`
  - `src/components/Cards/RegularCard.jsx`
  - `src/components/Cards/StatsCard.jsx`
  - `src/components/Cards/TasksCard.jsx`
### Added components
- New card components (`src/components/Card/*`) instead of `src/components/Cards/*`
  - `src/components/Card/Card.jsx`
  - `src/components/Card/CardAvatar.jsx`
  - `src/components/Card/CardBody.jsx`
  - `src/components/Card/CardFooter.jsx`
  - `src/components/Card/CardHeader.jsx`
  - `src/components/Card/CardIcon.jsx`
- `src/components/CustomTabs/CustomTabs.jsx` (instead of `src/components/Cards/TasksCard.jsx`)
### Deleted dependencies
- `material-ui@1.0.0-beta.41`
### Added dependencies
- `@material-ui/core@1.2.1` (instead of `material-ui@1.0.0-beta.41`)
- `@types/googlemaps@3.30.9` to stop the warning: **npm WARN react-google-maps@9.4.5 requires a peer of @types/googlemaps@^3.0.0 but none is installed. You must install peer dependencies yourself.**
- `@types/markerclustererplus@2.1.33` to stop the warning: **npm WARN react-google-maps@9.4.5 requires a peer of @types/markerclustererplus@^2.1.29 but none is installed. You must install peer dependencies yourself.**
- `ajv@6.5.1` to stop the warning: **npm WARN ajv-keywords@3.2.0 requires a peer of ajv@^6.0.0 but none is installed. You must install peer dependencies yourself.**
### Update dependencies
- `@material-ui/icons@1.0.0-beta.42` to `@material-ui/icons@1.1.0`
- `classnames@2.2.5` to `classnames@2.2.6`
- `npm-run-all@4.1.2` to `npm-run-all@4.1.3`
- `perfect-scrollbar@1.3.0` to `perfect-scrollbar@1.4.0`
- `react@16.2.0` to `react@16.4.0`
- `react-dom@16.2.0` to `react-dom@16.4.0`
- `react-router-dom@4.2.2` to `react-router-dom@4.3.1`
- `react-scripts@1.0.17` to `react-scripts@1.1.4`
- `react-swipeable-views@0.12.12` to `react-swipeable-views@0.12.13`