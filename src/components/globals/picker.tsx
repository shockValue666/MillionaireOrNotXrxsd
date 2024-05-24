import React, { useRef, useEffect } from 'react';

interface PickerProps {
  min: number;
  max: number;
  step: number;
  defaultValue?: number;
  onChange: (value: number) => void;
}

const Picker: React.FC<PickerProps> = ({ min, max, step, defaultValue, onChange }) => {
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (pickerRef.current) {
      const index = Math.round(pickerRef.current.scrollTop / 40); // Assuming each option has a height of 40px
      const value = min + index * step;
      onChange(value);
    }
  };

  // Populate values
  const values = [];
  for (let i = min; i <= max; i += step) {
    values.push(i);
  }

  // Scroll to default value on initial render
  useEffect(() => {
    if (defaultValue && pickerRef.current) {
      const defaultIndex = (defaultValue - min) / step;
      pickerRef.current.scrollTop = defaultIndex * 40; // Scroll to the default index
    }
  }, [defaultValue, min, step]);

  return (
    <div className="relative overflow-hidden h-200 w-full">
      <div
        ref={pickerRef}
        onScroll={handleScroll}
        className="overflow-y-scroll snap-y snap-mandatory h-full"
        style={{ scrollBehavior: 'smooth' }}>
        {values.map((value, index) => (
          <div key={index} className="h-40 flex items-center justify-center snap-center">
            {value}
          </div>
        ))}
      </div>
      <div className="absolute top-0 left-0 right-0 h-full pointer-events-none">
        <div className="h-full border-t border-b border-gray-300"></div> {/* Highlight line */}
      </div>
    </div>
  );
};

export default Picker;