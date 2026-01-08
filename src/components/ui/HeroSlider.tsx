import React from 'react';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import Autoplay from "embla-carousel-autoplay";

type Slide = {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  cta: {
    primary: { text: string; link: string };
    secondary: { text: string; link: string };
  };
};

type HeroSliderProps = {
  slides: Slide[];
  autoPlay?: boolean;
  interval?: number;
};

export function HeroSlider({ slides, autoPlay = true, interval = 3000 }: HeroSliderProps) {
  const plugin = React.useRef(
    Autoplay({ delay: interval, stopOnInteraction: false })
  );

  return (
    <Carousel
      plugins={autoPlay ? [plugin.current] : []}
      className="w-full group"
      style={{ perspective: '1000px' }}
    >
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id} className="transition-transform duration-500 ease-in-out group-hover:rotate-y-2">
            <div className="relative h-[30vh] md:h-[50vh] w-full overflow-hidden">
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40" />
              {/* Bottom 20% Fade - Mobile Only */}
              <div className="absolute bottom-0 left-0 right-0 h-1/5 bg-gradient-to-t from-background to-transparent md:hidden z-10 pointer-events-none" />

              <div className="absolute inset-0 container-premium flex items-center z-20">
                <div className="max-w-2xl text-white space-y-6 animate-in fade-in-5 slide-in-from-bottom-10 duration-700">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">{slide.badge}</span>
                  <h1 className="text-2xl md:text-6xl font-heading font-bold">
                    {slide.title} <span className="text-accent">{slide.subtitle}</span>
                  </h1>
                  <p className="text-sm text-white/90">{slide.description}</p>
                  <div className="flex gap-4">
                    <Button asChild size="sm" className="btn-hero">
                      <Link to={slide.cta.primary.link}>{slide.cta.primary.text}</Link>
                    </Button>
                    <Button asChild size="sm" variant="secondary" className="bg-white text-primary hover:bg-gray-200">
                      <Link to={slide.cta.secondary.link}>{slide.cta.secondary.text}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 border-white/50 hover:text-white hidden lg:inline-flex" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 border-white/50 hover:text-white hidden lg:inline-flex" />
    </Carousel>
  );
}

