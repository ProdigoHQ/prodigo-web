import HeroContent from "./hero/hero-content";
import ProductPreview from "./hero/product-preview";

export default function LandingHero() {
  return (
    <section
      id="accueil"
      className="relative overflow-hidden bg-white pt-24 pb-16 sm:pt-28 lg:pt-32 lg:pb-24"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(30,45,103,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(30,45,103,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 55% 55% at 50% 0%, black 15%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 55% 55% at 50% 0%, black 15%, transparent 75%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 50% 0%, rgba(230,106,31,0.07), transparent 72%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HeroContent />
        <ProductPreview />
      </div>
    </section>
  );
}
