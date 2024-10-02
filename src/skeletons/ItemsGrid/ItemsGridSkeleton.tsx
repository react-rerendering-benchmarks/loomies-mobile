import { memo } from "react";
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ItemCardSkeleton } from './ItemCardSkeleton';
export const ItemGridSkeleton = memo(() => {
  const skeletonCards = Array(6).fill(0);
  return <FlatList contentContainerStyle={Styles.container} data={skeletonCards} keyExtractor={(item, index) => index.toString()} numColumns={2} renderItem={() => <ItemCardSkeleton />} />;
});
const Styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  }
});