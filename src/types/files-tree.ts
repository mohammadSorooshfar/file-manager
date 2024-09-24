export interface FileNode {
  id: number
  type: FileType
  name: string
  children: FileNode[] | null
  open: boolean
}

export interface FileManage {
  selectedId: number | null
  renamingId: number | null
}

export type FileType = 'folder' | 'file'
