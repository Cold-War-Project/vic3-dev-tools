import { library, config } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faGithub,
  faBitbucket,
  faGitlab,
} from "@fortawesome/free-brands-svg-icons";
import { faUpload, faDownload } from "@fortawesome/free-solid-svg-icons";

library.add(faGithub, faBitbucket, faGitlab, faUpload, faDownload);

config.autoAddCss = false;

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("font-awesome-icon", FontAwesomeIcon, {});
});
