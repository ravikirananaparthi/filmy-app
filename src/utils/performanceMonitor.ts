/**
 * Performance Monitoring Utility
 * For tracking React Native app performance metrics
 */

interface PerformanceMetrics {
    screenName: string;
    mountTime: number;
    timestamp: number;
}

class PerformanceMonitor {
    private metrics: PerformanceMetrics[] = [];
    private screenStartTimes: Map<string, number> = new Map();

    /**
     * Mark the start of screen mount
     */
    startScreenMount(screenName: string) {
        this.screenStartTimes.set(screenName, Date.now());
    }

    /**
     * Mark the end of screen mount and record duration
     */
    endScreenMount(screenName: string) {
        const startTime = this.screenStartTimes.get(screenName);
        if (!startTime) return;

        const mountTime = Date.now() - startTime;
        this.metrics.push({
            screenName,
            mountTime,
            timestamp: Date.now(),
        });

        this.screenStartTimes.delete(screenName);

        // Log in development
        if (__DEV__) {
            console.log(`[Performance] ${screenName} mounted in ${mountTime}ms`);
        }
    }

    /**
     * Get average mount time for a screen
     */
    getAverageMountTime(screenName: string): number {
        const screenMetrics = this.metrics.filter((m) => m.screenName === screenName);
        if (screenMetrics.length === 0) return 0;

        const totalTime = screenMetrics.reduce((sum, m) => sum + m.mountTime, 0);
        return totalTime / screenMetrics.length;
    }

    /**
     * Get all metrics
     */
    getAllMetrics(): PerformanceMetrics[] {
        return [...this.metrics];
    }

    /**
     * Clear all metrics
     */
    clearMetrics() {
        this.metrics = [];
        this.screenStartTimes.clear();
    }

    /**
     * Log summary of all metrics
     */
    logSummary() {
        if (!__DEV__) return;

        console.log('\n=== Performance Summary ===');
        const screenNames = [...new Set(this.metrics.map((m) => m.screenName))];

        screenNames.forEach((screenName) => {
            const avg = this.getAverageMountTime(screenName);
            const count = this.metrics.filter((m) => m.screenName === screenName).length;
            console.log(`${screenName}: ${avg.toFixed(2)}ms avg (${count} samples)`);
        });
        console.log('===========================\n');
    }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * React hook for tracking screen mount performance
 * Usage in a screen component:
 * 
 * useScreenPerformance('HomeScreen');
 */
export const useScreenPerformance = (screenName: string) => {
    const [isReady, setIsReady] = React.useState(false);

    React.useEffect(() => {
        performanceMonitor.startScreenMount(screenName);

        // Mark as ready on next frame (after initial render)
        const rafId = requestAnimationFrame(() => {
            performanceMonitor.endScreenMount(screenName);
            setIsReady(true);
        });

        return () => {
            cancelAnimationFrame(rafId);
        };
    }, [screenName]);

    return isReady;
};

// For manual use in class components
export default performanceMonitor;
