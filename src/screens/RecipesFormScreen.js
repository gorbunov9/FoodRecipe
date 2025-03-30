import { View,Text,TextInput,TouchableOpacity,Image,StyleSheet,} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {widthPercentageToDP as wp,heightPercentageToDP as hp,} from "react-native-responsive-screen";

export default function RecipesFormScreen({ route, navigation }) {
  const { recipeToEdit, recipeIndex, onrecipeEdited } = route.params || {};
  const [recipeName, setRecipeName] = useState(recipeToEdit ? recipeToEdit.recipeName : "");
  const [recipeImage, setRecipeImage] = useState(recipeToEdit ? recipeToEdit.recipeImage : "");
  const [cookingDescription, setCookingDescription] = useState(
    recipeToEdit ? recipeToEdit.cookingDescription : ""
  );

  const saverecipe = async () => {
    const newRecipe = { recipeName, recipeImage, cookingDescription };
    console.log(newRecipe)
    try {
      const existingRecipes = await AsyncStorage.getItem("customrecipes");
      const recipes = existingRecipes ? JSON.parse(existingRecipes) : [];

      // If editing an article, update it; otherwise, add a new one
      if (recipeToEdit !== undefined) {
        recipes[recipeIndex] = newRecipe;
        await AsyncStorage.setItem("customrecipes", JSON.stringify(recipes));
        if (onrecipeEdited) onrecipeEdited(); // Notify the edit
      } else {
        recipes.push(newRecipe);
        await AsyncStorage.setItem("customrecipes", JSON.stringify(recipes));
      }

      navigation.goBack(); // Return to the previous screen
    } catch (error) {
      console.error("Error saving the article:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Recipe Name"
        value={recipeName}
        onChangeText={setRecipeName}
        style={styles.input}
      />
      <TextInput
        placeholder="Image URL"
        value={recipeImage}
        onChangeText={setRecipeImage}
        style={styles.input}
      />
      {recipeImage ? (
        <Image source={{ uri: recipeImage }} style={styles.image} />
      ) : (
        <Text style={styles.imagePlaceholder}>Upload Image URL</Text>
      )}
      <TextInput
        placeholder="Description"
        value={cookingDescription}
        onChangeText={setCookingDescription}
        multiline={true}
        numberOfLines={4}
        style={[styles.input, { height: hp(20), textAlignVertical: "top" }]}
      />
      <TouchableOpacity onPress={saverecipe} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save recipe</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
  },
  input: {
    marginTop: hp(4),
    borderWidth: 1,
    borderColor: "#ddd",
    padding: wp(.5),
    marginVertical: hp(1),
  },
  image: {
    width: 300,
    height:200,
    margin: wp(2),
  },
  imagePlaceholder: {
    height: hp(20),
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hp(1),
    borderWidth: 1,
    borderColor: "#ddd",
    textAlign: "center",
    padding: wp(2),
  },
  saveButton: {
    backgroundColor: "#4F75FF",
    padding: wp(.5),
    alignItems: "center",
    borderRadius: 5,
    marginTop: hp(2),
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
