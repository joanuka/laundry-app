import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock Data for Laundry Services
const LAUNDRY_SERVICES = [
  { id: '1', name: 'Wash & Fold', price: 1500, unit: 'kg', icon: '🧺 ' },
  { id: '2', name: 'Wash & Iron', price: 2200, unit: 'kg', icon: '🧼' },
  { id: '3', name: 'Suit / Native Dry Clean', price: 4500, unit: 'pc', icon: '🧥' },
  { id: '4', name: 'Steam Ironing Only', price: 700.50 , unit: 'pc', icon: '💨' },
];

export default function HomeScreen() {
  const [cart, setCart] = useState({});
  const [orderStatus, setOrderStatus] = useState(null);
  const [lastReceipt, setLastReceipt] = useState(null); // 👈 RECEIPT PLACEHOLDER

  // Add to cart
  const addToCart = (service) => {
    setCart((prev) => ({
      ...prev,
      [service.id]: {
        ...service,
        quantity: (prev[service.id]?.quantity || 0) + 1,
      },
    }));
  };

  // Remove from cart
  const removeFromCart = (id) => {
    setCart((prev) => {
      const copy = { ...prev };
      if (!copy[id]) return prev;

      if (copy[id].quantity > 1) {
        copy[id].quantity -= 1;
      } else {
        delete copy[id];
      }
      return copy;
    });
  };

  const formatNaira = (amount) => '₦' + Number(amount).toLocaleString();

  const calculateTotal = () =>
    Object.values(cart).reduce((sum, i) => sum + i.price * i.quantity, 0);

  // ✅ PLACE ORDER + SAVE RECEIPT + SHOW PLACEHOLDER
  const handlePlaceOrder = async () => {
    if (Object.keys(cart).length === 0) {
      Alert.alert('Empty Bag', 'Please add items first');
      return;
    }

    const receipt = {
      id: Date.now().toString(),
      items: Object.values(cart),
      total: calculateTotal(),
      date: new Date().toLocaleString(),
      status: 'Received',
    };

    setLastReceipt(receipt); // 👈 THIS IS YOUR PLACEHOLDER
    setOrderStatus('Received');
    setCart({});

    try {
      const existing = await AsyncStorage.getItem('receipts');
      const receipts = existing ? JSON.parse(existing) : [];
      receipts.push(receipt);
      await AsyncStorage.setItem('receipts', JSON.stringify(receipts));
    } catch (e) {
      console.log(e);
    }

    Alert.alert('Success', 'Order placed successfully');
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Celine's Laundry Services</Text>
        <Text style={styles.headerSubtitle}>
          Fresh clothes, zero hassle
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* SERVICES */}
        <Text style={styles.sectionTitle}>Select Services</Text>

        <View style={styles.grid}>
          {LAUNDRY_SERVICES.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>
                {formatNaira(item.price)} / {item.unit}
              </Text>

              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => addToCart(item)}
              >
                <Text style={{ color: '#007AFF' }}>Add to basket</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* BASKET */}
        <Text style={styles.sectionTitle}>Basket</Text>

        <View style={styles.basket}>
          {Object.keys(cart).length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#999' }}>
              Empty
            </Text>
          ) : (
            Object.values(cart).map((item) => (
              <View key={item.id} style={styles.row}>
                <Text>
                  {item.name} x {item.quantity}
                </Text>
                <Text>₦{item.price * item.quantity}</Text>
              </View>
            ))
          )}

          <View style={styles.totalRow}>
            <Text>Total</Text>
            <Text style={{ fontWeight: 'bold' }}>
              ₦{calculateTotal()}
            </Text>
          </View>
        </View>

        {/* CHECKOUT BUTTON */}
        <TouchableOpacity
          style={styles.checkout}
          onPress={handlePlaceOrder}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>
            Place Order
          </Text>
        </TouchableOpacity>

        {/* 🧾 RECEIPT PLACEHOLDER (THIS IS THE PART YOU WANTED) */}
        {lastReceipt && (
          <View style={styles.receipt}>
            <Text style={styles.receiptTitle}>🧾 Last Receipt</Text>

            <Text>Date: {lastReceipt.date}</Text>
            <Text>Status: {lastReceipt.status}</Text>

            <Text style={{ marginTop: 10, fontWeight: 'bold' }}>
              Items:
            </Text>

            {lastReceipt.items.map((item) => (
              <Text key={item.id}>
                {item.name} x {item.quantity}
              </Text>
            ))}

            <Text style={{ marginTop: 10, fontWeight: 'bold' }}>
              Total: ₦{lastReceipt.total}
            </Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },

  header: {
    backgroundColor: '#007AFF',
    padding: 20,
  },

  headerTitle: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },

  headerSubtitle: {
    color: '#fff',
    marginTop: 5,
  },

  scrollContainer: {
    padding: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },

  icon: { fontSize: 30 },

  name: { fontWeight: '600', textAlign: 'center' },

  price: { fontSize: 12, color: '#666', marginBottom: 10 },

  addBtn: {
    borderWidth: 1,
    borderColor: '#007AFF',
    padding: 5,
    borderRadius: 5,
  },

  basket: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  checkout: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },

  receipt: {
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
  },

  receiptTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});