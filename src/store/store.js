import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import bookReducer from "./books/bookSlice";
import sectionsReducer from "./sections/sectionSlice";
const rootReducer = combineReducers({
  user: userReducer,
  book: bookReducer,
  sections: sectionsReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user", "sections"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
