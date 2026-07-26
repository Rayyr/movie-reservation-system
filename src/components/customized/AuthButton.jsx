import { Button } from "@mui/material";

function AuthButton({ children, isValid, isBlocked, isLoading }) {
  return (
    <Button
       type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2 }}
                  disabled={isLoading || !isValid || isBlocked}
      
    >
      {children}
    </Button>
  );
}

export default AuthButton;
