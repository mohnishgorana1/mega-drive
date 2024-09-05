import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function timeAgo(dateString: string): string {
  const currentTime = new Date();
  const givenTime = new Date(dateString);
  const diffInSeconds = Math.floor((currentTime.getTime() - givenTime.getTime()) / 1000);

  const units = [
    { name: 'year', seconds: 60 * 60 * 24 * 365 },
    { name: 'month', seconds: 60 * 60 * 24 * 30 },
    { name: 'week', seconds: 60 * 60 * 24 * 7 },
    { name: 'day', seconds: 60 * 60 * 24 },
    { name: 'hour', seconds: 60 * 60 },
    { name: 'minute', seconds: 60 },
    { name: 'second', seconds: 1 }
  ];

  for (const unit of units) {
    const amount = Math.floor(diffInSeconds / unit.seconds);
    if (amount >= 1) {
      return amount === 1 ? `1 ${unit.name} ago` : `${amount} ${unit.name}s ago`;
    }
  }

  return 'just now';
}

export function formatFileSize(bytes: number): string {
  // Ensure 'bytes' is a number
  const numBytes = Number(bytes);

  if (isNaN(numBytes)) {
    throw new Error('Invalid input, bytes must be a number');
  }

  const units = ['bytes', 'KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;
  let size = numBytes;

  // Convert the bytes to the appropriate unit
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}



// SORTING


interface FileOrFolder {
  createdAt: string;
  fileSize: number;
  folderName: string;
}


export function sortItems(items: FileOrFolder[], sortKey: SortKey, sortOrder: SortOrder = 'asc'): FileOrFolder[] {
  return items.sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortKey) {
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case 'fileSize':
        aValue = a.fileSize;
        bValue = b.fileSize;
        break;
      case 'folderName':
        aValue = a.folderName.toLowerCase();
        bValue = b.folderName.toLowerCase();
        break;
      default:
        return 0;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });
}