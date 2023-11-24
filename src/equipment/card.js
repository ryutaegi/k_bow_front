import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const CardMain = ({ label, heading, description, imageUrl, onActionPress }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.contentContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.cardImage}
        />
        <View style={styles.textContainer}>
          {label && <View style={styles.labelContainer}>
            <Text style={styles.labelText}>{label}</Text>
            </View>}
          <Text style={styles.cardHeading}>{heading}</Text>
          <Text style={styles.cardDescription}>{description}</Text>

          <TouchableOpacity style={styles.cardButton} onPress={onActionPress}>
        <Text style={styles.buttonText}>방문하기</Text>
      </TouchableOpacity>
        </View>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom : 10,
  },
  contentContainer: {
    flexDirection: 'row',
    marginBottom: 16, // Add some space above the button
  },
  cardImage: {
    width: 150, // Adjust the size accordingly
    height: 150, // Adjust the size accordingly
    //borderRadius: 25, // Make it round
    marginRight: 16, // Add space between the image and the text
  },
  labelContainer: {
    alignSelf: 'flex-start', // This will align the label to the left
    marginBottom: 8, // Add some margin below the label if needed
    backgroundColor : '#a0d1b4',
    padding : 10,
  },
  textContainer: {
    flex: 1, // Take up all available space
    justifyContent: 'center', // Center the text vertically
  },
  labelText: {
    fontSize: 12,
    color: '#000',
  },
  cardHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  cardDescription: {
    fontSize: 14,
    color: '#000',
  },
  cardButton: {
    backgroundColor: '#2979FF',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop : 10,
    alignItems: 'center', // Center the text horizontally
  },
  buttonText: {
    fontSize: 14,
    color: '#fff',
  },
});

export default CardMain;
