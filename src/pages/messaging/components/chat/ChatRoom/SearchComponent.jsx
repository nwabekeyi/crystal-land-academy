export default function Message({ message, self, onReply }) {
  const isSender = self === message.sender.id;
  const formattedTime = formatDate(message.timestamp);

  return (
    <Box
      component="li"
      display="flex"
      justifyContent={isSender ? "flex-end" : "flex-start"}
      sx={{ width: "100%" }}
      onClick={() => onReply(message)} // Pass the message to the onReply handler when clicked
      style={{ cursor: "pointer" }} // Add cursor to indicate it's clickable
    >
      {/* Avatar for the sender */}
      {!isSender && (
        <Avatar
          src={message.sender.profilePictureUrl}
          alt={message.sender.name}
          sx={{ marginRight: 1 }}
        />
      )}

      <Box
        sx={{
          width: "80%",
          display: "flex",
          flexDirection: "column",
          alignItems: isSender ? "flex-end" : "flex-start",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: "8px 16px",
            borderRadius: "12px",
            backgroundColor: isSender ? "primary.main" : "background.paper",
            color: isSender ? "common.white" : "text.primary",
            width: "100%",
            wordBreak: "break-word",
          }}
        >
          <Typography variant="body1">{message.message}</Typography>

          {!isSender && (
            <Box mt={1} textAlign={isSender ? "right" : "left"} display="flex">
              <Typography variant="caption" display="block" fontWeight="bold" mr="2%">
                {message.sender.name}
              </Typography>
              <Typography variant="caption">{message.sender.role}</Typography>
            </Box>
          )}
        </Paper>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ marginTop: "8px" }}
        >
          {formattedTime}
        </Typography>
      </Box>
    </Box>
  );
}
