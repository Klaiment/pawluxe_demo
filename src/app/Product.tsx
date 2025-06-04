import * as React from "react";
import { useParams } from "react-router-dom";

export const Product: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Product Page</h1>
      <p className="text-lg">This is the product page for {slug}.</p>
    </div>
  );
};
