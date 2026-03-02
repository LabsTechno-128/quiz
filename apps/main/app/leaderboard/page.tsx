"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { leaderboardService } from "../services/leaderboard.service";
import { User } from "../types/api.types";

 

 
export default function LeaderboardPage() { 
  const [me, setMe] = useState<User | null>(null);
  const [userRankings, setUserRankings] = useState<User[]>([]);

  useEffect(() => {
      const fetchUserRanking = async () => {
        const response = await leaderboardService.getUserRanking();
          setMe(response);
          console.log(response,"----------->>");  
      };
       const fetchOverAllRanking = async () => {
        const response = await leaderboardService.getOverAllRanking();
        //  console.log(response,"----------->>");
         setUserRankings(response.result);
      };
      fetchUserRanking();
      fetchOverAllRanking();
  }, []);
    

  return (
    <div className="   ">
      <div className="flex gap-4 justify-between bg-[#F7F7F7] py-14 px-4 lg:px-24 max-w-[1440px] mx-auto ">
        <div>
          <h1 className="text-3xl font-bold">Leader Board List</h1>
          <p className="text-normal pt-2">Here is your all pruchase list</p>
        </div>
      </div>
      <div className="  px-4 lg:px-24 max-w-[1440px] mx-auto">
        {/* --- My Rank Card --- */}
        {me && (
          <div className="flex flex-col md:flex-row justify-between md:items-center p-4 rounded-2xl shadow-sm bg-gradient-to-r from-violet-600 to-purple-500 text-white -mt-9 gap-5 md:gap-0">
            <div className="flex items-center gap-3">
              <Image
                src={me.avatar??""}
                alt={me.name}
                width={40}
                height={40}
                className="rounded"
              />
              <div>
                <h4 className="font-medium">
                  {me.name} <span className="text-sm opacity-90">(Me)</span>
                </h4>
                <p className="text-violet-200 text-sm">{me.rank}</p>
              </div>
            </div>
            <div className="px-4 py-2 text-sm font-semibold rounded-lg bg-white text-violet-600 w-28 ">
              {me.totalCorrectScore} PT
            </div>
          </div>
        )}

        {/* --- Gap before others --- */}
        <div className="mt-6 ">
          {userRankings.map((user) => (
            <div
              key={user.id}
              className="flex flex-col md:flex-row justify-between md:items-center p-4  shadow-sm border-b border-[#E4E9EE] bg-white hover:bg-gray-100 transition gap-5 md:gap-0"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={user?.avatar ?? ""}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="rounded"
                />
                <div>
                  <h4 className="font-medium text-gray-800">{user.name ||"unknown"}</h4>
                  <p className="text-sm text-gray-500">{user.rank}</p>
                </div>
              </div>
              <div className="px-4 py-2 text-sm font-semibold rounded-lg border border-violet-200 text-violet-600  w-28">
                {user.totalCorrectScore} PT
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
