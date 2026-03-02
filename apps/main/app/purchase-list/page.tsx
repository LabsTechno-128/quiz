"use client";

import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { userService } from "../services/user.service";
import { User } from "../types/api.types";
import { leaderboardService } from "../services/leaderboard.service";

interface PurchaseItem {
  id: number;
  title: string;
  subject: string;
  icon: string;
}

const purchaseData: PurchaseItem[] = [
  {
    id: 1,
    title: "Geography Mastery",
    subject: "Geography",
    icon: "/assets/card-quzzy.png",
  },
  {
    id: 2,
    title: "Grammar Essentials",
    subject: "English",
    icon: "/assets/card-quzzy.png",
  },
  {
    id: 3,
    title: "Geography Mastery",
    subject: "Geography",
    icon: "/assets/card-quzzy.png",
  },
  {
    id: 4,
    title: "Geography Mastery",
    subject: "Geography",
    icon: "/assets/card-quzzy.png",
  },
  {
    id: 5,
    title: "Grammar Essentials",
    subject: "English",
    icon: "/assets/card-quzzy.png",
  },
  {
    id: 6,
    title: "Geography Mastery",
    subject: "Geography",
    icon: "/assets/card-quzzy.png",
  },
];

const PurchaseList: FC = () => {
  // useEffect(()=>{
  //    const user = async () => {
  //     const user = await userService.getCurrentUser();
  //     console.log(user);
  //    };
  //    user();
  // },[])

    const [me, setMe] = useState<User | null>(null); 
  
    useEffect(() => {
        const fetchUserRanking = async () => {
          const response = await leaderboardService.getUserRanking();
          console.log(response)
            setMe(response);   
        };
       
        fetchUserRanking(); 
    }, []);
    console.log(me?.user?.answers )
  return (
    <>
      <div className="flex gap-4 justify-between bg-[#F7F7F7] py-14 px-4 lg:px-24 max-w-[1440px] mx-auto ">
        <div>
          <h1 className="text-3xl font-bold">Purchase List</h1>
          <p className="text-normal pt-2">Here is your all pruchase list</p>
        </div>
      </div>
      <div className="bg-white flex justify-center max-w-[1440px]  px-4 lg:px-24 mx-auto w-full ">
        <div className=" shadow-sm rounded-xl w-full -mt-9">
          <div className="space-y-3 ">
            { Array.isArray(me?.user?.answers) && me?.user?.answers?.length>0 && me?.user?.answers?.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row md:items-center justify-between bg-white border-b border-[#E4E9EE]  p-4 hover:shadow-sm transition-shadow gap-5 md:gap-0 "
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 relative">
                    <Image
                      src={item.quiz?.image || '/'}
                      alt={item.quiz?.name || '/'}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {item.quiz?.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">{item.quiz?.description}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="px-4 py-2 text-sm rounded-md bg-gradient-to-r from-[#473BA4] to-[#6A5BE2] text-white font-medium hover:opacity-90">
                    View Pdf
                  </button>
                  <button className="px-4 py-2 text-sm rounded-md border border-indigo-300 text-indigo-600 font-medium hover:bg-indigo-50 transition-colors">
                    Download Pdf
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PurchaseList;
