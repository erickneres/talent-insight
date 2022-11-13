import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { Profile, User } from "../../types/User";

import { useApi } from "../../hooks/useApi";

export function AuthProvider({ children }: { children: JSX.Element }){
  const [user, setUser] = useState<User | null>(JSON.parse(localStorage.getItem("saved-user") || "null"));
  const [profile, setProfile] = useState<Profile | null>(JSON.parse(localStorage.getItem("saved-profile") || "null"));

  const api = useApi();

  async function register(name: string, email: string, password: string, confirmPassword: string, age: number) {
    const data = await api.registerUser(name, email, password, confirmPassword, age);

    if (data.error) {
      return data.message;
    }

    if (data.user && data.token) {
      setUser(data.user);
      setToken(data.token);
    }
  }

  async function signin(email: string, password: string) {
    const data = await api.signinUser(email, password);

    if (data.error) {
      return data.message;
    }

    if (data.user && data.token) {
      setUser(data.user);
      setProfile(data.userProfile);
      setToken(data.token);
    }
  }

  async function signout() {
    setUser(null);
    setProfile(null);
    setToken('');
  }

  function setToken(token: string) {
    localStorage.setItem('ti-auth-token', token);
  }

  useEffect(() => {
    localStorage.setItem("saved-user", JSON.stringify(user));
    localStorage.setItem("saved-profile", JSON.stringify(profile));
  }, [user]);

  useEffect(() => {
    async function validateToken() {
      const storageData = localStorage.getItem("ti-auth-token");

      if (storageData) {
        try {
          const data = await api.validateUserToken(storageData);

          setUser(data.user);
          setProfile(data.userProfile);

        } catch (e) {
          setUser(null);
          setProfile(null);
          console.log(e);
        }
      }
    }

    validateToken();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isSigned: !!user,
      profile,
      setUser,
      setProfile,
      register,
      signin,
      signout
    }}>
      {children}
    </AuthContext.Provider>
  )
}