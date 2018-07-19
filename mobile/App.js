import React from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Dimensions,
  Button,
  Platform,
  TextInput,
  WebView,
} from 'react-native';
import Voice from 'react-native-voice';
import io from 'socket.io-client';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
  input: {
    fontSize: 20,
    margin: 10,
  },
});

export default class App extends React.Component {
  state = {
    started: false,
  };
  componentDidMount() {
    const socket = io('https://g.wangriwu.com');
    socket.on('connect', () => {
      console.log('Socket connection established');
    });

    socket.on('disconnect', () => {
      console.log('Socket connection lost');
    });

    Voice.onSpeechStart = () => console.log('started');
    Voice.onSpeechRecognized = () => console.log('recognized');
    Voice.onSpeechEnd = () => {
      console.log('ended');
      if (this.value) {
        socket.send(this.value, true, this.name);
      }
      this.startTranscription()
        .then(() => console.log('restarted'))
        .catch(e => Alert.alert('Failed to start recording', e.message));
    };
    Voice.onSpeechPartialResults = (e) => {
      console.log('result', e);
      const [value] = e.value;
      this.value = value;
      if (this.value) {
        socket.send(this.value, false, this.name);
      }
    };
    Voice.onSpeechResults = e => console.log('final result', e);
    Voice.onSpeechError = (e) => {
      console.log('err', e);
      if (e.error.message.includes('No speech input')) {
        this.startTranscription()
          .then(() => console.log('restarted'))
          .catch(err => Alert.alert('Failed to start recording', err.message));
      } else {
        Alert.alert('Error', e.error.message);
      }
    };
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  startTranscription() {
    if (this.shouldStop) return Promise.resolve();
    return Voice.start('en-US');
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          onChangeText={(text) => {
            this.name = text;
          }}
        />
        <Button
          onPress={() => {
            if (this.state.started) {
              this.shouldStop = true;
              Voice.stop()
                .then(() => this.setState({ started: false }))
                .catch(e => Alert.alert('Failed to stop recording', e.message));
            } else {
              this.shouldStop = false;
              this.startTranscription()
                .then(() => this.setState({ started: true }))
                .catch(e => Alert.alert('Failed to start recording', e.message));
            }
          }}
          title={this.state.started ? 'Stop recording' : 'Start recording'}
        />
        <WebView source={{ uri: 'https://riwu.github.io/gs-assistant' }} style={{ width }} />
      </View>
    );
  }
}
