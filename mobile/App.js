import React from 'react';
import {
  StyleSheet,
  View,
  Alert,
  WebView,
  Dimensions,
  Button,
  Platform,
  TextInput,
} from 'react-native';
import Voice from 'react-native-voice';
import io from 'socket.io-client';

const socket = io('https://g.wangriwu.com');

socket.on('connect', () => {
  console.log('Socket connection established');
});

socket.on('disconnect', () => {
  console.log('Socket connection lost');
});

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
});

const startTranscription = () => Voice.start('en-US');

export default class App extends React.Component {
  state = {
    started: false,
  };
  componentDidMount() {
    Voice.onSpeechStart = () => console.log('started');
    Voice.onSpeechRecognized = () => console.log('recognized');
    Voice.onSpeechEnd = () => {
      console.log('ended');
      if (this.value) {
        socket.send(this.value, true, this.name);
      }
      startTranscription()
        .then(() => console.log('restarted'))
        .catch(e => Alert.alert('Failed to start recording', e.message));
    };
    Voice.onSpeechPartialResults = (e) => {
      console.log('result', e);
      this.value = e.value;
      if (e.value) {
        socket.send(e.value, false, this.name);
      }
    };
    Voice.onSpeechResults = e => console.log('final result', e);
    Voice.onSpeechError = (e) => {
      console.log('err', e);
      if (!e.error.message.includes('No speech input')) {
        if (!this.alerted) {
          Alert.alert('Error', e.error.message, [
            {
              text: 'OK',
              onPress: () => {
                this.alerted = false;
              },
            },
          ]);
        }
        this.alerted = true;
      }
      startTranscription()
        .then(() => console.log('restarted'))
        .catch(err => Alert.alert('Failed to start recording', err.message));
    };
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Enter your name"
          onChangeText={(text) => {
            this.name = text;
          }}
        />
        <Button
          onPress={() => {
            if (this.state.started) {
              Voice.stop()
                .then(() => this.setState({ started: false }))
                .catch(e => Alert.alert('Failed to stop recording', e.message));
            } else {
              startTranscription()
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
