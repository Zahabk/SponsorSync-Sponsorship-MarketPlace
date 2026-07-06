import { createContext, useContext, useEffect, useState } from "react";
import AuthService from "../services/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 
  
  useEffect(() => {
    const checkAuth= async()=>{
        try {
            const data = await AuthService.getCurrentUser()
            setUser(data.data)
            setIsAuthenticated(true)
        } catch (error) {
            setUser(null)
            setIsAuthenticated(false)
        }finally{
            setLoading(false)

        }
    }
    checkAuth()
  });

   const login = async (credentials) => {
    const data = await AuthService.login(credentials);
    setUser(data.user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return(
    <AuthContext.Provider value={{isAuthenticated,user,setUser,loading,login,logout}}>
        {children}
    </AuthContext.Provider>
  )
};

export const useAuth = ()=>{
    return useContext(AuthContext)
}