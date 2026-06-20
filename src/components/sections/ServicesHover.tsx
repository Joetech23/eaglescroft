'use client'

import {
  HoverSlider,
  HoverSliderImage,
  HoverSliderImageWrap,
  TextStaggerHover,
} from '@/components/ui/animated-slideshow'

const SLIDES = [
  { id: 'web', title: 'web development', imageUrl: 'https://images.unsplash.com/photo-1654618977232-a6c6dea9d1e8?q=80&w=2486&auto=format&fit=crop' },
  { id: 'uiux', title: 'ui ux design', imageUrl: 'https://images.unsplash.com/photo-1688733720228-4f7a18681c4f?q=80&w=2487&auto=format&fit=crop' },
  { id: 'brand', title: 'branding', imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2487&auto=format&fit=crop' },
  { id: 'video', title: 'video editing', imageUrl: 'https://images.unsplash.com/photo-1574717025058-2f8737d2e2b7?q=80&w=2487&auto=format&fit=crop' },
  { id: 'seo', title: 'seo & marketing', imageUrl: 'https://images.unsplash.com/photo-1726066012698-bb7a3abce786?q=80&w=2487&auto=format&fit=crop' },
  { id: 'it', title: 'it & automation', imageUrl: 'https://images.unsplash.com/photo-1624996752380-8ec242e0f85d?q=80&w=2487&auto=format&fit=crop' },
]

export default function ServicesHover() {
  return (
    <HoverSlider
      id="services"
      className="place-content-center bg-white px-6 py-[120px] text-navy md:px-12"
    >
      <div className="mx-auto max-w-[1280px]">
        <h3 className="mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-gold-500">/ our services</h3>
        <p className="mb-10 max-w-xl font-display text-2xl font-semibold tracking-tightest text-navy md:text-3xl">
          Hover a craft to see it in motion.
        </p>

        <div className="flex flex-wrap items-center justify-between gap-8 md:gap-12">
          <div className="flex flex-col space-y-1.5 md:space-y-3">
            {SLIDES.map((slide, index) => (
              <TextStaggerHover
                key={slide.id}
                index={index}
                className="cursor-pointer font-display text-3xl font-bold uppercase tracking-tighter text-navy md:text-5xl"
                text={slide.title}
              />
            ))}
          </div>

          <HoverSliderImageWrap className="w-full max-w-[520px] overflow-hidden rounded-[28px] border border-navy/10 shadow-[0_30px_70px_rgba(0,30,96,0.18)]">
            {SLIDES.map((slide, index) => (
              <div key={slide.id}>
                <HoverSliderImage
                  index={index}
                  imageUrl={slide.imageUrl}
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="size-full max-h-[420px] object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
            ))}
          </HoverSliderImageWrap>
        </div>
      </div>
    </HoverSlider>
  )
}
