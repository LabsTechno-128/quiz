'use client';

import Image from 'next/image';

type User = {
  id: number;
  name: string;
  points: number;
  rank: string;
  img: string;
  isMe?: boolean;
};

const users: User[] = [
  {
    id: 1,
    name: 'Abdul Malek Sarkar',
    points: 1200,
    rank: '#01',
    img: '/assets/card-quzzy.png',
    isMe: true
  },
  {
    id: 2,
    name: 'Abdul Malek Sarkar',
    points: 1200,
    rank: '#01',
    img: '/assets/card-quzzy.png'
  },
  {
    id: 3,
    name: 'Abdul Malek Sarkar',
    points: 1000,
    rank: '#02',
    img: '/assets/card-quzzy.png'
  },
  {
    id: 4,
    name: 'Abdul Malek Sarkar',
    points: 850,
    rank: '#03',
    img: '/assets/card-quzzy.png'
  },
  {
    id: 5,
    name: 'Abdul Malek Sarkar',
    points: 800,
    rank: '#04',
    img: '/assets/card-quzzy.png'
  },
  {
    id: 6,
    name: 'Abdul Malek Sarkar',
    points: 700,
    rank: '#05',
    img: '/assets/card-quzzy.png'
  },
  {
    id: 7,
    name: 'Abdul Malek Sarkar',
    points: 700,
    rank: '#06',
    img: '/assets/card-quzzy.png'
  },
  {
    id: 8,
    name: 'Abdul Malek Sarkar',
    points: 700,
    rank: '#07',
    img: '/assets/card-quzzy.png'
  },
  {
    id: 9,
    name: 'Abdul Malek Sarkar',
    points: 700,
    rank: '#08',
    img: '/assets/card-quzzy.png'
  },
  {
    id: 10,
    name: 'Abdul Malek Sarkar',
    points: 700,
    rank: '#09',
    img: '/assets/card-quzzy.png'
  }
];

export default function LeaderboardPage() {
  const me = users.find((u) => u.isMe);
  const others = users.filter((u) => !u.isMe);

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
                src={me.img}
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
              {me.points} PT
            </div>
          </div>
        )}

        {/* --- Gap before others --- */}
        <div className="mt-6 ">
          {others.map((user) => (
            <div
              key={user.id}
              className="flex flex-col md:flex-row justify-between md:items-center p-4  shadow-sm border-b border-[#E4E9EE] bg-white hover:bg-gray-100 transition gap-5 md:gap-0"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={user.img}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="rounded"
                />
                <div>
                  <h4 className="font-medium text-gray-800">{user.name}</h4>
                  <p className="text-sm text-gray-500">{user.rank}</p>
                </div>
              </div>
              <div className="px-4 py-2 text-sm font-semibold rounded-lg border border-violet-200 text-violet-600  w-28">
                {user.points} PT
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
