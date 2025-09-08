import SalinityProfileChart from './SalinityProfileChart';
import EquatorFloatMap from './EquatorFloatMap';

const SalinityEquatorAnalysis = () => {
  return (
    <div className="space-y-4">
      {/* Analysis Description */}
      <div className="glass-card p-4 rounded-lg bg-background/80 backdrop-blur-sm border border-border/30">
        <p className="text-sm text-foreground">
          Here are salinity profiles collected near the Equator (5°N–5°S) during March 2023. 
          The profiles show variation in salinity with depth across different floats. 
          Highlighted markers represent float positions contributing to the analysis.
        </p>
      </div>

      {/* Combined Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Salinity Profile Chart */}
        <div className="glass-card rounded-lg overflow-hidden">
          <SalinityProfileChart />
        </div>

        {/* Float Location Map */}
        <div className="glass-card rounded-lg overflow-hidden">
          <EquatorFloatMap />
        </div>
      </div>

      {/* Data Source Caption */}
      <div className="text-center text-xs text-muted-foreground italic">
        Simulated from ARGO float data near Equator, March 2023
      </div>
    </div>
  );
};

export default SalinityEquatorAnalysis;