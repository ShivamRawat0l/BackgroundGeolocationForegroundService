/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import React from 'react';
import {Button, SafeAreaView, StyleSheet, View} from 'react-native';
import GetLocation from 'react-native-get-location';

const BACKEND_URL = 'http://192.168.1.134:8239/';
function App() {
  const getUserLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        fetch(BACKEND_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(location),
        })
          .then(data => {
            console.log(location);
          })
          .catch(e => {
            console.log('Error', e);
          });
      })
      .catch(error => {
        fetch(BACKEND_URL, {
          method: 'POST',
          body: error,
        })
          .then(data => {
            console.log(error);
          })
          .catch(e => {
            console.log('Error', e);
          });
      });
  };
  const startBackgroundFetching = () => {
    ReactNativeForegroundService.add_task(() => getUserLocation(), {
      delay: 1000,
      onLoop: true,
      taskId: 'taskid',
      onError: e => console.log('Error logging:', e),
    });

    ReactNativeForegroundService.start({
      id: 1244,
      title: 'Foreground Service',
      message: 'We are live World',
      icon: 'ic_launcher',
      button: true,
      button2: true,
      buttonText: 'Button',
      button2Text: 'Anther Button',
      buttonOnPress: 'cray',
      setOnlyAlertOnce: true,
      color: '#000000',
      progress: {
        max: 100,
        curr: 50,
      },
    });
  };
  return (
    <SafeAreaView>
      <View>
        <Button
          title="START BACKGROUND SERVICE"
          onPress={() => {
            startBackgroundFetching();
          }}></Button>
        <Button
          title="STOP BACKGROUND SERVICE"
          onPress={() => {
            ReactNativeForegroundService.remove_all_tasks();
          }}></Button>
        <Button
          title="FETCH BACKGROUND SERVICE"
          onPress={() => {
            fetch('http://192.168.1.134:8239/')
              .then(data => {
                console.log(data);
              })
              .catch(e => {
                console.log('Error', e);
              });
          }}></Button>
        <Button
          title="FETCH BACKGROUND SERVICE"
          onPress={() => {
            fetch('http://localhost:8239/')
              .then(data => {
                console.log(data);
              })
              .catch(e => {
                console.log('Error', e);
              });
          }}></Button>
        <Button
          title="FETCH ONLINE BACKGROUND SERVICE"
          onPress={() => {
            fetch(
              'https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits',
            )
              .then(response => response.json())
              .then(commits => alert(commits[0].author.login));
          }}></Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
