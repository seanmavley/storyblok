import { Vue } from "vue-class-component";
import axios from "axios";

const API_URL = process.env.VUE_APP_SERVER_URL;
interface iFormData {
  search: string;
  replace: string;
}

export default class Welcome extends Vue {
  formData: iFormData = { search: "", replace: "" }
  busy = false;
  space_id!: string;
  message = "";

  error_message = "Something unexpected happened!";

  onSubmit() {
    // just for redundancy
    if (this.formData.search === "" || this.formData.replace === "") {
      this.message = "Please fill the form, commpletely!";
      return;
    }

    this.busy = true;
    // this.getSpaceId();
    axios.post(`${API_URL}/initiate`, this.formData)
      .then((res: any) => {
        console.log(res);
      })
      .catch((err: any) => {
        console.log(err);
        this.message = this.error_message;
      }) 
   }
}