import { Image, StyleSheet, Text, View, Button } from "react-native";
import * as FileSystem from "expo-file-system";
import { useState } from "react";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default function ImageTest() {
  const bigImage =
    "https://images.unsplash.com/photo-1682685797741-f0213d24418c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const smallImage =
    "https://firebasestorage.googleapis.com/v0/b/pause-247817.appspot.com/o/organizations%2Fransomedheart%2Fv2PauseAssets%2F5HyEt16I3dTgPWa8J23H%2F5e78515d-7d4b-4026-8cbb-31335432651e.jpeg?alt=media&token=25810df7-ae24-4768-a1fc-e1f2fa8d1f1f";

  return (
    <View style={styles.container}>
      <ImageDownloader url={bigImage} name="bigImage.jpeg" />
      <View style={{ height: 20 }} />
      <ImageDownloader url={smallImage} name="smallImage.jpeg" />
    </View>
  );
}

function ImageDownloader({ url, name }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const filePath = FileSystem.documentDirectory + name;
  const [fileUri, setFileUri] = useState(null);

  async function downloadResumable() {
    setIsDownloading(true);
    const downloadResumable = FileSystem.createDownloadResumable(url, filePath);

    try {
      const { uri } = (await downloadResumable.downloadAsync()) || {};
      setFileUri(uri);
    } catch (e) {
      console.error(e);
    } finally {
      setFileInfo(await FileSystem.getInfoAsync(filePath));
      setIsDownloading(false);
    }
  }

  async function download() {
    setIsDownloading(true);
    //const downloadResumable = FileSystem.createDownloadResumable(url, filePath);

    try {
      //const { uri } = (await downloadResumable.downloadAsync()) || {};
      const { uri } = await FileSystem.downloadAsync(url, filePath);
      setFileUri(uri);
    } catch (e) {
      console.error(e);
    } finally {
      setFileInfo(await FileSystem.getInfoAsync(filePath));
      setIsDownloading(false);
    }
  }

  console.log(fileUri);

  return (
    <>
      {isDownloading && <Text>Downloading...</Text>}
      {fileUri && (
        <>
          <Image
            source={{ uri: fileUri, height: 100, width: 100 }}
            style={{ width: 100, height: 100, backgroundColor: "pink" }}
          />
          <Text>File Path: {filePath}</Text>
          <Text>File Size: {JSON.stringify(fileInfo)}</Text>
        </>
      )}
      <Button
        onPress={async () => await download()}
        title={`Download ${name}`}
      />
      <Button
        onPress={async () => await downloadResumable()}
        title={`Download resumable ${name}`}
      />
    </>
  );
}
