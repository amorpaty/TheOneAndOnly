import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

function KeywordTags({keywords, handleKeywordPress}) {
  return (
    <View style={styles.container}>
      {keywords.map((tag) => (
        <Button
          key={tag.keywordId}
          onPress={() => handleKeywordPress(tag)}
          style={styles.tagButton}
        >
          <Text style={styles.tagText}>{tag.keywordName}</Text>
        </Button>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position : 'absolute',
    top: 60,
    left: 10,
    right: 10,
    zIndex : 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 15,
  },
  tagButton: {
    backgroundColor: 'white',
    borderRadius: 5,
    marginHorizontal: 5,
    marginVertical: 5,
    shadowColor : 'black',
    shadowOffset :{width : 1, height:4},
    shadowOpacity : 1,
    shadowRadius : 4,
    elevation: 5, // 그림자를 더 진하게 하려면 이 값을 높입니다.
  },
  selectedTag: {
    backgroundColor: 'white',
  },
  tagText: {
    fontSize: 14,
    fontWeight : '500',
    color: '#3a3b3a',
  },
});

export default KeywordTags;
