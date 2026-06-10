export interface Resource {
  id: number;
  name: string;
  type: string;
  description?: string;
  capacity?: number;
  pricePerHour?: number;
  imageUrl?: string;
  status: string;
  openingHour?: string;
  closingHour?: string;
  businessId?: number;
  businessName?: string;
}