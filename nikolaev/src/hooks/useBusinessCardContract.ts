import { useEffect, useState } from "react";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { BusinessCard, Like } from "../wrappers/tact_BusinessCard";
import { Address, OpenedContract, toNano } from "ton-core";
import { useTonConnect } from "./useTonConnect";

type UserInfo = {
  name: string;
  profession: string;
  bio: string;
};

export function useBusinessCardContract() {
  const { client } = useTonClient();
  const { wallet, sender } = useTonConnect();

  const [likes, setLikes] = useState<number | null>();
  const [userInfo, setUserInfo] = useState<UserInfo | null>();

  const businessCardContract = useAsyncInitialize(async () => {
    if (!client || !wallet) return;

    const contract = BusinessCard.fromAddress(
      Address.parse("EQCM3b63cele_wx64hUJecFvmYA-xHbU4O0lyj3AJxqcLVEe")
    );

    return client.open(contract) as OpenedContract<BusinessCard>;
  }, [client]);

  async function getLikes() {
    if (!businessCardContract) return;

    setLikes(null);
    const likes = await businessCardContract.getLikes();
    setLikes(Number(likes));
  }

  async function getUserInfo() {
    if (!businessCardContract) return;

    setUserInfo(null);
    const userInfo = await businessCardContract.getInfo();
    setUserInfo({
      name: userInfo.name,
      bio: userInfo.name,
      profession: userInfo.profesion
    });
  }

  async function sendLike() {
    const message: Like = {
      $$type: "Like"
    };

    await businessCardContract?.send(
      sender,
      {
        value: toNano("0.01")
      },
      message
    );
  }

  useEffect(() => {
    getLikes().catch(console.log);
    getUserInfo().catch(console.log);
  }, [businessCardContract]);

  return {
    likes,
    userInfo,
    sendLike
  };
}
