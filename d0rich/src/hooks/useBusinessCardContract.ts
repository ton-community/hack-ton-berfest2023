import { useEffect, useState } from "react";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { BusinessCard } from "../wrappers/tact_BusinessCard";
import { Address } from "ton-core";

interface UserInfo {
  name: string
  profession: string
  bio: string
}

const contractAddress = Address.parse('EQCM3b63cele_wx64hUJecFvmYA-xHbU4O0lyj3AJxqcLVEe')

export function useBusinessCardContract() {
  const { client } = useTonClient();
  const [likes, setLikes] = useState<number | null>();
  const [userInfo, setUserInfo] = useState<UserInfo | null>();

  const businessCardContract = useAsyncInitialize(async () => {
    if (!client) return
    const contract = BusinessCard.fromAddress(contractAddress)

    return await client.open(contract)
  }, [client])

  async function getLikes() {
    if (!businessCardContract) return
    const likes = await businessCardContract.getLikes()
    setLikes(Number(likes))
  }

  useEffect(() => {
    getLikes().catch(console.error)
  }, [businessCardContract])

  return {
    likes
  }
}