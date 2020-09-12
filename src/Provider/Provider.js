import React from 'react';
import { onIsLoggedIn } from '../Services/Auth.service';

export const SessionContext = React.createContext();
function SessionProvider(props) {
  const [store, setStore] = React.useState({
    isLoggedIn: false,
    loading: true,
    user: {},
  });

  const logout = () => {
    setStore((store) => ({ ...store, isLoggedIn: false, user: {} }));
  };
  const doLogin = (res) => {
    setStore((store) => ({...store, isLoggedIn: true, user:res.user}));
  };
  const session = {
    isLoggedIn: store.isLoggedIn,
    loading: store.loading,
    user: store.user,
    logout,
    doLogin,
  };

  React.useEffect(() => {
    setStore({ loading: true });
    function fetchData() {
      return onIsLoggedIn()
        .then((res) => {
          setStore({ loading: false, isLoggedIn: res.isLogin, user: res.user });
        })
        .catch((err) => {
          setStore({ loading: false, isLoggedIn: false });
        });
    }
    fetchData();
  }, []);

  return <SessionContext.Provider value={session}>{props.children}</SessionContext.Provider>;
}

export default SessionProvider;
