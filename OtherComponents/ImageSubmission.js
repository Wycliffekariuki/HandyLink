import React, { useState } from "react";
import { View, Button, Image, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Text } from "react-native-paper";

const ImageSubmission = ({ onImageSaved }) => {
  const [imageUri, setImageUri] = useState(null);
  const [newUri, setNewUri] = useState(null);
  const serviceProviderId = "123User1";

  const selectImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images", "videos"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        console.log("Image selected:", uri);
        setImageUri(uri);
        saveImageToFolder(uri);
      } else {
        console.log("Image selection was canceled or no assets found.");
      }
    } catch (error) {
      console.log("Error selecting image:", error);
    }
  };

  const saveImageToFolder = async (uri) => {
    try {
      const folderUri = `${FileSystem.documentDirectory}serviceProvider_${serviceProviderId}/images`;
      console.log("Creating directory at:", folderUri);
      await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true });
      const fileName = uri.split("/").pop();
      const newPath = `${folderUri}/${fileName}`;
      setNewUri(newPath);
      setImageUri(newPath);
      console.log("Moving file to:", newPath);
      await FileSystem.moveAsync({
        from: uri,
        to: newPath,
      });

      onImageSaved(newPath);
      Alert.alert("Success", "Image saved successfully");
    } catch (error) {
      console.log("Error saving image:", error);
      Alert.alert("Error", "Failed to save image");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Select Image" onPress={selectImage} />
      {newUri && <Image source={{ uri: newUri }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  image: {
    width: 200,
    height: 200,
    margin: 10,
    borderRadius: 10,
  },
});

export default ImageSubmission;

//  let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ["images", "videos"],
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });
