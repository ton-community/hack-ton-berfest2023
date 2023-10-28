import { Address } from "ton-core";
import { BusinessCard } from "../wrappers/tact_BusinessCard";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import {useState} from "react";

type UserInfo ={
    name: string,
    profession: string,
    bio: string
}

export  function useBusinessCardContract(){
    const {client} = useTonClient()
    const {sender} = useTonConnect()

    const [likes , setLikes] = useState<number | null >()
    const [UserInfo, setUserInfo] =useState<UserInfo | null>()     
    
    const businessCardContract = useAsyncInitialize(async()=>{
        if(!client) return

        const contract = BusinessCard.fromAddress(
            Address.parse("EQCM3b63cele_wx64hUJecFvmYA-xhbu4O0lyj3AJxqclVEe")
            )
            client.open(contract)
     },[client])
}

async function getlikes(){
   // if(!businessCardContract) return
    //const likes = await businessCardContract.getlikes()
    //setLikes(Number(likes))
}

async function getUserInfo() {
    //setUserInfo(null)
}

/*useEffect(()=>{
getlikes().catch(console.log)
},[businessCardContract])

return{
    likes
}*/