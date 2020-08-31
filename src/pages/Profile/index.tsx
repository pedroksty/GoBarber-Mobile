import React, { useRef, useCallback, useMemo } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  View,
  TextInput,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather'

import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErros';

import { useAuth } from '../../hooks/auth';

import Input from '../../components/Input';
import Button from '../../components/Button';


import { Title, Container, UserAvatarButton, UserAvatar, BackButton } from './styles'

interface ProfileFormData {
  name: string
  email: string
  old_password: string
  password: string
  password_confirmation: string
}

const Profile: React.FC = () => {
  const { user, updateUser} = useAuth()

  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const ConfirmPasswordInputRef = useRef<TextInput>(null);

  const navigation = useNavigation();

  const handleProfile = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um E-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string()
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string()
            })
            .oneOf([Yup.ref('password')], 'Confirmação incorreta')
        })

        await schema.validate(data, {
          abortEarly: false
        });

        const {
          name,
          email,
          password,
          old_password,
          password_confirmation
        } = data

        const formData = Object.assign(
          {
            name,
            email
          },
          old_password
            ? {
                old_password,
                password,
                password_confirmation
              }
            : {}
        )

        const response = await api.put('/profile', formData)

        updateUser(response.data)

        Alert.alert(
          'Perfil Atualizado com sucesso',
        );

        navigation.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }
        console.log(err);
        Alert.alert('Erro na atualização do seu perfil', 'Tente novamente');
      }
    },
    [navigation, updateUser]
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const defaultImageURL = useMemo(() => {
    return 'https://portal.staralliance.com/cms/aux-pictures/prototype-images/avatar-default.png/@@images/image.png'
  }, [])

  return (
    <>
      <KeyboardAvoidingView
        enabled
        style={{
          flex: 1
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flex: 1
          }}
        >
          <Container>
            <BackButton onPress={handleGoBack} >
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>

            <UserAvatarButton onPress={() => {}} >
              <UserAvatar  source={{uri: user.avatar_url ? user.avatar_url : defaultImageURL}} />
            </UserAvatarButton>

            <View>
              <Title>Meu perfil</Title>
            </View>

            <Form  initialData={user} ref={formRef} onSubmit={handleProfile}>
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Seu nome"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                }}
              />
              <Input
                ref={emailInputRef}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  oldPasswordInputRef.current?.focus();
                }}
              />
              <Input
                ref={oldPasswordInputRef}
                containerStyle={{ marginTop: 16}}
                secureTextEntry
                name="old_password"
                icon="lock"
                placeholder="Senha atual"
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
              />

              <Input
                ref={passwordInputRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Nova senha"
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => {
                  ConfirmPasswordInputRef.current?.focus();
                }}
              />

              <Input
                ref={ConfirmPasswordInputRef}
                secureTextEntry
                name="password_confirmation"
                icon="lock"
                placeholder="Confirmar senha"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Confirmar mudanças
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
