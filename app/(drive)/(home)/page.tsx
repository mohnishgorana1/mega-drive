
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <section className="flex items-center justify-center">
      PAGE HOME
      <Link href={"/folder/123"}>
        <Button className="bg-slate-500 rounded">
          Folder 123
        </Button>
      </Link>
    </section>
  )
}

