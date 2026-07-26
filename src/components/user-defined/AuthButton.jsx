import { Button } from "@mui/material";

function AuthButton({ children, isValid, isBlocked, isLoading }) {
  return (
    <Button
    
      type="submit"
      fullWidth
      variant="contained"
      sx={{ textTransform: "none",mt: 2, backgroundColor: "var(--blue)" }}
      disabled={isLoading || !isValid || isBlocked}
    >
      {children}
    </Button>
  );
}

export default AuthButton;
