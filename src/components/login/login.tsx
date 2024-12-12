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

  const userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.includes('firefox')) return 'Firefox';
  if (userAgent.includes('opr') || userAgent.includes('opera')) return 'Opera';
  if (userAgent.includes('trident')) return 'Internet Explorer';
  if (userAgent.includes('edg')) return 'Edge';
  if (userAgent.includes('chrome')) return 'Chrome';
  if (userAgent.includes('safari')) return 'Safari';
  
  return 'Unknown';
};

export const LogIn = () => {
  const [isIframe, setIsIframe] = useState(false);
  const [browser, setBrowser] = useState('Unknown');
  const { data: session, status } = useSession();

  useEffect(() => {
    // Comprehensive iframe detection
    const checkIframe = () => {
      try {
        // Multiple methods to detect iframe
        const isInIframe = 
          window.self !== window.top || 
          window.parent !== window.self || 
          window !== window.top ||
          // Check for cross-origin iframe
          (window.location !== window.parent.location);

        setIsIframe(isInIframe);
        
        // Detect browser
        setBrowser(detectBrowser());
      } catch (error) {
        // If there's an error accessing parent window, assume it's in an iframe
        setIsIframe(true);
        setBrowser(detectBrowser());
      }
    };

    // Check immediately if window is available
    if (typeof window !== 'undefined') {
      checkIframe();
    }
  }, []);

  // Handle login for browsers requiring first-party context
  const handleIframeLogin = () => {
    try {
      // More robust parent URL retrieval
      const parentUrl = window.parent ? 
        window.parent.location.href : 
        window.top?.location.href || 
        window.location.href;
      
      const encodedParentUrl = encodeURIComponent(parentUrl);
      
      const loginUrl = `${process.env.NEXT_PUBLIC_URL}/login?callbackUrl=${encodedParentUrl}`;
      
      // Attempt to open login in a new window/tab
      const newWindow = window.open(loginUrl, '_blank', 'noopener,noreferrer');
      
      if (newWindow) {
        newWindow.focus();
      } else {
        // Fallback error handling for popup blockers
        alert('ログインウィンドウを開けませんでした。ポップアップブロックを解除してください。');
      }
    } catch (error) {
      console.error('Login window open failed:', error);
      alert('ログイン処理中にエラーが発生しました。');
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
        Azure Entraでログインをしてください。
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isIframe? (
          // Special login button for problematic browsers in iframe
          <Button onClick={handleIframeLogin}>
            別画面が起動しログインを行います
          </Button>
        ) : (
          // Normal login buttons
          <>
            <Button onClick={() => signIn("azure-ad")}> Azure Entraでログイン</Button>
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