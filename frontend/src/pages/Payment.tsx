import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function Payment() {
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 flex flex-col items-center justify-center">
      <Card className="liquid-glass max-w-lg w-full border-white/20 text-center">
        <CardHeader className="flex flex-col items-center gap-4 pt-8">
           <CheckCircle className="w-16 h-16 text-white mb-2" />
           <CardTitle className="text-2xl">Safe & Secure Payment</CardTitle>
           <p className="text-gray-300 font-light">Your issue has been resolved safely.</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-8 pb-8">
          <div className="aspect-square bg-white rounded-xl mx-auto w-48 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-2 border-4 border-black border-dashed opacity-20"></div>
            <span className="text-black font-bold">QR Code</span>
          </div>
          <Button size="lg" className="w-full text-lg">Confirm Payment</Button>
        </CardContent>
      </Card>
    </div>
  );
}
