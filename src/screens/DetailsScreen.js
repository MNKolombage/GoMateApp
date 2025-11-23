// src/screens/DetailsScreen.js
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addFav, removeFav } from '../redux/slices/favouritesSlice';

export default function DetailsScreen({ route }) {
  const { item, type } = route.params;
  const dispatch = useDispatch();
  const favs = useSelector(state => state.favourites.items);
  const theme = useSelector(state => state.theme.mode);
  const isDark = theme === 'dark';
  const isFav = !!favs.find(i => i.id === item.id);

  const toggleFav = async () => {
    if (isFav) {
      dispatch(removeFav(item.id));
      const updated = favs.filter(i => i.id !== item.id);
      await AsyncStorage.setItem('favourites', JSON.stringify(updated));
    } else {
      dispatch(addFav({ ...item, type }));
      const updated = [...favs, { ...item, type }];
      await AsyncStorage.setItem('favourites', JSON.stringify(updated));
    }
  };

  const isRoute = type === 'route';

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      {isRoute ? (
        // Route Details
        <View>
          <View style={[styles.headerSection, isDark && styles.headerSectionDark]}>
            <View style={[styles.routeHeaderCard, isDark && styles.cardDark]}>
              <View style={styles.routeBadge}>
                <Ionicons name="bus" size={24} color="#fff" />
                <Text style={styles.routeNumber}>{item.routeNumber}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: item.status === 'Active' ? '#4CAF50' : '#FF9800' }]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <Text style={[styles.mainTitle, isDark && styles.textDark]}>{item.name}</Text>
          </View>

          <View style={[styles.detailCard, isDark && styles.cardDark]}>
            <View style={styles.detailRow}>
              <Ionicons name="location" size={24} color="#2196F3" />
              <View style={styles.detailTextContainer}>
                <Text style={[styles.detailLabel, isDark && styles.textDark]}>Route</Text>
                <Text style={[styles.detailValue, isDark && styles.textDark]}>{item.from} → {item.to}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="time" size={24} color="#2196F3" />
              <View style={styles.detailTextContainer}>
                <Text style={[styles.detailLabel, isDark && styles.textDark]}>Schedule</Text>
                <Text style={[styles.detailValue, isDark && styles.textDark]}>{item.schedule}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="cash" size={24} color="#2196F3" />
              <View style={styles.detailTextContainer}>
                <Text style={[styles.detailLabel, isDark && styles.textDark]}>Fare</Text>
                <Text style={[styles.priceValue, isDark && styles.textDark]}>{item.price}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.infoCard, isDark && styles.cardDark]}>
            <Text style={[styles.infoTitle, isDark && styles.textDark]}>Route Information</Text>
            <View style={styles.infoRow}>
              <Ionicons name="business" size={16} color={isDark ? '#999' : '#666'} />
              <Text style={[styles.infoText, isDark && styles.textDark]}>Operator: {item.operator || 'City Transit Authority'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="subway" size={16} color={isDark ? '#999' : '#666'} />
              <Text style={[styles.infoText, isDark && styles.textDark]}>Type: {item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : 'Bus'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time" size={16} color={isDark ? '#999' : '#666'} />
              <Text style={[styles.infoText, isDark && styles.textDark]}>Operates daily from 6:00 AM to 11:00 PM</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="snow" size={16} color={isDark ? '#999' : '#666'} />
              <Text style={[styles.infoText, isDark && styles.textDark]}>Air-conditioned vehicles</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="accessibility" size={16} color={isDark ? '#999' : '#666'} />
              <Text style={[styles.infoText, isDark && styles.textDark]}>Wheelchair accessible</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="wifi" size={16} color={isDark ? '#999' : '#666'} />
              <Text style={[styles.infoText, isDark && styles.textDark]}>Free WiFi on board</Text>
            </View>
          </View>
        </View>
      ) : (
        // Destination Details
        <View>
          <Image source={{ uri: item.thumbnail }} style={styles.destImage} />
          <View style={[styles.destContent, isDark && styles.destContentDark]}>
            <View style={styles.destHeader}>
              <Text style={[styles.mainTitle, isDark && styles.textDark]}>{item.name}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            </View>

            <View style={styles.destStats}>
              <View style={styles.statItem}>
                <Ionicons name="star" size={20} color="#FFD700" />
                <Text style={[styles.statText, isDark && styles.textDark]}>{item.rating} Rating</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="navigate" size={20} color="#2196F3" />
                <Text style={[styles.statText, isDark && styles.textDark]}>{item.distance}</Text>
              </View>
            </View>

            <View style={styles.descSection}>
              <Text style={[styles.sectionTitle, isDark && styles.textDark]}>About</Text>
              <Text style={[styles.descText, isDark && styles.textDark]}>{item.description}</Text>
            </View>

            <View style={[styles.infoCard, isDark && styles.cardDark]}>
              <Text style={[styles.infoTitle, isDark && styles.textDark]}>Visit Information</Text>
              <View style={styles.infoRow}>
                <Ionicons name="time" size={16} color={isDark ? '#999' : '#666'} />
                <Text style={[styles.infoText, isDark && styles.textDark]}>Hours: {item.hours || 'Check locally'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="accessibility" size={16} color={isDark ? '#999' : '#666'} />
                <Text style={[styles.infoText, isDark && styles.textDark]}>{item.accessibility || 'Accessibility info available on-site'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="bus" size={16} color={isDark ? '#999' : '#666'} />
                <Text style={[styles.infoText, isDark && styles.textDark]}>Accessible via multiple bus routes</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="car" size={16} color={isDark ? '#999' : '#666'} />
                <Text style={[styles.infoText, isDark && styles.textDark]}>Parking facilities available</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.favButton} onPress={toggleFav}>
        <Ionicons 
          name={isFav ? "heart" : "heart-outline"} 
          size={24} 
          color="#fff" 
        />
        <Text style={styles.favButtonText}>
          {isFav ? 'Remove from Favorites' : 'Add to Favorites'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  headerSection: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 10,
  },
  routeHeaderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  routeNumber: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  detailCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  destImage: {
    width: '100%',
    height: 250,
  },
  destContent: {
    padding: 16,
  },
  destHeader: {
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  categoryText: {
    color: '#2196F3',
    fontSize: 13,
    fontWeight: '600',
  },
  destStats: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  descSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  descText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  favButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4081',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 8,
    elevation: 3,
  },
  favButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Dark mode styles
  containerDark: {
    backgroundColor: '#1C1C1E',
  },
  textDark: {
    color: '#E5E5E7',
  },
  cardDark: {
    backgroundColor: '#2C2C2E',
  },
  destContentDark: {
    backgroundColor: '#1C1C1E',
  },
  headerSectionDark: {
    backgroundColor: '#2C2C2E',
  },
});
