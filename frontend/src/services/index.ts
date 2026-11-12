/** Única porta de entrada para dados. Hoje devolvem mocks; nas próximas fases passam a chamar a API. */
export { authService } from './authService'
export type { Credentials, Preferences, Registration } from './authService'
export { reviewService } from './reviewService'
export { scenarioService } from './scenarioService'
export { sessionService } from './sessionService'
export type { HintKind, StartSessionInput } from './sessionService'
export { statsService } from './statsService'
