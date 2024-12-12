"use client";
import { AI_NAME } from "@/features/theme/customise";
import { signIn } from "next-auth/react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useState, useEffect } from "react";

export const LogIn = () => {
  const [isIframe, setIsIframe] = useState(false);

  useEffect(() => {
    // Check if the current window is inside an iframe
    setIsIframe(window.self !== window.top);
  }, []);

  const handleIframeLogin = () => {
    // Open login in a new tab with the current parent page URL as redirect
    const parentUrl = window.parent.location.href;
    
    // Encode the parent URL to ensure it's safely passed as a parameter
    const encodedParentUrl = encodeURIComponent(parentUrl);
    
    // Open a new tab with the iframe-specific login route
    window.open(`/iframelogin?redirectUrl=${encodedParentUrl}`, '_blank');
  };

  return (
    <Card className="flex gap-2 flex-col min-w-[300px]">
      <CardHeader className="gap-2">
        <CardTitle className="text-2xl flex gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={"ai-icon.png"} />
          </Avatar>
          <span className="text-primary">{AI_NAME}</span>
        </CardTitle>
        <CardDescription>
        Azure Entraでログインをしてください。
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isIframe ? (
          // Iframe-specific login button
          <Button onClick={handleIframeLogin}>
            Iframe経由でログイン
          </Button>
        ) : (
          // Original login buttons
          <>
            <Button onClick={() => signIn("azure-ad")}> Azure Entraでログイン</Button>
            {process.env.NODE_ENV === "development" && (
              <Button onClick={() => signIn("localdev")}>Basic Auth (DEV ONLY)</Button>
            )}
            {process.env.NODE_ENV === "development" && (
              <Button onClick={() => signIn("github")}>GitHub</Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};