import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';

// Mock data for stores
const POPULAR_STORES = [
  { id: 'target', name: 'Target', logo: 'https://logo.clearbit.com/target.com' },
  { id: 'walmart', name: 'Walmart', logo: 'https://logo.clearbit.com/walmart.com' },
  { id: 'bestbuy', name: 'Best Buy', logo: 'https://logo.clearbit.com/bestbuy.com' },
  { id: 'amazon', name: 'Amazon', logo: 'https://logo.clearbit.com/amazon.com' },
  { id: 'costco', name: 'Costco', logo: 'https://logo.clearbit.com/costco.com' },
  { id: 'home-depot', name: 'Home Depot', logo: 'https://logo.clearbit.com/homedepot.com' },
  { id: 'lowes', name: 'Lowe\'s', logo: 'https://logo.clearbit.com/lowes.com' },
  { id: 'walgreens', name: 'Walgreens', logo: 'https://logo.clearbit.com/walgreens.com' },
];

interface Store {
  id: string;
  name: string;
  logo?: string;
  isCustom?: boolean;
}

interface StoreSelectionStepProps {
  data: string[];
  onUpdate: (stores: string[]) => void;
}

export default function StoreSelectionStep({ data, onUpdate }: StoreSelectionStepProps) {
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [customStore, setCustomStore] = useState('');
  const [selectedStores, setSelectedStores] = useState<Store[]>(
    data.map(storeId => ({
      id: storeId,
      name: storeId,
      isCustom: !POPULAR_STORES.some(s => s.id === storeId)
    }))
  );

  const filteredStores = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return POPULAR_STORES.filter(
      store => 
        store.name.toLowerCase().includes(query) &&
        !selectedStores.some(s => s.id === store.id)
    );
  }, [searchQuery, selectedStores]);

  const toggleStore = (store: Store) => {
    const isSelected = selectedStores.some(s => s.id === store.id);
    let updatedStores;
    
    if (isSelected) {
      updatedStores = selectedStores.filter(s => s.id !== store.id);
    } else {
      updatedStores = [...selectedStores, store];
    }
    
    setSelectedStores(updatedStores);
    onUpdate(updatedStores.map(s => s.id));
  };

  const addCustomStore = () => {
    if (customStore.trim() && !selectedStores.some(s => s.name.toLowerCase() === customStore.toLowerCase())) {
      const newStore = {
        id: `custom-${Date.now()}`,
        name: customStore.trim(),
        isCustom: true
      };
      const updatedStores = [...selectedStores, newStore];
      setSelectedStores(updatedStores);
      onUpdate(updatedStores.map(s => s.id));
      setCustomStore('');
    }
  };

  const renderStoreItem = ({ item }: { item: Store }) => (
    <TouchableOpacity
      style={[styles.storeItem, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}
      onPress={() => toggleStore(item)}
    >
      {item.logo ? (
        <Image source={{ uri: item.logo }} style={styles.storeLogo} />
      ) : (
        <View style={[styles.storeLogo, { backgroundColor: '#e0e0e0' }]} />
      )}
      <ThemedText style={styles.storeName}>
        {item.name} {item.isCustom && '(Custom)'}
      </ThemedText>
      <View style={[
        styles.checkbox,
        {
          backgroundColor: selectedStores.some(s => s.id === item.id) 
            ? Colors[colorScheme ?? 'light'].primary 
            : 'transparent',
          borderColor: Colors[colorScheme ?? 'light'].border
        }
      ]}>
        {selectedStores.some(s => s.id === item.id) && (
          <ThemedText style={styles.checkmark}>✓</ThemedText>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.title}>Favorite Stores</ThemedText>
      <ThemedText style={styles.subtitle}>Select stores you shop at frequently</ThemedText>

      {/* Selected Stores */}
      {selectedStores.length > 0 && (
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Your Stores</ThemedText>
          <View style={styles.selectedStores}>
            {selectedStores.map(store => (
              <TouchableOpacity
                key={store.id}
                style={[styles.selectedStore, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}
                onPress={() => toggleStore(store)}
              >
                <ThemedText>{store.name}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Search and Add Custom Store */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Add Store</ThemedText>
        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.searchInput, { color: Colors[colorScheme ?? 'light'].text }]}
            placeholder="Search or add a store"
            placeholderTextColor={Colors[colorScheme ?? 'light'].placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <ThemedText style={styles.clearButtonText}>×</ThemedText>
            </TouchableOpacity>
          ) : null}
        </View>

        {searchQuery && !filteredStores.length && (
          <View style={styles.addCustomContainer}>
            <ThemedText>Don't see your store?</ThemedText>
            <View style={styles.addCustomInput}>
              <TextInput
                style={[styles.customStoreInput, { color: Colors[colorScheme ?? 'light'].text }]}
                placeholder="Enter store name"
                placeholderTextColor={Colors[colorScheme ?? 'light'].placeholder}
                value={customStore}
                onChangeText={setCustomStore}
                onSubmitEditing={addCustomStore}
              />
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}
                onPress={addCustomStore}
                disabled={!customStore.trim()}
              >
                <ThemedText style={styles.addButtonText}>Add</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Popular Stores */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Popular Stores</ThemedText>
        <FlatList
          data={filteredStores}
          renderItem={renderStoreItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.storeList}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  selectedStores: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  selectedStore: {
    padding: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    paddingRight: 40,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 18,
    lineHeight: 20,
    color: '#666',
  },
  addCustomContainer: {
    marginTop: 16,
  },
  addCustomInput: {
    flexDirection: 'row',
    marginTop: 8,
  },
  customStoreInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addButton: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  storeList: {
    paddingBottom: 16,
  },
  storeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  storeLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  storeName: {
    flex: 1,
    fontSize: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 16,
  },
});