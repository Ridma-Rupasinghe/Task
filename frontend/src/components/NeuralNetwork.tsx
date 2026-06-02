
import { steps } from '../constants';
import { Settings } from 'lucide-react';


interface NeuralnetworkProps {
    getNodePosition: (index: number) => { x: number; y: number };
    currentStep: number;
}



export default function NeuralNetwork({getNodePosition, currentStep}: NeuralnetworkProps) {
  return (
    <div className="lg:w-2/5 flex items-center justify-center">
      <div className="relative w-full max-w-md aspect-square">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Circular path */}
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="#374151"
            strokeWidth="0.3"
            opacity="0.3"
          />

          {/* Connections between nodes */}
          {steps.map((_, index) => {
            const pos1 = getNodePosition(index);
            const pos2 = getNodePosition((index + 1) % 6);
            const isActive = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <g key={`connection-${index}`}>
                <path
                  d={`M ${pos1.x} ${pos1.y} A 35 35 0 0 1 ${pos2.x} ${pos2.y}`}
                  fill="none"
                  stroke={isActive || isCurrent ? "#06b6d4" : "#374151"}
                  strokeWidth="0.5"
                  className="transition-all duration-500"
                  opacity={isActive || isCurrent ? 1 : 0.3}
                />
                {isCurrent && (
                  <circle r="1" fill="#06b6d4" className="animate-pulse">
                    <animateMotion
                      dur="2s"
                      repeatCount="indefinite"
                      path={`M ${pos1.x} ${pos1.y} A 35 35 0 0 1 ${pos2.x} ${pos2.y}`}
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {steps.map((step, index) => {
            const pos = getNodePosition(index);
            const isCurrent = index === currentStep;
            const isPast = index <= currentStep;

            return (
              <g key={`node-${index}`}>
                {/* Glow effect for current node */}
                {isCurrent && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="5.5"
                    fill={
                      step.color === "cyan"
                        ? "#06b6d4"
                        : step.color === "pink"
                        ? "#ec4899"
                        : step.color === "purple"
                        ? "#a855f7"
                        : "#eab308"
                    }
                    opacity="0.3"
                    className="animate-pulse"
                  />
                )}

                {/* Node circle */}
                <circle 
                  cx={pos.x}
                  cy={pos.y}
                  r="7"
                  fill={isPast ? "#1f2937" : "#111827"}
                  stroke={
                    isPast
                      ? step.color === "cyan"
                        ? "#06b6d4"
                        : step.color === "pink"
                        ? "#ec4899"
                        : step.color === "purple"
                        ? "#a855f7"
                        : "#eab308"
                      : "#374151"
                  }
                  strokeWidth="0.5"
                  className={`transition-all duration-500  ${
                    isCurrent ? "animate-pulse" : ""
                  }`}
                />

                {/* Icon using foreignObject to embed React component */}
                <foreignObject
                  x={pos.x - 4}
                  y={pos.y - 4}
                  width="8"
                  height="8"
                  className="pointer-events-none"
                >
                  <div
                    className={`flex items-center justify-center w-full h-full ${
                      isPast ? "text-white" : "text-gray-600"
                    } transition-all duration-300`}
                    style={{ fontSize: "2.5px" }}
                  >
                    {step.icon}
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {/* Center icon */}
          <circle
            cx="50"
            cy="50"
            r="8"
            fill="#1f2937"
            stroke="#374151"
            strokeWidth="0.5"
          />
          <foreignObject
            x="44"
            y="44"
            width="12"
            height="12"
            className="pointer-events-none"
          >
            <div
              className="flex items-center justify-center w-full h-full text-gray-600 origin-center animate-spin-slow" 

              style={{ fontSize: "12px" }}
            >
              <Settings size={16} />
            </div>
          </foreignObject>
        </svg>
      </div>
    </div>
  );
}