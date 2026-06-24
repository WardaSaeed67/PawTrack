import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    // Protect the dashboard and any private API paths, while allowing login, signup, static files, and public assets
    "/((?!api/auth|api/auth/signup|login|signup|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg).*)",
  ],
};
