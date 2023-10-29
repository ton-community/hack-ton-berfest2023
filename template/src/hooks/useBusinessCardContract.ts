import { BusinessCard } from "../components/BusinessCard";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { BusinessCard } from "../components/BusinessCard";
import { Address, toNano } from "ton-core";
import {useEffect, useState} from "react";
import { type, userInfo } from "os";
import { Like } from "../wrappers/tact_BusinessCard";


  type userinfo ={
       name : string,
       profession : string,
       bio : string  

        }
export function useBusinessCardContract() {
    const {client} = useTonClient()
    const {sender} = useTonConnect()
    const [likes,setlikes]= useState<number | null>()

    const [userinfo,setuserinfo] = useState<userinfo | null >()

    const businessCardContact = useAsyncInitialize(async()=>{
         if (!client) return

         const contract = BusinessCard.fromAddress(
            Address.parse("EQCM3b63cele_wx64hUJecFvmYA-xHbU40Olyj3AJxqcLVEe")
         )
         return client.open (contract)


    }  ,  [client])

    async function getlikes() {
        if (!businessCardContact) return 

        setlikes(null)

        const likes = await businessCardContact.getlikes()

        setlikes(Number(likes))
    }

     async function getUserInfo() {

        if(businessCardContact) return  
        setuserinfo (null)

        const userinfo = await businessCardContact.getInfo()
            setuserinfo(
                {
                  name : userinfo.name,
                  profession : userinfo.profession,
                  bio : userinfo.bio
                     
                }
            )
    

        
     }

     async function sendLikes() {
        if(!businessCardContact) return

        const message :Like={
            $$type : "Like"
        }

        await businessCardContact.send(
            sender,
            {
                value :toNano("0.01")
            },
            message
        )
     }

    useEffect(
        ()=>{
            getlikes().catch(console.log)
            getUserInfo().catch(console.log)
        } , [businessCardContact]
    )
    return {
        likes,
        userinfo,
        sendLikes
    }
}