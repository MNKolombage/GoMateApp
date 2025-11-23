// src/AppBootstrap.js
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUserFromStorage } from './redux/slices/authSlice';
import { setFavs } from './redux/slices/favouritesSlice';
import { setTheme } from './redux/slices/themeSlice';

export default function AppBootstrap({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const userRaw = await AsyncStorage.getItem('user');
      const favsRaw = await AsyncStorage.getItem('favourites');
      const themeRaw = await AsyncStorage.getItem('theme');
      if (userRaw) dispatch(setUserFromStorage(JSON.parse(userRaw)));
      if (favsRaw) dispatch(setFavs(JSON.parse(favsRaw)));
      if (themeRaw) dispatch(setTheme(themeRaw));
    })();
  }, []);

  return children;
}
