import { useEffect, useState } from 'react';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { BusinessCard, Like } from '../wrappers/tact_BusinessCard';
import { Address, toNano } from 'ton-core';
import { useTonConnect } from './useTonConnect';

type UserInfo = {
  name: string;
  profesion: string;
  bio: string;
};

export const useBusinessCardContract = () => {
  const { client } = useTonClient();

  const { wallet, sender } = useTonConnect();

  const [likes, setLikes] = useState<number | null>();
  const [userInfo, setUserInfo] = useState<UserInfo | null>();

  const businessCardContract = useAsyncInitialize(async () => {
    if (!client || !wallet) return;

    const contract = BusinessCard.fromAddress(
      Address.parse('EQCM3b63cele_wx64hUJecFvmYA-xHbU4O0lyj3AJxqcLVEe')
    );

    return client.open(contract);
  }, [client, wallet]);

  const getLikes = async () => {
    if (!businessCardContract) return;
    setLikes(null);
    const likes = await businessCardContract.getLikes();

    setLikes(Number(likes));
  };

  const getUserInfo = async () => {
    if (!businessCardContract) return;
    setUserInfo(null);
    const { name, profesion, bio } = await businessCardContract.getInfo();

    setUserInfo({
      name,
      profesion,
      bio,
    });
  };

  const sendLike = async () => {
    const message: Like = {
      $$type: 'Like',
    };

    await businessCardContract?.send(
      sender,
      {
        value: toNano('0.01'),
      },
      message
    );
  };

  useEffect(() => {
    getLikes().catch(() => console.log());
    getUserInfo().catch(() => console.log());
  }, [businessCardContract]);

  return { likes, userInfo, sendLike };
};
