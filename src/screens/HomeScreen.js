// src/screens/HomeScreen.js
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { getDemoDestinations, getDemoRoutes, getDestinations, getRoutes } from '../services/transportService';

export default function HomeScreen({ navigation }) {
  const theme = useSelector(state => state.theme.mode);
  const isDark = theme === 'dark';
  const [routes, setRoutes] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('routes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [routes, destinations, activeTab, searchQuery, selectedFilter, sortBy]);

  const fetchData = async () => {
    try {
      // Fetch from APIs - will fallback to demo data if API fails
      const routeData = await getRoutes();
      const destData = await getDestinations();
      
      setRoutes(routeData);
      setDestinations(destData);
    } catch (err) {
      console.error('Error fetching data:', err);
      // Use demo data as ultimate fallback
      setRoutes(getDemoRoutes());
      setDestinations(getDemoDestinations());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFiltersAndSort = () => {
    let data = activeTab === 'routes' ? [...routes] : [...destinations];

    // Apply search filter
    if (searchQuery) {
      data = data.filter(item => {
        if (activeTab === 'routes') {
          return item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 item.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 item.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 item.routeNumber.toLowerCase().includes(searchQuery.toLowerCase());
        } else {
          return item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 item.category.toLowerCase().includes(searchQuery.toLowerCase());
        }
      });
    }

    // Apply category/type filter
    if (selectedFilter !== 'all') {
      data = data.filter(item => {
        if (activeTab === 'routes') {
          return item.type?.toLowerCase() === selectedFilter.toLowerCase();
        } else {
          return item.category === selectedFilter;
        }
      });
    }

    // Apply sorting
    if (sortBy !== 'default') {
      data.sort((a, b) => {
        switch (sortBy) {
          case 'price_low':
            const priceA = parseFloat(a.price.replace(/[^0-9]/g, ''));
            const priceB = parseFloat(b.price.replace(/[^0-9]/g, ''));
            return priceA - priceB;
          case 'price_high':
            const priceAHigh = parseFloat(a.price.replace(/[^0-9]/g, ''));
            const priceBHigh = parseFloat(b.price.replace(/[^0-9]/g, ''));
            return priceBHigh - priceAHigh;
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'distance':
            return parseFloat(a.distance?.replace(/[^0-9.]/g, '') || 0) - parseFloat(b.distance?.replace(/[^0-9.]/g, '') || 0);
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
    }

    setFilteredData(data);
  };

  const getRouteFilters = () => [
    { label: 'All', value: 'all' },
    { label: 'Bus', value: 'bus' },
    { label: 'Train', value: 'train' },
    { label: 'Ferry', value: 'ferry' }
  ];
  const getDestinationFilters = () => [
    { label: 'All', value: 'all' },
    { label: 'Beach', value: 'Beach' },
    { label: 'Mountain', value: 'Mountain' },
    { label: 'Historical', value: 'Historical' },
    { label: 'Wildlife', value: 'Wildlife' },
    { label: 'Temple', value: 'Temple' }
  ];

  const getRouteSortOptions = () => [
    { label: 'Default', value: 'default' },
    { label: 'Price: Low to High', value: 'price_low' },
    { label: 'Price: High to Low', value: 'price_high' },
    { label: 'Name (A-Z)', value: 'name' },
  ];

  const getDestinationSortOptions = () => [
    { label: 'Default', value: 'default' },
    { label: 'Highest Rated', value: 'rating' },
    { label: 'Nearest First', value: 'distance' },
    { label: 'Name (A-Z)', value: 'name' },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    setSearchQuery('');
    setSelectedFilter('all');
    setSortBy('default');
    fetchData();
  };

  const renderRoute = ({ item }) => (
    <TouchableOpacity style={[styles.routeCard, isDark && styles.routeCardDark]} onPress={() => navigation.navigate('Details', { item, type: 'route' })}>
      <View style={styles.routeHeader}>
        <View style={styles.routeBadge}>
          <Ionicons name="bus" size={20} color="#fff" />
          <Text style={styles.routeNumber}>{item.routeNumber}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'Active' ? '#4CAF50' : '#FF9800' }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={[styles.routeName, isDark && styles.textDark]}>{item.name}</Text>
      <View style={styles.routeDetails}>
        <Ionicons name="location" size={16} color={isDark ? '#999' : '#666'} />
        <Text style={[styles.routeText, isDark && styles.textDark]}>{item.from} → {item.to}</Text>
      </View>
      <View style={styles.routeFooter}>
        <View style={styles.scheduleInfo}>
          <Ionicons name="time" size={16} color={isDark ? '#999' : '#666'} />
          <Text style={[styles.scheduleText, isDark && styles.textDark]}>{item.schedule}</Text>
        </View>
        <Text style={[styles.priceText, isDark && styles.textDark]}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderDestination = ({ item }) => (
    <TouchableOpacity style={[styles.destCard, isDark && styles.destCardDark]} onPress={() => navigation.navigate('Details', { item, type: 'destination' })}>
      <Image source={{ uri: item.thumbnail }} style={styles.destImage} />
      <View style={styles.destInfo}>
        <Text style={[styles.destName, isDark && styles.textDark]}>{item.name}</Text>
        <Text numberOfLines={2} style={[styles.destDesc, isDark && styles.textDark]}>{item.description}</Text>
        <View style={styles.destFooter}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={[styles.ratingText, isDark && styles.textDark]}>{item.rating}</Text>
          </View>
          <View style={styles.distanceContainer}>
            <Ionicons name="navigate" size={14} color={isDark ? '#999' : '#666'} />
            <Text style={[styles.distanceText, isDark && styles.textDark]}>{item.distance}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) return <View style={[{flex:1,justifyContent:'center',alignItems:'center'}, isDark && {backgroundColor: '#1C1C1E'}]}><ActivityIndicator size="large" color="#2196F3" /></View>;

  return (
    <View style={[{ flex: 1, backgroundColor: '#f5f5f5' }, isDark && { backgroundColor: '#1C1C1E' }]}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <Text style={[styles.headerTitle, isDark && styles.textDark]}>GoMate</Text>
        <Text style={[styles.headerSubtitle, isDark && styles.textDark]}>Your Travel Companion</Text>
      </View>
      
      <View style={[styles.tabContainer, isDark && styles.tabContainerDark]}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'routes' && styles.activeTab, isDark && activeTab === 'routes' && styles.activeTabDark]} 
          onPress={() => {
            setActiveTab('routes');
            setSearchQuery('');
            setSelectedFilter('all');
            setSortBy('default');
          }}
        >
          <Ionicons name="bus" size={20} color={activeTab === 'routes' ? '#2196F3' : (isDark ? '#999' : '#666')} />
          <Text style={[styles.tabText, activeTab === 'routes' && styles.activeTabText, isDark && styles.tabTextDark]}>Transport Routes</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'destinations' && styles.activeTab, isDark && activeTab === 'destinations' && styles.activeTabDark]} 
          onPress={() => {
            setActiveTab('destinations');
            setSearchQuery('');
            setSelectedFilter('all');
            setSortBy('default');
          }}
        >
          <Ionicons name="compass" size={20} color={activeTab === 'destinations' ? '#2196F3' : (isDark ? '#999' : '#666')} />
          <Text style={[styles.tabText, activeTab === 'destinations' && styles.activeTabText, isDark && styles.tabTextDark]}>Destinations</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, isDark && styles.searchContainerDark]}>
        <Ionicons name="search" size={20} color={isDark ? '#999' : '#666'} />
        <TextInput
          style={[styles.searchInput, isDark && styles.searchInputDark]}
          placeholder={activeTab === 'routes' ? 'Search routes, locations...' : 'Search destinations...'}
          placeholderTextColor={isDark ? '#666' : '#999'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={isDark ? '#999' : '#666'} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Sort Options */}
      <View style={[styles.sortContainer, isDark && styles.sortContainerDark]}>
        <Ionicons name="funnel-outline" size={16} color={isDark ? '#999' : '#666'} />
        <Text style={[styles.sortLabel, isDark && styles.textDark]}>Sort by:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(activeTab === 'routes' ? getRouteSortOptions() : getDestinationSortOptions()).map(option => (
            <TouchableOpacity
              key={option.value}
              style={[styles.sortOption, sortBy === option.value && styles.sortOptionActive]}
              onPress={() => setSortBy(option.value)}
            >
              <Text style={[
                styles.sortText,
                sortBy === option.value && styles.sortTextActive,
                isDark && styles.textDark
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={[styles.resultsText, isDark && styles.textDark]}>
          {filteredData.length} {activeTab === 'routes' ? 'routes' : 'destinations'} found
        </Text>
      </View>

      <FlatList 
        data={filteredData}
        keyExtractor={(i) => String(i.id)} 
        renderItem={activeTab === 'routes' ? renderRoute : renderDestination}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2196F3']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color={isDark ? '#666' : '#ccc'} />
            <Text style={[styles.emptyText, isDark && styles.textDark]}>No results found</Text>
            <Text style={[styles.emptySubtext, isDark && styles.textDark]}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 2,
    marginBottom: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  listContainer: {
    padding: 12,
  },
  routeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  routeNumber: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  routeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  routeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  routeText: {
    fontSize: 14,
    color: '#666',
  },
  routeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  scheduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scheduleText: {
    fontSize: 13,
    color: '#666',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  destCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  destImage: {
    width: '100%',
    height: 180,
  },
  destInfo: {
    padding: 12,
  },
  destName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  destDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  destFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#2196F3',
    fontSize: 12,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 13,
    color: '#666',
  },
  // Search and Filter styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 2,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  filterScroll: {
    maxHeight: 50,
    marginTop: 8,
  },
  filterContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    marginRight: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  filterPillActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
    elevation: 4,
  },
  filterText: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  sortLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  sortOptionActive: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  sortText: {
    fontSize: 13,
    color: '#666',
  },
  sortTextActive: {
    color: '#2196F3',
    fontWeight: '600',
  },
  resultsHeader: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  resultsText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  // Dark mode styles
  headerDark: {
    backgroundColor: '#2C2C2E',
  },
  textDark: {
    color: '#E5E5E7',
  },
  tabContainerDark: {
    backgroundColor: '#2C2C2E',
  },
  tabTextDark: {
    color: '#999',
  },
  activeTabDark: {
    borderBottomColor: '#2196F3',
  },
  routeCardDark: {
    backgroundColor: '#2C2C2E',
  },
  destCardDark: {
    backgroundColor: '#2C2C2E',
  },
  searchContainerDark: {
    backgroundColor: '#2C2C2E',
  },
  searchInputDark: {
    color: '#E5E5E7',
  },
  filterPillDark: {
    backgroundColor: '#2C2C2E',
    borderColor: '#2196F3',
  },
  filterPillActiveDark: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  filterTextDark: {
    color: '#2196F3',
  },
  sortContainerDark: {
    backgroundColor: '#2C2C2E',
  },
});
