import apiClient from "./apiClient";

export const fetchConceptGraph = async () => {
  const res = await apiClient.get("/neo4j/concept-graph");
  return res.data;
};

const fetchRelated = async (nodeId) => {
  try {
    const loginData = JSON.parse(localStorage.getItem("electric_login"));
    const token = loginData?.token;
    if (!token) return;

    const res = await axios.get(
      `${API}/concept/node/${encodeURIComponent(nodeId)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setRelated(res.data);
  } catch (e) {
    console.error(e);
  }
};
