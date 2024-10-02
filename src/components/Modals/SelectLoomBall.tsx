import { useRef } from "react";
import { useCallback } from "react";
import { memo } from "react";
import { getItemsService } from '@src/services/items.services';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import Modal from 'react-native-modal';
import { TLoomball } from '@src/types/types';
import { SelectLoomballGrid } from '../ItemsGrid/SelectLoomballGrid';
import { FloatingRedIcon } from '../FloatingRedIcon';
export interface iPropsSelectLoomBallModal {
  isVisible: boolean;
  toggleVisibilityCallback: () => void;
  submitCallback: (loomBall: TLoomball) => void;
}
export const SelectLoomBallModal = memo(({
  isVisible,
  toggleVisibilityCallback,
  submitCallback
}: iPropsSelectLoomBallModal) => {
  const [loomballs, setLoomballs] = useState<TLoomball[]>([]);
  const selectedLoomball = useRef<TLoomball>();

  //Get loomBall from user
  const getUserLoomBalls = async () => {
    const response = await getItemsService();
    if (!response) return;
    const responseLoomballs: TLoomball[] = response.loomballs;
    updateSelectedLoomball(responseLoomballs, selectedLoomball.current?._id);
  };
  const updateSelectedLoomball = (loomballs: TLoomball[], id?: string) => {
    //Assign property is_selected
    const loomballsWithSelectProperty = loomballs.map(loomball => {
      const isSelected = id === loomball._id ? true : false;
      return {
        ...loomball,
        is_selected: isSelected
      };
    });
    setLoomballs(loomballsWithSelectProperty);
  };
  useEffect(() => {
    getUserLoomBalls();
  }, []);

  // Update the selected loomball when the state changes
  useEffect(() => {
    updateSelectedLoomball(loomballs, selectedLoomball.current?._id);
  }, [selectedLoomball.current]);

  //update SelectLommBall
  const handleItemPress = useCallback((SelectLommBall: TLoomball) => {
    selectedLoomball.current = SelectLommBall;
  }, [setSelectedLoomball]);

  //Change the loomball and close the modal
  const changeLoomBall = useCallback(() => {
    if (selectedLoomball.current !== null && selectedLoomball.current !== undefined) {
      submitCallback(selectedLoomball.current);
      toggleVisibilityCallback();
    }
  }, [selectedLoomball]);
  return <Modal isVisible={isVisible} onBackButtonPress={toggleVisibilityCallback} onBackdropPress={toggleVisibilityCallback} style={Styles.modal}>
      <Text style={Styles.modalTitle}>Loomballs</Text>

      <SelectLoomballGrid loomBalls={loomballs} markIfSelected={true} elementsCallback={handleItemPress} />

      <FloatingRedIcon onPress={changeLoomBall} collection='MaterialCommunityIcons' name='checkbox-marked-circle-outline' bottom={80} right={16} />
      <FloatingRedIcon onPress={toggleVisibilityCallback} collection='MaterialIcons' name='cancel' bottom={16} right={16} />
    </Modal>;
});
const Styles = StyleSheet.create({
  modal: {
    backgroundColor: '#fff',
    width: '90%',
    padding: 12
  },
  modalTitle: {
    color: '#ED4A5F',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase'
  }
});