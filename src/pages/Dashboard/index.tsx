import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../hooks/auth';

import { Container,
  Header,
  HeaderTitle, 
  UserName,
  ProfileButton,
  UserAvatar,
 } from './styles';

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();
  const {navigate} = useNavigation()

  const navigateToProfile = useCallback(() => {
    navigate('Profile')
  }, [navigate])

  return (
    <Container>
      <Header>
        <HeaderTitle>
          Bem vindo, {"\n"}
          <UserName>{user.name}</UserName>
        </HeaderTitle>

        <ProfileButton onPress={navigateToProfile} >
          <UserAvatar source={{uri: user.avatar_url ? user.avatar_url : 'https://portal.staralliance.com/cms/aux-pictures/prototype-images/avatar-default.png/@@images/image.png'}} />
        </ProfileButton>
      </Header>
    </Container>
  );
};

export default Dashboard;
