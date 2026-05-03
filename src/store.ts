import { create } from 'zustand';

interface StoreState {
  currentSlide: number;
  trafficMultiplier: number;
  eksNodeCount: number;
  isPanicMode: boolean;
  nextSlide: (max: number) => void;
  prevSlide: () => void;
  setSlide: (index: number) => void;
  applySlideEffects: (index: number) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  currentSlide: 0,
  trafficMultiplier: 1,
  eksNodeCount: 50,
  isPanicMode: false,
  
  applySlideEffects: (index: number) => {
    // Determine effects based on the slide index
    // Slide 2 (Problem Analysis) -> simulate spike
    // Slide 4 (Tools & Solution) -> show massive EKS cluster
    // Slide 3 (Literature Review) -> normal cache
    
    let traffic = 1;
    let nodes = 50;
    let panic = false;
    
    if (index === 2) {
      traffic = 10; // Dhoni spike
    } else if (index === 4 || index === 5 || index === 6) {
      nodes = 300; // Auto-scaled
      traffic = 2; // steady traffic
    } else if (index === 8) {
      panic = true; // Just to show panic mode in personal insights
    }
    
    set({
      trafficMultiplier: traffic,
      eksNodeCount: nodes,
      isPanicMode: panic
    });
  },

  nextSlide: (max: number) => {
    const next = Math.min(get().currentSlide + 1, max - 1);
    set({ currentSlide: next });
    get().applySlideEffects(next);
  },
  
  prevSlide: () => {
    const prev = Math.max(get().currentSlide - 1, 0);
    set({ currentSlide: prev });
    get().applySlideEffects(prev);
  },
  
  setSlide: (index: number) => {
    set({ currentSlide: index });
    get().applySlideEffects(index);
  }
}));
