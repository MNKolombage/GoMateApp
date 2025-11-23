// src/screens/FavouritesScreen.js
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setFavs } from '../redux/slices/favouritesSlice';

export default function FavouritesScreen({ navigation }) {
  const favs = useSelector(state => state.favourites.items);
  const theme = useSelector(state => state.theme.mode);
  const isDark = theme === 'dark';
  const dispatch = useDispatch();

  useEffect(() => {
    loadFavourites();
  }, []);

  const loadFavourites = async () => {
    const json = await AsyncStorage.getItem('favourites');
    if (json) dispatch(setFavs(JSON.parse(json)));
  };

  const renderFavourite = ({ item }) => {
    const isRoute = item.type === 'route';
    
    return (
      <TouchableOpacity 
        style={[styles.card, isDark && styles.cardDark]} 
        onPress={() => navigation.navigate('Details', { item, type: item.type })}
      >
        {isRoute ? (
          <View style={styles.routeCardContent}>
            <View style={styles.routeIconContainer}>
              <Ionicons name="bus" size={32} color="#2196F3" />
            </View>
            <View style={styles.cardInfo}>
              <View style={styles.cardHeader}>
                <Text style={[styles.routeNumber, isDark && styles.textDark]}>{item.routeNumber}</Text>
                <View style={[styles.miniStatus, { backgroundColor: item.status === 'Active' ? '#4CAF50' : '#FF9800' }]}>
                  <Text style={styles.miniStatusText}>{item.status}</Text>
                </View>
              </View>
              <Text style={[styles.cardTitle, isDark && styles.textDark]}>{item.name}</Text>
              <View style={styles.routeInfo}>
                <Ionicons name="location" size={14} color={isDark ? '#999' : '#666'} />
                <Text style={[styles.routeText, isDark && styles.textDark]}>{item.from} → {item.to}</Text>
              </View>
              <View style={styles.cardFooter}>
                <View style={styles.scheduleChip}>
                  <Ionicons name="time" size={12} color={isDark ? '#999' : '#666'} />
                  <Text style={[styles.scheduleText, isDark && styles.textDark]}>{item.schedule}</Text>
                </View>
                <Text style={[styles.priceText, isDark && styles.textDark]}>{item.price}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.destCardContent}>
            <Image source={{ uri: item.thumbnail }} style={styles.destImage} />
            <View style={styles.cardInfo}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, isDark && styles.textDark]}>{item.name}</Text>
              </View>
              <Text numberOfLines={2} style={[styles.cardDesc, isDark && styles.textDark]}>{item.description}</Text>
              <View style={styles.destFooter}>
                <View style={styles.categoryChip}>
                  <Text style={styles.categoryChipText}>{item.category}</Text>
                </View>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={12} color="#FFD700" />
                  <Text style={[styles.ratingText, isDark && styles.textDark]}>{item.rating}</Text>
                </View>
                <View style={styles.distanceContainer}>
                  <Ionicons name="navigate" size={12} color={isDark ? '#999' : '#666'} />
                  <Text style={[styles.distanceText, isDark && styles.textDark]}>{item.distance}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (!favs.length) {
    return (
      <View style={[styles.emptyContainer, isDark && styles.emptyContainerDark]}>
        <Ionicons name="heart-outline" size={80} color={isDark ? '#666' : '#ccc'} />
        <Text style={[styles.emptyTitle, isDark && styles.textDark]}>No Favorites Yet</Text>
        <Text style={[styles.emptyText, isDark && styles.textDark]}>Start adding your favorite routes and destinations!</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <Text style={[styles.headerTitle, isDark && styles.textDark]}>My Favorites</Text>
        <Text style={[styles.headerSubtitle, isDark && styles.textDark]}>{favs.length} saved item{favs.length !== 1 ? 's' : ''}</Text>
      </View>
      <FlatList 
        data={favs} 
        keyExtractor={i => String(i.id)} 
        renderItem={renderFavourite}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E3F2FD',
    marginTop: 4,
  },
  listContainer: {
    padding: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  routeCardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  routeIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#E3F2FD',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  routeNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  miniStatus: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  miniStatusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  routeText: {
    fontSize: 13,
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scheduleText: {
    fontSize: 11,
    color: '#666',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  destCardContent: {
    flexDirection: 'row',
  },
  destImage: {
    width: 100,
    height: 100,
  },
  cardDesc: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  destFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryChip: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  categoryChipText: {
    color: '#2196F3',
    fontSize: 11,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  distanceText: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },
  // Dark mode styles
  containerDark: {
    backgroundColor: '#1C1C1E',
  },
  headerDark: {
    backgroundColor: '#2C2C2E',
  },
  textDark: {
    color: '#E5E5E7',
  },
  cardDark: {
    backgroundColor: '#2C2C2E',
  },
  emptyContainerDark: {
    backgroundColor: '#1C1C1E',
  },
});
