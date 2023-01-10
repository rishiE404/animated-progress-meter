import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Meter} from './components/meter';
import {Needle} from './components/needle';
import {withAnchorPoint} from './helper/anchorPoint';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const progressValue = useRef(new Animated.Value(0)).current;

  const [score, setScore] = useState(0);
  const [fillColor, setFillColor] = useState('#FFFFFF');

  const getTransform = () => {
    let transform = {
      transform: [{perspective: 1}, {rotate: animInterpolation}],
    };
    return withAnchorPoint(
      transform,
      {x: 0.5, y: 1},
      {width: 125, height: 150},
    );
  };

  const animInterpolation = progressValue.interpolate({
    inputRange: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    outputRange: [
      '-90deg',
      '-90deg',
      '-90deg',
      '-45deg',
      '-45deg',
      '0deg',
      '0deg',
      '45deg',
      '45deg',
      '90deg',
      '90deg',
    ],
  });

  function onButtonClick() {
    if (progressValue !== score) {
      setScore(Math.floor(Math.random() * (10 - 1 + 1) + 1));
    }
  }

  useEffect(() => {
    if (score > 0) {
      Animated.timing(progressValue, {
        duration: 2000,
        toValue: new Animated.Value(score),
        useNativeDriver: true,
      }).start(finished => {
        console.log('finished====', finished);
        if (finished) {
          setFillColor('#91d9ae');
        }
      });
    }
  }, [progressValue, score]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Animated.View>
        <View style={styles.progressCardContainer}>
          <Animated.View style={[styles.indicatorStyle, getTransform()]}>
            <Needle />
          </Animated.View>
          <Animated.View style={styles.progressMeterContainer}>
            <Meter progressValue={score} fillColor={fillColor} />
          </Animated.View>
        </View>
      </Animated.View>

      <Pressable style={styles.buttonContainer} onPress={() => onButtonClick()}>
        <Text style={styles.textStyles}> Animate </Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
  },
  progressCardContainer: {
    alignItems: 'center',
  },
  progressMeterContainer: {
    shadowOffset: {width: 0, height: 0},
    elevation: Platform.select({android: 12, ios: 5}),
    shadowOpacity: Platform.select({android: 0.001, ios: 0.2}),
    shadowRadius: Platform.select({android: 0, ios: 7}),
    borderRadius: 50,
  },
  indicatorStyle: {
    position: 'absolute',
    top: -10,
    zIndex: 7,
  },
  buttonContainer: {
    marginTop: 50,
    alignSelf: 'center',
    backgroundColor: 'green',
    borderRadius: 4,
    width: 100,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyles: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;
