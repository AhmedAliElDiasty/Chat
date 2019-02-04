import React, { Component } from 'react';
import { View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import client from '../../Services/DeepStreamServer';
import styles from './MyGiftedChat.style';
import {getData , onSend , chatList} from './Data'

export default class MyGiftedChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      messages: [],
    };
  }
  async componentDidMount() {
    client.login();
    const messagesList = await getData();
    this.setState(previousState => ({
      messages: GiftedChat.append(
        previousState.messages,
        messagesList.reverse(),
      ),
    }));
    await this.onEntryAdded();
  }
  onEntryAdded = () => {
    chatList.on('entry-added', x => {
      client.record.getRecord(x).whenReady(msg => {
        console.log('messa', msg);
        let message = msg.get();
        let arr = [];
        arr.push(message);
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, arr),
        }));
      });
    });
  };

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
          onSend={onSend.bind(this)}
          user={{
            _id: 1,
          }}
          onInputTextChanged={this.changeTextHandler}
        />
      </View>
    );
  }
}
