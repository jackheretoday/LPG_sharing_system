export interface Location {
  lat: number;
  lng: number;
}

export interface MarkerData {
  id: string;
  type: 'cylinder' | 'mechanic' | 'emergency';
  position: Location;
  ownerName?: string;
  distance?: string;
  availability?: string;
  status?: string;
}

export const mockMarkers: MarkerData[] = [
  {
    id: '1',
    type: 'cylinder',
    position: { lat: 19.108, lng: 72.826 },
    ownerName: 'Amit Shah',
    distance: '0.4 miles away',
    availability: '2 available',
  },
  {
    id: '2',
    type: 'cylinder',
    position: { lat: 19.110, lng: 72.822 },
    ownerName: 'Suresh Raina',
    distance: '0.8 miles away',
    availability: '1 available',
  },
  {
    id: '3',
    type: 'mechanic',
    position: { lat: 19.104, lng: 72.818 },
    ownerName: 'Rajesh Mechanic',
    status: 'On the way',
  },
  {
    id: '4',
    type: 'emergency',
    position: { lat: 19.102, lng: 72.828 },
    status: 'Active Leakage reported',
  },
];

export const mockMessages = [
  { id: '1', text: 'Hello, I have an available cylinder.', sender: 'owner' },
  { id: '2', text: 'Great! Is it sealed?', sender: 'user' },
  { id: '3', text: 'Yes, fully verified by HP Gas.', sender: 'owner' },
];
