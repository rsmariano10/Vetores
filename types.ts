export enum Sector {
  Kitchen = 'Cozinha',
  DiningHall = 'Salão',
  Storage = 'Estoque',
  Restrooms = 'Banheiros',
  Exterior = 'Área Externa',
  Other = 'Outro',
}

export enum VectorType {
  Cockroach = 'Barata',
  Rodent = 'Roedor',
  Fly = 'Mosca',
  Other = 'Outro Inseto',
}

export interface Incident {
  id: string;
  photo: string; // base64 encoded image
  date: string;  // ISO string format
  sector: Sector;
  vector: VectorType;
}