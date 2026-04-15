import { cn } from '../lib/utils';
import { Check } from 'lucide-react';

export function StatusTimeline({ currentStep }: { currentStep: number }) {
  const steps = [
    { label: 'Requested', time: '10:45 AM' },
    { label: 'Assigned', time: '10:48 AM' },
    { label: 'On the Way', time: '10:50 AM' },
    { label: 'Completed', time: 'Pending' }
  ];

  return (
    <div className="relative flex flex-col pl-4 gap-6">
      <div className="absolute left-[11px] top-2 bottom-6 w-px bg-white/10" />
      {steps.map((step, idx) => {
        const isActive = idx <= currentStep;
        return (
          <div key={idx} className="relative flex items-start gap-4">
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 z-10 transition-colors",
              isActive ? "bg-white text-black" : "bg-black border border-white/20 text-transparent"
            )}>
              <Check className="w-3 h-3" strokeWidth={3} />
            </div>
            <div>
              <p className={cn("font-medium", isActive ? "text-white" : "text-gray-500")}>
                {step.label}
              </p>
              <p className="text-sm text-gray-400 font-light">{step.time}</p>
            </div>
          </div>
        )
      })}
    </div>
  );
}
