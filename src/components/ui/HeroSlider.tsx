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

export function HeroSlider({ slides, autoPlay = false, interval = 5000 }: HeroSliderProps) {
  const plugin = React.useRef(
    Autoplay({ delay: interval, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={autoPlay ? [plugin.current] : []}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <div className="relative h-[60vh] md:h-[80vh] w-full">
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 container-premium flex items-center">
                <div className="max-w-2xl text-white space-y-6 animate-in fade-in-5 slide-in-from-bottom-10 duration-700">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">{slide.badge}</span>
                  <h1 className="text-4xl md:text-6xl font-heading font-bold">
                    {slide.title} <span className="text-accent">{slide.subtitle}</span>
                  </h1>
                  <p className="text-lg text-white/90">{slide.description}</p>
                  <div className="flex gap-4">
                    <Button asChild size="lg" className="btn-hero">
                      <Link to={slide.cta.primary.link}>{slide.cta.primary.text}</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
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

