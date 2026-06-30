export const DB_NAME="SponsorSync"
export const options = {
  httpOnly: true,
  secure: true, 
//   secure: process.env.NODE_ENV === 'production', 
//   sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
  maxAge: 24 * 60 * 60 * 1000
}