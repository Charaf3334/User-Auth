import { createContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'

// This tells Axios to always send cookies (like session cookies) with every request, even across domains
axios.defaults.withCredentials = true


type AppContextType = {
    backendUrl: string;
    isLoggedin: boolean;
    setIsLoggedin: (value: boolean) => void;
    userData: any;
    setUserData: (value: any) => void;
    getUserData: () => void;
};


export const AppContext = createContext<AppContextType | null>(null)

export const AppContextProdiver = (props: any) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin, setIsLoggedin] = useState(false)
    const [userData, setUserData] = useState(false)

    const getAuthStatus = async () => {

        try {
            
            const {data} = await axios.get(backendUrl + '/api/auth/is-auth')

            if (data.success) {
                setIsLoggedin(true)
                getUserData()
            }

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Something went wrong'
            toast.error(errorMessage)
        }

    }

    const getUserData = async () => {

        try {

            const {data} = await axios.get(backendUrl + '/api/user/data')
            data.success ? setUserData(data.userData) : toast.error(data.message)
            
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Something went wrong'
            toast.error(errorMessage)
        }

    }

    {/* whenever we reload the page, if we are already logged in and authenticated, our session will stay on */}
    useEffect(() => {
        getAuthStatus()
    },[])

    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}