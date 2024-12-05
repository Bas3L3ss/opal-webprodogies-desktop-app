import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { Toaster } from "sonner";
import ControlLayout from "./layouts/ControlLayer";
import AuthButton from "./components/Global/AuthButton";
import Widget from "./components/Global/Widget";

function App() {
  const client = new QueryClient();
  return (
    <QueryClientProvider client={client}>
      <ControlLayout>
        <AuthButton />
        <Widget />
      </ControlLayout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
