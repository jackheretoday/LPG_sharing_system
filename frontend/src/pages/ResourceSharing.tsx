import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function ResourceSharing() {
  return (
     <div className="min-h-screen bg-black text-white p-6 md:p-12">
        <h1 className="text-3xl font-light mb-8">Resource Sharing</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
             <Card key={i} className="liquid-glass border-white/20">
               <CardHeader>
                 <CardTitle className="text-lg">Spare Cylinder {i}</CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-gray-400 text-sm mb-6">Location: Andheri West</p>
                 <Button className="w-full">Request Resource</Button>
               </CardContent>
             </Card>
          ))}
        </div>
     </div>
  );
}
