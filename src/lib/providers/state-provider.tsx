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
import {DoubleSlut, EmojiSlot, Gamble, Profile, TripleSlut} from '../supabase/supabase.types'
import { usePathname } from 'next/navigation';
import { getDoubleSlutLatest, getEmojiSlotLatest, getLatestGamble, getProfile, getTripleSlutLatest } from '../supabase/queries';
import { useSupabaseUser } from './supabase-user-provider';
import { gamble } from '../../../migrations/schema';

interface AppState {
    userLocal: Profile | null;
    emojiSlotLocal:EmojiSlot | null;
    doubleSlutLocal:DoubleSlut | null;
    tripleSlutLocal:TripleSlut | null;
    gambleLocal:Gamble | null;
}

type Action = 
    | {type:"SET_USER",payload:Profile}
    | {type:"UPDATE_USER",payload:Profile}
    | {type:"DELETE_USER",payload:Profile}
    | {type:"SET_EMOJI_SLOT",payload:EmojiSlot}
    | {type:"UPDATE_EMOJI_SLOT",payload:EmojiSlot}
    | {type:"DELETE_EMOJI_SLOT",payload:EmojiSlot | null}
    | {type:"SET_GAMBLE",payload:Gamble}
    | {type:"UPDATE_GAMBLE",payload:Gamble}
    | {type:"DELETE_GAMBLE",payload:Gamble | null}
    | {type:"SET_DOUBLE_SLUT",payload:DoubleSlut}
    | {type:"UPDATE_DOUBLE_SLUT",payload:DoubleSlut}
    | {type:"DELETE_DOUBLE_SLUT",payload:DoubleSlut | null}
    | {type:"SET_TRIPLE_SLUT",payload:TripleSlut}
    | {type:"UPDATE_TRIPLE_SLUT",payload:TripleSlut}
    | {type:"DELETE_TRIPLE_SLUT",payload:TripleSlut | null}

const initialState: AppState = { userLocal: null, emojiSlotLocal:null,gambleLocal:null,doubleSlutLocal:null,tripleSlutLocal:null};

const appReducer = (
    state: AppState = initialState,
    action: Action
  ): AppState => {
    switch (action.type) {
        case "SET_USER":
          // console.log("user setted gamw ti poutana m", state, action.payload)
            return { ...state, userLocal: action.payload };
        case "UPDATE_USER":
            return { ...state, userLocal:action.payload };
        case "DELETE_USER":
            return { ...state, userLocal: action.payload };
        case "SET_EMOJI_SLOT":
            return { ...state, emojiSlotLocal: action.payload };
        case "UPDATE_EMOJI_SLOT":
            return { ...state, emojiSlotLocal: action.payload };
        case "DELETE_EMOJI_SLOT":
            return { ...state, emojiSlotLocal: null };
          case "SET_GAMBLE":
            return { ...state, gambleLocal: action.payload };
        case "UPDATE_GAMBLE":
            return { ...state, gambleLocal: action.payload };
        case "DELETE_GAMBLE":
            return { ...state, gambleLocal: null };
          case "SET_DOUBLE_SLUT":
            return { ...state, doubleSlutLocal: action.payload };
        case "UPDATE_DOUBLE_SLUT":
            return { ...state, doubleSlutLocal: action.payload };
        case "DELETE_DOUBLE_SLUT":
            return { ...state, doubleSlutLocal: null };
          case "SET_TRIPLE_SLUT":
            return { ...state, tripleSlutLocal: action.payload };
        case "UPDATE_TRIPLE_SLUT":
            return { ...state, tripleSlutLocal: action.payload };
        case "DELETE_TRIPLE_SLUT":
            return { ...state, tripleSlutLocal: null };
        default:
            return state;
    }
}

