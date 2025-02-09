"use client"
import { Button } from "@/components/ui/button";
import { CSVLink } from "react-csv";
import { ChatThreadModel } from "../chat/chat-services/models";

const headers = [
  { label: "会話日時", key: "createdAt" },
  { label: "ユーザー名", key: "useName" },
  { label: "タイトル", key: "name" },
  { label: "スレッドID", key: "id" }
];

const formatToJST = (date: Date | string) => {
  const targetDate = date instanceof Date ? date : new Date(date);
  const jstDate = new Date(targetDate.getTime() + (9 * 60 * 60 * 1000));
  return {
    date: jstDate.toLocaleDateString("ja-JP"),
    time: jstDate.toLocaleTimeString("ja-JP")
  };
};

interface Props {
  resources: Array<ChatThreadModel>;
}

const DownloadCSV: React.FC<Props> = (props) => {
  const convertedData = props.resources.map(thread => {
    const jstDateTime = formatToJST(thread.createdAt);
    return {
      ...thread,
      createdAt: `${jstDateTime.date} ${jstDateTime.time}`
    };
  });

  return (
    <main>
      <div>
        <CSVLink data={convertedData} headers={headers}>
          <Button>CSVダウンロード</Button>
        </CSVLink>
      </div>
    </main>
  );
};

export default DownloadCSV;