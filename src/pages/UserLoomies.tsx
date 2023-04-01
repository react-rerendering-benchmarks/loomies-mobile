import React, { useEffect, useState } from 'react';
import { getLoomiesRequest } from '@src/services/user.services';
import { TCaughtLoomies } from '@src/types/types';
import { LoomiesGrid } from '@src/components/CaughtLoomiesGrid/LoomiesGrid';
import { Container } from '@src/components/Container';
import { LoomiesGridSkeleton } from '@src/skeletons/CaughtLoomiesGrid/LoomiesGridSkeleton';
import { NavigationProp } from '@react-navigation/native';
import { EmptyMessage } from '@src/components/EmptyMessage';
import { CustomButton } from '@src/components/CustomButton';
import { View } from 'react-native';

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: NavigationProp<any, any>;
}

export const UserLoomies = ({ navigation }: IProps) => {
  const [loomies, setLoomies] = useState(Array<TCaughtLoomies>);
  const [loading, setLoading] = useState(true);

  // Request to obtain the loomies
  const fetchLoomies = async () => {
    const [response, err] = await getLoomiesRequest();

    if (!err) {
      const { loomies } = response;
      setLoomies(loomies || []);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoomies();
  }, []);

  // Function to redirect to the map view in case the user doesn't have any loomies
  const goToMap = () => {
    navigation.navigate('Map');
  };

  const goToLoomieTeam = () => {
    navigation.navigate('UpdateLoomieTeam');
  };

  // Function to render the loomies or show a message if there are no loomies
  const renderLoomies = () => {
    if (!loading && loomies.length === 0)
      return (
        <EmptyMessage
          text="You don't have any Loomies yet..."
          showButton={true}
          buttonText={'Catch Loomies'}
          buttonCallback={goToMap}
        />
      );

    return (
      <>
        <View style={{ paddingHorizontal: 10 }}>
          <CustomButton
            title='Update Loomie Team'
            type='bordered'
            callback={goToLoomieTeam}
          />
        </View>
        <LoomiesGrid loomies={loomies} />
      </>
    );
  };

  return (
    <Container>{loading ? <LoomiesGridSkeleton /> : renderLoomies()}</Container>
  );
};
