const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
const fetch = require("node-fetch");

// initial state
const initialState = {
  video: "",
  loading: false,
  error: null,
  recommendedVideosLoading: false,
  recommendedVideos: [],
  recommendedVideosError: null,
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
    //extra reducer for single video.
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

    //extra reducer for fetchRelatedVideos.

    builder.addCase(fetchRelatedVideos.pending, (state, action) => {
      state.recommendedVideosLoading = true;
      state.recommendedVideosError = null;
    });
    builder.addCase(fetchRelatedVideos.fulfilled, (state, action) => {
      state.recommendedVideosLoading = false;
      state.recommendedVideosError = null;
      state.recommendedVideos = action.payload.sort(
        (a, b) => b.views - a.views
      );
    });
    builder.addCase(fetchRelatedVideos.rejected, (state, action) => {
      state.recommendedVideosLoading = false;
      state.recommendedVideosError = action.error.message;
    });
  },
});

module.exports = videoSlice.reducer;

module.exports.fetchVideo = fetchVideo;
module.exports.fetchRelatedVideos = fetchRelatedVideos;
