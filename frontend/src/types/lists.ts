export interface List {
  id: string;
  title: string;
  color: string;
  userId: number;
}

export interface ListContextType {
  selectedList: List | null;
  setSelectedList: React.Dispatch<React.SetStateAction<List | null>>;
}
