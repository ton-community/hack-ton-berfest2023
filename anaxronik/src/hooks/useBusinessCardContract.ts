import { useEffect, useState } from "react";
import { Address, toNano } from "ton-core";
import { BusinessCard, Like } from "../wrappers/tact_BusinessCard";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";

export type UserInfo = {
  name: string;
  profession: string;
  bio: string;
};

export function useBusinessCardContract() {
  const { client } = useTonClient();
  const { sender } = useTonConnect();

  const [likes, setLikes] = useState<number | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const contract = useAsyncInitialize(async () => {
    if (!client) return;

    const address = Address.parse(
      "EQCM3b63cele_wx64hUJecFvmYA-xHbU4O0lyj3AJxqcLVEe"
    );
    const contract = BusinessCard.fromAddress(address);
    return client.open(contract);
  }, [client]);

  async function getLikes() {
    if (!contract) return;
    const likes = await contract.getLikes();
    setLikes(Number(likes));
  }
  async function getUserInfo() {
    if (!contract) return;
    const userInfo = await contract.getInfo();
    setUserInfo({
      name: userInfo.name,
      bio: userInfo.bio,
      profession: userInfo.profesion,
    });
  }

  async function sendLike() {
    const message: Like = {
      $$type: "Like",
    };

    await contract?.send(
      sender,
      {
        value: toNano("0.01"),
      },
      message
    );
  }

  useEffect(() => {
    getLikes().catch(console.log);
    getUserInfo().catch(console.log);
  }, [contract]);

  return { likes, userInfo, sendLike };
}
