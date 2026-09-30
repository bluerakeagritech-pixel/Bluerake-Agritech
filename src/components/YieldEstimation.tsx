import React, { useState } from 'react';
import { CloudRain, Sprout, LineChart } from 'lucide-react';
import { estimateYield, analyzeSatelliteImagery } from '../services/riskScoring';

interface YieldEstimationProps {
  cropType: string;
  farmSize: number;
  region: string;
  location: { lat: number; lng: number };
}

const YieldEstimation: React.FC<YieldEstimationProps> = ({
  cropType,
  farmSize,
  region,
  location
}) => {
  const [yieldData, setYieldData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const calculateYield = async () => {
    setLoading(true);
    try {
      // Get satellite data
      const satelliteData = await analyzeSatelliteImagery(location);
      
      // Mock historical data (in production, this would come from the database)
      const historicalData = {
        goodPractices: true,
        previousYields: [2.4, 2.6, 2.3],
        irrigationUsage: true
      };

      // Calculate yield estimation
      const estimation = await estimateYield(
        cropType,
        farmSize,
        region,
        historicalData,
        satelliteData
      );

      setYieldData(estimation);
    } catch (error) {
      console.error('Error calculating yield:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Sprout className="w-5 h-5 text-green-600" />
        Yield Estimation
      </h2>

      <button
        onClick={calculateYield}
        disabled={loading}
        className="w-full mb-6 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        {loading ? 'Calculating...' : 'Calculate Estimated Yield'}
      </button>

      {yieldData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <LineChart className="w-5 h-5 text-green-600" />
                <h3 className="font-medium">Estimated Yield</h3>
              </div>
              <p className="text-2xl font-bold text-green-700">
                {yieldData.estimatedYield} MT/ha
              </p>
              <p className="text-sm text-green-600">
                Confidence: {Math.round(yieldData.confidence * 100)}%
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CloudRain className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium">Weather Impact</h3>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${yieldData.factors.weather * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-blue-600 mt-1">
                {Math.round(yieldData.factors.weather * 100)}% optimal conditions
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Sprout className="w-5 h-5 text-emerald-600" />
              <h3 className="font-medium">Growth Factors</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Soil Health</span>
                  <span>{Math.round(yieldData.factors.soil * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full"
                    style={{ width: `${yieldData.factors.soil * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Management Practices</span>
                  <span>{Math.round(yieldData.factors.management * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full"
                    style={{ width: `${yieldData.factors.management * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YieldEstimation;