import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import styled, { ThemeContext } from "styled-components/native";

export const CardRow = ({
  label,
  heading,
  description,
  imageUrl,
  onActionPress,
}) => {
  const theme = useContext(ThemeContext);
  return (
    <View style={styles.cardContainer}>
      <View style={styles.contentContainer}>
        <Image source={{ uri: imageUrl }} style={styles.cardImage} />
        <View style={styles.textContainer}>
          {label && (
            <View style={styles.labelContainer}>
              <Text style={styles.labelText}>{label}</Text>
            </View>
          )}
          <Text style={styles.cardHeading}>{heading}</Text>
          <Text style={styles.cardDescription}>{description}</Text>

          <TouchableOpacity
            style={[styles.cardButton, { backgroundColor: theme.wiget22 }]}
            onPress={onActionPress}
          >
            <Text style={styles.buttonText}>방문하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export const CardRowSimple = ({
  label,
  heading,
  description,
  onActionPress,
  onActionPress2
}) => {
  const theme = useContext(ThemeContext);
  return (
    <View style={[styles.cardContainer, {margin : 10, marginBottom : 5}]}>
      
        
      
          {label && (
            <View style={styles.labelContainer}>
              <Text style={styles.labelText}>{label}</Text>
            </View>
          )}
          <Text style={styles.cardHeading}>{heading}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity
              style={[styles.cardButton, { backgroundColor: theme.wiget11, width : '47%' }]}
              onPress={onActionPress}
            >
              <Text style={styles.buttonText}>위치보기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cardButton, { backgroundColor: theme.wiget22, width : '47%' }]}
              onPress={onActionPress2}
            >
              <Text style={styles.buttonText}>전화하기</Text>
            </TouchableOpacity>
          </View>
        
      
    </View>
  );
};

export const CardRowTwoChoice = ({
  label,
  heading,
  description,
  imageUrl,
  onActionPress,
  onActionPress2
}) => {
  const theme = useContext(ThemeContext);
  return (
    <View style={[styles.cardContainer, {margin : 10, marginTop : 5}]}>
      <View style={styles.contentContainer}>
        <Image source={{ uri: imageUrl }} style={styles.cardImage} />
        <View style={styles.textContainer}>
          {label && (
            <View style={styles.labelContainer}>
              <Text style={styles.labelText}>{label}</Text>
            </View>
          )}
          <Text style={styles.cardHeading}>{heading}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity
              style={[styles.cardButton, { backgroundColor: theme.wiget11, width : '47%' }]}
              onPress={onActionPress}
            >
              <Text style={styles.buttonText}>위치보기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cardButton, { backgroundColor: theme.wiget22, width : '47%' }]}
              onPress={onActionPress2}
            >
              <Text style={styles.buttonText}>예약하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 10,
  },
  contentContainer: {
    flexDirection: "row",
    marginBottom: 0, // Add some space above the button
  },
  cardImage: {
    width: 150, // Adjust the size accordingly
    height: 150, // Adjust the size accordingly
    //borderRadius: 25, // Make it round
    marginRight: 16, // Add space between the image and the text
    resizeMode: "contain",
  },
  labelContainer: {
    alignSelf: "flex-start", // This will align the label to the left
    marginBottom: 8, // Add some margin below the label if needed
    backgroundColor: "rgb(210,210,210)",
    borderRadius: 7,
    padding: 3,
    paddingLeft: 10,
    paddingRight: 10,
  },
  textContainer: {
    flex: 1, // Take up all available space
    justifyContent: "center", // Center the text vertically
  },
  labelText: {
    fontSize: 12,
    color: "#000",
  },
  cardHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  cardDescription: {
    fontSize: 14,
    color: "#000",
  },
  cardButton: {
    backgroundColor: "#2979FF",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 10,
    alignItems: "center", // Center the text horizontally
  },
  buttonText: {
    fontSize: 14,
    color: "#fff",
  },
});
