// app/share/[token]/page.tsx
import dbConnect from "@/lib/dbConnect";
import File from "@/models/file.modal";
import Folder from "@/models/folder.modal";
import { Download, FileIcon, FolderIcon, ShieldAlert, ExternalLink, Globe } from "lucide-react";
import Image from "next/image";
import { formatFileSize } from "@/lib/utils";
import Header from "@/components/Header";

export default async function SharedPage({ 
  params, 
  searchParams 
}: { 
  params: { token: string }, 
  searchParams: { type: string } 
}) {
  await dbConnect();
  const { token } = params;
  const { type } = searchParams;

  // 🚀 Fetch and Populate: Agar folder hai toh uski files ko bhi le aao
  const item = type === "folder" 
    ? await Folder.findOne({ shareToken: token, isPublic: true }).populate("files")
    : await File.findOne({ shareToken: token, isPublic: true });

  if (!item) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="text-center animate-in fade-in zoom-in duration-500">
              <ShieldAlert size={64} className="mx-auto text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]"/> 
              <h1 className="text-2xl font-bold text-white">Access Denied</h1>
              <p className="text-gray-500 mt-2">This link is invalid or has been set to private.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30 overflow-x-hidden p-6 md:p-12">
      <Header />
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-purple-600/5 blur-[100px]" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto p-6 md:p-12">
        {/* Header Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-2xl ${
                type === 'folder' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
            }`}>
              {type === 'folder' ? <FolderIcon size={32} /> : <FileIcon size={32} />}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter truncate max-w-[300px] md:max-w-md">
                {type === 'folder' ? item.folderName : item.fileName}
              </h1>
              <p className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                <Globe size={14} className="text-green-500" /> Publicly Shared {type}
              </p>
            </div>
          </div>

          {/* Individual File Download Button */}
          {type === 'file' && (
            <a 
              href={item.databaseLocations.secure_url} 
              target="_blank" 
              className="flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-all shadow-xl active:scale-95"
            >
              <Download size={20} />
              Download Now
            </a>
          )}
        </div>

        {/* 📁 FOLDER CONTENTS GRID */}
        {type === 'folder' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
               <h2 className="text-lg font-bold text-gray-400 uppercase tracking-widest">Files inside</h2>
               <span className="bg-white/5 px-3 py-1 rounded-full text-xs font-mono">{item.files?.length || 0} Items</span>
            </div>

            {item.files && item.files.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {item.files.map((file: any) => (
                  <div key={file._id} className="group relative p-4 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 transition-all hover:bg-white/[0.06]">
                    <div className="aspect-video w-full rounded-2xl bg-dark-400 overflow-hidden mb-4 flex items-center justify-center">
                       {file.type.startsWith('image/') ? (
                         <Image src={file.databaseLocations.secure_url} alt="preview" width={300} height={200} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       ) : (
                         <FileIcon size={40} className="text-gray-600" />
                       )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate text-gray-200">{file.fileName}</p>
                        <p className="text-[10px] text-gray-500 font-mono uppercase mt-1">{formatFileSize(file.fileSize)}</p>
                      </div>
                      <a 
                        href={file.databaseLocations.secure_url} 
                        target="_blank" 
                        className="p-2 rounded-xl bg-blue-500/10 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-500 hover:text-white"
                      >
                        <Download size={16} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center rounded-[3rem] border border-dashed border-white/10">
                <p className="text-gray-500 font-medium italic">This folder is empty</p>
              </div>
            )}
          </div>
        )}

        {/* Footer Branding */}
        <div className="mt-20 pt-12 border-t border-white/5 text-center text-gray-600">
           <p className="text-xs font-mono tracking-widest uppercase mb-4">Powered by Mega Drive Architecture</p>
           <div className="flex items-center justify-center gap-1 text-xs">
              Made for high-speed digital sharing &copy; {new Date().getFullYear()}
           </div>
        </div>
      </main>
    </div>
  );
}