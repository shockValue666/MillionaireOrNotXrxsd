'use client';
//in general we want to have access to the current workspace, folder and file
//throughout the app. we want to be able to dispatch events to update the global state
//and we want to be able to listen to changes in the global state
import React, {
  Dispatch,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
// import { Users } from '../supabase/supabase.types';
import {Profile, User} from '../supabase/supabase.types'
import { usePathname } from 'next/navigation';
import { getProfile, getUserSubscriptionStatus } from '../supabase/queries';

interface AppState {
    userLocal: Profile | Profile[] | [];
}

type Action = 
    | {type:"SET_USER",payload:Profile}
    | {type:"UPDATE_USER",payload:Profile}
    | {type:"DELETE_USER",payload:Profile}


const initialState: AppState = { userLocal: [] };

const appReducer = (
    state: AppState = initialState,
    action: Action
  ): AppState => {
    switch (action.type) {
        case "SET_USER":
          console.log("user setted gamw ti poutana m")
            return { ...state, userLocal: action.payload };
        case "UPDATE_USER":
            return { ...state, userLocal: action.payload };
        case "DELETE_USER":
            return { ...state, userLocal: action.payload };
        default:
            return state;
    }
}

const AppStateContext = createContext<
  | {
      state: AppState;
      dispatch: Dispatch<Action>;
      userId: string | undefined;
    }
  | undefined
>(undefined);


interface AppStateProviderProps {
    children: React.ReactNode;
}

const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState); // the equivalent of useState but for complex states
    //the appReducer is the reducer function which takes the current state and the action and returns the new state
    //the intitial state is the initial state of the global state
    const pathname = usePathname();
    //returns the current pathname of the URL
  
    const profileId = useMemo(() => {
      const urlSegments = pathname?.split('/').filter(Boolean);//split the pathname by / and remove any empty strings
      if (urlSegments)
        if (urlSegments.length > 1) {
          return urlSegments[1];//return the second element of the array
        }
    }, [pathname]);
    //the useMemo hook is used to memorize the value of the workspaceId
    //between renders. It only changes when the pathname changes
  
  
    useEffect(() => {
      if (!profileId) return;
      const fetchProfile = async () => {
        const { error: filesError, data } = await getProfile(profileId);
        if (filesError) {
          console.log(filesError);
        }
        if (!data) return;
        dispatch({
          type: 'SET_USER',
          payload: { ...data },
        });
      };
      fetchProfile();
    }, [profileId]);//fetch the files when the folderId or the workspaceId changes
    //in order to make it more optimized
  
    useEffect(() => {
      // console.log('App State Changed', state);
    }, [state]);
  
    return (
      <AppStateContext.Provider
        value={{ state, dispatch, userId: profileId}}
      >
        {children}
      </AppStateContext.Provider>
    );
  };
  //in the workspace-dropdown.tsx we set the state to include
  // the shared, the collaboratin and the private workspaces using 
  // the SET_WORSKPACE action
  export default AppStateProvider;

  
  export const useAppState = () => {
    const context = useContext(AppStateContext);
    if (!context) {
      throw new Error('useAppState must be used within an AppStateProvider');
    }
    // console.log("contextxxxxxxx: ",context)
    return context;
  };