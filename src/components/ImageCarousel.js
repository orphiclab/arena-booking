// src/components/ImageCarousel.js

import React, { useState, useRef } from 'react';
import {
  View,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ImageCarousel = ({ images = [], height = 280 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const fallbackImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
  ];

  const onScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  return (
    <View style={{ height }}>
      <FlatList
        ref={flatListRef}
        data={fallbackImages}
        keyExtractor={(_, i) => `img_${i}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width: SCREEN_WIDTH, height }}
            resizeMode="cover"
          />
        )}
      />

      {/* Dots */}
      {fallbackImages.length > 1 && (
        <View style={styles.dotsContainer}>
          {fallbackImages.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === currentIndex ? '#00C2FF' : 'rgba(255,255,255,0.5)',
                  width: i === currentIndex ? 20 : 6,
                },
              ]}
            />
          ))}
        </View>
      )}

      {/* Counter */}
      {fallbackImages.length > 1 && (
        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {currentIndex + 1}/{fallbackImages.length}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dotsContainer: {
    position: 'absolute',
    bottom: 14,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    alignItems: 'center',
  },
  dot: {
    height: 6,
    borderRadius: 3,
    transition: 'width 0.3s',
  },
  counter: {
    position: 'absolute',
    top: 12,
    right: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  counterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ImageCarousel;
