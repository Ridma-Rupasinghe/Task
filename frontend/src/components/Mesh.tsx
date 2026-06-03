import type { Neural } from "../constants";

export default function NeuralNetwork({
  radius,
  centerX,
  centerY,
  viewBox,
  nodes,
  activeNode,
  setHoveredNode,
  handleNodeInteraction,
  getNodePosition,
  getColorClasses,
}: Neural) {
  return (
    <div className="relative flex items-center justify-center ">
      <svg
        fontFamily="Sora, sans-serif"
        viewBox={viewBox}
        className="w-full max-w-md lg:max-w-lg mx-auto"
        style={{ touchAction: "none" }}
      >
        {/* Center Core */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius * 0.33}
          className="fill-slate-800/50 stroke-cyan-400/30"
          strokeWidth="2"
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={radius * 0.25}
          className="fill-cyan-400/10 stroke-cyan-400"
          strokeWidth="2"
        />

        {/* Core Icon */}
        <g
          transform={`translate(${centerX - radius * 0.11}, ${
            centerY - radius * 0.11
          })`}
        >
          <rect
            width={radius * 0.22}
            height={radius * 0.22}
            className="fill-cyan-400"
            rx="4"
          />
          <rect
            x={radius * 0.066}
            y={radius * 0.066}
            width={radius * 0.088}
            height={radius * 0.088}
            className="fill-slate-900"
            rx="2"
          />
        </g>

        {/* Connection Lines */}
        {nodes.map((node) => {
          const pos = getNodePosition(node.angle);
          const isActive = activeNode === node.id;
          return (
            <line
              key={`line-${node.id}`}
              x1={centerX}
              y1={centerY}
              x2={pos.x}
              y2={pos.y}
              className={`${
                isActive ? "stroke-cyan-400" : "stroke-slate-700"
              } transition-all duration-300`}
              strokeWidth={isActive ? "2" : "1"}
              opacity={isActive ? "1" : "0.3"}
            />
          );
        })}

        {/* Outer Orbit Path */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="rgba(34, 211, 238, 0.25)"
          strokeWidth="6"
          strokeDasharray="8 10"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${centerX} ${centerY}`}
            to={`360 ${centerX} ${centerY}`}
            dur="40s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Orbiting Pulses */}
        <g transform={`translate(${centerX}, ${centerY})`}>
          {/* Pulse 1 – clockwise */}
          <circle
            cx={radius}
            cy={0}
            r={radius * 0.025}
            className="fill-cyan-400"
            style={{ filter: "drop-shadow(0 0 15px #22d3ee)" }}
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0"
              to="360"
              dur="10s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Pulse 2 – counter-clockwise */}
          <circle
            cx={radius}
            cy={0}
            r={radius * 0.02}
            className="fill-cyan-300"
            style={{ filter: "drop-shadow(0 0 10px #67e8f9)" }}
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360"
              to="0"
              dur="14s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.2;0.9;0.2"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* Animated Particles */}
        {activeNode &&
          nodes.map((node) => {
            if (node.id !== activeNode) return null;
            const pos = getNodePosition(node.angle);
            return (
              <circle
                key={`particle-${node.id}`}
                cx={pos.x}
                cy={pos.y}
                r="4"
                className="fill-cyan-400"
              >
                <animate
                  attributeName="cx"
                  from={pos.x}
                  to={centerX}
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  from={pos.y}
                  to={centerY}
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="1"
                  to="0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            );
          })}

        {/* Nodes */}
        {nodes.map((node) => {
          const pos = getNodePosition(node.angle);
          const isHovered = activeNode === node.id;
          const colors = getColorClasses(node.color, isHovered);
          const nodeRadius = radius * (isHovered ? 0.2 : 0.19);

          return (
            <g
              key={node.id}
              transform={`translate(${pos.x}, ${pos.y})`}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => handleNodeInteraction(node.id)}
              onTouchStart={() => handleNodeInteraction(node.id)}
              className="cursor-pointer transition-all duration-300"
              style={{ touchAction: "manipulation" }}
            >
              <circle
                r={nodeRadius}
                className={`${colors.bg} ${colors.border} transition-all duration-300`}
                strokeWidth="2"
                filter={isHovered ? "url(#glow)" : ""}
              />
              <foreignObject
                x={-radius * 0.09}
                y={-radius * 0.09}
                width={radius * 0.2}
                height={radius * 0.2}
              >
                <div
                  className={`${colors.text} flex items-center justify-center w-full h-full`}
                >
                  {node.icon}
                </div>
              </foreignObject>
              <text
                style={{ fontFamily: "Sora, sans-serif" }}
                fill={isHovered ? "rgb(var(--fgs))" : "rgb(var(--muted))"}
                y={radius * 0.3}
                className={` font-semibold transition-colors duration-300 text-[11px] sm:text-[15px] md:text-[16px] lg:text-[18px] `}
                textAnchor="middle"
              >
                {node.label}
              </text>
            </g>
          );
        })}

        {/* Glow Filter */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}
