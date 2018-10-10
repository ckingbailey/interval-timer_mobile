import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';

const data = require('./data/dummyTimers.json');
const timers = data.timers;
const intervals = data.intervals;

export default class App extends React.Component {
  /* timer and interval data has the shape of:
  ** timers: {
  **    Number: {
  **      name: String,
  **      intervals: [ Numbers ]
  **    },
  **    ....
  ** },
  ** intervals: {
  **    Number: {
  **      name: String,
  **      duration: Number,
  **    },
  **    ....
  **  }
  */
  state = {
    isLoadingComplete: false,
    curSetIntervalId: null,
    timers: {},
    intervals: {}
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator
            screenProps = {{
              timers: this.state.timers,
              intervals: this.state.intervals
            }}
          />
        </View>
      );
    }
  }

  componentDidMount() {
    this.setState({
      timers: timers,
      intervals: intervals
    })
  }

  startTimer(timerID) {
    this.setState(state => {
      const curSetIntervalId = setInterval(() => decrementInterval, 1000)
      const initialIntervalID = state.timers[timerID].intervals[0]
      const count = state.intervals[initialIntervalID].duration
      const endTime = this.getTimeSecs() + count
      const curTimer = {
        id: timerID,
        curInterval: {
          endTime,
          count, 
          id: initialIntervalID
        }
      }
      return { curSetIntervalId, curTimer }
    })
  }

  decrementInterval() {
    if (this.getTimeSecs() >= this.state.curInterval.endTime) { // check if this interval is done
      const curTimer = this.state.timers[this.state.curTimer.id];

      if (this.state.curTimer.curInterval.id === curTimer.intervals[curTimer.intervals.length - 1]) { // check if this is the last interval for current timer
        return this.endTimer()
      }
      return this.startNextInterval()
    }

    this.setState(state => {
      const count = state.curTimer.curInterval.endTime - this.getTimeSecs()
      return {
        curTimer: {
          curInterval: {
            count
          }
        }
      }
    })
  }

  startNextInterval() {
    this.setState(state => {
      const curTimer = state.timers[state.curTimer.id]
      const nextIntervalIndex = curTimer.intervals.indexOf(state.curTimer.curInterval.id) + 1
      const nextIntervalId = curTimer.intervals[nextIntervalIndex]
      const curTime = this.getTimeSecs()
      const endTime = curTime + state.intervals[nextIntervalId].duration
      const count = endTime - curTime

      return {
        curTimer: {
          curInterval: {
            endTime,
            count,
            id: nextIntervalId
          }
        }
      }
    })
  }

  endTimer () {
    this.setState(state => {
      clearInterval(state.curSetIntervalId)
      return { curSetIntervalId: null }
    })
  }

  getTimeSecs() {
    return Math.floor(Date.now()/1000)
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
