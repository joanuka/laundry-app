import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function ReceiptScreen() {
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = async () => {
    const data = await AsyncStorage.getItem('receipts');
    if (data) setReceipts(JSON.parse(data));
  };

  const downloadReceipt = async (item) => {
    const content = `
Celine's Laundry Receipt

Date: ${item.date}

Items:
${item.items.map(i => `${i.name} x${i.quantity} = ₦${i.price * i.quantity}`).join('\n')}

Total: ₦${item.total}

Status: ${item.status}
`;

    const fileUri = FileSystem.documentDirectory + `receipt_${item.id}.txt`;

    await FileSystem.writeAsStringAsync(fileUri, content);

    await Sharing.shareAsync(fileUri);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>

      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>
        My Receipts
      </Text>

      <FlatList
        data={receipts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{
            padding: 15,
            borderWidth: 1,
            marginBottom: 10,
            borderRadius: 10
          }}>
            <Text>Date: {item.date}</Text>
            <Text>Total: ₦{item.total}</Text>

            <TouchableOpacity
              onPress={() => downloadReceipt(item)}
              style={{
                marginTop: 10,
                backgroundColor: 'green',
                padding: 10,
                borderRadius: 8
              }}
            >
              <Text style={{ color: '#fff', textAlign: 'center' }}>
                Download Receipt
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}