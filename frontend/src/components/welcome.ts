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
    this.getSpaceId();
  }

  getSpaceId() {
    axios.get(`${API_URL}/space`)
      .then((res: any) => {
        this.space_id = res.data.space.id;
        this.getStories();
      })
      .catch((err: any) => {
        console.log(err);
        this.message = this.error_message;
      })
  }

  getStories() {
    axios.get(`${API_URL}/story`)
      .then((res) => {
        this.busy = false;
        this.searchReplace(res.data.stories, this.formData);
      })
      .catch((err: any) => {
        console.log(err);
        this.message = this.error_message;
      })
  }

  searchReplace(stories: any, formData: iFormData) {
    stories.forEach((element: any) => {
      const content: string = element.content.component;
      const replaced_content = content.replace(formData.search, formData.replace);
      this.updateStory(element.id, element.name, replaced_content);
    });

  }

  updateStory(id: string, name: string, content: string) {

    const data = {
      space_id: this.space_id,
      story_id: id,
      content,
      name
    }

    axios.post(
      `${API_URL}/story`,
      data,
    ).then((res: any) => {
      console.log(res);
      this.busy = false;
      this.message = "Search and Replace complete";
    })
    .catch((err: any) => {
      console.log(err);
      this.message = 'Something unexpected happened!';
    })
  }
}