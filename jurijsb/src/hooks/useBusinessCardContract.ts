import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { BusinessCard, Like } from "../wrappers/tact_BusinessCard";
import { Address, toNano } from "ton-core";
import { useEffect, useState } from "react";

type UserInfo = {
    name: string,
    profession: string,
    bio: string,
}

export function useBusinessCardContract() {
    const {client} = useTonClient()
    const {sender} = useTonConnect()

    const [likes, setLikes] = useState<number | null>()
    const [userInfo, setUserInfo] = useState<UserInfo | null>()

    const businessCardContract = useAsyncInitialize(async () => { 
        if (!client) return
        const contract = BusinessCard.fromAddress(
            Address.parse("EQCM3b63cele_wx64hUJecFvmYA-xHbU4O0lyj3AJxqcLVEe")
        )

        return client.open(contract)

    }, [client])
    
    async function getLikes() {
        if (!businessCardContract) return

        const likes = await businessCardContract.getLikes()
        setLikes(Number(likes))
    }

    async function getUserInfo() {
        if (!businessCardContract) return

        setUserInfo(null)
        const userInfo = await businessCardContract.getInfo()        
   
        setUserInfo({
            name: userInfo.name,
            profession: userInfo.profesion,
            bio: userInfo.bio
        })
    }

    async function sendLike() {
        if (!businessCardContract) return 

        const message : Like = {
            $$type: "Like",
        }

        await businessCardContract.send(
            sender,
            {
                value: toNano("0.01"),
            },
            message
        )
    }

    useEffect(() => {
        getLikes().catch(console.log)
        getUserInfo().catch(console.log)
    }, [businessCardContract])

    return {
        likes,
        userInfo,
        sendLike
    }
}
