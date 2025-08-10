//components/Auth.js
import React from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes
} from "@react-native-google-signin/google-signin";
import { useUser } from '../contexts/UserContext'; 

const Auth = () => {
  const { signInUser, synchronizeUserData } = useUser();

  GoogleSignin.configure({
    scopes: ['email', 'profile'], 
    webClientId: '292694167327-ho7su5mm59m6flj45i4hge1m9h0n73b4.apps.googleusercontent.com', 
  });

  const handleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();
      const {type, data} = userInfo;
      const {scopes, serverAuthCode, idToken, user} = data;
      const {email, familyName, givenName, id, name, photo} = user;
      await signInUser({ id, name, email, photo });
      synchronizeUserData(idToken, email);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("ERROR: Sign in cancelled.");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("ERROR: Sign in in progress.");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("ERROR: Outdated services.");
      } else {
        console.error("ERROR: ", error);
      }
    }
  };

  return <GoogleSigninButton
    size={GoogleSigninButton.Size.Wide}
    color={GoogleSigninButton.Color.Dark}
    onPress={handleSignIn}
  />;
}

export default Auth;