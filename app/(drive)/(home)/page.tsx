import React from "react";

import DisplayFilesAndFolder from "@/components/DisplayFilesAndFolder";

// # Main page for displaying files and folders at the root level
export default function Home() {

  return (
    <main className="flex flex-col w-full gap-3">
      <div>
        <DisplayFilesAndFolder
          currentFolderId={null}
        />
      </div>

    </main>
  )
}

