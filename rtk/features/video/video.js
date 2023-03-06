const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
const fetch = require("node-fetch");

// initial state
const initialState = {
  video: "",
  loading: false,
  error: null,
  recommendedVideoLoading: false,
  recommendedVideo: [],
  recommendedVideoError: null,
};

const fetchVideo = createAsyncThunk("video/fetchVideo", async function () {
  const response = await fetch("http://localhost:9000/videos");
  const video = await response.json();
  return video;
});

const fetchRelatedVideos = createAsyncThunk(
  "video/fetchRelatedVideos",
  async function (tags) {
    const queryString = tags.map((tag) => `tags_like=${tag}`).join("&");
    const response = await fetch(`http://localhost:9000/videos?${queryString}`);
    const relatedVideos = await response.json();
    return relatedVideos;
  }
);

const videoSlice = createSlice({
  name: "video",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchVideo.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchVideo.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.video = action.payload;
    });
    builder.addCase(fetchVideo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(fetchRelatedVideos.pending, (state, action) => {
      state.recommendedVideoLoading = true;
      state.recommendedVideoError = null;
    });
    builder.addCase(fetchRelatedVideos.fulfilled, (state, action) => {
      state.recommendedVideoLoading = false;
      state.recommendedVideoError = null;
      state.recommendedVideo = action.payload.sort((a, b) => b.views - a.views);
    });
    builder.addCase(fetchRelatedVideos.rejected, (state, action) => {
      state.recommendedVideoLoading = false;
      state.recommendedVideoError = action.error.message;
    });
  },
});

module.exports = videoSlice.reducer;

module.exports.fetchVideo = fetchVideo;
module.exports.fetchRelatedVideos = fetchRelatedVideos;
