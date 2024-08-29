import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F3DF',
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  meetText: {
    color: '#F48278',
  },
  title: {
    fontSize: 40,
    fontFamily: 'Recoleta',
    color: '#231F20',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderColor: '#F48278',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 18,
    fontFamily: 'Recoleta',
    color: '#231F20',
  },
  signUpButton: {
    backgroundColor: '#F48278',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  signUpButtonText: {
    color: '#F8F3DF',
    fontSize: 20,
    fontFamily: 'Recoleta',
  },
  loginButton: {
    backgroundColor: '#F48278',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#F8F3DF',
    fontSize: 20,
    fontFamily: 'Recoleta',
  },
  orText: {
    color: '#231F20',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    fontFamily: 'Recoleta',
  },
  ssoButton: {
    backgroundColor: '#231F20',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  ssoButtonText: {
    color: '#F8F3DF',
    fontSize: 18,
    fontFamily: 'Recoleta',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
});
