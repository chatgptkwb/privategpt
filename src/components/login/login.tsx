"use client";
import { AI_NAME } from "@/features/theme/customise";
import { signIn, useSession } from "next-auth/react";
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

// Browser detection function
const detectBrowser = (): string => {
  if (typeof window === 'undefined') return 'Unknown';

  const userAgent = window.navigator.userAgent;
  if (userAgent.indexOf('Firefox') > -1) return 'Firefox';
  if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) return 'Opera';
  if (userAgent.indexOf('Trident') > -1) return 'Internet Explorer';
  if (userAgent.indexOf('Edge') > -1) return 'Edge';
  if (userAgent.indexOf('Chrome') > -1) return 'Chrome';
  if (userAgent.indexOf('Safari') > -1) return 'Safari';
  
  return 'Unknown';
};

export const LogIn = () => {
  const [isIframe, setIsIframe] = useState(false);
  const [browser, setBrowser] = useState('Unknown');
  const { data: session, status } = useSession();

  useEffect(() => {
    // Check if the current window is inside an iframe
    setIsIframe(window.self !== window.top);
    
    // Detect browser
    setBrowser(detectBrowser());
  }, []);

  // Handle login for browsers requiring first-party context
  const handleIframeLogin = () => {
    // Open login in a new tab with the current parent page URL as redirect
    const parentUrl = window.parent.location.href;
    const encodedParentUrl = encodeURIComponent(parentUrl);
    
    const loginUrl = `${process.env.NEXT_PUBLIC_URL}/login?callbackUrl=${encodedParentUrl}`;
    const newWindow = window.open(loginUrl, '_blank');
    
    try {
      newWindow?.focus();
    } catch {
      alert('Pop-up Blocker is enabled! Please add this site to your exception list.');
    }
  };

  // Browsers that need special handling in iframe
  const needsFirstPartyContext = ['Safari', 'Firefox', 'Edge', 'Unknown'];

  // Loading state
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

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
        Azure Entraでログインをしてください。{isIframe}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isIframe && needsFirstPartyContext.includes(browser) ? (
          // Special login button for problematic browsers in iframe
          <Button onClick={handleIframeLogin}>
            別画面が起動しログインを行います
          </Button>
        ) : (
          // Normal login buttons
          <>
            <Button onClick={() => signIn("azure-ad")}> Azure Entraでログイン</Button>
            <Button onClick={handleIframeLogin}>
            別画面が起動しログインを行います
            </Button>
            {process.env.NODE_ENV === "development" && (
              <>
                <Button onClick={() => signIn("localdev")}>Basic Auth (DEV ONLY)</Button>
                <Button onClick={() => signIn("github")}>GitHub</Button>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};