import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center justify-center bg-brand-deep text-center text-white">
      <div className="container-x">
        <p className="text-7xl font-semibold text-gold-400 md:text-9xl">404</p>
        <h1 className="mt-4 text-2xl font-semibold md:text-4xl">This page took flight.</h1>
        <p className="mx-auto mt-4 max-w-md text-white/65">
          The page you’re looking for doesn’t exist or has moved. Let’s get you back on track.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button href="/" variant="gold" withArrow>Back home</Button>
          <Button href="/contact" variant="outline">Contact us</Button>
        </div>
      </div>
    </section>
  )
}
