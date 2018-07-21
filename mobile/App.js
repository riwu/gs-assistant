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
  PermissionsAndroid,
} from 'react-native';
import Voice from 'react-native-voice';
import io from 'socket.io-client';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import env from './.env.json';

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
    axios.post(env.SESSION_URL, {
      page: DeviceInfo.getDeviceName(),
      referrer: 'GS Assistant',
    });

    const socket = io(env.SOCKET_URL);
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
      this.startTranscription()
        .then(() => console.log('restarted'))
        .catch(e => Alert.alert('Failed to start recording', e.message));
    };
    Voice.onSpeechPartialResults = (e) => {
      console.log('result', e);
      const [value] = e.value;
      this.sendText(socket, value, false);
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

  sendText(socket, value, isFinal) {
    if (value) {
      const name = (this.name || '').trim() || DeviceInfo.getDeviceName();
      console.log('name', name);
      socket.send(value, isFinal, name);
    }
  }

  startTranscription() {
    if (this.shouldStop) return Promise.resolve();
    return Voice.start('en-US');
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          autoCorrect={false}
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
              const request =
                Platform.OS === 'ios'
                  ? Promise.resolve(PermissionsAndroid.RESULTS.GRANTED)
                  : PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
              request.then((status) => {
                if (status === PermissionsAndroid.RESULTS.GRANTED) {
                  this.shouldStop = false;
                  this.startTranscription()
                    .then(() => this.setState({ started: true }))
                    .catch(e => Alert.alert('Failed to start recording', e.message));
                } else {
                  Alert.alert(
                    'Microphone permission not granted',
                    'Please enable Microphone permission in App settings',
                  );
                }
              });
            }
          }}
          title={this.state.started ? 'Stop recording' : 'Start recording'}
        />
        <WebView source={{ uri: 'https://riwu.github.io/gs-assistant' }} style={{ width }} />
      </View>
    );
  }
}
