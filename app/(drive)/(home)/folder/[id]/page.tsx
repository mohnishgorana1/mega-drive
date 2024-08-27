import React from 'react'

function FolderPage({ params }: { params: { id: string } }) {
    const id = params.id
    return (
        <div>FolderPage Folder ID {id}</div>
    )
}

export default FolderPage