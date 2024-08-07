import { Text, View, StyleSheet, TouchableOpacity, Button} from "react-native";
import { CameraView, Camera, useCameraPermissions} from 'expo-camera';
import {useState, useEffect, useRef} from 'react';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
// import {Audio} from 'expo-av';


export default function Index() {

   const copyToMediaLibrary = async(cacheUri,folderName, fileName) => {
    try{
        console.log('this is cacheuri', cacheUri)
        console.log('this is foldername', folderName)
        console.log('this is filename', fileName)
        let x = await FileSystem.copyAsync({from:cacheUri, to:FileSystem.documentDirectory+`/offlineStorage/${fileName}.mp4`})
        const asset = await MediaLibrary.createAssetAsync(FileSystem.documentDirectory+`/offlineStorage/${fileName}.mp4`)
        const deleteFile =  await FileSystem.deleteAsync(FileSystem.documentDirectory+`/offlineStorage/${fileName}.mp4`)
        // const asset = await MediaLibrary.createAssetAsync(cacheUri)
    }
    catch(e){console.log(e)}
}


  let camera = useRef(null);
  let [permission, requestPermission] = useCameraPermissions();
  const audioStatus = Camera.requestMicrophonePermissionsAsync();


  const takeVideo = async () => {
    console.log('start recording pressed')
    if (camera.current) {
    try{
        console.log(await camera.current.getAvailablePictureSizesAsync('16:9'))
        const data = await camera.current.recordAsync(
          {videoQuality: '2160p'}
          );
          let fileN = 'test'+Math.floor(Math.random()*10)
          let localSaveDir = null;
          const x = await copyToMediaLibrary(data.uri,localSaveDir,fileN)
    }catch(e){console.log("Error at stop recording",e)};
    };
  }

  const stopVideo = async () => {
    camera.current.stopRecording();
  };

  
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <View style={styles.cameraContainer}>
        <CameraView
          ref={(ref) => {camera.current = ref}}
          style={styles.fixedRatio}
          facing={'front'}
          videoQuality={'2160p'}
          mode={'video'}
          pictureSize='3840x2160'

        />
      </View>
      <TouchableOpacity style={styles.cameraButton} onPress={takeVideo}><Text>Record</Text></TouchableOpacity>
      <TouchableOpacity style={styles.cameraButton} onPress={stopVideo}><Text>Stop Record</Text></TouchableOpacity>
    </View>
  );
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:10
  },
  cameraContainer: {
    marginBottom:50,
    width: 1100,
    height: 618,
    backgroundColor: 'blue',
  },
  fixedRatio: {
    height: '100%',
    width: '100%',
  },
  cameraButton: {
    height:100,
    width:200,
    backgroundColor:'red'
  }
});

