import { LinearGradient } from "expo-linear-gradient";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
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
  Alert,
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
import { fetchFeedUpdates, fetchNewsFeed } from "./src/api/newsApi";
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

function shouldOpenMenuSwipe(dx: number, dy: number, vx: number) {
  const horizontalDistance = Math.abs(dx);
  const verticalDistance = Math.abs(dy);

  if (dx <= 0) {
    return false;
  }

  return (
    (horizontalDistance > 14 && horizontalDistance > verticalDistance * 1.35) ||
    (horizontalDistance > 10 && vx > 0.3 && horizontalDistance > verticalDistance * 1.1)
  );
}

function createMenuSwipePanResponder({
  gestureProgress,
  onOpenMenu,
}: {
  gestureProgress: Animated.Value;
  onOpenMenu: () => void;
}) {
  const animateGestureBack = () => {
    Animated.timing(gestureProgress, {
      toValue: 0,
      duration: 140,
      useNativeDriver: true,
    }).start();
  };

  return PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onStartShouldSetPanResponderCapture: () => false,
    onMoveShouldSetPanResponder: (_, gestureState) =>
      shouldOpenMenuSwipe(gestureState.dx, gestureState.dy, gestureState.vx),
    onMoveShouldSetPanResponderCapture: (_, gestureState) =>
      shouldOpenMenuSwipe(gestureState.dx, gestureState.dy, gestureState.vx),
    onPanResponderMove: (_, gestureState) => {
      const progress = Math.min(Math.max(gestureState.dx, 0) / 100, 1);
      gestureProgress.setValue(progress);
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 84 || (gestureState.dx > 42 && gestureState.vx > 0.42)) {
        animateGestureBack();
        onOpenMenu();
        return;
      }

      animateGestureBack();
    },
    onPanResponderTerminate: animateGestureBack,
  });
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

  const edgePanResponder = useRef(
    createMenuSwipePanResponder({
      gestureProgress,
      onOpenMenu,
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
      {...edgePanResponder.panHandlers}
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
              <Pressable style={styles.iconAction} onPress={onReload}>
                <Ionicons name="refresh" size={22} color="#FFFFFF" />
              </Pressable>

              <Pressable
                style={styles.iconAction}
                onPress={() =>
                  Share.share({
                    message: `${item.title}\n\n${item.summary}\n\nSource: ${item.sourceUrl}`,
                  })
                }
              >
                <Ionicons name="share-social-outline" size={22} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

function EmptyNewsScreen({
  viewportHeight,
  onOpenMenu,
  onReload,
}: {
  viewportHeight: number;
  onOpenMenu: () => void;
  onReload: () => void;
}) {
  const gestureProgress = useRef(new Animated.Value(0)).current;
  const edgePanResponder = useRef(
    createMenuSwipePanResponder({
      gestureProgress,
      onOpenMenu,
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
      {...edgePanResponder.panHandlers}
    >
      <View style={styles.cardShell}>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyCardTitle}>No such news.</Text>
          <Pressable style={styles.emptyCardButton} onPress={onReload}>
            <Ionicons name="refresh" size={22} color="#FFFFFF" />
          </Pressable>
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
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasNewStories, setHasNewStories] = useState(false);
  const [pendingStoryCount, setPendingStoryCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [viewportHeight, setViewportHeight] = useState(height);
  const [currentIndex, setCurrentIndex] = useState(0);
  const drawerX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const drawerGesture = useRef(new Animated.Value(0)).current;
  const chipVisibility = useRef(new Animated.Value(0)).current;

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
        const result = await fetchNewsFeed(language, selectedCategory, {
          limit: 10,
        });
        setNews(result.articles);
        setPendingStoryCount(0);
        setHasNewStories(false);
        setHasMore(result.hasMore);
        setNextCursor(result.nextCursor);
        setCurrentIndex(0);
        listRef.current?.scrollToOffset({ offset: 0, animated: false });
      } catch (error) {
        console.warn("Failed to refresh news feed", error);
        setNews([]);
        setHasMore(false);
        setNextCursor(null);
        Alert.alert(
          "Feed unavailable",
          `Could not load the ${language === "en" ? "English" : "Bangla"} feed right now.`,
        );
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

  const loadMoreFeed = React.useCallback(async () => {
    if (isLoading || isRefreshing || isLoadingMore || !hasMore || nextCursor == null) {
      return;
    }

    setIsLoadingMore(true);
    try {
      const result = await fetchNewsFeed(language, selectedCategory, {
        limit: 10,
        before: nextCursor,
      });
      setNews((current) => {
        const seen = new Set(current.map((item) => item.id));
        const appended = result.articles.filter((item) => !seen.has(item.id));
        return [...current, ...appended];
      });
      setHasMore(result.hasMore);
      setNextCursor(result.nextCursor);
    } catch (error) {
      console.warn("Failed to load more news", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoading, isLoadingMore, isRefreshing, language, nextCursor, selectedCategory]);

  const applyPendingStories = React.useCallback(
    async ({ scrollToTop = true }: { scrollToTop?: boolean } = {}) => {
      const latest = news[0];
      if (!latest?.cursor) {
        return;
      }

      try {
        const result = await fetchNewsFeed(language, selectedCategory, {
          limit: 20,
          after: latest.cursor,
        });
        setNews((current) => {
          const seen = new Set(current.map((item) => item.id));
          const prepended = result.articles.filter((item) => !seen.has(item.id));
          return [...prepended, ...current];
        });
      } catch (error) {
        console.warn("Failed to fetch pending stories", error);
      }

      setPendingStoryCount(0);
      setHasNewStories(false);

      if (scrollToTop) {
        setCurrentIndex(0);
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
      }
    },
    [language, news, selectedCategory],
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      const latest = news[0];
      if (!latest || isLoading || isRefreshing || isLoadingMore) {
        return;
      }
      void (async () => {
        try {
          const after = latest.cursor;
          if (!after) {
            return;
          }
          const result = await fetchFeedUpdates(language, selectedCategory, after);
          if (!result.hasNew) {
            return;
          }
          if (currentIndex === 0) {
            await applyPendingStories({ scrollToTop: false });
            return;
          }
          setPendingStoryCount(result.newCount);
          setHasNewStories(true);
        } catch (error) {
          console.warn("Failed to poll newer stories", error);
        }
      })();
    }, 30000);

    return () => clearInterval(interval);
  }, [applyPendingStories, currentIndex, isLoading, isLoadingMore, isRefreshing, language, news, selectedCategory]);

  React.useEffect(() => {
    if (currentIndex === 0 && hasNewStories) {
      void applyPendingStories({ scrollToTop: false });
    }
  }, [applyPendingStories, currentIndex, hasNewStories]);

  React.useEffect(() => {
    Animated.timing(chipVisibility, {
      toValue: hasNewStories && currentIndex > 0 ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [chipVisibility, currentIndex, hasNewStories]);

  React.useEffect(() => {
    void refreshFeed();
  }, [refreshFeed]);

  React.useEffect(() => {
    void SystemUI.setBackgroundColorAsync("#000000");
  }, []);

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
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <StatusBar style="light" translucent={false} backgroundColor="#000000" />

      <View
        style={[styles.app, { paddingTop: insets.top }]}
        onLayout={(event) => {
          const nextHeight = event.nativeEvent.layout.height;
          if (Math.abs(nextHeight - viewportHeight) > 1) {
            setViewportHeight(nextHeight);
          }
        }}
      >
        {hasNewStories ? (
          <Animated.View
            pointerEvents={currentIndex > 0 ? "auto" : "none"}
            style={[
              styles.newStoriesChipWrap,
              {
                opacity: chipVisibility,
                transform: [
                  {
                    translateY: chipVisibility.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-10, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Pressable style={styles.newStoriesChip} onPress={() => void applyPendingStories()}>
              <Ionicons name="arrow-up" size={14} color="#050505" />
              <Text style={styles.newStoriesChipText}>
                {pendingStoryCount} new {pendingStoryCount === 1 ? "story" : "stories"}
              </Text>
            </Pressable>
          </Animated.View>
        ) : null}

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
            onViewableItemsChanged={({ viewableItems }) => {
              const firstVisible = viewableItems.find((item) => item.isViewable);
              setCurrentIndex(firstVisible?.index ?? 0);
            }}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 80,
            }}
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
            onEndReachedThreshold={0.6}
            onEndReached={() => {
              void loadMoreFeed();
            }}
            ListFooterComponent={
              isLoadingMore ? (
                <View style={styles.feedFooter}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                </View>
              ) : null
            }
            ListEmptyComponent={
              <EmptyNewsScreen
                viewportHeight={viewportHeight}
                onOpenMenu={() => toggleDrawer(true)}
                onReload={() => {
                  void refreshFeed({ silent: true });
                }}
              />
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
            <View style={styles.languageSlider}>
              {(["en", "bn"] as Language[]).map((option) => {
                const isActive = option === language;
                return (
                  <Pressable
                    key={option}
                    style={[
                      styles.languageItem,
                      isActive && styles.languageItemActive,
                    ]}
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
                <Feather name="chevron-left" size={26} color="#FFFFFF" />
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
              <WebView source={{ uri: sourceArticle.sourceUrl }} />
            ) : null}
          </SafeAreaView>
        </Modal>

        <View
          pointerEvents="none"
          style={[
            styles.bottomInsetCover,
            { height: Math.max(insets.bottom, 8) },
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
  newStoriesChipWrap: {
    position: "absolute",
    top: 12,
    alignSelf: "center",
    zIndex: 4,
  },
  newStoriesChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#F2F2F2",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  newStoriesChipText: {
    color: "#050505",
    fontSize: 13,
    fontWeight: "700",
  },
  bottomInsetCover: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000",
    zIndex: 1,
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
    fontSize: 25,
    lineHeight: 31,
    fontWeight: "400",
    fontStyle: "italic",
    letterSpacing: -0.6,
  },
  summary: {
    color: "#BEBEBE",
    fontSize: 17,
    lineHeight: 27,
    marginTop: 16,
    fontWeight: "300",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 28,
    paddingHorizontal: 18,
    paddingBottom: 8,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  sourceBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    maxWidth: "68%",
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
  iconAction: {
    paddingVertical: 6,
    paddingHorizontal: 2,
    alignItems: "center",
    justifyContent: "center",
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
  languageSlider: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    marginBottom: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#1C1C1C",
    backgroundColor: "#070707",
  },
  languageItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  languageItemActive: {
    backgroundColor: "#F2F2F2",
  },
  languageItemText: {
    color: "#D9D9D9",
    fontSize: 15,
    fontWeight: "500",
  },
  languageItemTextActive: {
    color: "#050505",
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
  emptyCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    backgroundColor: "#050505",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#151515",
    marginHorizontal: 14,
    marginVertical: 14,
  },
  emptyCardTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "500",
    fontStyle: "italic",
  },
  emptyCardButton: {
    marginTop: 24,
    minWidth: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    backgroundColor: "#0A0A0A",
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
  feedFooter: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
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
    paddingVertical: 4,
    paddingRight: 4,
    alignItems: "center",
    justifyContent: "center",
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
