import client from '../../Services/DeepStreamServer';

export const chatList = client.record.getList('chatList444');

export function getData () {
  return new Promise((resolve, reject) => {
    let newMessgesList = [];
    chatList.whenReady(x => {
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

export function onSend(messages = []) {
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
    chatList.addEntry(name);
  });
}