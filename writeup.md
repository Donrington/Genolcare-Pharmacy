Section 4: Velocity Logistics (The Last-Mile Sprint)
1. Advanced Technical Write-up: "The Kinetic Network"
The VelocityLogistics.tsx component is designed as a Horizontal Kinetic Thread. In a 2026 build, this section must use the user's scroll velocity as the engine for its own animation.

Component Architecture:
The Full-Width Canvas: Use an <AnimatedVectorMap> component (using react-three-fiber or a dynamic SVG canvas) that spans the width of the viewport. As the user scrolls Y, the map translates X (the parallax effect).

The "drawIn" Route Path: Map the scrollYProgress [0.3, 0.7] to the stroke-dashoffset of a complex vector path representing a delivery from the Genolcare central hub in Wuse, Abuja, to a hypothetical last-mile destination. As the user scrolls down, the route path "draws itself" across the map.

Metric Cards & Velocity Coupling:
Use a velocity-coupled hook. If the user scrolls rapidly (high useVelocity), the following happens:

The horizontal translation speed of the FloatingMetricCards ([60-Min Fulfillment] and [Cold-Chain Last Mile]) increases dramatically, creating extreme parallax depth.

The drawIn map path animation becomes erratic and rapid, flickering with a subtle "glitch shader" to imply optimized, high-frequency routing calculations.

Refinement: The cards use Framer Motion variants. Fast scroll triggers a skewX variant of +/- 3 degrees, making the cards "trail" with physical inertia. Slow scroll settles them into a stable state.