import { useEffect, useRef } from 'react';

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      loadTime: 0,
      renderTime: 0,
      memoryUsage: 0,
      fcp: 0, // First Contentful Paint
      lcp: 0, // Largest Contentful Paint
      cls: 0, // Cumulative Layout Shift
      fid: 0, // First Input Delay
    };
    
    this.observers = [];
    this.init();
  }

  init() {
    // Performance Observer để theo dõi Core Web Vitals
    if ('PerformanceObserver' in window) {
      this.observeWebVitals();
    }
    
    // Theo dõi memory usage
    this.monitorMemory();
    
    // Theo dõi load time
    this.monitorLoadTime();
  }

  observeWebVitals() {
    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcp) {
        this.metrics.fcp = fcp.startTime;
      }
    });
    fcpObserver.observe({ entryTypes: ['paint'] });
    this.observers.push(fcpObserver);

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.push(lcpObserver);

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      this.metrics.cls = clsValue;
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
    this.observers.push(clsObserver);

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const firstInput = entries[0];
      if (firstInput) {
        this.metrics.fid = firstInput.processingStart - firstInput.startTime;
      }
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
    this.observers.push(fidObserver);
  }

  monitorMemory() {
    if ('memory' in performance) {
      const updateMemory = () => {
        this.metrics.memoryUsage = performance.memory.usedJSHeapSize;
        setTimeout(updateMemory, 5000); // Update every 5 seconds
      };
      updateMemory();
    }
  }

  monitorLoadTime() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          this.metrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        }
      }, 0);
    });
  }

  getMetrics() {
    return { ...this.metrics };
  }

  getFormattedMetrics() {
    return {
      'Load Time': `${this.metrics.loadTime.toFixed(2)}ms`,
      'First Contentful Paint': `${this.metrics.fcp.toFixed(2)}ms`,
      'Largest Contentful Paint': `${this.metrics.lcp.toFixed(2)}ms`,
      'Cumulative Layout Shift': this.metrics.cls.toFixed(4),
      'First Input Delay': `${this.metrics.fid.toFixed(2)}ms`,
      'Memory Usage': `${(this.metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  logMetrics() {
    console.group('🚀 Performance Metrics');
    const formatted = this.getFormattedMetrics();
    Object.entries(formatted).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
    console.groupEnd();
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
  }
}

export const usePerformanceMonitor = (enabled = process.env.NODE_ENV === 'development') => {
  const monitorRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    monitorRef.current = new PerformanceMonitor();
    
    // Log metrics after initial load
    setTimeout(() => {
      monitorRef.current.logMetrics();
    }, 3000);

    return () => {
      if (monitorRef.current) {
        monitorRef.current.destroy();
      }
    };
  }, [enabled]);

  return monitorRef.current;
};

export default PerformanceMonitor;