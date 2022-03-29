import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet,ScrollView, Text, View, FlatList, SafeAreaView, LogBox, Image } from 'react-native';
import firebase from 'firebase/compat/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { Provider as PaperProvider, Card, List, Button } from 'react-native-paper';
import Constants from 'expo-constants';
import LoginScreen from './Login';
 
const firebaseConfig = {
  apiKey: "AIzaSyDXYuUtHXYRAJFo0OiJLA48u69xz5zTo4Y",
  authDomain: "work7-47693.firebaseapp.com",
  databaseURL: "https://work7-47693-default-rtdb.firebaseio.com",
  projectId: "work7-47693",
  storageBucket: "work7-47693.appspot.com",
  messagingSenderId: "587150325733",
  appId: "1:587150325733:web:ab5fbe77d40847c715e10c",
  measurementId: "G-LTLX1CTYCK"
};
 
LogBox.ignoreAllLogs(true);
 
try {
  firebase.initializeApp(firebaseConfig);
} catch (err) {   }
 
function dbListener(path,setData){
   const tb = ref(getDatabase(), path);
   onValue(tb, (snapshot)=>{
     setData(snapshot.val());
   })
}
 
function renderCorona({item}){
  var icon = <Image style={{width:30,height:20}} source={{uri:`https://covid19.who.int/countryFlags/${item.code}.png`}}/>
  var desc = <View>
  <Text>{ "ผู้ป่วยสะสม "+item.confirmed+" ราย"}</Text>
  <Text>{ "เสียชีวิต "+item.death+" ราย"}</Text>
  <Text>{ "ฉีดวัคซีนแล้วจำนวน "+item.vaccine+" โดส"}</Text>
  </View>;
  //return <View><Text>ประเทศ {item.name} มีผู้ป่วย {item.confirmed} ราย</Text></View>
  return <List.Item title={item.name} description={desc} left={(props=>icon)}></List.Item>
}

 
function Loading(){
  return <View><Text>Loading</Text></View>
}
 
 
export default function App() {
  const [corona, setCorona] = React.useState([]);
  const [user, setUser] = React.useState(null);
 
  React.useEffect(() => {
    var auth = getAuth();
    auth.onAuthStateChanged(function (us) {
      setUser(us);
    });
    dbListener("/corona", setCorona);
   }, []);

   if(user==null){    
    return <LoginScreen/>;
  }

 
  if(corona.length==0){
    return <Loading/>;
  }
  return (
    <PaperProvider>      
    <View style={styles.container}>
    <ScrollView>
      <Card>
      <Card.Cover source={{uri:("https://images.unsplash.com/photo-1584483766114-2cea6facdf57?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80")}}/>
      <Card.Title title="Coronavirus Situation"/>
      <Card.Content>
      <FlatList data={corona} renderItem={renderCorona} ></FlatList>
      </Card.Content>
      </Card>
    </ScrollView>
    <Button icon="logout" mode="contained" onPress={() => getAuth().signOut()}>
      Sign Out
      </Button>
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" style="light" />
    </View>
    </PaperProvider>
  );
 
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight,
  },
});
