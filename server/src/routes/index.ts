import { Router } from 'express';
import axios from "axios"

interface iFormData {
  search: string;
  replace: string;
}


// User-route
const indexRouter = Router();

indexRouter.get('/', (req, res) => {
  res.json({
    "api": "success"
  })
})

async function sleep(ms: any) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

indexRouter.post('/initiate', (req, res) => {
  let space: any;
  let stories: any[];
  let formData: iFormData = req.body

  axios.get(`https://api.storyblok.com/v1/cdn/spaces/me?token=${process.env.CDN_TOKEN}`)
  .then((response: any) => {
    // res.json(response.data);
    space = response.data.space
    return axios.get(`https://api.storyblok.com/v1/cdn/stories?token=${process.env.CDN_TOKEN}`)
  })
  .then((response: any) => {
    stories = response.data.stories;
    
    stories.forEach(async (element: any, index: any) => {
      const content: string = element.content.component;
      const replaced_content = content.replace(formData.search, formData.replace);
      await sleep(1000 * index)
        .then(() => {
          const payload = {
            "story": {
              "name": element.name,
              "slug": element.name.replace(/ +/g, '-').toLowerCase(),
              "content": {
                "component": "page",
                "body": [{ content: replaced_content}]
              }
            },
            "force_update": 1,
            "publish": 1
          }
        
          axios.put(
            `https://mapi.storyblok.com/v1/spaces/${space.id}/stories/${element.id}`,
            payload,
            {
              headers: {
                Authorization: process.env.MAPI_TOKEN
              }
            }
          ).then((putResponse: any) => {
            res.json({
              'status': true
            })
          })
          .catch(err => {
            console.log(err);
          })
        })
    });

  })

})

// Export the base-router
const baseRouter = Router();
baseRouter.use('/', indexRouter);
export default baseRouter;
