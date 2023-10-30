import { Address, toNano } from "ton-core";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { BusinessCard, Like } from "../wrappers/tact_BusinessCard";
import { useState, useEffect } from "react";

type UserInfo = {
    name: string,
    profession: string,
    bio: string
}

export function useBuinessCardContract() {
    const { client } = useTonClient()
    const { sender } = useTonConnect()

    const [likes, setLikes] = useState<number | null>()
    const [userInfo, setUserInfo] = useState<UserInfo | null>()

    const buisnessCardContract = useAsyncInitialize(async () => {
        if (!client) return

        const contract = BusinessCard.fromAddress(Address.parse("EQCM3b63cele_wx64hUJecFvmYA-xHbU4O0lyj3AJxqcLVEe"))

        return client.open(contract)
    }, [client])

    async function getLikes() {
        if (!buisnessCardContract) return
        setLikes(null)
        const likes = await buisnessCardContract.getLikes()
        setLikes(Number(likes))
    }

    async function getUserInfo() {
        if (!buisnessCardContract) return
        setUserInfo(null)
        const userInfo = await buisnessCardContract.getInfo()
        setUserInfo({
            name: userInfo.name,
            profession: userInfo.profesion,
            bio: userInfo.bio,
        })
    }

    async function sendLike() {
        if (!buisnessCardContract) return

        const message: Like = {
            $$type: "Like"
        }

        await buisnessCardContract.send(
            sender,
            {
                value: toNano("0.01")
            },
            message
        )
    }

    useEffect(() => {
        getLikes().catch(console.log)
        getUserInfo().catch(console.log)
    }, [buisnessCardContract]);

    return {
        likes,
        userInfo,
        sendLike
    }

}