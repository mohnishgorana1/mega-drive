type SortOrder = 'asc' | 'desc';
type SortKey = 'createdAt' | 'fileSize' | 'folderName';


interface FileOrFolder {
    createdAt: string;
    fileSize: number;
    folderName: string;
  }