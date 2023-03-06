const configureStore = require("@reduxjs/toolkit").configureStore;
const logger = require("redux-logger").default;
const videoSliceReducer = require("../features/video/video");

const store = configureStore({
  reducer: {
    video: videoSliceReducer,
  },
  middleware: (getDefaultMiddleWares) => getDefaultMiddleWares().concat(logger),
});

module.exports = store;
