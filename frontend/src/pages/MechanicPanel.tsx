import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MapPin } from 'lucide-react';

export default function MechanicPanel() {
  return (
     <div className="min-h-screen bg-black text-white p-6 md:p-12">
        <h1 className="text-3xl font-light mb-8">Mechanic Panel</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="liquid-glass border-white/20">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">Emergency #1024</CardTitle>
                <span className="text-red-400 text-sm font-medium animate-pulse">High Severity</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-gray-300 mb-6 font-light">
                <MapPin className="w-4 h-4" />
                <span>2 miles away • Andheri West</span>
              </div>
              <div className="flex gap-4">
                 <Button className="flex-1 text-black font-medium text-sm">Accept Job</Button>
                 <Button variant="outline" className="flex-1 text-sm">Reject</Button>
              </div>
            </CardContent>
          </Card>
        </div>
     </div>
  );
}
