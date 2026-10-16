import logoUrl from '../assets/ve-boost-logo.png'

/**
 * Logo VE-BOOST (versione bianca su fondo trasparente).
 * Scala in base alla prop `height`; la larghezza segue le proporzioni
 * originali dell'immagine (2032x290).
 */
export default function Logo({ height = 28, className = '', title = 'VE-BOOST' }) {
  return (
    <img
      src={logoUrl}
      alt={title}
      className={className}
      style={{ height, width: 'auto', display: 'block' }}
    />
  )
}
