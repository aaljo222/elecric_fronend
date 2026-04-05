import { useEffect, useState } from "react";
import { fetchData } from "../api/api";

const ApiTestPage = () => {
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchData();
      setResponse(data);
    };
    load();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">🚀 Railway API 연결 테스트</h1>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </>
  );
};

export default ApiTestPage;
