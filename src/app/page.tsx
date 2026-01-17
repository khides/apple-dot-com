'use client'

import { NavHeader, HeroSection, ProductCard, Footer } from '@khides/minimal-ds'
import '@khides/minimal-ds/styles'

export default function Home() {
  return (
    <div className="min-h-screen">
      <NavHeader showSearch showCart />

      <main>
        {/* Hero Section - iPhone */}
        <HeroSection
          title="iPhone 16 Pro"
          tagline="Hello, Apple Intelligence."
          theme="light"
          primaryAction={{ label: 'Learn more', href: '/iphone-16-pro' }}
          secondaryAction={{ label: 'Shop iPhone', href: '/shop/buy-iphone' }}
        />

        {/* Apple Watch */}
        <ProductCard
          subtitle="WATCH"
          title="SERIES 10"
          tagline="Thinnest ever."
          theme="light"
          layout="full-width"
          primaryAction={{ label: 'Learn more', href: '/apple-watch-series-10' }}
          secondaryAction={{ label: 'Shop Apple Watch', href: '/shop/buy-watch' }}
        />

        {/* MacBook Pro */}
        <ProductCard
          title="MacBook Pro"
          tagline="Mind-blowing. Head-turning."
          theme="dark"
          layout="full-width"
          primaryAction={{ label: 'Learn more', href: '/macbook-pro' }}
          secondaryAction={{ label: 'Shop MacBook Pro', href: '/shop/buy-mac/macbook-pro' }}
        />

        {/* Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-3">
          {/* iPad Pro */}
          <ProductCard
            subtitle="iPad Pro"
            title="Unbelievably thin. Incredibly powerful."
            theme="dark"
            layout="half-width"
            primaryAction={{ label: 'Learn more', href: '/ipad-pro' }}
            secondaryAction={{ label: 'Shop iPad Pro', href: '/shop/buy-ipad/ipad-pro' }}
          />

          {/* iPad Air */}
          <ProductCard
            subtitle="iPad Air"
            title="Fresh Air."
            theme="light"
            layout="half-width"
            primaryAction={{ label: 'Learn more', href: '/ipad-air' }}
            secondaryAction={{ label: 'Shop iPad Air', href: '/shop/buy-ipad/ipad-air' }}
          />

          {/* AirPods Pro */}
          <ProductCard
            title="AirPods Pro 2"
            tagline="Adaptive Audio. Now playing."
            theme="light"
            layout="half-width"
            primaryAction={{ label: 'Learn more', href: '/airpods-pro' }}
            secondaryAction={{ label: 'Buy', href: '/shop/product/airpods-pro' }}
          />

          {/* AirPods Max */}
          <ProductCard
            title="AirPods Max"
            tagline="Striking. All day."
            theme="dark"
            layout="half-width"
            primaryAction={{ label: 'Learn more', href: '/airpods-max' }}
            secondaryAction={{ label: 'Buy', href: '/shop/product/airpods-max' }}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
