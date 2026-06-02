import React, { useState } from "react";
import {  MessageCircle } from "lucide-react";

import NeuralNetwork from "../components/NeuralNetwork";
import { steps, getColorClassesS } from "../constants";

const CircularStepper: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const getNodePosition = (index: number) => {
    const centerX = 50;
    const centerY = 50;
    const radius = 35;
    const angleOffset = -Math.PI / 2;
    const angle = (index / 6) * 2 * Math.PI + angleOffset;

    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <section id="simulation" className=" pb-20 flex flex-col px-6 lg:px-0 ">

      


      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-8">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentStep
                ? `${getColorClassesS(step.color, "bg")} scale-125`
                : index < currentStep
                ? "bg-gray-500"
                : "bg-gray-700"
            }`}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto w-full">
        {/* Left side - Circular diagram */}

        <NeuralNetwork
          getNodePosition={getNodePosition}
          currentStep={currentStep}
        />

        {/* Right side - Content */}
        <div className="lg:w-1/2 flex flex-col">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`${getColorClassesS(currentStepData.color, "text")} font-heading`}
              >
                {currentStepData.icon}
              </div>
              <div>
                <div className="text-sm text-gray-400 font-semi">
                  Step {currentStep + 1} of {steps.length}
                </div>
                <h2
                  className={`text-3xl font-bold font-heading ${getColorClassesS(
                    currentStepData.color,
                    "text"
                  )}`}
                >
                  {currentStepData.title}
                </h2>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[rgb(var(--bgd))] rounded-lg p-6 border border-gray-800">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-cyan-500">
                    <MessageCircle size={18} />
                  </span>
                  <h3 className="font-semibold text-lg font-semi text-[rgb(var(--fgs))]">How It Works</h3>
                </div>
                <p className="text-[rgb(var(--fg))] leading-relaxed font-body text-pretty">
                  {currentStepData.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[rgb(var(--bgd))] rounded-lg p-5 border border-gray-800">
                  <h4 className="font-semibold mb-3 text-[rgb(var(--fgs))] font-semi">
                    TRADITIONAL 
                  </h4>
                  <p style={{ color: "rgb(var(--fg))" }}
                  className="text-[rgb(var(--fg))] text-sm leading-relaxed font-body text-pretty">
                    {currentStepData.traditional}
                  </p>
                </div>

                <div
                  className={`bg-[rgb(var(--bg))] rounded-lg p-5 border ${getColorClassesS(
                    currentStepData.color,
                    "border"
                  )}`}
                >
                  <h4
                    className={`font-semibold mb-3 font-semi text-display ${getColorClassesS(
                      currentStepData.color,
                      "text"
                    )}`}
                  >
                    ACCELALPHA
                  </h4>
                  <p className="fill-[rgb(var(--fg))] text-sm leading-relaxed font-body">
                    {currentStepData.neuro}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-auto pt-6">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="text-[rgb(var(--fg))] hover:text-[rgb(var(--fgs))] cursor-pointer font-body px-6 py-3 rounded-lg border border-gray-700  hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className={`text-[rgb(var(--fg))] hover:text-[rgb(var(--fgs))] px-6 py-3 rounded-lg font-body cursor-pointer border-[0.5px] border-gray-700 ${
                currentStep === steps.length - 1
                  ? "bg-cyan-500 hover:bg-cyan-600"
                  : "bg-cyan-500 hover:bg-cyan-600"
              }  font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {currentStep === steps.length - 1 ? "Complete" : "Next Step →"}
            </button>
          </div>
        </div>
      </div>

      
      
    </section>
  );
};

export default CircularStepper;
