export interface Tag {
  id: number;
  name: string;
}

export interface TagContextType {
  selectedTag: Tag | null;
  setSelectedTag: React.Dispatch<React.SetStateAction<Tag | null>>;
}
