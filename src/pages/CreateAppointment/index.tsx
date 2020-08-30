import React, { useCallback, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather'
import { useRoute, useNavigation } from '@react-navigation/native';

import { useAuth } from '../../hooks/auth';

import api from '../../services/api';

import { 
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
 } from './styles';

interface RouteParams {
  providerId: string
}

export interface Provider {
  id: string
  name: string
  avatar_url: string
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth()
  const route = useRoute()
  const {goBack} = useNavigation()

  const routeParams = route.params as RouteParams

  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedProvider, setSelectedProvider] = useState(routeParams.providerId)


  const navigateBack = useCallback(() => {
    goBack()
  }, [goBack])

  useEffect(() => {
    api.get('providers').then(response => {
      setProviders(response.data)
    })
  }, [])

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId)
  }, [])


  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack} >
          <Icon  name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabelereiros</HeaderTitle>

        <UserAvatar  source={{uri: user.avatar_url ? user.avatar_url : 'https://portal.staralliance.com/cms/aux-pictures/prototype-images/avatar-default.png/@@images/image.png'}} />
      </Header>

      <ProvidersListContainer>

        <ProvidersList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={providers}
          keyExtractor={provider => provider.id}
          renderItem={({item: provider}) => (
          <ProviderContainer
            onPress={() => handleSelectProvider(provider.id)}
            selected={provider.id === selectedProvider}
          >
            <ProviderAvatar source={{uri:  provider.avatar_url ? provider.avatar_url : 'https://portal.staralliance.com/cms/aux-pictures/prototype-images/avatar-default.png/@@images/image.png' }}/>
            <ProviderName selected={provider.id === selectedProvider} >{provider.name}</ProviderName>
          </ProviderContainer>

          )}
        />

      </ProvidersListContainer>


    </Container>
  )
}

export default CreateAppointment;