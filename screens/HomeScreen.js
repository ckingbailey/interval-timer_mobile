import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';

const data = require('../data/dummyTimers.json');
const timers = data.timers;
const intervals = data.intervals;

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timers: []
    }
  }

  static navigationOptions = {
    header: null,
  };

  tallyTimerTotal(timerID) {
    const timerData = timers; // timers here is a placeholder. eventually the collection will come from a data API
    const intervalData = intervals; // same here: intervals is a placeholder. eventually the collection will come from a data API

    return timerData[timerID].intervals.reduce((acc, intervalID) => {
      return acc += intervalData[intervalID].duration
    }, 0)
  }

  renderTimerList() {
    const timerData = timers; // timers here is a placeholder. eventually the collection will come from a data API

    return this.state.timers.map(timerID => {
      const totalTime = this.tallyTimerTotal(timerID);

      return <Text style={ styles.getStartedText } key={ timerID }>{ timerData[timerID].name } : { totalTime }</Text>
    })
  }

  componentDidMount() {
    this.setState({
      timers: Object.keys(timers)
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>My Timers</Text>
          </View>

          { this._maybeRenderDevelopmentModeBanner() }

          <View style={styles.getStartedContainer}>
            { this.renderTimerList() }
          </View>
        </ScrollView>

        <View style={styles.tabBarInfoContainer}>
          <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>

          <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
            <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
          </View>
        </View>
      </View>
    );
  }

  _maybeRenderDevelopmentModeBanner() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={ this._handleLearnMorePress } style={ styles.helpLinkText }>Learn more</Text>
      );
  
      return (
        <View style={styles.developmentBanner}>
            <Text style={ styles.developmentModeText }>
              <Image source={require('../assets/images/robot-dev-icon.png')} style={styles.developmentBannerImage} />
              Dev mode enabled {learnMoreButton}
            </Text>
        </View>
      )
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const colors = {
  purple: '#9933EE',
  green: '#20B2AA',
  yellow: '#E5BB14',
  orange: '#E4572E',
  blue: '#2660A4'
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentBanner: {
    marginBottom: 16,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: '#ddd'
  },
  developmentModeText: {
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  headerContainer: {
    paddingTop: 16,
    paddingBottom: 16,
    alignItems: 'center',
    backgroundColor: colors.orange,
  },
  headerText: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 24
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
