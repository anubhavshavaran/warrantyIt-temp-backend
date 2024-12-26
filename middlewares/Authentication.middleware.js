import { verify } from "jsonwebtoken";
const isUserAutheticated = async (request, response, next) => {
  try {
    const incommingUserToken = request.cookies.token;
    if (!incommingUserToken) {
      return response
        .status(401)
        .json({ message: "unauthorised user", status: false });
    }

    const decodedUserToken = await verify(
      incommingUserToken,
      process.env.JWTSECRETE
    );

    if (!decodedUserToken) {
      return response.status(404).json({
        message: "invalid user token",
        status: false,
      });
    }

    request.user = decodedUserToken;
  } catch (error) {
    console.log("Something Went Wrong In Authetication Middleware", error);
  }
};

export default isUserAutheticated;
