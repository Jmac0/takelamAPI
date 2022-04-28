interface PropertyInterface {
  _id?: string;
  title: { title: string; unique: boolean };
  tag: { tag: string; unique: boolean };
  description: string;
  ownership: string;
  plotSize: string;
  buildSize: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  location: string;
  cords: {cords: string[]; required: true }
  floorPlan: [string];
}

export {PropertyInterface}