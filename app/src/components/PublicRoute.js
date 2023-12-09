"use client";

import { useRouter } from "next/navigation";
import React, { Suspense, useEffect } from "react";

const PublicRoute = ({ component: Component, ...props }) => {
  const router = useRouter();

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (token) {
      router.push("/profile");
    } 
  }, [router]);

  return (
    <Suspense fallback={<p>Loading</p>}>
      <Component {...props} />
    </Suspense>
  );
};

export default PublicRoute;
