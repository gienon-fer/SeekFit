import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes
} from "@react-native-google-signin/google-signin";

const Auth = ({ onSignIn }) => {
  GoogleSignin.configure({
    scopes: ['email', 'profile'], 
    webClientId: GOOGLE_WEB_CLIENT_ID, 
  });

  return <GoogleSigninButton
    size={GoogleSigninButton.Size.Wide}
    color={GoogleSigninButton.Color.Dark}
    onPress={async () => {
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const {type, data} = userInfo;
        const {scopes, serverAuthCode, idToken, user} = data;
        const {email, familyName, givenName, id, name, photo} = user;
        console.log(name);
        onSignIn(name);
      } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          console.log("ERROR: Sign in cancelled.")
        } else if (error.code === statusCodes.IN_PROGRESS) {
          // operation (e.g. sign in) is in progress already
          console.log("ERROR: Sign in in progress.")
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          // play services not available or outdated
          console.log("ERROR: Outdated services.")
        } else {
          // some other error happened
          console.log("ERROR: " + error)
        }
      }
    }}
  />;
}

export default Auth;