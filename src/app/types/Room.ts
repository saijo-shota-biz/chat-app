export interface Room {
  id: string;
  name: string;
  description: string;
  tags: string[];
  private: boolean;
  password?:string;
}