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

const formatToJST = (date: Date) => {
  const jstDate = new Date(date.getTime() + (9 * 60 * 60 * 1000));
  return {
    date: jstDate.toLocaleDateString("ja-JP"),
    time: jstDate.toLocaleTimeString("ja-JP")
  };
};

interface Props {
  resources: Array<ChatThreadModel>;
}

const Download: React.FC<Props> = (props) => {
  // データを変換して新しい配列を作成
  const convertedData = props.resources.map(thread => {
    const jstDateTime = formatToJST(new Date(thread.createdAt));
    return {
      ...thread,
      createdAt: `${jstDateTime.date} ${jstDateTime.time}` // 日付と時間を結合
    };
  });

  return (
    <CSVLink data={convertedData} headers={headers}>
      <Button>CSVダウンロード</Button>
    </CSVLink>
  );
};

const DownloadCSV: React.FC<Props> = (props) => {
  return (
    <main>
      <div>
        <Download {...props} />
      </div>
    </main>
  );
};

export default DownloadCSV;