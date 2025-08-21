import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Play, Pause, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SlideData {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  cta: {
    primary: { text: string; link: string };
    secondary: { text: string; link: string };
  };
  badge?: string;
}

interface ParallaxSliderProps {
  slides: SlideData[];
  autoPlay?: boolean;
  interval?: number;
}

export function ParallaxSlider({ slides, autoPlay = true, interval = 5000 }: ParallaxSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, interval, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="relative h-[75vh] md:h-[90vh] overflow-hidden group">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Background Images with Advanced Parallax */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
              index === currentSlide
                ? 'opacity-100 scale-100 blur-0'
                : index === currentSlide - 1 || (currentSlide === 0 && index === slides.length - 1)
                ? 'opacity-30 scale-110 blur-sm'
                : index === currentSlide + 1 || (currentSlide === slides.length - 1 && index === 0)
                ? 'opacity-30 scale-110 blur-sm'
                : 'opacity-0 scale-125 blur-md'
            }`}
            style={{
              transform: `translateX(${(index - currentSlide) * 100}%) scale(${
                index === currentSlide ? 1 : 1.1
              }) rotateY(${index === currentSlide ? 0 : (index - currentSlide) * 5}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-[4000ms] ease-out"
              style={{
                backgroundImage: `url(${slide.image})`,
                transform: `translateX(${index === currentSlide ? '0' : '20px'}) scale(${
                  index === currentSlide ? 1.05 : 1.1
                })`,
                filter: `brightness(${index === currentSlide ? 0.8 : 0.6}) contrast(${
                  index === currentSlide ? 1.1 : 0.9
                }) saturate(${index === currentSlide ? 1.2 : 0.8})`,
              }}
            />
            
            {/* Multi-layer Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-accent/10" />
            
            {/* Animated Glow Effect */}
            <div 
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-premium-gold/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/15 rounded-full blur-2xl animate-pulse" 
                   style={{ animationDelay: '1s' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 border border-white/10 rounded-full animate-spin" 
             style={{ animationDuration: '20s' }} />
        <div className="absolute bottom-20 left-20 w-24 h-24 border border-premium-gold/20 rounded-full animate-pulse" />
        <Sparkles className="absolute top-1/3 right-1/3 w-6 h-6 text-white/30 animate-pulse" 
                  style={{ animationDelay: '2s' }} />
      </div>

      {/* Enhanced Content with Glassmorphism */}
      <div className="relative container-premium h-full flex items-center z-10">
        <div className="max-w-4xl">
          {/* Content Background with Glassmorphism */}
          <div className="backdrop-blur-sm bg-black/20 rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
            {slides[currentSlide].badge && (
              <Badge 
                className={`mb-6 bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20 transition-all duration-500 animate-fade-in ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ animationDelay: '0.2s' }}
              >
                <Sparkles className="w-3 h-3 mr-2" />
                {slides[currentSlide].badge}
              </Badge>
            )}
            
            <h1 
              className={`text-hero font-heading mb-6 leading-tight transition-all duration-700 ease-out ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ animationDelay: '0.4s' }}
            >
              <span className="block text-white text-shadow-lg hover:text-shadow-glow transition-all duration-300">
                {slides[currentSlide].title}
              </span>
              <span className="text-premium-gold block mt-2 bg-gradient-to-r from-premium-gold to-accent bg-clip-text text-transparent animate-pulse">
                {slides[currentSlide].subtitle}
              </span>
            </h1>
            
            <p 
              className={`text-xl mb-8 text-white/90 max-w-2xl leading-relaxed transition-all duration-700 ease-out ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ animationDelay: '0.6s' }}
            >
              {slides[currentSlide].description}
            </p>
            
            <div 
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 ease-out ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ animationDelay: '0.8s' }}
            >
              <Button 
                size="lg" 
                className="btn-hero text-lg px-8 py-4 hover-scale bg-gradient-to-r from-primary to-primary-glow hover:shadow-[0_0_30px_rgba(0,100,100,0.5)] transition-all duration-300 transform hover:-translate-y-1"
                asChild
              >
                <Link to={slides[currentSlide].cta.primary.link}>
                  {slides[currentSlide].cta.primary.text}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4 border-white/40 text-white hover:bg-white/10 hover:border-white backdrop-blur-md bg-white/5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                asChild
              >
                <Link to={slides[currentSlide].cta.secondary.link}>
                  {slides[currentSlide].cta.secondary.text}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
        {/* Glassmorphism Dots Indicator */}
        <div className="flex items-center gap-3 bg-black/20 backdrop-blur-lg rounded-full px-6 py-3 border border-white/10 shadow-xl">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative transition-all duration-500 hover:scale-125 ${
                index === currentSlide
                  ? 'w-10 h-3 bg-gradient-to-r from-premium-gold to-accent rounded-full shadow-lg'
                  : 'w-3 h-3 bg-white/40 hover:bg-white/70 rounded-full'
              }`}
            >
              {index === currentSlide && (
                <div className="absolute inset-0 bg-gradient-to-r from-premium-gold to-accent rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* Enhanced Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="p-3 bg-black/20 backdrop-blur-lg rounded-full hover:bg-black/30 transition-all duration-300 text-white border border-white/10 shadow-xl hover:scale-110 hover:shadow-2xl"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>
      </div>

      {/* Enhanced Arrow Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-black/20 backdrop-blur-lg rounded-full hover:bg-black/30 transition-all duration-300 text-white group z-20 border border-white/10 shadow-xl hover:scale-110 hover:shadow-2xl"
      >
        <ChevronLeft className="w-6 h-6 group-hover:scale-110 group-hover:-translate-x-1 transition-all duration-300" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-black/20 backdrop-blur-lg rounded-full hover:bg-black/30 transition-all duration-300 text-white group z-20 border border-white/10 shadow-xl hover:scale-110 hover:shadow-2xl"
      >
        <ChevronRight className="w-6 h-6 group-hover:scale-110 group-hover:translate-x-1 transition-all duration-300" />
      </button>

      {/* Enhanced Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20 z-10 backdrop-blur-sm">
        <div
          className="h-full bg-gradient-to-r from-premium-gold via-accent to-primary transition-all duration-1000 relative overflow-hidden"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
        </div>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 bg-black/20 backdrop-blur-lg rounded-full px-4 py-2 text-white text-sm border border-white/10 shadow-xl">
        <span className="font-mono">
          {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
      </div>
    </section>
  );
}