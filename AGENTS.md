# AGENTS.md

This file contains guidelines and commands for agentic coding agents working on this repository.

## Project Overview

This is a vanilla JavaScript frontend application built with Vite (rolldown-vite). The project uses ES modules and includes a login form component and a counter component. The codebase is minimal and follows vanilla JavaScript patterns.

## Development Commands

### Core Commands
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Testing Commands
⚠️ **No testing framework is currently configured**
- No unit tests, integration tests, or e2e tests are set up
- Consider adding a testing framework like Vitest or Jest for future development
- To run single tests: Not applicable (no test framework configured)

### Linting & Formatting Commands
⚠️ **No linting or formatting tools are currently configured**
- No ESLint, Prettier, or other code quality tools are set up
- Consider adding ESLint and Prettier for consistent code style
- To lint: Not applicable (no linter configured)

## Code Style Guidelines

### JavaScript/ES6+ Conventions

#### Imports
- Use ES6 import/export syntax consistently
- Import relative modules with `./` prefix
- Group imports: external libraries first, then internal modules
- Example:
```javascript
import './style.css'
import javascriptLogo from './javascript.svg'
import { setupCounter } from './counter.js'
import { LoginForm } from "./loginform/loginform.js"
```

#### Naming Conventions
- **Variables & Functions**: camelCase (`handleSubmit`, `containerId`)
- **Classes**: PascalCase (`LoginForm`)
- **Constants**: UPPER_SNAKE_CASE (not heavily used in current codebase)
- **File names**: kebab-case for folders, camelCase for JS files (`loginform/loginform.js`)

#### Code Structure
- Use ES6 classes for component organization
- Export classes and functions using named exports
- Follow constructor pattern for class initialization
- Use template literals for HTML strings and string interpolation

#### DOM Manipulation
- Use `document.querySelector()` and `document.getElementById()`
- Prefer modern event listener syntax with arrow functions
- Use `innerHTML` for simple component rendering
- Handle form submissions with `preventDefault()`

#### Error Handling
- Basic validation with `if` checks for required fields
- Use `alert()` for simple user feedback (consider upgrading to better UX)
- Console logging for debugging (`console.log()`)

### CSS Conventions

#### Structure
- Use CSS custom properties (variables) for theming
- Organize styles with clear section comments
- Implement responsive design with media queries
- Use both light and dark theme support

#### Naming
- Use kebab-case for class names (`.auth-form`, `.form-group`)
- Use BEM-like patterns when appropriate
- Prefix component-specific classes when needed

#### Styling Patterns
- CSS custom properties for colors and spacing
- Flexbox for layouts
- Transitions for hover states
- Mobile-first responsive design

## Project Structure

```
src/
├── main.js                 # Application entry point
├── counter.js              # Counter component example
├── style.css               # Global styles
├── loginform/
│   ├── loginform.js        # LoginForm component
│   └── style.css           # LoginForm specific styles
└── javascript.svg          # JavaScript logo
```

## Component Patterns

### Class-based Components
- Constructor takes container ID as parameter
- `render()` method handles DOM insertion
- `setupEventListeners()` method for event binding
- Use `this.container` to reference DOM element

Example structure:
```javascript
export class ComponentName {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        this.setupEventListeners();
    }
    
    render() { /* DOM manipulation */ }
    setupEventListeners() { /* Event binding */ }
    handleSubmit() { /* Business logic */ }
}
```

## Development Notes

- This is a minimal setup with no build tools beyond Vite
- No TypeScript, testing framework, or linting tools configured
- Code uses modern ES6+ features
- Mixed language content (Russian text in login form)
- Consider adding: testing framework, linting, type checking, and better error handling

## Browser Compatibility

- Targets modern browsers with ES6+ support
- Uses CSS custom properties and modern CSS features
- Consider adding browser compatibility testing if needed