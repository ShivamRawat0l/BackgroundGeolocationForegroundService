/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import React, {useRef} from 'react';
import {Button, SafeAreaView, StyleSheet, View} from 'react-native';
import GetLocation from 'react-native-get-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'http://192.168.1.134:8239/';
const DISTANCE = 600;

function App() {
  const position = useRef({});

  function distance(lat1, lon1, lat2, lon2) {
    var R = 6371; // km (change this constant to get miles)
    var dLat = ((lat2 - lat1) * Math.PI) / 180;
    var dLon = ((lon2 - lon1) * Math.PI) / 180;
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return Math.round(d * 1000);
  }

  const getUserLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        var checkDistance = Object.keys(position.current).length
          ? distance(
              position.current.latitude,
              position.current.longitude,
              location.latitude,
              location.longitude,
            )
          : 0;

        if (
          !DISTANCE ||
          checkDistance > DISTANCE ||
          !Object.keys(position.current).length
        ) {
          position.current = {
            latitude: location.latitude,
            longitude: location.longitude,
          };

          fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(location),
          })
            .then(data => {
              AsyncStorage.getItem('location')
                .then(data => {
                  let storageData = JSON.parse(data) ?? [];
                  storageData.push(location);
                  AsyncStorage.setItem('location', JSON.stringify(storageData));
                  console.log('STORAGE DATA ', storageData.length);
                })
                .catch(e => {
                  console.log('STORAGE ERROR', e);
                });
              console.log(location);
            })
            .catch(e => {
              console.log('Error', e);
            });
        }
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
          }}
        />
        <Button
          title="STOP BACKGROUND SERVICE"
          onPress={() => {
            ReactNativeForegroundService.remove_all_tasks();
          }}
        />
        <Button
          title="FETCH BACKGROUND SERVICE"
          onPress={() => {
            fetch(BACKEND_URL)
              .then(data => {
                console.log(data);
              })
              .catch(e => {
                console.log('Error', e);
              });
          }}
        />
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
