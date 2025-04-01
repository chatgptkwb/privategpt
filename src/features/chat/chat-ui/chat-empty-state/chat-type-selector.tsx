import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, MessageCircle, File, Globe } from "lucide-react";
import { FC } from "react";
import { ChatType } from "../../chat-services/models";
import { useChatContext } from "../chat-context";
import { useSession } from "next-auth/react";

interface Prop {
  disable: boolean;
}

export const ChatTypeSelector: FC<Prop> = (props) => {
  const { data: session } = useSession();
  const { chatBody, onChatTypeChange } = useChatContext();

  return (
    <Tabs
      defaultValue={chatBody.chatType}
      onValueChange={(value) => onChatTypeChange(value as ChatType)}
    >
      <TabsList className={`grid w-full ${process.env.NEXT_PUBLIC_FAQ === 'True' ? 'grid-cols-4' : 'grid-cols-3'} h-12 items-stretch`}>
        <TabsTrigger
          value="simple"
          className="flex gap-1"
          disabled={props.disable}
        >
          <MessageCircle size={20} /> 通常利用
        </TabsTrigger>    
        <TabsTrigger
          value="web"
          className="flex gap-1"
          disabled={props.disable}
        >
          <Globe size={20} /> Web検索
        </TabsTrigger>   
        <TabsTrigger
          value="data"
          className="flex gap-1"
          disabled={props.disable}
        >
          <FileText size={20} /> 文書要約{process.env.NEXT_PUBLIC_FAQ}
        </TabsTrigger>              
        {process.env.NEXT_PUBLIC_FAQ === 'True' && (
          <TabsTrigger
            value="doc"
            className="flex gap-1"
            disabled={props.disable}
          >
            <FileText size={20} /> 社内FAQ
          </TabsTrigger>   
        )}
      </TabsList>
    </Tabs>
  );
};