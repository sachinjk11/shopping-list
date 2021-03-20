import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import * as SQLite from 'expo-sqlite';
import { BannerAd } from './bannerAd';

const db = SQLite.openDatabase("db.db");

const Separator = () => (
  <View style={styles.separator} />
);


function Items({ done: doneHeading, onPressItem }) {
  const [items, setItems] = React.useState(null);

  React.useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        `select * from items where done = ?;`,
        [doneHeading],
        (_, { rows: { _array } }) => setItems(_array));
    });
  }, []);

  let heading = doneHeading == 1 ? "Item in Cart" : 
                 doneHeading == 2 ? "Item in Bag" : "Shopping List";

  if (items === null || items.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeading}>{heading}</Text>
      {items.map(({ id, done, value }) => (
        <TouchableOpacity
          key={id}
          onPress={() => onPressItem && onPressItem(id)}
          style={{
            backgroundColor: done==0?"#fff":done==1?"lightseagreen":"tomato",
            borderColor: "#000",
            borderWidth: 1,
            padding: 8
          }}
        >
          <Text style={{ color: done == 0 ? "#000":"#fff"}}>{value}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function App() {
  const [text, setText] = React.useState(null)
  const [forceUpdate, forceUpdateId] = useForceUpdate()

  React.useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        "create table if not exists items (id integer primary key not null, done int, value text);"
      );
    });
  }, []);

  const add = (text) => {
    // is text empty?
    if (text === null || text === "") {
      return false;
    }

    db.transaction(
      tx => {
        tx.executeSql("insert into items (done, value) values (0, ?)", [text]);
        tx.executeSql("select * from items", 
        [], 
        (_, { rows }) => console.log(JSON.stringify(rows)));
      },
      null,
      forceUpdate
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.inst}>Add item in Shopping List</Text>
      <View style={styles.flexRow}>
        <TextInput
          onChangeText={text => setText(text)}
          onSubmitEditing={() => {
            add(text);
            setText(null);
          }}
          placeholder="what do you need to buy?"
          style={styles.input}
          value={text}
        />
      </View>
      <ScrollView style={styles.listArea}>
        <Items
          key={`forceupdate-todo-${forceUpdateId}`}
          done={0}
          onPressItem={id =>
            db.transaction(
              tx => {
                tx.executeSql(`update items set done = 1 where id = ?;`, [id]);
              },
              null,
              forceUpdate
            )
          }
        />
        <Items
          done={1}
          key={`forceupdate-done-${forceUpdateId}`}
          onPressItem={id =>
            db.transaction(
              tx => {
                tx.executeSql(`update items set done = 2 where id = ?;`, [id]);
              },
              null,
              forceUpdate
            )
          }
        />
        <Items
          done={2}
          key={`forceupdate-delete-${forceUpdateId}`}
          onPressItem={id =>
            db.transaction(
              tx => {
                tx.executeSql(`delete from items where id = ?;`, [id]);
              },
              null,
              forceUpdate
            )
          }
        />
      <Text style={styles.instNote}>On Click Item move from one bucket to another</Text>
      <Text style={styles.instNote}>{"Shopping list -> Item in Cart -> Item in Bag -> Delete "}</Text>
      <View style={{marginTop:20}}>
      </View>
      </ScrollView>
      <Separator/>
          <BannerAd/>
      <Separator/>
    </View>
  );

}

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return [() => setValue(value + 1), value];
}

const styles = StyleSheet.create({
  inst:{
        fontFamily: 'sans-serif-condensed',
        margin:10,
        fontSize: 17,
  },
  instNote:{
    fontFamily: 'sans-serif-condensed',
    margin:0,
    fontSize: 11,
    paddingLeft:12
},
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center"
  },
  flexRow: {
    flexDirection: "row"
  },
  input: {
    borderColor: "tomato",
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 40,
    margin: 5,
    padding: 8
  },
  listArea: {
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: 11,
    paddingBottom:20,
  },
  sectionContainer: {
    marginBottom: 10,
    marginHorizontal: 10
  },
  sectionHeading: {
    fontSize: 15,
    marginBottom: 8
  }
});