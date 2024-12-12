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
  const [loginStage, setLoginStage] = useState<'initial' | 'opened' | 'ready-to-refresh'>('initial');
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
          // Additional cross-origin iframe check
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

      // Listen for postMessage from the login window
      const handleMessage = (event: MessageEvent) => {
        // Verify the message is from a trusted source
        const loginUrl = `${process.env.NEXT_PUBLIC_URL || 'https://kashiwabaragpt.azurewebsites.net'}`;
        if (event.origin !== new URL(loginUrl).origin) return;

        // Check for login success message
        if (event.data === 'login_success') {
          // Update login stage
          setLoginStage('ready-to-refresh');
        }
      };

      window.addEventListener('message', handleMessage);

      // Cleanup listener
      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }
  }, []);

  // Handle login for browsers requiring first-party context
  const handleIframeLogin = () => {
    try {
      // Construct login URL with additional parameters
      const loginUrl = new URL(`${process.env.NEXT_PUBLIC_URL || 'https://kashiwabaragpt.azurewebsites.net'}/login`);
      
      // Add any necessary query parameters
      loginUrl.searchParams.append('iframe', 'true');
      
      // Attempt to open login in a new window/tab
      const newWindow = window.open(loginUrl.toString(), '_blank', 'noopener,noreferrer');
      
      if (newWindow) {
        newWindow.focus();
        // Update login stage
        setLoginStage('opened');
      } else {
        // Fallback error handling for popup blockers
        alert('ログインが完了しましたらブラウザの更新ボタンをクリックしてください');
      }
    } catch (error) {
      console.error('Login window open failed:', error);
      alert('ログイン処理中にエラーが発生しました。');
    }
  };

  // Handle page refresh
  const handleRefresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  // Browsers that need special handling in iframe
  const needsFirstPartyContext = ['Safari', 'Firefox', 'Edge', 'Unknown'];

  // Loading state
  if (status === 'loading') {
    return <div>読み込み中...</div>;
  }

  // User already logged in
  if (session) {
    return null;
  }

  return (
    <Card className="flex gap-2 flex-col min-w-[300px]">
      <CardHeader className="gap-2">
        <CardTitle className="text-2xl flex gap-2 items-center">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={"/ai-icon.png"} 
              alt={`${AI_NAME} アイコン`}
            />
          </Avatar>
          <span className="text-primary">{AI_NAME}</span>
        </CardTitle>
        <CardDescription>
          Azure Entraでログインをしてください。
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isIframe  ? (
          loginStage === 'initial' ? (
            <Button onClick={handleIframeLogin} variant="default">
              初回のみ別画面が起動します
            </Button>
          ) : loginStage === 'opened' ? (
            <Button variant="secondary" disabled>
              ログイン処理中...
            </Button>
          ) : (
            <Button onClick={handleRefresh} variant="default">
              画面を更新します
            </Button>
          )
        ) : (
          // Normal login buttons
          <>
            <Button 
              onClick={() => signIn("azure-ad")}
              variant="default"
            > 
              Azure Entraでログイン
            </Button>
            {process.env.NODE_ENV === "development" && (
              <>
                <Button 
                  onClick={() => signIn("localdev")}
                  variant="secondary"
                >
                  Basic Auth (開発環境専用)
                </Button>
                <Button 
                  onClick={() => signIn("github")}
                  variant="outline"
                >
                  GitHubでログイン
                </Button>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};