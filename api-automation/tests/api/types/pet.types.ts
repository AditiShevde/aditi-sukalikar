export type PetStatus = 'available' | 'pending' | 'sold';

export type Category = {
  id?: number;
  name?: string;
};

export type Tag = {
  id?: number;
  name?: string;
};

export type PetPayload = {
  id: number;
  name: string;
  category?: Category;
  photoUrls: string[];
  tags?: Tag[];
  status?: PetStatus;
};
