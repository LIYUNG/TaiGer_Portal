import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    // console.log('tokenString  ' + tokenString)
    try
    {
      const userToken = JSON.parse(tokenString);
      // console.log('userToken  ' + userToken)
      // return userToken?.token
      return userToken
    }
    catch(e){
      const userToken = JSON.parse("0");
      // console.log('userToken  ' + userToken)
      // return userToken?.token
      return userToken
    }
  };
  // console.log('getToken()  ' + getToken())
  const [token, setToken] = useState(getToken());
  // console.log(' token  ' + token)

  const saveToken = userToken => {
    // localStorage.setItem('token', JSON.stringify(userToken.token));
    // setToken(userToken.token);
    localStorage.setItem('token', JSON.stringify(userToken.token));
    setToken(userToken.token);
  };

  return {
    setToken: saveToken,
    token
  }

}