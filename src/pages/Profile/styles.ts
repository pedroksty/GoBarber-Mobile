import styled from 'styled-components/native';
import Button from '../../components/Button';

export const Container = styled.ScrollView`
  flex: 1;
  padding: 0 30px;
`;

export const BackButton = styled.TouchableOpacity`
  margin-top: 40px;
`

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0;
  
`;

export const UserAvatarButton = styled.TouchableOpacity`
  margin-top: 32px;

`
export const UserAvatar = styled.Image`
  width: 148px;
  height: 148px;
  border-radius: 74px;
  align-self: center;
`
export const LogoutButton = styled(Button)`
  background: #e02626;
`