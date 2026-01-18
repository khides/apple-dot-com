'use client'

import { NavHeader, HeroSection, ProductCard, Footer, FeaturePromoSection, ServiceCarousel } from '@khides/minimal-ds'
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
          backgroundImage="/images/hero/iphone-16-pro.png"
          imagePosition="bottom"
          primaryAction={{ label: 'Learn more', href: '/iphone-16-pro' }}
          secondaryAction={{ label: 'Shop iPhone', href: '/shop/buy-iphone' }}
          className="!min-h-[580px] lg:!min-h-[600px]"
        />

        {/* Apple Watch Series 11 */}
        <ProductCard
          subtitle="WATCH"
          title="SERIES 11"
          tagline="Thinnest ever."
          theme="light"
          layout="full-width"
          image="/images/products/apple-watch-series-11.png"
          imageAlt="Apple Watch Series 11"
          imagePosition="center"
          primaryAction={{ label: 'Learn more', href: '/apple-watch-series-11' }}
          secondaryAction={{ label: 'Shop Apple Watch', href: '/shop/buy-watch' }}
          className="!min-h-[450px] lg:!min-h-[500px]"
        />

        {/* iPad Air - Full Width */}
        <ProductCard
          subtitle="iPad Air"
          title="Fresh Air."
          theme="light"
          layout="full-width"
          image="/images/products/ipad-air.png"
          imageAlt="iPad Air"
          imagePosition="center"
          primaryAction={{ label: 'Learn more', href: '/ipad-air' }}
          secondaryAction={{ label: 'Shop iPad Air', href: '/shop/buy-ipad/ipad-air' }}
          className="!min-h-[450px] lg:!min-h-[500px]"
        />

        {/* Grid Section 1: MacBook Pro + Apple Watch Ultra */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-3">
          {/* MacBook Pro */}
          <ProductCard
            title="MacBook Pro"
            tagline="Mind-blowing. Head-turning."
            theme="dark"
            layout="half-width"
            image="/images/products/macbook-pro.png"
            imageAlt="MacBook Pro"
            imagePosition="center"
            primaryAction={{ label: 'Learn more', href: '/macbook-pro' }}
            secondaryAction={{ label: 'Shop MacBook Pro', href: '/shop/buy-mac/macbook-pro' }}
            className="!min-h-[500px] lg:!min-h-[550px]"
          />

          {/* Apple Watch Ultra 3 */}
          <ProductCard
            subtitle="WATCH"
            title="ULTRA 3"
            tagline="Next level adventure."
            theme="light"
            layout="half-width"
            image="/images/products/apple-watch-ultra-3.png"
            imageAlt="Apple Watch Ultra 3"
            imagePosition="center"
            primaryAction={{ label: 'Learn more', href: '/apple-watch-ultra' }}
            secondaryAction={{ label: 'Shop Apple Watch Ultra', href: '/shop/buy-watch/apple-watch-ultra' }}
            className="!min-h-[500px] lg:!min-h-[550px]"
          />

          {/* AirPods Pro 3 */}
          <ProductCard
            title="AirPods Pro 3"
            tagline="Adaptive Audio. Now playing."
            theme="light"
            layout="half-width"
            image="/images/products/airpods-pro-3.png"
            imageAlt="AirPods Pro 3"
            imagePosition="center"
            primaryAction={{ label: 'Learn more', href: '/airpods-pro' }}
            secondaryAction={{ label: 'Buy', href: '/shop/product/airpods-pro' }}
            className="!min-h-[500px] lg:!min-h-[550px]"
          />

          {/* Apple Fitness+ */}
          <ProductCard
            subtitle="fitness+"
            title="A new satisfying satisfying way to start."
            theme="light"
            layout="half-width"
            image="/images/products/apple-fitness+.png"
            imageAlt="Apple Fitness+"
            imagePosition="center"
            primaryAction={{ label: 'Learn more', href: '/apple-fitness-plus' }}
            secondaryAction={{ label: 'Try it free', href: '/shop/product/apple-fitness-plus' }}
            className="!min-h-[500px] lg:!min-h-[550px]"
          />
        </div>

        {/* Grid Section 2: Trade In + Apple Card - 小さめのカード */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-3">
          {/* Apple Trade In */}
          <ProductCard
            subtitle="Apple Trade In"
            title="Get $170-$630 in credit toward iPhone 16 Pro."
            theme="light"
            layout="half-width"
            image="/images/products/apple-trade-in.png"
            imageAlt="Apple Trade In"
            imagePosition="center"
            primaryAction={{ label: 'See what your device is worth', href: '/shop/trade-in' }}
            className="!min-h-[400px] lg:!min-h-[450px]"
          />

          {/* Apple Card */}
          <ProductCard
            subtitle="Apple Card"
            title="Get up to 3% Daily Cash back with every purchase."
            theme="light"
            layout="half-width"
            image="/images/products/apple-card.png"
            imageAlt="Apple Card"
            imagePosition="center"
            primaryAction={{ label: 'Learn more', href: '/apple-card' }}
            secondaryAction={{ label: 'Apply now', href: '/apple-card/apply' }}
            className="!min-h-[400px] lg:!min-h-[450px]"
          />
        </div>

        {/* Endless Entertainment Section */}
        <FeaturePromoSection
          subtitle="Endless entertainment."
          title="Watch the film."
          backgroundImage="/images/carousel/apple-arcade.png"
          theme="dark"
          size="large"
          primaryAction={{ label: 'Watch the film', href: '/watch' }}
          secondaryAction={{ label: 'Learn more', href: '/entertainment' }}
          className="!min-h-[550px] lg:!min-h-[600px]"
        />

        {/* PLURIBUS Section */}
        <FeaturePromoSection
          title="PLURIBUS"
          subtitle="Apple TV+"
          backgroundImage="/images/carousel/apple-tv.png"
          backgroundColor="#f5c518"
          theme="light"
          size="default"
          primaryAction={{ label: 'Stream now', href: '/tv' }}
          className="!min-h-[400px] lg:!min-h-[450px]"
        />

        {/* Services Carousel */}
        <ServiceCarousel
          items={[
            {
              title: 'Apple TV+',
              subtitle: 'Stream exclusive shows and movies',
              image: '/images/carousel/apple-tv.png',
              imageAlt: 'Apple TV+',
              href: '/tv',
              theme: 'dark',
            },
            {
              title: 'Apple Music',
              subtitle: '100 million songs',
              image: '/images/carousel/apple-music.png',
              imageAlt: 'Apple Music',
              href: '/music',
              theme: 'dark',
            },
            {
              title: 'Apple Arcade',
              subtitle: 'Unlimited games',
              image: '/images/carousel/apple-arcade.png',
              imageAlt: 'Apple Arcade',
              href: '/arcade',
              theme: 'dark',
            },
            {
              title: 'Apple Fitness+',
              subtitle: 'A new way to get fit',
              image: '/images/carousel/apple-fitnes+.png',
              imageAlt: 'Apple Fitness+',
              href: '/fitness',
              theme: 'dark',
            },
          ]}
          columns={4}
          theme="dark"
        />

        {/* More from Apple Section */}
        <FeaturePromoSection
          title="More from Apple"
          backgroundImage="/images/other/more-from-apple.png"
          theme="dark"
          size="large"
          textAlign="center"
          className="!min-h-[550px] lg:!min-h-[600px]"
        />
      </main>

      <Footer theme="dark" className="!min-h-[550px] lg:!min-h-[600px]" />
    </div>
  )
}
