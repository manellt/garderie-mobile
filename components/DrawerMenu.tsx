import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';

import { DrawerSection } from '../types';

export type { DrawerSection };

interface Props {
  visible: boolean;
  activeSection: DrawerSection;
  onSelect: (section: DrawerSection) => void;
  onClose: () => void;
}

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(width * 0.75, 300);

const menuItems: { key: DrawerSection; label: string; icon: string }[] = [
  { key: 'accueil', label: 'Accueil', icon: '🏠' },
  { key: 'activites', label: 'Activités', icon: '🎯' },
  { key: 'apropos', label: 'À propos', icon: 'ℹ️' },
];

export default function DrawerMenu({ visible, activeSection, onSelect, onClose }: Props) {
  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={styles.drawer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ma Garderie</Text>
          <Text style={styles.headerSubtitle}>Menu principal</Text>
        </View>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.menuItem,
              activeSection === item.key && styles.menuItemActive,
            ]}
            onPress={() => {
              onSelect(item.key);
              onClose();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text
              style={[
                styles.menuLabel,
                activeSection === item.key && styles.menuLabelActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#fff',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  header: {
    backgroundColor: '#066E52',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#DDF3EA',
    fontSize: 13,
    marginTop: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemActive: {
    backgroundColor: '#DDF3EA',
  },
  menuIcon: {
    fontSize: 22,
    marginRight: 16,
  },
  menuLabel: {
    fontSize: 16,
    color: '#333',
  },
  menuLabelActive: {
    color: '#066E52',
    fontWeight: 'bold',
  },
});
