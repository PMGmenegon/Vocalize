import type { Accent, ScenarioId } from '../../types'
import { Airport, HotelUK, HotelUS } from './artAirportHotel'
import { DinerUS, OfficeUK, OfficeUS, PubUK } from './artRestaurantOffice'
import { HighStreetUK, MallUS, ParkUK, ParkUS } from './artShoppingPark'

const ART: Record<ScenarioId, Record<Accent, () => React.JSX.Element>> = {
  restaurant: { 'en-US': DinerUS, 'en-GB': PubUK },
  'job-interview': { 'en-US': OfficeUS, 'en-GB': OfficeUK },
  airport: { 'en-US': () => <Airport uk={false} />, 'en-GB': () => <Airport uk /> },
  hotel: { 'en-US': HotelUS, 'en-GB': HotelUK },
  shopping: { 'en-US': MallUS, 'en-GB': HighStreetUK },
  'small-talk': { 'en-US': ParkUS, 'en-GB': ParkUK },
}

interface SceneProps {
  scenarioId: ScenarioId
  accent: Accent
  className?: string
  /** Miniaturas ficam paradas (sem animações). */
  still?: boolean
}

/**
 * Paisagem ilustrada do cenário, no sotaque pedido. É decorativa (aria-hidden) e
 * preenche o espaço do pai (`slice`). As animações sutis param com "reduzir movimento".
 */
export default function Scene({ scenarioId, accent, className = '', still = false }: SceneProps) {
  const Art = ART[scenarioId][accent]
  return (
    <svg
      viewBox="0 0 800 450"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={`block h-full w-full ${still ? 'scene-still' : ''} ${className}`}
    >
      <Art />
    </svg>
  )
}
