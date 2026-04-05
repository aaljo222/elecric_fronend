import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// main.jsx 또는 App.jsx 상단에 추가
import store from "@/store";
import "katex/dist/katex.min.css";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
