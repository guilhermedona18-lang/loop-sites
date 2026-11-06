"use client"

import { HeroBanner } from "../home/hero-banner"
import { SearchPanel } from "../home/search-panel"
import { FeaturedVehicles } from "../home/featured-vehicles"
import { Testimonials } from "../home/testimonials"

export function HomeView() {
  return (
    <div>
      <HeroBanner />
      <SearchPanel />
      <FeaturedVehicles />
      <Testimonials />
    </div>
  )
}
