import { LinearGradient } from "expo-linear-gradient";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  Animated,
  ActivityIndicator,
  Dimensions,
  FlatList,
  ImageBackground,
  Linking,
  Modal,
  PanResponder,
  Pressable,
  Platform,
  RefreshControl,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { fetchNewsFeed } from "./src/api/newsApi";
import { Category, Language, NewsCard } from "./src/types";

const { height, width } = Dimensions.get("window");
const DRAWER_WIDTH = Math.min(width * 0.82, 320);
const categories: Category[] = [
  "All",
  "World",
  "Politics",
  "Business",
  "Technology",
  "Sports",
];

function buildArticleHtml(article: NewsCard) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body {
            margin: 0;
            padding: 24px;
            background: #000000;
            color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }
          .eyebrow {
            color: #ffffff;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 1.4px;
            text-transform: uppercase;
            margin-bottom: 12px;
          }
          h1 {
            margin: 0 0 16px;
            font-size: 34px;
            line-height: 1.15;
          }
          .meta {
            color: #a0a0a0;
            font-size: 14px;
            margin-bottom: 24px;
          }
          img {
            width: 100%;
            border-radius: 22px;
            margin-bottom: 24px;
          }
          p {
            color: #d0d0d0;
            font-size: 19px;
            line-height: 1.8;
            margin: 0 0 18px;
          }
          a {
            color: #ffffff;
          }
        </style>
      </head>
      <body>
        <div class="eyebrow">${article.category}</div>
        <h1>${article.title}</h1>
        <div class="meta">Source: ${article.sourceName}</div>
        <img src="${article.imageUrl}" alt="${article.title}" />
        ${article.articleBody
          .split("\n\n")
          .map((paragraph) => `<p>${paragraph}</p>`)
          .join("")}
        <p><a href="${article.sourceUrl}">Publisher link</a></p>
      </body>
    </html>
  `;
}

function NewsScreen({
  item,
  viewportHeight,
  onOpenSource,
  onOpenMenu,
  onReload,
}: {
  item: NewsCard;
  viewportHeight: number;
  onOpenSource: (article: NewsCard) => void;
  onOpenMenu: () => void;
  onReload: () => void;
}) {
  const gestureProgress = useRef(new Animated.Value(0)).current;
  const handleOpenSource = () => {
    onOpenSource(item);
  };

  const animateGestureBack = () => {
    Animated.timing(gestureProgress, {
      toValue: 0,
      duration: 140,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 18 && Math.abs(gestureState.dy) < 24,
      onPanResponderMove: (_, gestureState) => {
        const progress = Math.min(Math.max(gestureState.dx, 0) / 100, 1);
        gestureProgress.setValue(progress);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 90) {
          animateGestureBack();
          onOpenMenu();
          return;
        }

        animateGestureBack();
      },
      onPanResponderTerminate: animateGestureBack,
    }),
  ).current;

  return (
    <Animated.View
      style={[
        styles.screen,
        { height: viewportHeight },
        {
          opacity: gestureProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.97],
          }),
          transform: [
            {
              scale: gestureProgress.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.992],
              }),
            },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.cardShell}>
        <ImageBackground source={{ uri: item.imageUrl }} style={styles.heroImage}>
          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.08)", "rgba(0,0,0,0.72)"]}
            locations={[0, 0.55, 1]}
            style={styles.imageOverlay}
          />
        </ImageBackground>

        <View style={styles.contentBlock}>
          <View style={styles.copyBlock}>
            <Text style={styles.kicker}>{item.category}</Text>
            <Text style={styles.headline}>{item.title}</Text>
            <Text style={styles.summary}>{item.summary}</Text>
          </View>

          <View style={styles.footerRow}>
            <Pressable style={styles.sourceBlock} onPress={handleOpenSource}>
              <Feather name="external-link" size={16} color="#FFFFFF" />
              <View>
                <Text style={styles.sourceLine}>
                  <Text style={styles.sourceMeta}>By: </Text>
                  <Text style={styles.sourceName}>{item.sourceName}</Text>
                </Text>
              </View>
            </Pressable>

            <View style={styles.actionRow}>
              <Pressable style={styles.shareButton} onPress={onReload}>
                <Feather name="rotate-cw" size={18} color="#FFFFFF" />
              </Pressable>

              <Pressable
                style={styles.shareButton}
                onPress={() =>
                  Share.share({
                    message: `${item.title}\n\n${item.summary}\n\nSource: ${item.sourceUrl}`,
                  })
                }
              >
                <Feather name="share-2" size={20} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

function AppContent() {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<NewsCard>>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [sourceArticle, setSourceArticle] = useState<NewsCard | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [news, setNews] = useState<NewsCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(height);
  const drawerX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const drawerGesture = useRef(new Animated.Value(0)).current;

  const toggleDrawer = (open: boolean) => {
    setIsDrawerOpen(open);
    drawerGesture.setValue(0);
    Animated.spring(drawerX, {
      toValue: open ? 0 : -DRAWER_WIDTH,
      useNativeDriver: true,
      damping: 22,
      stiffness: 210,
    }).start();
  };

  const drawerPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 16 && Math.abs(gestureState.dy) < 20,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          drawerGesture.setValue(Math.min(Math.abs(gestureState.dx) / 100, 1));
        } else {
          drawerGesture.setValue(0);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        drawerGesture.setValue(0);
        if (gestureState.dx < -60) {
          toggleDrawer(false);
        }
      },
      onPanResponderTerminate: () => {
        drawerGesture.setValue(0);
      },
    }),
  ).current;

  const refreshFeed = React.useCallback(
    async ({ silent = false }: { silent?: boolean } = {}) => {
      if (silent) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const result = await fetchNewsFeed(language, selectedCategory);
        setNews(result.articles);
        listRef.current?.scrollToOffset({ offset: 0, animated: false });
      } finally {
        if (silent) {
          setIsRefreshing(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [language, selectedCategory],
  );

  React.useEffect(() => {
    void refreshFeed();
  }, [refreshFeed]);

  React.useEffect(() => {
    if (Platform.OS !== "android") {
      return;
    }

    void NavigationBar.setPositionAsync("absolute");
    void NavigationBar.setBehaviorAsync("overlay-swipe");
    void NavigationBar.setBackgroundColorAsync("#000000");
    void NavigationBar.setButtonStyleAsync("light");
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style="light" />

      <View
        style={styles.app}
        onLayout={(event) => {
          const nextHeight = event.nativeEvent.layout.height;
          if (Math.abs(nextHeight - viewportHeight) > 1) {
            setViewportHeight(nextHeight);
          }
        }}
      >
        {isLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingStateTitle}>Loading stories</Text>
            <Text style={styles.loadingStateText}>
              Pulling the latest {language === "en" ? "English" : "Bangla"} feed.
            </Text>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={news}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NewsScreen
                item={item}
                viewportHeight={viewportHeight}
                onOpenSource={(article) => setSourceArticle(article)}
                onOpenMenu={() => toggleDrawer(true)}
                onReload={() => {
                  void refreshFeed({ silent: true });
                }}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => {
                  void refreshFeed({ silent: true });
                }}
                tintColor="#FFFFFF"
                colors={["#FFFFFF"]}
                progressBackgroundColor="#000000"
              />
            }
            pagingEnabled
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            snapToAlignment="start"
            getItemLayout={(_, index) => ({
              length: viewportHeight,
              offset: viewportHeight * index,
              index,
            })}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>No stories in this category</Text>
                <Text style={styles.emptyStateText}>
                  Switch categories from the right-side menu or change language.
                </Text>
              </View>
            }
          />
        )}

        <Animated.View
          pointerEvents={isDrawerOpen ? "auto" : "none"}
          style={[
            styles.drawerOverlay,
            {
              opacity: drawerX.interpolate({
                inputRange: [-DRAWER_WIDTH, 0],
                outputRange: [0, 1],
              }),
            },
          ]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={() => toggleDrawer(false)} />
          <Animated.View
            style={[
              styles.drawer,
              {
                opacity: drawerGesture.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.95],
                }),
                transform: [
                  { translateX: drawerX },
                  {
                    scale: drawerGesture.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0.985],
                    }),
                  },
                ],
              },
            ]}
            {...drawerPanResponder.panHandlers}
          >
            <View style={styles.drawerHeader}>
              <View style={styles.drawerLogoWrap}>
                <Text style={styles.drawerLogo}>সং</Text>
              </View>
            </View>

            <Text style={styles.drawerSectionTitle}>Language</Text>
            <View style={styles.languageRow}>
              {(["en", "bn"] as Language[]).map((option) => {
                const isActive = option === language;
                return (
                  <Pressable
                    key={option}
                    style={styles.languageItem}
                    onPress={() => {
                      setLanguage(option);
                      toggleDrawer(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.languageItemText,
                        isActive && styles.languageItemTextActive,
                      ]}
                    >
                      {option === "en" ? "English" : "বাংলা"}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.drawerSection}>
              <Text style={styles.drawerSectionTitle}>Categories</Text>
              {categories.map((category) => {
                const isActive = category === selectedCategory;
                return (
                  <Pressable
                    key={category}
                    style={styles.drawerItem}
                    onPress={() => {
                      setSelectedCategory(category);
                      toggleDrawer(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.drawerItemText,
                        isActive && styles.drawerItemTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                    {isActive ? <View style={styles.drawerActiveDot} /> : null}
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.drawerSection}>
              <Text style={styles.drawerSectionTitle}>More</Text>

              <Pressable
                style={styles.drawerLink}
                onPress={() => Linking.openURL("https://example.com/policy")}
              >
                <Ionicons name="document-text-outline" size={16} color="#E8E8E8" />
                <Text style={styles.drawerLinkText}>Policy</Text>
              </Pressable>

              <Pressable
                style={styles.drawerLink}
                onPress={() => Linking.openURL("mailto:hello@shongkhep.app")}
              >
                <Feather name="mail" size={16} color="#E8E8E8" />
                <Text style={styles.drawerLinkText}>Contact Us</Text>
              </Pressable>
            </View>
          </Animated.View>
        </Animated.View>

        <Modal visible={Boolean(sourceArticle)} animationType="slide">
          <SafeAreaView style={styles.webviewContainer} edges={["top"]}>
            <View style={styles.webviewHeader}>
              <Pressable
                style={styles.webviewBackButton}
                onPress={() => setSourceArticle(null)}
              >
                <Feather name="arrow-left" size={18} color="#000000" />
              </Pressable>

              <View style={styles.webviewTitleWrap}>
                <Text numberOfLines={1} style={styles.webviewTitle}>
                  {sourceArticle?.sourceName}
                </Text>
                <Text numberOfLines={1} style={styles.webviewUrl}>
                  {sourceArticle?.sourceUrl}
                </Text>
              </View>
            </View>

            {sourceArticle ? (
              <WebView source={{ html: buildArticleHtml(sourceArticle) }} />
            ) : null}
          </SafeAreaView>
        </Modal>

        <View
          pointerEvents="none"
          style={[
            styles.bottomInsetCover,
            { height: Math.max(insets.bottom, 16) + 20 },
          ]}
        />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider style={styles.safeAreaProvider}>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaProvider: {
    flex: 1,
    backgroundColor: "#000000",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  app: {
    flex: 1,
    backgroundColor: "#000000",
  },
  bottomInsetCover: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000",
  },
  screen: {
    height,
    width,
    backgroundColor: "#000000",
  },
  cardShell: {
    flex: 1,
    backgroundColor: "#000000",
  },
  heroImage: {
    width,
    height: height * 0.31,
    overflow: "hidden",
    backgroundColor: "#050505",
  },
  imageOverlay: {
    flex: 1,
  },
  contentBlock: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 38,
    justifyContent: "space-between",
  },
  copyBlock: {
    maxWidth: width - 72,
  },
  kicker: {
    color: "#7E7E7E",
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  headline: {
    color: "#FFFFFF",
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  summary: {
    color: "#BEBEBE",
    fontSize: 17,
    lineHeight: 27,
    marginTop: 16,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 28,
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sourceBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    maxWidth: "76%",
  },
  sourceMeta: {
    color: "#737373",
    fontSize: 14,
  },
  sourceLine: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  sourceName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0D0D0D",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#202020",
  },
  drawerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-start",
  },
  drawer: {
    width: DRAWER_WIDTH,
    height: "100%",
    backgroundColor: "#030303",
    borderRightWidth: 1,
    borderColor: "#121212",
    paddingTop: 32,
    paddingHorizontal: 22,
  },
  drawerHeader: {
    paddingBottom: 22,
    marginBottom: 10,
  },
  drawerLogoWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: "#050505",
    borderWidth: 1,
    borderColor: "#151515",
    alignItems: "center",
    justifyContent: "center",
  },
  drawerLogo: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
  drawerSection: {
    marginTop: 8,
  },
  drawerSectionTitle: {
    color: "#8A8A8A",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.3,
    textTransform: "uppercase",
    marginBottom: 12,
    marginTop: 12,
  },
  languageRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 10,
  },
  languageItem: {
    paddingVertical: 2,
  },
  languageItemText: {
    color: "#D9D9D9",
    fontSize: 16,
    fontWeight: "500",
  },
  languageItemTextActive: {
    fontStyle: "italic",
    opacity: 0.5,
    color: "#FFFFFF",
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#262626",
  },
  drawerItemText: {
    color: "#E4E4E4",
    fontSize: 16,
    fontWeight: "500",
  },
  drawerItemTextActive: {
    fontStyle: "italic",
    opacity: 0.5,
    color: "#FFFFFF",
  },
  drawerActiveDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#6F6F6F",
  },
  drawerLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#262626",
  },
  drawerLinkText: {
    color: "#E8E8E8",
    fontSize: 15,
    fontWeight: "500",
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  emptyState: {
    height,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },
  emptyStateText: {
    color: "#A5A5A5",
    fontSize: 16,
    lineHeight: 25,
    marginTop: 10,
    textAlign: "center",
  },
  loadingState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  loadingStateTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 18,
  },
  loadingStateText: {
    color: "#A5A5A5",
    fontSize: 16,
    lineHeight: 25,
    marginTop: 8,
    textAlign: "center",
  },
  webviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#040404",
    borderBottomWidth: 1,
    borderColor: "#1B1B1B",
  },
  webviewBackButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  webviewTitleWrap: {
    flex: 1,
  },
  webviewTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  webviewUrl: {
    color: "#A7A7A7",
    fontSize: 12,
    marginTop: 3,
  },
});
