import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import { Thermometer, Droplets, Sun, Zap, Lightbulb, Activity, TrendingUp } from 'lucide-react';

export default function UserDashboard() {
  const { currentClient, getBoardById } = useApp();
  const [outputStates, setOutputStates] = useState<Record<string, boolean>>({});
  const [sensorValues, setSensorValues] = useState<Record<string, number>>({});

  if (!currentClient) return null;

  const board = getBoardById(currentClient.assignedBoard);
  if (!board) return null;

  // Simulate sensor readings
  useEffect(() => {
    const interval = setInterval(() => {
      const newValues: Record<string, number> = {};
      Object.keys(board.pinMapping.inputs).forEach((key, index) => {
        if (index === 0) newValues[key] = Math.floor(Math.random() * 40) + 15; // Temperature
        else if (index === 1) newValues[key] = Math.floor(Math.random() * 60) + 30; // Humidity
        else newValues[key] = Math.floor(Math.random() * 1000); // Light/Other
      });
      setSensorValues(newValues);
    }, 2000);
    return () => clearInterval(interval);
  }, [board]);

  const toggleOutput = (key: string) => {
    setOutputStates(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getInputIcon = (index: number) => {
    const icons = [Thermometer, Droplets, Sun, Activity, Zap];
    return icons[index % icons.length];
  };

  const getInputColor = (index: number) => {
    const colors = ['text-red-400', 'text-blue-400', 'text-yellow-400', 'text-purple-400', 'text-green-400'];
    return colors[index % colors.length];
  };

  const getInputUnit = (index: number) => {
    const units = ['°C', '%', 'lux', '', ''];
    return units[index % units.length];
  };

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">مرحباً، {currentClient.name}</h1>
        <p className="text-gray-400 mt-1">
          الشريحة: {board.name} • 
          <span className={`mx-2 ${currentClient.status === 'online' ? 'text-[#4CAF50]' : 'text-gray-500'}`}>
            {currentClient.status === 'online' ? '● متصل' : '○ غير متصل'}
          </span>
        </p>
      </div>

      {/* Sensor Readings */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#2196F3]" />
          قراءات الحساسات (المداخل)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(board.pinMapping.inputs).map(([key, pin], index) => {
            const Icon = getInputIcon(index);
            const color = getInputColor(index);
            const unit = getInputUnit(index);
            const alias = currentClient.aliases[key] || key;
            const value = sensorValues[key] || 0;

            return (
              <div key={key} className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-[#2a2a2a] rounded-xl flex items-center justify-center ${color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-gray-500 font-mono">Pin {pin}</span>
                </div>
                <h3 className="font-bold text-lg mb-1">{alias}</h3>
                <p className="text-xs text-gray-500 mb-3">{key}</p>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold">{value}</span>
                  <span className="text-gray-400 text-sm mb-1">{unit}</span>
                </div>
                {/* Mini bar */}
                <div className="mt-3 h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2196F3] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((value / (unit === '°C' ? 50 : unit === '%' ? 100 : 1000)) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Output Controls */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#FF9800]" />
          التحكم بالمخارج (تشغيل سريع)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(board.pinMapping.outputs).map(([key, pin]) => {
            const alias = currentClient.aliases[key] || key;
            const isOn = outputStates[key] || false;

            return (
              <div
                key={key}
                className={`bg-[#1e1e1e] border rounded-xl p-6 transition-all ${
                  isOn ? 'border-[#4CAF50]/50 bg-[#4CAF50]/5' : 'border-gray-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isOn ? 'bg-[#4CAF50]/20 text-[#4CAF50]' : 'bg-[#2a2a2a] text-gray-400'
                    }`}>
                      <Lightbulb className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{alias}</h3>
                      <p className="text-xs text-gray-500">{key} • Pin {pin}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleOutput(key)}
                    className={`relative w-14 h-7 rounded-full transition-all ${
                      isOn ? 'bg-[#4CAF50]' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                      isOn ? 'right-1' : 'right-8'
                    }`}></div>
                  </button>
                </div>
                
                <div className="mt-4 flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isOn ? 'bg-[#4CAF50] animate-pulse' : 'bg-gray-600'}`}></div>
                  <span className={`text-sm ${isOn ? 'text-[#4CAF50]' : 'text-gray-500'}`}>
                    {isOn ? 'يعمل' : 'متوقف'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Info */}
      <div className="mt-8 bg-[#1e1e1e] border border-gray-800 rounded-xl p-6">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#2196F3]" />
          معلومات سريعة
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-[#4CAF50]">{Object.keys(board.pinMapping.inputs).length}</div>
            <div className="text-xs text-gray-500">مداخل</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#FF9800]">{Object.keys(board.pinMapping.outputs).length}</div>
            <div className="text-xs text-gray-500">مخارج</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#2196F3]">{Object.values(outputStates).filter(Boolean).length}</div>
            <div className="text-xs text-gray-500">مخارج نشطة</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">
              {currentClient.lastSeen.split(' ')[1] || '--:--'}
            </div>
            <div className="text-xs text-gray-500">آخر نشاط</div>
          </div>
        </div>
      </div>
    </div>
  );
}
