export function EngineeringDiagram() {
  return (
    <div className="engineering-art">
      <svg
        aria-hidden="true"
        className="engineering-art__drawing"
        viewBox="0 0 520 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path className="diagram-grid" d="M260 22V458M34 240H486" />
        <path className="diagram-grid" d="M80 80L440 400M440 80L80 400" />

        <circle className="diagram-line diagram-draw" cx="104" cy="300" r="74" pathLength={1} />
        <circle className="diagram-line diagram-draw" cx="104" cy="300" r="46" pathLength={1} />
        <circle className="diagram-accent diagram-draw" cx="104" cy="300" r="12" pathLength={1} />
        <circle className="diagram-line diagram-draw" cx="416" cy="300" r="74" pathLength={1} />
        <circle className="diagram-line diagram-draw" cx="416" cy="300" r="46" pathLength={1} />
        <circle className="diagram-accent diagram-draw" cx="416" cy="300" r="12" pathLength={1} />

        <g transform="translate(104 300)">
          <g className="diagram-gear diagram-gear--left">
            <circle className="diagram-gear__ring diagram-draw" r="30" pathLength={1} />
            <circle className="diagram-gear__hub diagram-draw" r="18" pathLength={1} />
            <path className="diagram-gear__teeth diagram-draw" d="M0-39V-29M0 29V39M39 0H29M-29 0H-39M27.5-27.5L20.5-20.5M-20.5 20.5L-27.5 27.5M27.5 27.5L20.5 20.5M-20.5-20.5L-27.5-27.5" pathLength={1} />
            <path className="diagram-gear__spokes diagram-draw" d="M0-18V18M-18 0H18M-12.7-12.7L12.7 12.7M12.7-12.7L-12.7 12.7" pathLength={1} />
          </g>
        </g>

        <g transform="translate(416 300)">
          <g className="diagram-gear diagram-gear--right">
            <circle className="diagram-gear__ring diagram-draw" r="30" pathLength={1} />
            <circle className="diagram-gear__hub diagram-draw" r="18" pathLength={1} />
            <path className="diagram-gear__teeth diagram-draw" d="M0-39V-29M0 29V39M39 0H29M-29 0H-39M27.5-27.5L20.5-20.5M-20.5 20.5L-27.5 27.5M27.5 27.5L20.5 20.5M-20.5-20.5L-27.5-27.5" pathLength={1} />
            <path className="diagram-gear__spokes diagram-draw" d="M0-18V18M-18 0H18M-12.7-12.7L12.7 12.7M12.7-12.7L-12.7 12.7" pathLength={1} />
          </g>
        </g>

        <path className="diagram-line diagram-draw" d="M104 300L207 224L260 245L313 224L416 300" pathLength={1} />
        <path className="diagram-line diagram-draw" d="M104 300L207 376L260 355L313 376L416 300" pathLength={1} />
        <path className="diagram-rack diagram-draw" d="M207 224V376M313 224V376M207 300H313" pathLength={1} />
        <path className="diagram-accent diagram-draw" d="M226 280L260 244L294 280V320L260 356L226 320V280Z" pathLength={1} />
        <circle className="diagram-accent diagram-draw" cx="260" cy="300" r="24" pathLength={1} />
        <path className="diagram-tick diagram-draw" d="M104 204V184M104 416V396M416 204V184M416 416V396" pathLength={1} />
        <path className="diagram-tick diagram-draw" d="M207 201V183M313 201V183M207 417V399M313 417V399" pathLength={1} />
      </svg>
    </div>
  );
}
