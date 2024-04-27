import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, FlatList, StyleSheet, Linking, KeyboardAvoidingView } from 'react-native';

const About = () => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isTyping, setIsTyping] = useState(false); // Track if the user is typing

  const developers = [
    { id: 1, name: 'Cassandra Ysabel Gallo', email: 'cassandraysabel.gallo-21@cpu.edu.ph', image: require('./assets/cassy.jpg') },
    { id: 2, name: 'Alhena Julienne Gedalanga', email: 'alhenajulienne.gedalanga-21@cpu.edu.ph', image: require('./assets/lena.jpg') },
    { id: 3, name: 'Julius Rey Parman', email: 'juliusrey.parman-23@cpu.edu.ph', image: require('./assets/julius.jpg') },
    { id: 4, name: 'Sean Ashton Regalado', email: 'seanashton.regalado-23@cpu.edu.ph', image: require('./assets/ashton.jpg') },
    { id: 5, name: 'Krystal Jane Siaotong', email: 'krystaljane.siaotong-23@cpu.edu.ph', image: require('./assets/xiao2.jpg') },
  ];

  const handleCommentChange = (text) => {
    setComment(text);
    setIsTyping(text.length > 0); // Set isTyping to true if text is not empty
  };

  const handleSubmitComment = () => {
    // Send feedback via email
    sendFeedback(comment);

    // Update local state
    setComments([...comments, { text: comment }]);
    setComment('');
    setIsTyping(false); // Reset isTyping after submitting comment
  };

  const sendFeedback = (feedback) => {
    // Here you can implement the logic to send feedback via email
    const email = 'recomeal@gmail.com';
    const subject = 'Feedback';
    const body = `Feedback: ${feedback}`;

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailtoLink);
  };

  const handleEmailPress = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <Text style={styles.about}>MEET THE TEAM</Text>
      <View style={styles.developersContainer}>
        {developers.map((developer) => (
          <View key={developer.id} style={styles.developerContainer}>
            <Image source={developer.image} style={styles.image} />
            <View>
              <Text style={styles.name}>{developer.name}</Text>
              <Text style={styles.email} onPress={() => handleEmailPress(developer.email)}>
                {developer.email}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <Text style={styles.feedback}>Send us your feedback!</Text>
      <TextInput
        value={comment}
        onChangeText={handleCommentChange}
        placeholder="Leave a comment..."
        style={styles.input}
      />
      {isTyping && ( // Render comment container only if typing
        <View style={styles.commentContainer}>
          <FlatList
            data={comments}
            renderItem={({ item }) => (
              <View style={styles.commentTextContainer}>
                <Text style={styles.commentText}>{item.text}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmitComment}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  about: {
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 23, // Adjusted top margin
  },
  feedback: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 23, // Adjusted top margin
  },
  developersContainer: {
    marginBottom: 20,
  },
  developerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  email: {
    color: 'blue',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
    borderRadius: 10,
    color:'black', // Changed to match other styles
  },
  commentContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    width: '100%',
  },
  commentTextContainer: {
    padding: 10, // Removed border here
    marginVertical: 5,
    width: '100%',
  },
  commentText: {
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: 'green',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 5,
    alignSelf: 'flex-end', // Align button to the right
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
});

export default About;
message.txt
6 KB