import { useTonClient } from './useTonClient';
import { useEffect, useState } from 'react';
import { useAsyncInitialize } from './useAsyncInitialize';
import { BusinessCard, Like } from '../wrappers/tact_BusinessCard';
import { Address, OpenedContract, toNano } from 'ton-core';
import { useTonConnect } from './useTonConnect';

type UserInfo = {
    name: string,
    profession: string,
    bio: string,
}
export function useBusinessCardContract() {
    const { client } = useTonClient();
    const { wallet, sender} = useTonConnect();

    const [likes, setLikes] = useState<number | null>();
    const [userInfo, setUserInfo] = useState<UserInfo | null>();

    const businessCardContract = useAsyncInitialize(async (): Promise<OpenedContract<BusinessCard> | undefined> => {
        if (!client || !wallet) return;

        const contract = BusinessCard.fromAddress(Address.parse("EQCM3b63cele_wx64hUJecFvmYA-xHbU4O0lyj3AJxqcLVEe"));

        return client.open(contract) as OpenedContract<BusinessCard>;
    }, [client, wallet]);

    async function getLikes() {
        if(!businessCardContract) return

        const likes = await businessCardContract.getLikes();
        setLikes(Number(likes));
    }

    async function getUserInfo() {
        if(!businessCardContract) return

        const userInfo = await businessCardContract.getInfo();
        setUserInfo({
            name: userInfo.name,
            profession: userInfo.profesion,
            bio: userInfo.bio,
        });
    }

    async function sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    async function sendLike() {
        const message: Like = {
            $$type: 'Like',
        }

        await businessCardContract?.send(
            sender,
            {
                value: toNano('0.01'),
            },
            message,
        )

        let currentLikes = likes;
        while(currentLikes === likes && businessCardContract) {
            await sleep(1500);
            currentLikes = Number(await businessCardContract.getLikes());
        }
        setLikes(currentLikes)
    }

    useEffect(() => {
        getLikes().catch(console.log)
        getUserInfo().catch(console.log)
    }, [businessCardContract])

    return {
        likes,
        userInfo,
        sendLike,
    }
}
