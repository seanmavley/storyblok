import { Router } from 'express';
import axios from "axios"

// User-route
const indexRouter = Router();

indexRouter.get('/', (req, res) => {
  res.json({
    "api": "success"
  })
})

indexRouter.get('/space', (req, res) => {
  axios.get(`https://api.storyblok.com/v1/cdn/spaces/me?token=${process.env.CDN_TOKEN}`)
    .then((response: any) => {
      res.json(response.data);
    })
})

indexRouter.get('/story', (req, res) => {
  axios.get(`https://api.storyblok.com/v1/cdn/stories?token=${process.env.CDN_TOKEN}`)
    .then((response: any) => {
      res.json(response.data);
    })
})

indexRouter.post('/story', (req, res) => {
  const data = req.body;

  const payload = {
    "story": {
      "name": data.name,
      "slug": data.name.replace(/ +/g, '-').toLowerCase(),
      "content": {
        "component": data.content,
        "body": []
      }
    },
    "force_update": 1,
    "publish": 1
  }

  axios.put(
    `https://mapi.storyblok.com/v1/spaces/${data.space_id}}/stories/${data.story_id}`,
    payload,
    {
      headers: {
        Authorization: process.env.MAPI_TOKEN
      }
    }
  ).then((res: any) => {
    res.json(res.data);
  })
    .catch((err) => {
      res.json({
        data: err
      })
    })
})

// Export the base-router
const baseRouter = Router();
baseRouter.use('/', indexRouter);
export default baseRouter;
