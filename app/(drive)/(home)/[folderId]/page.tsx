import React from 'react'


// Displays the contents of a specific folder (files and subfolders)
function FolderPage({ params }: { params: { folderId: string } }) {
    const id = params.folderId
    return (
        <div>FolderPage Folder ID {id} </div>
    )
}

export default FolderPage