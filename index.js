const store = require("./rtk/app/store");
const {
  fetchVideo,
  fetchRelatedVideos,
} = require("./rtk/features/video/video");

async function fetchVideosAndRelated() {
  try {
    const result = await store.dispatch(fetchVideo());
    const tags = result.payload.tags;
    await store.dispatch(fetchRelatedVideos(tags));
  } catch (err) {
    console.log(err);
  }
}

fetchVideosAndRelated();