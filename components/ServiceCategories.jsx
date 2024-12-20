import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { filterByCategory } from "../actions/serviceActions";

const ServiceCategories = ({ categories }) => {
  const dispatch = useDispatch();

  const handleCategoryClick = (category) => {
    dispatch(filterByCategory(category));
  };

  return (
    <View style={styles.categoriesContainer}>
      <Text style={styles.categoryHeader}>Categories</Text>
      <View style={styles.categoriesList}>
        {categories.map((category) => (
          <TouchableOpacity key={category} onPress={() => handleCategoryClick(category)}>
            <Text style={styles.categoryItem}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoriesContainer: {
    padding: 20,
    alignItems: "center",
  },
  categoryHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  categoriesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  categoryItem: {
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 5,
    margin: 5,
    fontWeight: "bold",
  },
});

export default ServiceCategories;
