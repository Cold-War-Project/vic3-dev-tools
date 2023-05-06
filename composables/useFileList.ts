import { FileObject } from "@supabase/storage-js";

const fileList = ref<FileObject[]>([]);
function setFileList(files: FileObject[]) {
  fileList.value = files;
}
  
export default function useFileList() {
  return { fileList, setFileList };
}
