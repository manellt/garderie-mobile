import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  StatusBar as RNStatusBar,
  FlatList,
  Animated,
  Pressable,
} from 'react-native';
import DrawerMenu from './DrawerMenu';
import { Activity, DrawerSection } from '../types';

// ─── Données statiques ───────────────────────────────────────────────────────

const ACTIVITIES: Activity[] = [
  { id: 1, titre: 'Dessin et coloriage', description: 'Développement de la créativité', icone: '🎨' },
  { id: 2, titre: 'Jeux éducatifs', description: 'Apprentissage par le jeu', icone: '🧩' },
  { id: 3, titre: 'Musique et chansons', description: 'Éveil musical des enfants', icone: '🎵' },
  { id: 4, titre: 'Lecture de contes', description: 'Découverte des histoires', icone: '📚' },
  { id: 5, titre: 'Activités sportives', description: 'Développement de la motricité', icone: '⚽' },
];

// ─── Carte d'activité avec animation ────────────────────────────────────────

interface ActivityCardProps {
  item: Activity;
  onPress: (titre: string) => void;
}

function ActivityCard({ item, onPress }: ActivityCardProps) {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  return (
    <Pressable
      onPress={() => onPress(item.titre)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <Text style={styles.cardIcon}>{item.icone}</Text>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{item.titre}</Text>
          <Text style={styles.cardDesc}>{item.description}</Text>
        </View>
        <Text style={styles.cardChevron}>›</Text>
      </Animated.View>
    </Pressable>
  );
}

// ─── Section À propos ────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <View style={styles.sectionContent}>
      <Text style={styles.sectionIcon}>🏫</Text>
      <Text style={styles.sectionTitle}>À propos</Text>
      <Text style={styles.sectionText}>
        Ma Garderie est une application mobile conçue pour faciliter la gestion
        des activités d'une garderie d'enfants.
      </Text>
      <Text style={styles.sectionText}>
        Elle permet de visualiser les activités proposées aux enfants et
        d'interagir facilement avec elles.
      </Text>
      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>Version</Text>
        <Text style={styles.infoValue}>1.0.0</Text>
        <Text style={styles.infoLabel}>Technologie</Text>
        <Text style={styles.infoValue}>React Native · Expo · TypeScript</Text>
      </View>
    </View>
  );
}

// ─── Composant principal ─────────────────────────────────────────────────────

export default function HomeScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<DrawerSection>('accueil');

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const handleSelectSection = useCallback((section: DrawerSection) => {
    setActiveSection(section);
  }, []);

  const handleActivityPress = useCallback((titre: string) => {
    Alert.alert(
      '🎯 Activité sélectionnée',
      titre,
      [{ text: 'Super !', style: 'default' }]
    );
  }, []);

  const handleFABPress = useCallback(() => {
    Alert.alert(
      '➕ Nouvelle activité',
      'Cette fonctionnalité sera disponible prochainement.',
      [{ text: 'OK', style: 'cancel' }]
    );
  }, []);

  const renderActivity = useCallback(
    ({ item }: { item: Activity }) => (
      <ActivityCard item={item} onPress={handleActivityPress} />
    ),
    [handleActivityPress]
  );

  const keyExtractor = useCallback((item: Activity) => String(item.id), []);

  // ── Contenu selon la section active ──
  const renderMainContent = () => {
    if (activeSection === 'apropos') {
      return <AboutSection />;
    }

    return (
      <FlatList
        data={ACTIVITIES}
        renderItem={renderActivity}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          activeSection === 'accueil' ? (
            <View style={styles.welcomeBanner}>
              <Text style={styles.welcomeEmoji}>👶🏻</Text>
              <Text style={styles.welcomeTitle}>Bonjour !</Text>
              <Text style={styles.welcomeSubtitle}>
                Découvrez nos activités pour les enfants
              </Text>
            </View>
          ) : (
            <Text style={styles.sectionHeader}>Toutes les activités</Text>
          )
        }
      />
    );
  };

  const STATUS_BAR_HEIGHT =
    Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 24) : 0;

  return (
    <View style={styles.root}>
      {/* AppBar */}
      <View style={[styles.appBar, { paddingTop: STATUS_BAR_HEIGHT + 12 }]}>
        <TouchableOpacity
          onPress={openDrawer}
          style={styles.menuBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Ma Garderie</Text>
        <View style={styles.menuBtn} />
      </View>

      {/* Contenu */}
      <View style={styles.content}>{renderMainContent()}</View>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleFABPress}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Drawer */}
      <DrawerMenu
        visible={drawerOpen}
        activeSection={activeSection}
        onSelect={handleSelectSection}
        onClose={closeDrawer}
      />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F6F5FB' },
  appBar: {
    backgroundColor: '#066E52',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  menuBtn: { width: 40, alignItems: 'center' },
  menuIcon: { fontSize: 24, color: '#fff', lineHeight: 28 },
  appBarTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  content: { flex: 1, paddingBottom: 80 },
  listContent: { padding: 16, paddingBottom: 24 },
  welcomeBanner: {
    backgroundColor: '#DDF3EA',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeEmoji: { fontSize: 48, marginBottom: 8 },
  welcomeTitle: { fontSize: 22, fontWeight: 'bold', color: '#066E52' },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#066E52',
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.8,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#066E52',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardIcon: { fontSize: 36, marginRight: 16 },
  cardText: { flex: 1 },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  cardDesc: { fontSize: 13, color: '#666' },
  cardChevron: {
    fontSize: 22,
    color: '#066E52',
    fontWeight: 'bold',
    opacity: 0.6,
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#066E52',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  fabIcon: { color: '#fff', fontSize: 30, lineHeight: 34, fontWeight: '300' },
  sectionContent: { padding: 24, alignItems: 'center' },
  sectionIcon: { fontSize: 64, marginBottom: 16 },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#066E52',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  infoBox: {
    backgroundColor: '#DDF3EA',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    width: '100%',
  },
  infoLabel: {
    fontSize: 12,
    color: '#066E52',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  infoValue: { fontSize: 15, color: '#333', marginTop: 2 },
});
