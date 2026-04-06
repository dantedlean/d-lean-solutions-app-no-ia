import { Paperclip, FileText, Image as ImageIcon } from 'lucide-react'

export function AttachmentList({ files }: { files: any[] }) {
  if (!files?.length) return null

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getIcon = (type: string) => {
    if (!type) return <Paperclip className="w-4 h-4 text-slate-500" />
    if (type.includes('image') || type.includes('jpeg') || type.includes('jpg')) {
      return <ImageIcon className="w-4 h-4 text-amber-500" />
    }
    if (type.includes('pdf')) return <FileText className="w-4 h-4 text-red-500" />
    if (type.includes('word') || type.includes('document')) {
      return <FileText className="w-4 h-4 text-blue-500" />
    }
    return <Paperclip className="w-4 h-4 text-slate-500" />
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold flex items-center gap-2 text-slate-800">
        <Paperclip className="w-4 h-4" />
        Anexos do Cliente
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {files.map((file, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-2.5 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <div className="bg-white p-2 rounded-md shadow-sm border border-slate-100 shrink-0">
              {getIcon(file.type)}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-slate-700 truncate" title={file.name}>
                {file.name}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">{formatSize(file.size)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
