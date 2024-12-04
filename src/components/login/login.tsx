"use client";
import { useState } from "react";
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
import { toast } from "sonner"; // トースト通知用（インストール必要）

export const LogIn = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAzureLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signIn("azure-ad", {
        redirect: false, // リダイレクトを無効化
        callbackUrl: window.location.origin,
      });

      if (result?.error) {
        toast.error("ログインに失敗しました", {
          description: result.error,
        });
      } else {
        toast.success("ログインしました");
        // 必要に応じてリダイレクト
        window.location.href = result?.url || window.location.origin;
      }
    } catch (error) {
      toast.error("予期せぬエラーが発生しました", {
        description: String(error),
      });
    } finally {
      setIsLoading(false);
    }
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
        <Button 
          onClick={handleAzureLogin} 
          disabled={isLoading}
        >
          {isLoading ? "ログイン中..." : "Azure Entraでログイン"}
        </Button>
      </CardContent>
    </Card>
  );
};