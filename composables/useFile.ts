/**
 * @description URL reference to a Blob object containing the file data.
 */
const loadedFile = ref({
  name: "",
  url: "",
});

function setLoadedFile(url: string, name: string) {
  loadedFile.value.name = name;
  loadedFile.value.url = url;
}

export default function useFile() {
  return { loadedFile, setLoadedFile };
}
