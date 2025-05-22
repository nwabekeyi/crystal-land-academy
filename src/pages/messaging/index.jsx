
import { Box } from "@mui/material";
import ChatLayout from "./components/layouts/ChatLayout";

function ChatApp() {
  return (
    <Box sx={{  maxHeight: "100%", height:"100%", paddingY: {xs: '15px', md:'25px'}, paddingX: { xs: 0, sm: "10px" }}}>
        <ChatLayout />

    </Box>
  );
}

export default ChatApp;
