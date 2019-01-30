import React, { Component } from 'react';
import { View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import client from './src/Services/DeepStreamServer';
import styles from './App.style';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      messages: [],
    };
  }

  async componentDidMount() {
    client.login();
    const messagesList = await this.getData();
    this.setState(previousState => ({
      messages: GiftedChat.append(
        previousState.messages,
        messagesList.reverse(),
      ),
    }));
    this.onEntryAdded();
  }

  getData = () => {
    return new Promise((resolve, reject) => {
      this.chatList = client.record.getList('chatList444');

      let newMessgesList = [];
      this.chatList.whenReady(x => {
        const list = x.getEntries();
        const messagesCount = list.length;
        let resolveCount = 0;

        for (let i = 0; i < list.length; i++) {
          client.record.getRecord(list[i]).whenReady(msg => {
            const newMsg = msg.get();
            newMessgesList.push(newMsg);

            msg.discard();

            resolveCount++;
            if (resolveCount == messagesCount) {
              resolve(newMessgesList);
            }
          });
        }
      });
    });
  };

  onEntryAdded = () => {
    this.chatList.on('entry-added', x => {
      client.record.getRecord(x).whenReady(msg => {
        console.log('messa', msg);

        let message = msg.get();

        console.log(message);
        let arr = [];

        arr.push(message);
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, arr),
        }));
      });
    });
  };

  onSend(messages = []) {
    let name = `test/${client.getUid()}`;
    const myRecord = client.record.getRecord(name);
    myRecord.whenReady(() => {
      myRecord.set({
        _id: client.getUid(),
        text: messages[0].text,
        createdAt: new Date(),
        user: {
          _id: 1,
        },
      });

      this.chatList.addEntry(name);
    });
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
          onSend={this.onSend.bind(this)}
          user={{
            _id: 1,
          }}
          onInputTextChanged={this.changeTextHandler}
        />
      </View>
    );
  }
}