const AppStateContext = createContext<
  | {
      state: AppState;
      dispatch: Dispatch<Action>;
      userId: string | undefined;
      profile:Profile | null;
      emojiSlot:EmojiSlot | null;
      gamble:Gamble | null;
      doubleSlut:DoubleSlut | null;
      tripleSlut:TripleSlut | null;
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
    const {userFromUsersTable} = useSupabaseUser();

    useEffect(()=>{
      // console.log("user form appstate provider: ",userFromUsersTable)
      if(userFromUsersTable?.id){

      }
    },[userFromUsersTable,pathname])
    const profileId = useMemo(()=>{
      if(userFromUsersTable){
        return userFromUsersTable.id
      }
    },[userFromUsersTable]);
  
    // const profileId = useMemo(() => {
    //   const urlSegments = pathname?.split('/').filter(Boolean);//split the pathname by / and remove any empty strings
    //   if (urlSegments)
    //     if (urlSegments.length > 1) {
    //       return urlSegments[1];//return the second element of the array
    //     }
    // }, [pathname]);
    //the useMemo hook is used to memorize the value of the workspaceId
    //between renders. It only changes when the pathname changes

    const usProf= useMemo(()=>{
      return state.userLocal
    },[state])
    const usEmojiSlot = useMemo(()=>{
      return state.emojiSlotLocal
    },[state])
    const usGamble = useMemo(()=>{
      return state.gambleLocal
    },[state])
    const usDoubleSlut = useMemo(()=>{
      return state.doubleSlutLocal
    },[state])
    const usTripleSlut = useMemo(()=>{
      return state.tripleSlutLocal
    },[state])

  
    useEffect(() => {
      // console.log("state from useEffect: ",state)
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

        const {error:emojiSlotError, data:emojiSlotData} = await getEmojiSlotLatest(profileId);
        if(emojiSlotError){
          console.log(emojiSlotError)
        }
        if(!emojiSlotData) {
          console.log("no data");
        };
        if(emojiSlotData){
          console.log("emojislotdata from appstate: ",emojiSlotData)
          dispatch({
            type:"SET_EMOJI_SLOT",
            payload:{...emojiSlotData}
          })
        }

        const {data:latestGambleData, error:latestGambleError} = await getLatestGamble(profileId);
        if(latestGambleError || !latestGambleData){
          console.log('latestGambleData error or no data' ,latestGambleError)
          // return;
        } //here's the problem probably create an if statement for the case of latestGambleData instead of returning null form the error or the lack of data
        if(latestGambleData){
          dispatch({
            type:"SET_GAMBLE",
            payload:{...latestGambleData}
          })
        }
        console.log("reaches here")
        // console.log("latestData: ",latestGambleData, " the other shit: ",{
        //     id:'1',
        //     createdAt:'2021',
        //     userId:"",
        //     amount: "",
        //     choice: "",
        //     winner: "",
        //     status: true
        //   })
        // dispatch({
        //   type:"SET_GAMBLE",
        //   payload:{}
        // })

        const {data:doubleSlutData, error:doubleSlutError} = await getDoubleSlutLatest(profileId)
        if(doubleSlutError || !doubleSlutData){
          console.log("error at getting the latest double slut: ",doubleSlutError)
          // return;
        }
        if(doubleSlutData){
          console.log("doubleSlut data: ",doubleSlutData)
          dispatch({
            type:"SET_DOUBLE_SLUT",
            payload:{...doubleSlutData }
          })
        }

         const {data:tripleSlutData, error:tripleSlutError} = await getTripleSlutLatest(profileId)
        if(tripleSlutError || !tripleSlutData){
          console.log("error at getting the latest triple slut: ",tripleSlutError)
          // return;
        }
        if(tripleSlutData){
          console.log("tripleSlutData: ",tripleSlutData)
          dispatch({
            type:"SET_TRIPLE_SLUT",
            payload:{...tripleSlutData }
          })
        }
      };
      fetchProfile();
    }, [profileId]);//fetch the files when the folderId or the workspaceId changes
    //in order to make it more optimized
  
    useEffect(() => {
      console.log('App State Changed', state);
    }, [state]);
  
    return (
      <AppStateContext.Provider
        value={{ state, dispatch, userId: profileId, profile:usProf, emojiSlot:usEmojiSlot, gamble:usGamble, doubleSlut:usDoubleSlut, tripleSlut:usTripleSlut}}
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