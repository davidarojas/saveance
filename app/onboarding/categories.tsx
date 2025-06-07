import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';

// Mock data for categories
const CATEGORIES = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: '📱',
    subcategories: ['Smartphones', 'Laptops', 'TVs', 'Headphones', 'Cameras']
  },
  {
    id: 'fashion',
    name: 'Fashion',
    icon: '👕',
    subcategories: ['Men', 'Women', 'Kids', 'Shoes', 'Accessories']
  },
  {
    id: 'home',
    name: 'Home & Garden',
    icon: '🏠',
    subcategories: ['Furniture', 'Decor', 'Kitchen', 'Bed & Bath', 'Garden']
  },
  {
    id: 'beauty',
    name: 'Beauty',
    icon: '💄',
    subcategories: ['Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Personal Care']
  },
  {
    id: 'sports',
    name: 'Sports & Outdoors',
    icon: '⚽',
    subcategories: ['Exercise', 'Outdoor', 'Team Sports', 'Fitness', 'Camping']
  },
  {
    id: 'toys',
    name: 'Toys & Games',
    icon: '🎮',
    subcategories: ['Action Figures', 'Board Games', 'Dolls', 'Puzzles', 'Outdoor Play']
  },
  {
    id: 'books',
    name: 'Books & Media',
    icon: '📚',
    subcategories: ['Fiction', 'Non-Fiction', 'eBooks', 'Audiobooks', 'Magazines']
  },
  {
    id: 'food',
    name: 'Food & Grocery',
    icon: '🍎',
    subcategories: ['Fresh Produce', 'Snacks', 'Beverages', 'Pantry', 'Frozen']
  },
];

interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: string[];
}

interface CategoriesStepProps {
  data: string[];
  onUpdate: (categories: string[]) => void;
}

export default function CategoriesStep({ data, onUpdate }: CategoriesStepProps) {
  const colorScheme = useColorScheme();
  const [selectedCategories, setSelectedCategories] = useState<{[key: string]: boolean}>(
    data.reduce((acc, category) => ({
      ...acc,
      [category]: true
    }), {})
  );
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    const newSelection = {
      ...selectedCategories,
      [categoryId]: !selectedCategories[categoryId]
    };
    
    // If expanding/collapsing the category
    if (categoryId === expandedCategory) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
    
    setSelectedCategories(newSelection);
    onUpdate(Object.keys(newSelection).filter(key => newSelection[key]));
  };

  const toggleSubcategory = (category: Category, subcategory: string, isSelected: boolean) => {
    const subcategoryId = `${category.id}_${subcategory.toLowerCase().replace(/\s+/g, '-')}`;
    const newSelection = {
      ...selectedCategories,
      [subcategoryId]: isSelected
    };
    
    setSelectedCategories(newSelection);
    onUpdate(Object.keys(newSelection).filter(key => newSelection[key]));
  };

  const isCategorySelected = (category: Category) => {
    // Check if any subcategory is selected
    return category.subcategories.some(
      sub => selectedCategories[`${category.id}_${sub.toLowerCase().replace(/\s+/g, '-')}`]
    );
  };

  const renderCategory = ({ item: category }: { item: Category }) => {
    const isExpanded = expandedCategory === category.id;
    const hasSelectedSubcategories = isCategorySelected(category);
    
    return (
      <View style={[
        styles.categoryContainer,
        { 
          backgroundColor: Colors[colorScheme ?? 'light'].card,
          borderColor: Colors[colorScheme ?? 'light'].border
        }
      ]}>
        <TouchableOpacity
          style={styles.categoryHeader}
          onPress={() => toggleCategory(category.id)}
        >
          <View style={styles.categoryIcon}>
            <ThemedText style={styles.iconText}>{category.icon}</ThemedText>
          </View>
          <ThemedText style={styles.categoryName}>{category.name}</ThemedText>
          <View style={[styles.checkbox, 
            hasSelectedSubcategories && { 
              backgroundColor: Colors[colorScheme ?? 'light'].primary,
              borderColor: Colors[colorScheme ?? 'light'].primary
            },
            !hasSelectedSubcategories && { borderColor: Colors[colorScheme ?? 'light'].border }
          ]}>
            {hasSelectedSubcategories && (
              <ThemedText style={styles.checkmark}>✓</ThemedText>
            )}
          </View>
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.subcategoriesContainer}>
            {category.subcategories.map((subcategory) => {
              const subcategoryId = `${category.id}_${subcategory.toLowerCase().replace(/\s+/g, '-')}`;
              const isSelected = !!selectedCategories[subcategoryId];
              
              return (
                <TouchableOpacity
                  key={subcategoryId}
                  style={[styles.subcategoryItem, 
                    isSelected && { 
                      backgroundColor: `${Colors[colorScheme ?? 'light'].primary}20`,
                      borderColor: Colors[colorScheme ?? 'light'].primary
                    }
                  ]}
                  onPress={() => toggleSubcategory(category, subcategory, !isSelected)}
                >
                  <ThemedText style={[
                    styles.subcategoryText,
                    isSelected && { color: Colors[colorScheme ?? 'light'].primary }
                  ]}>
                    {subcategory}
                  </ThemedText>
                  <View style={[
                    styles.subcategoryCheckbox,
                    isSelected && { 
                      backgroundColor: Colors[colorScheme ?? 'light'].primary,
                      borderColor: Colors[colorScheme ?? 'light'].primary
                    },
                    !isSelected && { borderColor: Colors[colorScheme ?? 'light'].border }
                  ]}>
                    {isSelected && (
                      <ThemedText style={styles.subcategoryCheckmark}>✓</ThemedText>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.title}>Your Interests</ThemedText>
      <ThemedText style={styles.subtitle}>
        Select categories you're interested in to see relevant deals
      </ThemedText>
      
      <FlatList
        data={CATEGORIES}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
  list: {
    paddingBottom: 24,
  },
  categoryContainer: {
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
    lineHeight: 24,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
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
    fontSize: 14,
    lineHeight: 14,
  },
  subcategoriesContainer: {
    padding: 12,
    paddingTop: 0,
  },
  subcategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  subcategoryText: {
    flex: 1,
    fontSize: 14,
  },
  subcategoryCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subcategoryCheckmark: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 12,
  },
});