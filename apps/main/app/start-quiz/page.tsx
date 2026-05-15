import { Suspense } from "react";
import StartQuizClient from "./components/StartQuizClient";
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StartQuizClient />
    </Suspense>
  );
}