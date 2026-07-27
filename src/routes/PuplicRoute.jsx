
//tp prevent logged-in users to visit such as pages which are wrapped with Puplic route
function PuplicRoute({ children }) {
  const user = localStorage.getItem("user");
  if (!user) {
    //prevenr him,so keep him in his current location , so only allow for not loggedin users
    return children;
  }
}

export default PuplicRoute;
