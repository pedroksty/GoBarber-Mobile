import React, { useCallback } from 'react';
import Icon from 'react-native-vector-icons/Feather'

import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';

import { 
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
 } from './styles';

interface RouteParams {
  providerId: string
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth()
  const route = useRoute()
  const {goBack} = useNavigation()

  const {providerId} = route.params as RouteParams

  const navigateBack = useCallback(() => {
    goBack()
  }, [goBack])


  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack} >
          <Icon  name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabelereiros</HeaderTitle>

        <UserAvatar  source={{uri: user.avatar_url ? user.avatar_url : 'https://portal.staralliance.com/cms/aux-pictures/prototype-images/avatar-default.png/@@images/image.png'}} />
      </Header>
    </Container>
  )
}

export default CreateAppointment;