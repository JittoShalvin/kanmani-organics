export interface Project {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  category: string;
  image: string;
  link: string;
  features: string[];
  benefits: string[];
  usage: string;
  sizes: string[];
  sortOrder: number;
  visible: boolean;
}

export interface UserData {
  id: string;
  username: string;
  email: string;
  name: string;
}
