import { NavigationProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useToastAlert } from '../hooks/useToastAlert';
import { Map3D } from '@src/components/Map3D/Map3D';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { ModalRewards } from '@src/components/ModalRewards';

interface MapViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: NavigationProp<any, any>;
}

export const MapView = ({ navigation }: MapViewProps) => {
  const [showGymModal, setShowGymModal] = useState(false);

  const toggleModal = () => {
    setShowGymModal(!showGymModal);
  };

  const { isLoading, isAuthenticated } = useAuth();
  const { showInfoToast } = useToastAlert();

  // Redirects to the login view if the user is not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated()) {
      showInfoToast('You are not logged in');
      navigation.navigate('Login');
    }
  }, [isLoading]);

  return (
    <View style={Styles.container}>
      <Map3D gymCallback={toggleModal} />
      <ModalRewards isVisible={showGymModal} callBack={toggleModal} />
      <Pressable
        style={{
          borderWidth: 1,
          borderColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          width: 70,
          position: 'absolute',
          bottom: 20,
          right: 20,
          height: 70,
          backgroundColor: '#00000044',
          borderRadius: 200
        }}
        onPress={() => {
          navigation.navigate('Application', { screen: 'Loomies' });
        }}
      >
        <FeatherIcon name={'briefcase'} size={28} color={'white'} />
      </Pressable>
      <Pressable
        style={{
          borderWidth: 1,
          borderColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          width: 70,
          position: 'absolute',
          bottom: 120,
          right: 20,
          height: 70,
          backgroundColor: '#00000044',
          borderRadius: 200
        }}
        onPress={toggleModal}
      >
        <FeatherIcon name={'briefcase'} size={28} color={'white'} />
      </Pressable>
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
