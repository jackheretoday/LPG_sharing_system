import { Siren } from 'lucide-react';
import { SeverityForm } from '../components/SeverityForm';

export default function Emergency() {
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full">
         <div className="flex items-center gap-3 mb-8">
            <Siren className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-light">Emergency Assessment</h1>
         </div>
         <div className="liquid-glass border border-white/20 p-8 rounded-2xl">
            <p className="text-gray-300 font-light mb-8 text-lg">
              Please stay calm. Help us understand the situation so we can deploy the right assistance.
            </p>
            <SeverityForm />
         </div>
      </div>
    </div>
  );
}
