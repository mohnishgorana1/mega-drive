
import React from "react";

import DisplayFilesAndFolder from "@/components/DisplayFilesAndFolder";


// Displays the contents of a specific folder (files and subfolders)
function FolderPage({ params }: { params: { folderId: string } }) {
  const currentFolderId = params.folderId;

  return (
    <main className="flex flex-col w-full gap-3">
      <div>
        <DisplayFilesAndFolder
          currentFolderId={currentFolderId}
        />
      </div>
    </main>
  )
}

export default FolderPage