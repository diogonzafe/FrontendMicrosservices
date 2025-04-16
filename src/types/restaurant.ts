export interface RestaurantDTO {
  id?: number;
  name: string;
  ownerId?: number;
  address: AddressDTO;
  category?: string;
}

export interface AddressDTO {
  street: string;
  number: string;
  city: string;
  neighborhood: string;
  state: string;
  zipcode: string;
  complement?: string;
}

export interface MenuItemDTO {
  id?: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  restaurantId?: number;
}
