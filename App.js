import React, { Component } from 'react';
import { View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { client } from './src/Services/DeepStreamServer';
import styles from './App.style';
// import createDeepstream from 'deepstream.io-client-js'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      messages: [],
    };
    this.chatList = client.record.getList('chatList41');
  }
  
  componentDidMount() {
    this.fetchData();

    
  }

  fetchData = () => {
    let newMessgesList = [];
    this.chatList.whenReady(async x => {
      const list = x.getEntries();      
      list.forEach(item=>{
        client.record.getRecord(item).whenReady(msg => {          
            const newMsg = msg.get().data;
            newMessgesList.push(newMsg);
            msg.discard();
          });
      })
      console.log('newMessagelist',newMessgesList)
      setTimeout(()=>{this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, newMessgesList.reverse()),
      }))},1000)       
      this.onEntryAdded()
    });
  };

  onEntryAdded = () =>{
    this.chatList.on('entry-added', x => {
      client.record.getRecord(x).whenReady(msg => {
        let arr = [];
        const newMessage = {
          _id: client.getUid(),
          text: msg.get().data.text,
          createdAt: new Date(),
          user: {
            _id: 1,
           
          },
        };
        arr.push(newMessage);
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, arr),
        }));
      });
    });
  }

  

  onSend() {
    this.myRecord = client.record.getRecord(`test/${client.getUid()}`);
    this.myRecord.set({
      data: {
        _id: client.getUid(),
        text: this.state.message,
        createdAt: new Date(),
        user: {
          _id: 1,
         
        },
      },
      index: Math.round(Math.random() * 10+Math.random() * 10),
    });
    this.chatList.addEntry(this.myRecord.name, this.myRecord._$data.index);
  }
  changeTextHandler = text => {
    this.setState({
      message: text,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <GiftedChat
          messages={this.state.messages}
          onSend={() => this.onSend()}
          user={{
            _id: 1,
          }}
          onInputTextChanged={this.changeTextHandler}
        />
      </View>
    );
  }
}
