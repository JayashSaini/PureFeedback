"use client";
import { useParams } from "next/navigation";
import React from "react";

const Page = () => {
  const params = useParams();

  return <div>username is : {params.username}</div>;
};

export default Page;
