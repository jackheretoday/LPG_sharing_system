import { MapView } from '../components/MapView';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

export default function Tracking() {
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 flex flex-col">
       <h1 className="text-3xl font-light mb-8">Live Tracking</h1>
       <div className="flex-1 grid md:grid-cols-3 gap-8">
         <div className="md:col-span-2 rounded-2xl overflow-hidden">
           <MapView />
         </div>
         <div className="flex flex-col gap-6">
           <Card className="liquid-glass">
             <CardHeader>
               <CardTitle className="text-xl">Mechanic Details</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div>
                 <p className="text-sm text-gray-400">Name</p>
                 <p className="text-lg font-medium">Rajesh Kumar</p>
               </div>
               <div>
                 <p className="text-sm text-gray-400">Phone</p>
                 <p className="text-lg font-medium">+91 98765 43210</p>
               </div>
               <div>
                 <p className="text-sm text-gray-400">Status</p>
                 <div className="mt-1">
                   <Badge variant="outline" className="animate-pulse bg-white/10 text-white border-white/30 px-3 py-1 text-sm font-normal">
                     <span className="w-2 h-2 rounded-full bg-white mr-2 inline-block"></span>
                     On the way (ETA 10 mins)
                   </Badge>
                 </div>
               </div>
               <div className="pt-4 border-t border-white/10 mt-6">
                 <Button className="w-full">Call Mechanic</Button>
               </div>
             </CardContent>
           </Card>
           
           <Card className="liquid-glass border-white/10">
              <CardContent className="p-6">
                <p className="text-gray-300 font-light text-sm">
                  Please stay outside your premise if smell is extremely strong. 
                  Do not turn any electrical switches on or off. Our mechanic is highly trained for safe handling.
                </p>
              </CardContent>
           </Card>
         </div>
       </div>
    </div>
  );
}
