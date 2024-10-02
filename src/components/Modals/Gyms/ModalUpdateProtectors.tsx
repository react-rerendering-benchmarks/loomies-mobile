import { useRef } from "react";
import { useCallback } from "react";
import { memo } from "react";
import { TCaughtLoomieToRender } from '@src/types/types';
import React, { useState, useContext, useEffect } from 'react';
import { MapModalsContext } from '@src/context/MapModalsProvider';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { getLoomiesRequest } from '@src/services/loomies.services';
import { Title } from '@src/components/Title';
import { EmptyMessage } from '@src/components/EmptyMessage';
import { LoomiesGrid } from '@src/components/CaughtLoomiesGrid/LoomiesGrid';
import { FloatingRedIcon } from '@src/components/FloatingRedIcon';
import { UpdateGymProtectorsService } from '@src/services/gyms.services';
import { useToastAlert } from '@src/hooks/useToastAlert';
export const ModalUpdateProtectors = memo(() => {
  const [loading, setLoading] = useState(true);
  const [loomies, setLoomies] = useState<Array<TCaughtLoomieToRender>>();
  const protectors = useRef<Array<string>>([]);
  const {
    isProtectorsModalOpen,
    toggleProtectorsModalVisibility,
    toggleGymModalVisibility,
    currentGymProtectors,
    currentModalGymId
  } = useContext(MapModalsContext);
  const {
    showSuccessToast,
    showErrorToast
  } = useToastAlert();
  const getUserLoomies = async () => {
    const [response, err] = await getLoomiesRequest();
    if (err) return;

    // Filter the loomies that are not busy
    const loomies = (response['loomies'] as Array<TCaughtLoomieToRender>);
    const availableLoomies = loomies.filter(loomie => loomie.is_busy === false || currentGymProtectors.includes(loomie._id));
    const markedLoomies = availableLoomies.map(loomie => ({
      ...loomie,
      is_selected: currentGymProtectors.includes(loomie._id)
    }));
    setLoomies(markedLoomies);
    setLoading(false);
    protectors.current = currentGymProtectors;
  };
  const handleSubmit = useCallback(async () => {
    const [response, err] = await UpdateGymProtectorsService(currentModalGymId, protectors.current);
    if (err) {
      showErrorToast(response.message || 'There was an error updating the gym protectors');
      return;
    }
    showSuccessToast('Gym protectors updated successfully');
    // Hide the current modals to update the UI
    toggleGymModalVisibility();
    toggleProtectorsModalVisibility();
  }, [currentModalGymId, protectors]);

  // Handle the loomie card click event
  const handleLoomieSelection = useCallback((loomieId: string) => {
    if (protectors.current.includes(loomieId)) {
      // Remove the loomie from the protectors array
      const newProtectors = protectors.current.filter(id => id !== loomieId);
      protectors.current = newProtectors;
    } else if (protectors.current.length === 6) {
      // Remove the first loomie from the protectors array and add the new one
      const newProtectors = protectors.current.slice(1);
      newProtectors.push(loomieId);
      protectors.current = newProtectors;
    } else {
      // Add the loomie to the protectors array
      const newProtectors = [...protectors.current, loomieId];
      protectors.current = newProtectors;
    }
  }, [protectors, setProtectors]);

  // Fetch the user loomies when the modal is opened
  useEffect(() => {
    if (!isProtectorsModalOpen) return;
    getUserLoomies();
  }, [isProtectorsModalOpen]);

  // Update the loomies selectied state when the protectors array changes
  useEffect(() => {
    const newLoomies = loomies?.map(loomie => ({
      ...loomie,
      is_selected: protectors.current.includes(loomie._id)
    }));
    setLoomies(newLoomies);
  }, [protectors.current]);
  const renderLoomies = memo(() => {
    if (loomies?.length === 0 || !loomies) {
      return <EmptyMessage text="You don't have any available loomies to protect this gym." buttonText='Catch loomies' buttonCallback={useCallback(() => {
        toggleGymModalVisibility();
        toggleProtectorsModalVisibility();
      }, [])} showButton={true} />;
    } else {
      return <LoomiesGrid loomies={loomies} markBusyLoomies={false} markSelectedLoomies={true} elementsCallback={handleLoomieSelection} />;
    }
  });
  const renderActionButtons = memo(() => {
    if (loomies?.length && loomies.length > 0) {
      return <>
          <FloatingRedIcon onPress={handleSubmit} collection='MaterialCommunityIcons' name='checkbox-marked-circle-outline' bottom={74} right={8} />
          <FloatingRedIcon onPress={toggleProtectorsModalVisibility} collection='MaterialIcons' name='cancel' bottom={8} right={8} />
        </>;
    } else {
      return <></>;
    }
  });
  return <Modal isVisible={isProtectorsModalOpen} onBackdropPress={toggleProtectorsModalVisibility}>
      <View style={Styles.container}>
        <View style={Styles.modalBackground}>
          {loading ? <Text style={Styles.modalText}>Loading...</Text> : <>
              <Title text='Update gym protectors' />
              {renderLoomies()}
              {renderActionButtons()}
            </>}
        </View>
      </View>
    </Modal>;
});
const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBackground: {
    width: '96%',
    maxHeight: '95%',
    backgroundColor: 'white',
    padding: 16
  },
  modalText: {
    fontSize: 16,
    color: '#5c5c5c',
    textAlign: 'center'
  }
});