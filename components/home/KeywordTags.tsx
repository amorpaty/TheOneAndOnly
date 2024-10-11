import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';

/**
 * 24.09.30
 * 키워드 Tag Button List 
 * @param param
 * @returns 
 */
function KeywordTags({keywords, handleKeywordPress}) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={true} // 가로 스크롤 활성화
        showsHorizontalScrollIndicator={false} // 스크롤바 숨기기 (선택 사항)
        contentContainerStyle={styles.scrollContent} // 스크롤 내용의 스타일
      >
        {keywords.map((tag) => (
          <Button
            key={tag.keywordId}
            onPress={() => handleKeywordPress(tag)}
            style={styles.tagButton}
          >
            <Text style={styles.tagText}>{tag.keywordName}</Text>
          </Button>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 10,
    right: 10,
    marginVertical: 15,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  tagButton: {
    backgroundColor: 'white',
    borderRadius: 5,
    marginHorizontal: 5,
    marginVertical: 5,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3a3b3a',
  },
});

export default KeywordTags;
